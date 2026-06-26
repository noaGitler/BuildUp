import JobModel from '../models/jobModel.js';

class JobController {

    // Get jobs with dynamic server-side filtration parameters
    static async getAllJobs(req, res) {
        try {
            const filters = {
                search: req.query.search || null,
                sort: req.query.sort || 'newest',
                category_id: req.query.category_id || null
            };

            const jobs = await JobModel.getAllJobs(filters);
            return res.status(200).json(jobs);
        } catch (error) {
            console.error('Error in getAllJobs controller:', error);
            return res.status(500).json({
                message: 'Internal server error while fetching job posts.'
            });
        }
    };

    // Get a single job post by ID for the detail view
    static async getJobById(req, res) {
        try {
            const jobId = req.params.id;
            const job = await JobModel.getJobById(jobId);

            if (!job) {
                return res.status(404).json({ message: 'Job post not found.' });
            }
            return res.status(200).json(job);
        } catch (error) {
            console.error('Error in getJobById controller:', error);
            return res.status(500).json({
                message: 'Internal server error while fetching job details.'
            });
        }
    };

    // Create a brand new job post
    static async createJob(req, res) {
        try {
            const jobData = req.body;
            const userFromToken = req.user;

            const newData = {
                ...req.body,
                client_id: userFromToken.id
            };

            const newJobId = await JobModel.createJob(newData);

            return res.status(201).json({
                success: true,
                message: "Job opportunity created successfully.",
                jobId: newJobId
            });
        } catch (error) {
            console.error("Error inside createJob controller:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server registry error."
            });
        }
    };

    // Update an existing job post with role-based access validation
    static async updateJob(req, res) {
        try {
            const jobId = req.params.id;
            const updatedData = req.body;
            const userFromToken = req.user;

            const ownerId = await JobModel.getJobOwnerId(jobId);

            if (!ownerId) {
                return res.status(404).json({ success: false, message: 'Job vacancy not found.' });
            }

            const isOwner = Number(ownerId) === Number(userFromToken.id);
            const isAdmin = userFromToken.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized action. You can only update your own job posts.'
                });
            }

            await JobModel.updateJob(jobId, updatedData);

            return res.status(200).json({
                success: true,
                message: "Job vacancy configuration updated successfully."
            });
        } catch (error) {
            console.error('Error in updateJob controller:', error);
            return res.status(500).json({ success: false, message: 'Internal server update error.' });
        }
    }

    // Delete an existing job post with role-based access validation
    static async deleteJob(req, res) {
        try {
            const jobId = req.params.id;
            const userFromToken = req.user;

            const ownerId = await JobModel.getJobOwnerId(jobId);

            if (!ownerId) {
                return res.status(404).json({ success: false, message: 'Job vacancy not found.' });
            }

            const isOwner = Number(ownerId) === Number(userFromToken.id);
            const isAdmin = userFromToken.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized action. You can only update your own job posts.'
                });
            }

            await JobModel.deleteJob(jobId);

            return res.status(200).json({
                success: true,
                message: "Job vacancy successfully purged from the database registry."
            });
        } catch (error) {
            console.error('Error in deleteJob controller:', error);
            return res.status(500).json({ success: false, message: 'Internal server deletion error.' });
        }
    }
};

export default JobController;
