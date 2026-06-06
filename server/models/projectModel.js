
import pool from '../config/db.js';

class projectModel {

    // Get projects with optional filters and sorting
    // static async getProjectsFiles(filters) {
    //     const { search, category_id, sort, limit } = filters;
    //     const connection = await pool.getConnection();

    //     try {
    //         let query = `
    //             SELECT p.id, p.professional_id, p.category_id, p.title, p.description, p.cover_image_id, p.created_at, m.media_url AS cover_image_url
    //             FROM projects p
    //             LEFT JOIN project_media m ON p.cover_image_id = m.id
    //         `;

    //         const queryParams = [];
    //         const whereConditions = [];

    //         // Dynamic Filtering by Category ID
    //         if (category_id) {
    //             whereConditions.push("p.category_id = ?");
    //             queryParams.push(Number(category_id));
    //         }

    //         // Dynamic Filtering by Title Search Text
    //         if (search) {
    //             whereConditions.push("p.title LIKE ?");
    //             queryParams.push(`%${search}%`);
    //         }

    //         // Append WHERE clause if any conditions exist
    //         if (whereConditions.length > 0) {
    //             query += " WHERE " + whereConditions.join(" AND ");
    //         }

    //         // Dynamic Sorting Configuration
    //         if (sort === 'oldest') {
    //             query += " ORDER BY p.created_at ASC";
    //         } else if (sort === 'title') {
    //             query += " ORDER BY p.title ASC";
    //         } else {
    //             query += " ORDER BY p.created_at DESC";
    //         }

    //         // Pagination / Limit Configuration
    //         const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
    //         query += " LIMIT ?";
    //         queryParams.push(parsedLimit);

    //         // Execute the compiled dynamic query safely
    //         const [rows] = await connection.query(query, queryParams);
    //         return rows;

    //     } catch (error) {
    //         throw error;
    //     } finally {
    //         connection.release();
    //     }
    // }


    static async getProjectsFiles(filters) {
        const { search, category_id, sort, limit } = filters;
        const connection = await pool.getConnection();

        try {
            // Optimizing column selection: Fetching only the essential fields for a Project Card
            let query = `SELECT 
                    p.id, 
                    p.category_id, 
                    p.title, 
                    p.created_at,
                    m.media_url AS cover_image_url,
                    u.name AS professional_name,
                    u.profile_image_url AS professional_image,
                    pp.tagline AS professional_tagline,
                FROM projects p
                LEFT JOIN project_media m ON p.cover_image_id = m.id
                LEFT JOIN users u ON p.professional_id = u.id
                LEFT JOIN professional_profiles pp ON u.id = pp.user_id
            `;

            const queryParams = [];
            const whereConditions = [];

            // Dynamic Filtering by Category ID
            if (category_id) {
                whereConditions.push("p.category_id = ?");
                queryParams.push(Number(category_id));
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

    // Create a new project with media assets
    static async createProjectWithMedia(projectData, mediaFiles) {
        const { professional_id, category_id, title, description } = projectData;
        const connection = await pool.getConnection();

        try {
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
            const folderMap = { image: 'images', video: 'videos', audio: 'audio', document: 'documents' };

            for (let i = 0; i < mediaFiles.length; i++) {
                const file = mediaFiles[i];

                let mediaType = 'document';
                if (file.mimetype.startsWith('image/')) mediaType = 'image';
                else if (file.mimetype.startsWith('video/')) mediaType = 'video';
                else if (file.mimetype.startsWith('audio/')) mediaType = 'audio';

                const targetFolder = folderMap[mediaType];

                // Construct the clean relative URL exactly as it rests on the server
                const relativePath = `/uploads/projects/${targetFolder}/${file.originalName}`;

                const mediaQuery = `
                    INSERT INTO project_media (project_id, media_type, media_url) 
                    VALUES (?, ?, ?)
                `;
                const [mediaResult] = await connection.query(mediaQuery, [projectId, mediaType, relativePath]);

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

    // Get complete project details
    static async getProjectById(projectId) {
        const connection = await pool.getConnection();
        try {
            // Fetch main project metadata details
            const projectQuery = `
                SELECT id, professional_id, category_id, title, description, cover_image_id, created_at 
                FROM projects 
                WHERE id = ?
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
}

export default projectModel;