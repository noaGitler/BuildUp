// import React, { useEffect } from 'react';
// import { useFilterParams } from '../../../Hooks/useFilterParams.js';
// import { useProfessionals } from '../../../context/ProfessionalContext.jsx';
// import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
// import ProfessionalCard from '../ProfessionalCard/ProfessionalCard.jsx';
// import './ProfessionalsPage.css';

// const ProfessionalsPage = () => {
//     const { professionals, loading, error, fetchProfessionals } = useProfessionals();
//     const { search, category, city, sortBy } = useFilterParams();

//     useEffect(() => {
//         // Discharging parameters securely into our centralized context layer function
//         const backendParams = {};
//         if (category) backendParams.category_id = category;
//         if (search) backendParams.search = search;
//         if (city) backendParams.city = city;
//         if (sortBy) backendParams.sortBy = sortBy;

//         fetchProfessionals(backendParams);
//     }, [search, category, city, sortBy, fetchProfessionals]);

//     // Extract unique cities dynamically from global context scope state
//     const availableCities = Array.from(
//         new Set(professionals.map(p => p.city).filter(Boolean))
//     );

//     // Navigation elements catalog configurations
//     const sortOptions = [
//         { id: 'newest', label: 'Newest Listed' },
//         { id: 'popular', label: 'Top Rated' },
//         { id: 'name_asc', label: 'Name A-Z' }
//     ];

//     return (
//         <div className="professionals-page-container">
//             <div className="creators-hero-header">
//                 <h1>Our Professionals Directory</h1>
//                 <p>Find and collaborate with top industry builders, architects, and design craftsmen.</p>
//             </div>

//             {/* Render filter bar with contextual values */}
//             <FilterBar sortOptions={sortOptions} cities={availableCities} />

//             <div className="professionals-page-layout">
//                 <main className="professionals-grid-display">
//                     {loading ? (
//                         <div className="professionals-feed-spinner">Loading professionals directory...</div>
//                     ) : error ? (
//                         <div className="professionals-error-message">{error}</div>
//                     ) : professionals.length === 0 ? (
//                         <div className="professionals-empty-feed">
//                             <p className="empty-feed-text">No professionals found matching the selected filters.</p>
//                         </div>
//                     ) : (
//                         <div className="professionals-grid-layout">
//                             {professionals.map((item) => (
//                                 <ProfessionalCard key={item.id} professional={item} />
//                             ))}
//                         </div>
//                     )}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default ProfessionalsPage;











// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiUsers, FiPlus } from 'react-icons/fi';

// import { useFilterParams } from '../../../Hooks/useFilterParams.js';
// import { useProfiles } from '../../../context/ProfilesContext.jsx';

// import FilterBar from '../../UI/FilterBar/FilterBar.jsx';
// import ProfessionalCard from '../ProfessionalCard/ProfessionalCard.jsx';
// import './ProfessionalsPage.css';

// const ProfessionalsPage = () => {
//     const navigate = useNavigate();
//     const { professionals, loading, error, fetchProfessionals } = useProfiles();
//     const { search, category, city, sortBy } = useFilterParams();
    
//     // Local pagination tracking limit state variables
//     const [limit, setLimit] = useState(12);

//     useEffect(() => {
//         const backendParams = { limit };
//         if (category) backendParams.category_id = category;
//         if (search) backendParams.search = search;
//         if (city) backendParams.city = city;
//         if (sortBy) backendParams.sortBy = sortBy;
        
//         fetchProfessionals(backendParams);
//     }, [search, category, city, sortBy, limit, fetchProfessionals]);

//     useEffect(() => {
//         setLimit(12); // Reset limits on filter mutations
//     }, [search, sortBy, category, city]);

//     const handleLoadMore = () => {
//         setLimit(prev => prev + 12);
//     };

//     const availableCities = Array.from(
//         new Set(professionals.map(p => p.city).filter(Boolean))
//     );

//     const sortOptions = [
//         { id: 'newest', label: 'Newest Listed' },
//         { id: 'popular', label: 'Top Rated' },
//         { id: 'name_asc', label: 'Name A-Z' }
//     ];

//     const displayedProfessionals = professionals.slice(0, limit);

//     return (
//         <div className="professionals-page-container">
//             <div className="creators-hero-header">
//                 <h1>Our Professionals Directory</h1>
//                 <p>Find and collaborate with top industry builders, architects, and design craftsmen.</p>
//             </div>
            
//             <FilterBar sortOptions={sortOptions} cities={availableCities} />
            
//             <main className="professionals-grid-display">
//                 {error && <div className="professionals-error-message">{error}</div>}
                
//                 {displayedProfessionals.length === 0 && !loading ? (
//                     <div className="professionals-empty-feed">
//                         <p className="empty-feed-text">No professionals found matching the selected filters.</p>
//                     </div>
//                 ) : (
//                     <div className="professionals-grid-layout">
//                         {displayedProfessionals.map((item) => (
//                             <ProfessionalCard key={item.id} professional={item} />
//                         ))}
//                     </div>
//                 )}

//                 {loading && <div className="professionals-feed-spinner">Syncing context arrays...</div>}

//                 {!loading && !error && professionals.length > limit && (
//                     <div className="load-more-action-wrapper" style={{ textAlign: 'center', marginTop: '24px' }}>
//                         <button className="btn-feed-load-more" onClick={handleLoadMore}>
//                             Load More Professionals
//                         </button>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default ProfessionalsPage;














// src/components/Professionals/ProfessionalsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        { id: 'newest', label: 'Newest Listed' },
        { id: 'popular', label: 'Top Rated' },
        { id: 'name_asc', label: 'Name A-Z' }
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