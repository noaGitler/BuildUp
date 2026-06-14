import pool from '../config/db.js';

class ProjectModel {

    // Get projects with optional filters and sorting
    static async getProjectsFiles(filters) {
        const { search, category_id, sort, limit, user_favorites_id, professional_id } = filters;
        const connection = await pool.getConnection();

        try {
            // Optimizing column selection: Fetching only the essential fields for a Project Card
            let query = `SELECT 
                    p.id, 
                    p.category_id, 
                    p.professional_id,
                    p.title, 
                    p.created_at,
                    m.media_url AS cover_image_url,
                    u.name AS professional_name,
                    u.profile_image_url AS professional_image,
                    pp.tagline AS professional_tagline
                FROM projects p
                LEFT JOIN project_media m ON p.cover_image_id = m.id
                LEFT JOIN users u ON p.professional_id = u.id
                LEFT JOIN professional_profiles pp ON u.id = pp.user_id
            `;

            const queryParams = [];
            const whereConditions = [];

            // Dynamic Join: If user_favorites_id is present, filter by favorite_projects table
            if (user_favorites_id) {
                query += ` INNER JOIN favorite_projects fp 
                       ON p.id = fp.project_id AND fp.user_id = ? `;
                queryParams.push(Number(user_favorites_id));
            }

            // Dynamic Filtering by Category ID
            if (category_id) {
                whereConditions.push("p.category_id = ?");
                queryParams.push(Number(category_id));
            }

            // Dynamic filtering by user
            if (professional_id) {
                whereConditions.push("p.professional_id = ?");
                queryParams.push(Number(professional_id));
            }

            // Dynamic Filtering by Title Search Text
            if (search) {
                whereConditions.push("p.title LIKE ?");
                queryParams.push(`%${search}%`);
            }

            // Append WHERE criteria if present
            if (whereConditions.length > 0) {
                query += " WHERE " + whereConditions.join(" AND ");
            }

            // Dynamic Ordering Rules
            if (sort === 'oldest') {
                query += " ORDER BY p.created_at ASC";
            } else if (sort === 'title') {
                query += " ORDER BY p.title ASC";
            } else {
                query += " ORDER BY p.created_at DESC";
            }

            // Dynamic Pagination Limit
            const parsedLimit = Number(limit) > 0 ? Number(limit) : 12;
            query += " LIMIT ?";
            queryParams.push(parsedLimit);

            const [rows] = await connection.query(query, queryParams);
            return rows;

        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    // Get complete project details
    static async getProjectById(projectId) {
        const connection = await pool.getConnection();
        try {
            // Fetch main project metadata details
            const projectQuery = `
            SELECT 
                p.*,
                u.name AS professional_name,
                u.profile_image_url AS professional_image,
                pp.tagline AS professional_tagline
            FROM projects p
            LEFT JOIN users u ON p.professional_id = u.id
            LEFT JOIN professional_profiles pp ON u.id = pp.user_id
            WHERE p.id = ?
            `;
            const [projectRows] = await connection.query(projectQuery, [projectId]);

            // If no project exists with this ID, return null immediately
            if (projectRows.length === 0) {
                return null;
            }

            const project = projectRows[0];

            // Fetch all media records attached to this specific project ID
            const mediaQuery = `
                SELECT id, media_type, media_url 
                FROM project_media 
                WHERE project_id = ?
            `;
            const [mediaRows] = await connection.query(mediaQuery, [projectId]);

            // Compile and attach the media rows directly inside the project data object
            project.mediaFiles = mediaRows;

            return project;

        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    // Create a new project with media assets
    static async createProject(projectData, processedMedia) {
        const { professional_id, category_id, title, description } = projectData;
        const connection = await pool.getConnection();

        try {
            const categoryCheckQuery = `
                SELECT 1 FROM professional_categories 
                WHERE user_id = ? AND category_id = ?
            `;
            const [categoryRows] = await connection.query(categoryCheckQuery, [professional_id, category_id]);

            // If no match is found, reject the operation immediately to preserve database integrity
            if (categoryRows.length === 0) {
                // throw new Error(`Unauthorized operation: Professional ID ${professional_id} is not mapped to Category ID ${category_id}.`);
                const adminCheckQuery = `
                SELECT role FROM users 
                WHERE id = ?
            `;
                const [userRows] = await connection.query(adminCheckQuery, [professional_id]);

                const userRole = userRows[0]?.role;

                // אם המשתמש לא קיים בכלל, או שהוא קיים אבל הוא לא admin - נחסום את הפעולה
                if (userRole !== 'admin') {
                    throw new Error(`Unauthorized operation: User ID ${professional_id} is neither mapped to Category ID ${category_id} nor an admin.`);
                }
            }

            await connection.beginTransaction();

            // Insert initial project records into the projects table
            const projectQuery = `
                INSERT INTO projects (professional_id, category_id, title, description, cover_image_id, created_at) 
                VALUES (?, ?, ?, ?, NULL, NOW())
            `;
            const [projectResult] = await connection.query(projectQuery, [
                professional_id, category_id, title, description || null
            ]);
            const projectId = projectResult.insertId;

            let coverImageId = null;

            for (let i = 0; i < processedMedia.length; i++) {
                const file = processedMedia[i];

                const mediaQuery = `
                    INSERT INTO project_media (project_id, media_type, media_url) 
                    VALUES (?, ?, ?)
                `;
                const [mediaResult] = await connection.query(mediaQuery, [projectId, file.media_type, file.media_url]);

                // Assign the first inserted record ID as the cover image ID
                if (i === 0) {
                    coverImageId = mediaResult.insertId;
                }
            }

            // Finalize transaction by linking the compiled cover image ID back to the project
            const updateCoverQuery = 'UPDATE projects SET cover_image_id = ? WHERE id = ?';
            await connection.query(updateCoverQuery, [coverImageId, projectId]);

            await connection.commit();
            return projectId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Updating basic project details
    static async updateBasicProjectDetails(projectId, title, description) {
        const connection = await pool.getConnection();
        try {
            const query = 'UPDATE projects SET title = ?, description = ? WHERE id = ?';
            await connection.query(query, [title, description, projectId]);
            return true;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    // Update the cover image URL
    static async updateCoverImageUrl(coverImageId, mediaUrl) {
        const connection = await pool.getConnection();
        try {
            const query = 'UPDATE project_media SET media_url = ? WHERE id = ?';
            await connection.query(query, [mediaUrl, coverImageId]);
            return true;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    // General project media update
    static async replaceSecondaryMedia(projectId, coverImageId, processedMedia) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const deleteQuery = 'DELETE FROM project_media WHERE project_id = ? AND id != ?';
            await connection.query(deleteQuery, [projectId, coverImageId]);

            if (processedMedia && processedMedia.length > 0) {
                const insertQuery = 'INSERT INTO project_media (project_id, media_type, media_url) VALUES ?';
                const values = processedMedia.map(file => [projectId, file.media_type, file.media_url]);
                await connection.query(insertQuery, [values]);
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Delete a project and all its associated media
    static async deleteProject(projectId) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query("UPDATE projects SET cover_image_id = NULL WHERE id = ?", [projectId]);

            const deleteMediaQuery = "DELETE FROM project_media WHERE project_id = ?";
            await connection.query(deleteMediaQuery, [projectId]);

            const deleteProjectQuery = "DELETE FROM projects WHERE id = ?";
            const [result] = await connection.query(deleteProjectQuery, [projectId]);

            await connection.commit();
            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default ProjectModel;