import AuthModel from '../models/authModel.js';

class AuthController {

    // Check if email is available
    static async registerStep1(req, res) {
        const { email, password } = req.body;
        try {
            const existingUser = await AuthModel.checkEmailExists(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already registered."
                });
            }

            await AuthModel.createPendingRegistration(email, password);

            // Success response without database insertion
            res.status(200).json({
                success: true,
                message: "Email is available. Proceed to step 2."
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error during email availability check.",
                error: error.message
            });
        }
    }

    static async registerStep2(req, res) {
        try {
            const { email, password, name, role, phone, profile_image_url, tag_line, bio, city, categoryIds } = req.body;

            // Ensure the email wasn't taken while the user was typing
            const isEmailTaken = await AuthModel.checkEmailExists(email);
            if (isEmailTaken) {
                return res.status(400).json({
                    success: false,
                    message: "Security alert: This email address was captured by another account."
                });
            }

            let finalProfileImageUrl = profile_image_url || null;
            if (finalProfileImageUrl && !finalProfileImageUrl.startsWith('/uploads/')) {
                finalProfileImageUrl = `/uploads/profiles/${finalProfileImageUrl}`;
            }

            // Execute the atomic multi-table transaction in the model layer
            const userId = await AuthModel.registerFullUser({
                email, password, name, role, phone, profile_image_url: finalProfileImageUrl, tag_line, bio, city, categoryIds
            });

            return res.status(201).json({
                success: true,
                message: "Registration completed and profile created successfully.",
                user: {
                    id: userId,
                    name,
                    role,
                    profile_image_url: finalProfileImageUrl || null
                }
            });
        } catch (error) {
            console.error("Error inside registerStep2 controller node:", error);
            return res.status(500).json({
                success: false,
                message: "Profile compilation and user creation failed.",
                error: error.message
            });
        }
    }

    //Login
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await AuthModel.login(email);

            if (!user || user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password credentials."
                });
            }

            // res.status(200).json({
            //     success: true,
            //     message: "Login verified successfully.",
            //     user: {
            //         id: user.id,
            //         name: user.name,
            //         role: user.role,
            //         profile_image_url: user.profile_image_url
            //     }
            // });

            // inside authController.login after password validation success
            return res.status(200).json({
                success: true,
                message: "Login verified successfully.",
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    profile_image_url: user.profile_image_url,
                    categoryIds: user.categoryIds
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Login processing failed due to internal errors."
            });
        }
    }

    // Check Authentication Status
    static async checkAuthStatus(req, res) {
        const { id } = req.params;
        try {
            const user = await AuthModel.findById(id);
            if (!user) {
                return res.status(401).json({
                    isAuthenticated: false,
                    message: "User session expired or invalid"
                });
            }

            // 🌟 התיקון: מוסיפים את השדה categoryIds ל-JSON שחוזר ל-React
            return res.status(200).json({
                isAuthenticated: true,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    profile_image_url: user.profile_image_url,
                    categoryIds: user.categoryIds
                }
            });
        } catch (error) {
            res.status(500).json({
                isAuthenticated: false,
                message: "Failed to establish secure auth state check sync."
            });
        }
    }

};

export default AuthController;