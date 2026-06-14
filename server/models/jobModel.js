// server/models/jobModel.js
import pool from '../config/db.js';

const Job = {
    /**
     * Fetch jobs with dynamic query filtration and sorting.
     */
    getAllJobs: async (filters) => {
        const { search, sort, category_id } = filters;

        let query = `
            SELECT 
                jp.id,
                jp.client_id, 
                jp.title,
                jp.description,
                jp.budget,
                jp.created_at,
                u.name AS client_name,
                u.profile_image_url AS client_image,
                c.name AS category_name,
                c.icon_url AS category_icon
            FROM job_posts jp
            JOIN users u ON jp.client_id = u.id
            JOIN categories c ON jp.category_id = c.id
            WHERE 1=1
        `;

        const queryParams = [];

        // Dynamic category selection validation
        if (category_id) {
            query += ` AND jp.category_id = ? `;
            queryParams.push(parseInt(category_id));
        }

        // Dynamic text search tracking criteria
        if (search) {
            query += ` AND (jp.title LIKE ? OR jp.description LIKE ?) `;
            const searchPattern = `%${search}%`;
            queryParams.push(searchPattern, searchPattern);
        }

        // Sorting context logic mapping configurations
        if (sort === 'oldest') {
            query += ` ORDER BY jp.created_at ASC `;
        } else if (sort === 'title') {
            query += ` ORDER BY jp.title ASC `;
        } else {
            query += ` ORDER BY jp.created_at DESC `; // Default 'newest' state
        }

        try {
            const [rows] = await pool.execute(query, queryParams);
            return rows;
        } catch (error) {
            console.error('Database error in getAllJobs model:', error);
            throw error;
        }
    },

    /**
     * Fetch a single job post by its primary key ID
     */
    getJobById: async (id) => {
        const query = `
            SELECT 
                jp.id,
                jp.title,
                jp.description,
                jp.budget,
                jp.created_at,
                u.id AS client_id,
                u.name AS client_name,
                u.email AS client_email,
                u.phone AS client_phone,
                u.profile_image_url AS client_image,
                p.bio AS client_description,
                p.city AS client_location,
                c.name AS category_name,
                c.icon_url AS category_icon
            FROM job_posts jp
            JOIN users u ON jp.client_id = u.id
            JOIN categories c ON jp.category_id = c.id
            LEFT JOIN professional_profiles p ON u.id = p.user_id
            WHERE jp.id = ?;
        `;
        try {
            const [rows] = await pool.execute(query, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Database error in getJobById model:', error);
            throw error;
        }
    },

    /**
     * Insert a new job opportunity into the database registry
     */
    insertJob: async (jobData) => {
        const query = `
            INSERT INTO job_posts (title, description, budget, category_id, client_id, created_at)
            VALUES (?, ?, ?, ?, ?, NOW());
        `;
        const values = [
            jobData.title,
            jobData.description,
            jobData.budget || null, // Inserts NULL if budget is unassigned (Open Budget)
            jobData.category_id,
            jobData.client_id
        ];

        try {
            const [result] = await pool.execute(query, values);
            return result.insertId;
        } catch (error) {
            console.error("Database compilation error inside insertJob model:", error);
            throw error;
        }
    },

    /**
     * Delete a job post from the database registry by its primary key ID
     */
    deleteJob: async (id) => {
        try {
            const query = `DELETE FROM job_posts WHERE id = ?`;
            const [result] = await pool.execute(query, [id]);
            return result;
        } catch (error) {
            console.error(`Database error inside Job.deleteJob for ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Update an existing job registry row by its primary key ID
     */
    updateJob: async (id, jobData) => {
        try {
            const query = `
                UPDATE job_posts 
                SET title = ?, description = ?, budget = ?, category_id = ?
                WHERE id = ?
            `;
            const values = [
                jobData.title,
                jobData.description,
                jobData.budget || null,
                jobData.category_id || null,
                id
            ];

            const [result] = await pool.execute(query, values);
            return result;
        } catch (error) {
            console.error(`Database error inside Job.updateJob for ID ${id}:`, error);
            throw error;
        }
    }
};

export default Job;