import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiTrendingUp, FiCheck } from 'react-icons/fi';

import { useFilterParams } from '../../../Hooks/useFilterParams.js';
import { useProfiles } from '../../../context/ProfilesContext.jsx';

import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
import ProfessionalCard from '../ProfessionalCard/ProfessionalCard.jsx';
import './ProfessionalsPage.css';

const ProfessionalsPage = () => {
    const navigate = useNavigate();
    const { professionals, loading, error, fetchProfessionals } = useProfiles();
    const { search, category, city, sortBy } = useFilterParams();

    // Local pagination tracking limit state variables
    const [limit, setLimit] = useState(12);

    useEffect(() => {
        const backendParams = { limit };
        if (category) backendParams.category_id = category;
        if (search) backendParams.search = search;
        if (city) backendParams.city = city;
        if (sortBy) backendParams.sortBy = sortBy;

        fetchProfessionals(backendParams);
    }, [search, category, city, sortBy, limit, fetchProfessionals]);

    useEffect(() => {
        setLimit(12); // Reset limits on filter mutations
    }, [search, sortBy, category, city]);

    const handleLoadMore = () => {
        setLimit(prev => prev + 12);
    };

    const availableCities = Array.from(
        new Set(professionals.map(p => p.city).filter(Boolean))
    );

    const sortOptions = [
        { id: 'newest', name: 'Latest', icon: <FiClock /> },
        { id: 'oldest', name: 'Oldest', icon: <FiTrendingUp /> },
        { id: 'title', name: 'A-Z', icon: <FiCheck /> }
    ];

    const displayedProfessionals = professionals.slice(0, limit);

    return (
        <div className="professionals-page-container">
            <div className="creators-hero-header">
                <h1>Our Professionals Directory</h1>
                <p>Find and collaborate with top industry builders, architects, and design craftsmen.</p>
            </div>

            <FilterBar sortOptions={sortOptions} cities={availableCities} />

            <main className="professionals-grid-display">
                {error && <div className="professionals-error-message">{error}</div>}

                {displayedProfessionals.length === 0 && !loading ? (
                    <div className="professionals-empty-feed">
                        <p className="empty-feed-text">No professionals found matching the selected filters.</p>
                    </div>
                ) : (
                    <div className="professionals-grid-layout">
                        {displayedProfessionals.map((item) => (
                            <ProfessionalCard key={item.id} professional={item} />
                        ))}
                    </div>
                )}

                {loading && <div className="professionals-feed-spinner">Syncing context arrays...</div>}

                {!loading && !error && professionals.length > limit && (
                    <div className="load-more-action-wrapper" style={{ textAlign: 'center', margin: '32px 0' }}>
                        <button className="btn-feed-load-more" onClick={handleLoadMore}>
                            Load More Professionals
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfessionalsPage;