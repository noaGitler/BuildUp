import projectModel from '../models/projectModel.js';

class ProjectController {

    // Get projects with optional filters and sorting
    // static async getProjectsFiles(req, res) {
    //     try {
    //         const { search, category_id, sort, limit } = req.query;

    //         const projects = await projectModel.getProjectsFiles({
    //             search: search || null,
    //             category_id: category_id || null,
    //             sort: sort || 'newest',
    //             limit: limit || 12
    //         });

    //         return res.status(200).json({
    //             success: true,
    //             message: "Filtered projects ecosystem batch catalog compiled successfully.",
    //             count: projects.length,
    //             data: projects
    //         });

    //     } catch (error) {
    //         console.error("Error inside getProjectsFiles controller node:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: "Failed to retrieve compiled feed data compilation records.",
    //             error: error.message
    //         });
    //     }
    // }

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

    // Create a new project with media assets
    static async createProject(req, res) {
        try {
            const { professional_id, category_id, title, description, mediaFiles } = req.body;

            const projectId = await projectModel.createProjectWithMedia({
                professional_id, category_id, title, description
            }, mediaFiles);

            return res.status(201).json({
                success: true,
                message: "Project created successfully and all media records compiled.",
                projectId: projectId
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
}

export default ProjectController;