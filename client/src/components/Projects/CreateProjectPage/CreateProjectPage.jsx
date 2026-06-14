import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useProjects } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/authContext';
import ProjectForm from '../ProjectForm/ProjectForm';

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const { createProject } = useProjects();
    const { user } = useAuth();

    const handleCreateSubmit = async (formData, processedMediaArray) => {
        // Helper helper to convert simplified extensions to official server mimetypes
        const getMimetype = (ext) => {
            const cleanExt = ext.toLowerCase().trim();
            if (cleanExt === 'png') return 'image/png';
            if (cleanExt === 'jpg' || cleanExt === 'jpeg') return 'image/jpeg';
            if (cleanExt === 'webp') return 'image/webp';
            if (cleanExt === 'mp4') return 'video/mp4';
            if (cleanExt === 'mp3') return 'audio/mpeg';
            if (cleanExt === 'wav') return 'audio/wav';
            return `image/${cleanExt}`; // Baseline fallback schema
        };

        // Transform flat UI arrays into the exact format expected by the Multer-based controller
        const serverMediaFiles = processedMediaArray.map(m => {
            // dynamic conversion extracting root elements from state values
            const filenameWithExt = m.media_url.substring(m.media_url.lastIndexOf('/') + 1);
            const fileExt = filenameWithExt.substring(filenameWithExt.lastIndexOf('.') + 1);

            return {
                originalName: filenameWithExt,
                mimetype: getMimetype(fileExt)
            };
        });

        const createPayload = {
            title: formData.title,
            description: formData.description,
            category_id: Number(formData.category_id),
            professional_id: Number(user?.id),
            mediaFiles: serverMediaFiles
        };

        const response = await createProject(createPayload);
        if (response.success) {
            const newProjectId = response.data?.id;
            navigate(`/projects/${newProjectId}`, { replace: true });
        } else {
            return response.message;
        }
    };

    return (
        <div className="create-project-page-wrapper">
            <ProjectForm
                initialValues={null}
                onSubmitAction={handleCreateSubmit}
            />
        </div>
    );
};

export default CreateProjectPage;