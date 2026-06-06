export const validateProjectCreation = (req, res, next) => {
    const { title, professional_id, category_id, mediaFiles } = req.body;

    // Check mandatory textual fields
    if (!title || !professional_id || !category_id) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: title, professional_id, and category_id are mandatory fields."
        });
    }

    // Check that at least one media reference is provided
    if (!mediaFiles || !Array.isArray(mediaFiles) || mediaFiles.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: A project must contain at least one media asset reference."
        });
    }

    // Ensure the first file type is an image for the cover image
    const firstFile = mediaFiles[0];
    if (!firstFile.mimetype || !firstFile.mimetype.startsWith('image/')) {
        return res.status(400).json({
            success: false,
            message: "Validation failed: The first media asset must be an image type to serve as the cover image."
        });
    }

    next();
};