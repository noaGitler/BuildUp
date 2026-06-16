import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useComments } from '../../../../context/CommentContext';
import { useAuth } from '../../../../context/authContext';

import CommentItem from '../CommentItem/CommentItem';
import './CommentList.css'

const CommentList = ({ projectId }) => {
    const navigate = useNavigate();

    const { comments, fetchComments, addComment, loading } = useComments();
    const { user } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handlePost = async () => {
        if (!newComment.trim()) return;
        await addComment(projectId, newComment);
        setNewComment('');
        setPage(1);
        setHasMore(true);
    };

    useEffect(() => {
        if (projectId) {
            setPage(1);
            setHasMore(true);
            fetchComments(projectId, 1, 5, true);
        }
    }, [projectId, fetchComments]);


    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        const result = await fetchComments(projectId, nextPage, 5, false);
        if (!result || result.length < 5) {
            setHasMore(false);
        }
    };

    if (loading && comments.length === 0) {
        return <div className="loading-spinner">Loading comments...</div>;
    }

    return (
        <div className="comments-wrapper">
            <h3>Project Comments</h3>

            {user ? (
                <div className="add-comment-area">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a professional comment regarding this design..."
                    />
                    <button onClick={handlePost}>Post Comment</button>
                </div>
            ) : (<div>Want to add your own comment? 
                <Link to="/login" onClick={() => clearErrors()} className="login-fields-link">Log in</Link>
                 now</div>)}

            <div className="list-container">
                {comments.map(c => (
                    <CommentItem key={c.id} comment={c} projectId={projectId} />
                ))}
            </div>

            {hasMore && comments.length > 0 && (
                <div className="load-more-container">
                    <button
                        onClick={handleLoadMore}
                        className="btn-load-more"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>)}
        </div>
    );
};

export default CommentList;