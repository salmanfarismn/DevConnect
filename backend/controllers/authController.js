const User = require("../models/userSchema");
const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const wrapAsync = require("../utils/wrapAsync");

//? User-Register Route 
exports.registerUser = wrapAsync(async(req, res) => {
    //? You have to parse the coming data, otherwise it will console 'undefined'

    const { name, email, phone, password } = req.body;
    const newUser = new User({
        name,
        email, 
        phone, 
        password,
        role: "client"
    });

    await newUser.save();
    res.status(201).json({ 
        message: "User registered successfully",
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
});


//? User-Login Route
exports.loginUser = wrapAsync(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        throw new ExpressError("Invalid email or password", 401);
    }

    const isUserValid = await bcrypt.compare(password, user.password);
    if(!isUserValid) {
        throw new ExpressError("Invalid email or password", 401);
    }

    const token = generateToken({id: user._id, email: user.email, role: user.role });
    res.json({ message: "Login successful", token });
});

//? User-Logout Route
exports.logoutUser = (req, res) => {
    res.json({ message: "Logout successful" });
};