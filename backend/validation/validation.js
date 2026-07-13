const ExpressError = require("../utils/ExpressError");
const { projectSchema, proposalSchema, registerSchema, loginSchema } = require("../validation/Schema");

function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if(error) {
            const errorMessage = error.details.map((el) => el.message).join(", ");
            throw new ExpressError(errorMessage, 400);
        }
        next();
    };
};

exports.validateProjects = validate(projectSchema);
exports.validateProposals = validate(proposalSchema);
exports.validateRegister = validate(registerSchema);
exports.validateLogin = validate(loginSchema);