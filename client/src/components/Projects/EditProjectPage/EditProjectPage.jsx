// // src/components/Projects/EditProjectPage/EditProjectPage.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import projectService from '../../../services/projectService';
// import ProjectForm from '../ProjectForm/ProjectForm';

// const EditProjectPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [sanitizedData, setSanitizedData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchAndSanitize = async () => {
//             try {
//                 setLoading(true);
//                 const result = await projectService.getProjectById(id);

//                 if (result.success && result.data) {
//                     const raw = result.data;

//                     // עיבוד מראש של קבצי המדיה - הוצאת הלוגיקה המורכבת מתוך הטופס
//                     const processedMedia = (raw.mediaFiles || []).map(m => {
//                         const lastDot = m.media_url.lastIndexOf('.');
//                         return {
//                             id: m.id,
//                             url: lastDot !== -1 ? m.media_url.substring(0, lastDot) : m.media_url,
//                             ext: lastDot !== -1 ? m.media_url.substring(lastDot + 1) : 'png'
//                         };
//                     });

//                     // בניית אובייקט נקי המכיל אך ורק את השדות הניתנים לעריכה פיזית
//                     const cleanPayload = {
//                         title: raw.title || '',
//                         description: raw.description || '',
//                         category_id: raw.category_id || '',
//                         mediaItems: processedMedia.length > 0 ? processedMedia : [{ url: '', ext: 'png' }]
//                     };

//                     setSanitizedData(cleanPayload);
//                 } else {
//                     setError(result.message || "Project asset initialization failed.");
//                 }
//             } catch (err) {
//                 setError("Failed to fetch requested project data from server.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) fetchAndSanitize();
//     }, [id]);

//     if (loading) return <div className="details-status-msg">Loading current project configurations...</div>;
//     if (error) return <div className="details-status-msg error">{error}</div>;

//     return (
//         <div className="edit-project-page-wrapper">
//             <ProjectForm initialProjectData={sanitizedData} />
//         </div>
//     );
// };

// export default EditProjectPage;















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

    const handleEditSubmit = async (formData, processedMediaArray, trackingFlags) => {
        const getMimetype = (ext) => {
            const cleanExt = ext.toLowerCase().trim();
            if (cleanExt === 'png') return 'image/png';
            if (cleanExt === 'jpg' || cleanExt === 'jpeg') return 'image/jpeg';
            if (cleanExt === 'mp4') return 'video/mp4';
            if (cleanExt === 'mp3') return 'audio/mpeg';
            return `image/${cleanExt}`;
        };

        // Prepare complete transformed array items beforehand
        const convertedMediaItems = processedMediaArray.map(m => {
            const filenameWithExt = m.media_url.substring(m.media_url.lastIndexOf('/') + 1);
            const fileExt = filenameWithExt.substring(filenameWithExt.lastIndexOf('.') + 1);
            return {
                id: m.id || null,
                originalName: filenameWithExt,
                mimetype: getMimetype(fileExt)
            };
        });

        const updatePayload = {
            title: formData.title,
            description: formData.description,
            category_id: Number(formData.categoryId),
            mediaFiles: {}
        };

        if (trackingFlags.isCoverDirty) {
            updatePayload.mediaFiles.cover_image = {
                cover_image_id: convertedMediaItems[0]?.id || null,
                originalName: convertedMediaItems[0]?.originalName || '',
                mimetype: convertedMediaItems[0]?.mimetype || ''
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
        } else {
            return response.message;
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