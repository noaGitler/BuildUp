import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

            await AuthModel.registerStep1(email, password);

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

            // Preparing the data for sending to the model
            let finalProfileImageUrl = profile_image_url || null;
            if (finalProfileImageUrl && !finalProfileImageUrl.startsWith('/uploads/')) {
                finalProfileImageUrl = `/uploads/profiles/${finalProfileImageUrl}`;
            }

            // Execute the atomic multi-table transaction in the model layer
            const userId = await AuthModel.registerStep2({
                email, password, name, role, phone, profile_image_url: finalProfileImageUrl, tag_line, bio, city, categoryIds
            });

            const token = jwt.sign(
                { id: userId, role: role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return res.status(201).json({
                success: true,
                message: "Registration completed and profile created successfully.",
                token: token,
                user: {
                    id: userId,
                    name,
                    role,
                    profile_image_url: finalProfileImageUrl || null
                }
            });
        } catch (error) {
            // Catching an error that is thrown if the email is already registered
            if (error.message === "Temporary registration record missing or expired.") {
                return res.status(400).json({
                    success: false,
                    message: "Security alert: This email address was captured by another account."
                });
            }

            console.error("Error inside registerStep2 controller node:", error)
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

            if (!user || !(await bcrypt.compare(password, user.password))) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password credentials."
                });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(200).json({
                success: true,
                message: "Login verified successfully.",
                token: token,
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
    // static async checkAuthStatus(req, res) {
    //     const { id } = req.params;
    //     try {
    //         const user = await AuthModel.findById(id);
    //         if (!user) {
    //             return res.status(404).json({
    //                 isAuthenticated: false,
    //                 message: "User context not found."
    //             });
    //         }

    //         res.status(200).json({
    //             isAuthenticated: true,
    //             user: {
    //                 id: user.id,
    //                 name: user.name,
    //                 role: user.role,
    //                 profile_image_url: user.profile_image_url,
    //                 categoryIds: user.categoryIds
    //             }
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             isAuthenticated: false,
    //             message: "Failed to establish secure auth state check sync."
    //         });
    //     }
    // }
    static async checkAuthStatus(req, res) {
        try {
            const userIdFromToken = req.user.id;

            const user = await AuthModel.findById(userIdFromToken);
            if (!user) {
                return res.status(404).json({
                    isAuthenticated: false,
                    message: "User context not found."
                });
            }

            res.status(200).json({
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
}

export default AuthController;