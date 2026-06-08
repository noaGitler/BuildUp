import projectModel from '../models/projectModel.js';

class ProjectController {

    // Get projects with optional filters and sorting
    static async getProjectsFiles(req, res) {
        try {
            const { search, category_id, sort, limit } = req.query;

            // Request the optimized card layout structure from data model
            const projects = await projectModel.getProjectsFiles({
                search: search || null,
                category_id: category_id || null,
                sort: sort || 'newest',
                limit: limit || 12
            });

            return res.status(200).json({
                success: true,
                message: "Optimized minimalist feed batch compiled successfully.",
                count: projects.length,
                data: projects
            });

        } catch (error) {
            console.error("Error inside getProjectsFiles controller node:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to compile lightweight project catalog list.",
                error: error.message
            });
        }
    }

    // Get complete project details
    static async getProjectById(req, res) {
        try {
            const projectId = req.params.id;

            const project = await projectModel.getProjectById(projectId);

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: `Project with ID ${projectId} could not be found in the database.`
                });
            }

            return res.status(200).json({
                success: true,
                message: "Project details compiled and fetched successfully.",
                data: project
            });

        } catch (error) {
            console.error("Error inside getProjectById controller node:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve project details due to an internal server error.",
                error: error.message
            });
        }
    }

    // Create a new project with media assets
    static async createProject(req, res) {
        try {
            const { professional_id, category_id, title, description, mediaFiles } = req.body;

            const processedMedia = ProjectController._prepareMediaFiles(mediaFiles || []);

            const projectId = await projectModel.createProject({
                professional_id, category_id, title, description
            }, processedMedia);

            const newProject = await projectModel.getProjectById(projectId);

            return res.status(201).json({
                success: true,
                message: "Project created successfully and all media records compiled.",
                data: newProject
            });

        } catch (error) {
            console.error("Error inside createProject controller node:", error);
            return res.status(500).json({
                success: false,
                message: "Project creation transaction failed due to an internal server error.",
                error: error.message
            });
        }
    }

    // Comprehensive update that handles text and media according to the specified object hierarchy conditions
    static async updateProject(req, res) {
        try {
            const projectId = req.params.id;
            const { title, description, mediaFiles } = req.body;

            // 1. שליפת הפרויקט הקיים מה-DB כדי לבדוק את הנתונים הנוכחיים
            const dbProject = await projectModel.getProjectById(projectId);
            if (!dbProject) {
                return res.status(404).json({
                    success: false,
                    message: `Project with ID ${projectId} could not be found.`
                });
            }

            // Basic text update (title, description) - only if title is provided
            await projectModel.updateBasicProjectDetails(projectId, title, description);

            if (mediaFiles) {

                // update cover image URL
                if (mediaFiles.cover_image) {
                    const clientCover = mediaFiles.cover_image;

                    if (Number(clientCover.cover_image_id) === Number(dbProject.cover_image_id)) {
                        await projectModel.updateCoverImageUrl(dbProject.cover_image_id, clientCover.cover_image_URL);
                    }
                }

                // update secondary media records
                if (mediaFiles.secondary_media && Array.isArray(mediaFiles.secondary_media)) {
                    const processedMedia = ProjectController._prepareMediaFiles(mediaFiles.secondary_media);
                    await projectModel.replaceSecondaryMedia(projectId, dbProject.cover_image_id, processedMedia);
                }
            }

            const updatedProject = await projectModel.getProjectById(projectId);

            return res.status(200).json({
                success: true,
                message: "Project updated cleanly according to specified object hierarchy conditions.",
                data: updatedProject
            });

        } catch (error) {
            console.error("Error inside updateProject controller node:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error during project patch update validation.",
                error: error.message
            });
        }
    }



    // Delete a project and all its associated media records
    static async deleteProject(req, res) {
        try {
            const projectId = req.params.id;
            const success = await projectModel.deleteProject(projectId);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: `Project with ID ${projectId} does not exist.`
                });
            }

            return res.status(200).json({
                success: true,
                message: "Project and all compiled media were completely deleted."
            });
        } catch (error) {
            console.error("Error inside deleteProject controller:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error during project removal process.",
                error: error.message
            });
        }
    }

    // private helper method to prepare media file data for database insertion
    static _prepareMediaFiles(mediaFiles) {
        const folderMap = { image: 'images', video: 'videos', audio: 'audio' };

        return mediaFiles.map(file => {
            let mediaType = 'image';
            if (file.mimetype.startsWith('video/')) mediaType = 'video';
            else if (file.mimetype.startsWith('audio/')) mediaType = 'audio';

            const targetFolder = folderMap[mediaType];
            const mediaUrl = `/uploads/projects/${targetFolder}/${file.originalName}`;

            return {
                media_type: mediaType,
                media_url: mediaUrl
            };
        });
    }
}

export default ProjectController;