// --- PRIVATE HELPER VALIDATION FUNCTIONS ---

// Checks if the email matches a standard format structure
const isEmailFormatValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Checks password strength (e.g., minimum 6 characters)
const isPasswordStrong = (password) => {
    return password && password.length >= 6;
};

// Checks if the role provided is allowed in the system
const isRoleValid = (role) => {
    const validRoles = ['client', 'professional', 'admin'];
    return validRoles.includes(role);
};


class AuthValidation {
    // ---   PUBLIC MIDDLEWARE FUNCTIONS      ---

    // Validation for Register Step 1
    static async registerStep1(req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        if (!await isEmailFormatValid(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        if (!await isPasswordStrong(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        next();
    };

    // Validation for Register Step 2
    static async registerStep2 (req, res, next) {
        const { name, role, categoryIds } = req.body;

        if (!name || !role) {
            return res.status(400).json({ message: "Name and role fields are required." });
        }

        if (!await isRoleValid(role)) {
            return res.status(400).json({ message: "Invalid system role type." });
        }

        if (role === 'professional') {
            if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
                return res.status(400).json({ message: "Professionals must select at least one category." });
            }
        }

        next();
    };

    // Validation for Login
    static async login (req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        if (!await isEmailFormatValid(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        next();
    };
};

export default AuthValidation;