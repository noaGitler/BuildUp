import React, { useState } from 'react';
import { FiEdit3, FiTrash2, FiCheck, FiX, FiUser } from 'react-icons/fi';

import { useComments } from '../../../../context/CommentContext';
import { useAuth } from '../../../../context/authContext';

import './CommentItem.css'

const CommentItem = ({ comment, projectId }) => {
    const { deleteComment, updateComment } = useComments();
    const { user } = useAuth();

    // Local state for toggling edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.comment_text);

    const SERVER_URL = 'http://localhost:5000';

    // Only allow editing/deleting if the logged-in user matches the comment owner
    const isOwner = user && (Number(user.id) === Number(comment.user_id) || user.role === 'admin' );

    const handleSave = async () => {
        await updateComment(comment.id, editText, projectId);
        setIsEditing(false); // Switch back to view mode
    };

    return (
        <div className="comment-item">
            <div className="comment-header">
                {/* <strong>{comment.user_name}</strong> */}

                <div className="comment-author-info">
                    {/* User Avatar Section */}
                    {comment.user_image ? (
                        <img
                            src={`${SERVER_URL}${comment.user_image}`}
                            alt={comment.user_name}
                            className="comment-avatar-img"
                        />
                    ) : (
                        <div className="comment-avatar-fallback"><FiUser /></div>
                    )}
                    <strong>{comment.user_name}</strong>
                </div>

                <span className="comment-date">
                    {new Date(comment.created_at).toLocaleString([], {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>


            {/* Conditional Rendering: Edit Mode vs View Mode */}
            {isEditing ? (
                <div className="edit-container">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className='btn-edit-container'>
                        <button
                            className='btn-details btn-edit-container-V'
                            onClick={handleSave}>
                            <FiCheck />
                        </button>
                        <button
                            className='btn-details btn-edit-container-X'
                            onClick={() => setIsEditing(false)}>
                            <FiX />
                        </button>
                    </div>
                </div>
            ) : (
                <p className="comment-body">{comment.comment_text}</p>
            )}

            {/* Action Buttons: Only show if user owns the comment */}
            {isOwner && !isEditing && (
                <div className="comment-actions">
                    <button
                        className='btn-details btn-details-inline-edit-icon'
                        onClick={() => setIsEditing(true)}>
                        <FiEdit3 />
                    </button>
                    <button
                        className='btn-details btn-details-inline-delete-icon'
                        onClick={() => deleteComment(comment.id, projectId)}>
                        <FiTrash2 />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentItem;