import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import projectService from '../../../services/projectService';
import { useProjects } from '../../../context/ProjectContext';

import ProjectForm from '../ProjectForm/ProjectForm';

const EditProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateProject } = useProjects();
    const [sanitizedData, setSanitizedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndSanitize = async () => {
            try {
                setLoading(true);
                const result = await projectService.getProjectById(id);

                if (result.success && result.data) {
                    const raw = result.data;

                    const processedMedia = (raw.mediaFiles || []).map(m => {
                        const fullUrl = m.media_url || '';
                        const lastSlash = fullUrl.lastIndexOf('/');
                        const filenameWithExt = lastSlash !== -1 ? fullUrl.substring(lastSlash + 1) : fullUrl;

                        // Split explicitly at the absolute trailing file format dot location
                        const lastDot = filenameWithExt.lastIndexOf('.');

                        return {
                            id: m.id,
                            url: lastDot !== -1 ? filenameWithExt.substring(0, lastDot) : filenameWithExt,
                            ext: lastDot !== -1 ? filenameWithExt.substring(lastDot + 1) : 'png'
                        };
                    });

                    // Isolate editable fields metrics exclusively to keep presentation forms light and isolated
                    const cleanPayload = {
                        title: raw.title || '',
                        description: raw.description || '',
                        category_id: raw.category_id || '',
                        mediaItems: processedMedia.length > 0 ? processedMedia : [{ url: '', ext: 'png' }]
                    };

                    setSanitizedData(cleanPayload);
                } else {
                    setError(result.message || "Project architecture data loading parameters failed.");
                }
            } catch (err) {
                setError("Failed to fetch requested validation overview files components from server.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAndSanitize();
    }, [id]);

    // Packaging the data according to the server and sending it
    const handleEditSubmit = async (formData, processedMediaArray, trackingFlags) => {
        const getMimetype = (ext) => {
            const cleanExt = ext.toLowerCase().trim();
            if (cleanExt === 'png') return 'image/png';
            if (cleanExt === 'jpg' || cleanExt === 'jpeg') return 'image/jpeg';
            if (cleanExt === 'mp4') return 'video/mp4';
            if (cleanExt === 'mp3') return 'audio/mpeg';
            return `image/${cleanExt}`;
        };

        const convertedMediaItems = processedMediaArray.map(m => {
            return {
                id: m.id || null,
                media_type: m.media_type,
                media_url: m.media_url,
                mimetype: getMimetype(m.ext || 'png'),
                originalName: m.originalName || ''
            };
        });

        const updatePayload = {
            title: formData.title,
            description: formData.description,
            category_id: Number(formData.category_id),
            mediaFiles: {}
        };

        if (trackingFlags.isCoverDirty && convertedMediaItems.length > 0) {
            updatePayload.mediaFiles.cover_image = {
                cover_image_id: convertedMediaItems[0].id || sanitizedData?.mediaItems[0]?.id,
                cover_image_URL: convertedMediaItems[0].media_url,
                originalName: convertedMediaItems[0].originalName,
                mimetype: convertedMediaItems[0].mimetype
            };
        }

        if (trackingFlags.isSecondaryDirty) {
            updatePayload.mediaFiles.secondary_media = convertedMediaItems.slice(1);
        }

        if (!trackingFlags.isCoverDirty && !trackingFlags.isSecondaryDirty) {
            delete updatePayload.mediaFiles;
        }

        const response = await updateProject(id, updatePayload);
        if (response.success) {
            navigate(`/projects/${id}`, { replace: true });
            return null;
        } else {
            return response.message || "Failed to save data layout updates.";
        }
    };

    if (loading) return <div className="details-status-msg">Loading current project content models maps...</div>;
    if (error) return <div className="details-status-msg error">{error}</div>;

    return (
        <div className="edit-project-page-wrapper">
            <ProjectForm
                initialValues={sanitizedData}
                onSubmitAction={handleEditSubmit}
            />
        </div>
    );
};

export default EditProjectPage;