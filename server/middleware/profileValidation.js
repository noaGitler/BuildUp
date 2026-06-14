// check if a basic text field is valid (not empty or whitespace only)
const isTextValid = (text) => {
    return text && typeof text === 'string' && text.trim().length > 0;
};

// check if a phone number is valid (at least 9 characters)
const isPhoneValid = (phone) => {
    // ממירים לסטרינג למקרה שהגיע כמספר כדי שנוכל לבדוק אורך
    const phoneStr = String(phone || '');
    return phoneStr.trim().length >= 9;
};

class ProfileValidation {

    // Validation middleware for modifying an existing profile
    static update(req, res, next) {
        const { name, phone, category_ids } = req.body;

        if (!isTextValid(name) || !phone) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: name and phone are mandatory fields."
            });
        }

        if (!isPhoneValid(phone)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed: Provided phone number is invalid."
            });
        }

        if (category_ids && !Array.isArray(category_ids)) {
             return res.status(400).json({
                success: false,
                message: "Validation failed: category_ids must be an array."
            });
        }

        next();
    }
}

export default ProfileValidation;