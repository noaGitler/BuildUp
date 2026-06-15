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
            const newJobId = await JobModel.createJob(jobData);

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
            const { userId, ...updatedData } = req.body;

            const cleanData = {
                title: updatedData.title || '',
                description: updatedData.description || '',
                budget: (updatedData.budget !== undefined && updatedData.budget !== '') ? Number(updatedData.budget) : null,
                category_id: updatedData.category_id // כאן אנחנו לא עושים || null!
            };

            if (!cleanData.category_id) {
                return res.status(400).json({ success: false, message: 'Category is required.' });
            }

            if (!userId) {
                return res.status(400).json({ success: false, message: 'Client verification context missing.' });
            }

            const existingJob = await JobModel.getJobById(jobId);

            if (!existingJob) {
                return res.status(404).json({ success: false, message: 'Job vacancy not found.' });
            }

            // Authorization Guard: Either the record creator or an authorized administrator
            const userRole = await JobModel.getUserRole(userId);
            const isAdmin = userRole === 'admin';
            const isOwner = Number(existingJob.client_id) === Number(userId);

            if (!isOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized action. You do not have management privileges for this post.'
                });
            }


            await JobModel.updateJob(jobId, cleanData);

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
            const userId = req.query.userId;

            if (!userId) {
                return res.status(400).json({ success: false, message: 'Client verification context missing.' });
            }

            const existingJob = await JobModel.getJobById(jobId);

            if (!existingJob) {
                return res.status(404).json({ success: false, message: 'Job vacancy not found.' });
            }

            // Authorization Guard: Either the record creator or an authorized administrator
            const userRole = await JobModel.getUserRole(userId);
            const isAdmin = userRole === 'admin';

            const isOwner = Number(existingJob.client_id) === Number(userId);

            if (!isOwner && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized action. You do not have management privileges for this post.'
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