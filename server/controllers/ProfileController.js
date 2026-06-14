import profileModel from '../models/profileModel.js';

class ProfileController {


    // Get all professionals with optional filters and sorting
    static async getAllProfessionals(req, res) {
        try {
            // Extract category_id, search, city, and sortBy from the URL query
            const { category_id, search, city, sortBy } = req.query;

            // Pass all active parameters directly into the database model
            const professionals = await profileModel.getAllProfessionals({
                category_id: category_id || null,
                search: search || null,
                city: city || null,
                sortBy: sortBy || 'newest'
            });

            return res.status(200).json({
                success: true,
                message: "Professional directory fetched successfully.",
                count: professionals.length,
                data: professionals
            });

        } catch (error) {
            console.error("Error inside getAllProfessionals controller:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve professional directory.",
                error: error.message
            });
        }
    }


    static async getProfile(req, res) {
        try {
            const profile = await profileModel.getProfileById(req.params.id);
            if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

            return res.status(200).json({ success: true, data: profile });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.params.id;

            const payloadData = { ...req.body };

            if (payloadData.profile_image_url) {
                if (!payloadData.profile_image_url.startsWith('/uploads/profiles/')) {
                    payloadData.profile_image_url = `/uploads/profiles/${payloadData.profile_image_url}`;
                }
            }
            const updatedProfile = await profileModel.updateProfile(userId, payloadData);

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedProfile
            });
        } catch (error) {
            console.error("Update profile error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default ProfileController;