// check if a basic text field is valid (not empty or whitespace only)
const isTextValid = (text) => {
    return text && text.trim().length > 0;
};

// check if an ID is valid (a positive number)
const isIdValid = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

// structural validation to ensure the file object contains necessary metadata properties and is not empty
const isFileStructureValid = (file) => {
    return file && file.mimetype && file.filename && file.size > 0;
};

// check if the file is an image based on its MIME type
const isImageFile = (file) => {
    return file && file.mimetype && file.mimetype.startsWith('image/');
};

// type validation for supported media types (images, videos, audio, PDFs, text files)
const isSupportedMediaType = (file) => {
    if (!file || !file.mimetype) return false;

    return file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/') ||
        file.mimetype.startsWith('audio/') ||
        file.mimetype.startsWith('text/');
};


class ProjectValidation {

    static create(req, res, next) {
        const { title, professional_id, category_id, mediaFiles } = req.body;

        if (!isTextValid(title) || !isIdValid(professional_id) || !isIdValid(category_id)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: title, professional_id, and category_id are mandatory fields."
            });
        }

        if (!mediaFiles || !Array.isArray(mediaFiles) || mediaFiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: A new project must contain at least one media asset reference."
            });
        }

        const firstFile = mediaFiles[0];

        if (!firstFile || !firstFile.mimetype) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Cover image metadata is incomplete or corrupted."
            });
        }

        if (!firstFile.mimetype.startsWith('image/')) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: The first media asset must be an image type to serve as the cover image."
            });
        }

        next();
    }

    // Validation middleware for modifying an existing project (PATCH)
    static update(req, res, next) {
        const { title } = req.body;

        // Title Validation Check
        if (title !== undefined && !isTextValid(title)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Provided title cannot be empty."
            });
        }

        // check for file uploads and validate their structure and types
        if (req.files) {

            // if the client attempted to update the cover image, validate its structure and type
            if (req.files.cover_image) {
                if (!Array.isArray(req.files.cover_image) || req.files.cover_image.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed: cover_image slot is initialized but empty."
                    });
                }

                const coverFile = req.files.cover_image[0];
                if (!isFileStructureValid(coverFile) || !isImageFile(coverFile)) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed: cover_image must be a non-empty valid image file."
                    });
                }
            }

            // if the client attempted to update secondary media assets, validate their structure, types, and quantity
            if (req.files.media_files) {
                if (!Array.isArray(req.files.media_files)) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed: media_files structure must be wrapped in an array."
                    });
                }

                if (req.files.media_files.length > 10) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed: Maximum of 10 secondary assets can be updated at once."
                    });
                }

                for (let i = 0; i < req.files.media_files.length; i++) {
                    const file = req.files.media_files[i];

                    if (!isFileStructureValid(file)) {
                        return res.status(400).json({
                            success: false,
                            message: `Validation failed: File at index ${i} has incomplete metadata descriptors.`
                        });
                    }

                    if (!isSupportedMediaType(file)) {
                        return res.status(400).json({
                            success: false,
                            message: `Validation failed: File format '${file.mimetype}' at index ${i} is not supported.`
                        });
                    }
                }
            }
        }

        next();
    }
}

export default ProjectValidation;