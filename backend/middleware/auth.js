const jwt = require("jsonwebtoken");

module.exports.authenticateToken = (req, res, next) => {
    //? Bearer TOKEN
    //? The authHeader variable stores the Bearer, we get the Bearer header from the request header inside that in authorization header
    //? the token variables stores the token, we check if the authHeader is present and if present we then split it using a space
        //? and the get the 2nd parameter from that array which is token


    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};



module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden. Insufficient role." })
        }
        next();
    }
    
}