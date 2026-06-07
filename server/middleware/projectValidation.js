// export const validateProjectCreation = (req, res, next) => {
//     const { title, professional_id, category_id, mediaFiles } = req.body;

//     // Check mandatory textual fields
//     if (!title || !professional_id || !category_id) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation failed: title, professional_id, and category_id are mandatory fields."
//         });
//     }

//     // Check that at least one media reference is provided
//     if (!mediaFiles || !Array.isArray(mediaFiles) || mediaFiles.length === 0) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation failed: A project must contain at least one media asset reference."
//         });
//     }

//     // Ensure the first file type is an image for the cover image
//     const firstFile = mediaFiles[0];
//     if (!firstFile.mimetype || !firstFile.mimetype.startsWith('image/')) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation failed: The first media asset must be an image type to serve as the cover image."
//         });
//     }

//     next();
// };

// export const validateProjectUpdate = (req, res, next) => {
//     if (req.files) {
//         if (req.files.cover_image && req.files.cover_image.length > 0) {
//             const coverFile = req.files.cover_image[0];
//             if (!coverFile.mimetype || !coverFile.mimetype.startsWith('image/')) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Validation failed: The cover_image field must contain a valid image file type."
//                 });
//             }
//         }
//     }

//     next();
// };

// const projectValidation = {
//     validateProjectCreation,
//     validateProjectUpdate
// };

// export default projectValidation;





// --- PRIVATE HELPER VALIDATION FUNCTIONS ---

// בודק אם שדה טקסט בסיסי קיים ואינו ריק או מכיל רק רווחים
const isTextValid = (text) => {
    return text && text.trim().length > 0;
};

// בודק אם מזהה (ID) הוא מספר תקין הגדול מ-0
const isIdValid = (id) => {
    const num = Number(id);
    return !isNaN(num) && num > 0;
};

// בודק את תקינות המבנה והערכים הפיזיים של קובץ שהועלה (Multer metadata)
const isFileStructureValid = (file) => {
    return file && file.mimetype && file.filename && file.size > 0;
};

// בודק אם סוג הקובץ הוא תמונה בלבד (מתאים עבור קאבר)
const isImageFile = (file) => {
    return file && file.mimetype && file.mimetype.startsWith('image/');
};

// בודק אם סוג הקובץ נתמך במערכת המשנית (תמונה, וידאו, שמע, מסמך)
const isSupportedMediaType = (file) => {
    if (!file || !file.mimetype) return false;
    
    return file.mimetype.startsWith('image/') || 
           file.mimetype.startsWith('video/') || 
           file.mimetype.startsWith('audio/') || 
           file.mimetype === 'application/pdf' ||
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

        // בדיקת תקינות כותרת (רק אם המשתמש ניסה לעדכן אותה)
        if (title !== undefined && !isTextValid(title)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Provided title cannot be empty."
            });
        }

        // בדיקות קבצים (רק במידה והועלו קבצים חדשים כלשהם בטופס)
        if (req.files) {

            // א) ולידציה על קאבר חדש (במידה והוחלף)
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

            // ב) ולידציה בלולאה על קבצי גלריה משנית (במידה והועלו)
            if (req.files.media_files) {
                if (!Array.isArray(req.files.media_files)) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed: media_files structure must be wrapped in an array."
                    });
                }

                // הגבלת כמות קבצים כדי להגן על השרת
                if (req.files.media_files.length > 10) {
                    return res.status(400).json({
                        success: false,
                        message: "Validation failed: Maximum of 10 secondary assets can be updated at once."
                    });
                }

                // ריצה על המערך ובדיקת כל איבר בנפרד בעזרת פונקציות העזר
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

// export { ProjectValidation };
export default ProjectValidation ;