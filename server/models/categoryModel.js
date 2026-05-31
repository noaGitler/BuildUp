import pool from '../config/db.js';

class CategoryModel {
    // get all categories from the database
    static async getAll() {
        try {
            const [rows] = await pool.query('SELECT * FROM categories');
            return rows;
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    }

}

export default CategoryModel;