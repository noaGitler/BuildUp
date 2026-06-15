import ProjectModel from '../models/projectModel.js';
import FavoriteModel from '../models/favoriteModel.js'

class FavoriteController {
    // Fetch favorited projects for a specific user using raw IDs
    static async getFavoriteProjects(req, res) {
        try {
            // Destructure parameters sent from React client url/filters
            const { search, category_id, sort, limit, userId } = req.query;

            // Execute the optimized project model catalog join using the provided user ID
            const favoriteProjects = await ProjectModel.getProjectsFiles({
                search: search || null,
                category_id: category_id || null,
                sort: sort || 'newest',
                limit: limit || 12,
                user_favorites_id: userId
            });

            return res.status(200).json({
                success: true,
                message: "User specific favorite feed batch compiled.",
                count: favoriteProjects.length,
                data: favoriteProjects
            });

        } catch (error) {
            console.error("Error inside getFavoriteProjects controller:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to compile favorited project data rows.",
                error: error.message
            });
        }
    }

    static async addFavorite(req, res) {
        try {
            const { userId, projectId } = req.body; // Guaranteed to be valid positive numbers by middleware

            // // Verify if the link already exists to avoid database duplicate errors
            // const isAlreadyFavorited = await FavoriteModel.checkExists(Number(userId), Number(projectId));

            // if (isAlreadyFavorited) {
            //     return res.status(409).json({
            //         success: false,
            //         message: "This specific project configuration is already stored inside user favorites collection."
            //     });
            // }

            await FavoriteModel.addFavorite(Number(userId), Number(projectId));

            return res.status(201).json({
                success: true,
                message: "Project instance recorded into system user inspiration log successfully."
            });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: "This specific project configuration is already stored inside user favorites collection."
                });
            }

            console.error("Error encountered within addFavoriteProject controller module:", error);
            return res.status(500).json({
                success: false,
                message: "Server failed to record favorite connection index.",
                error: error.message
            });
        }
    }

    static async removeFavorite(req, res) {
        try {
            const { userId, projectId } = req.body;

            if (!userId || !projectId) {
                return res.status(400).json({
                    success: false,
                    message: "Required parameters 'userId' and 'projectId' are missing."
                });
            }

            await FavoriteModel.removeFavorite(Number(userId), Number(projectId));

            return res.status(200).json({
                success: true,
                message: "Project connection cleared from stored database row successfully."
            });

        } catch (error) {
            console.error("Error encountered within removeFavoriteProject controller module:", error);
            return res.status(500).json({
                success: false,
                message: "Server failed to remove favorite connection record.",
                error: error.message
            });
        }
    }
};

export default FavoriteController;