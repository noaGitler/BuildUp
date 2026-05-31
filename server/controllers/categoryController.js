import CategoryModel from '../models/CategoryModel.js';

class CategoryController {
    // get all categories
    static async getAllCategories(req, res) {
        try {
            const categories = await CategoryModel.getAll();
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to load categories',
                error: error.message
            });
        }
    }
}

export default CategoryController;