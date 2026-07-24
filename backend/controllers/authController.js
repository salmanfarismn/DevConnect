const User = require("../models/userSchema");
const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const wrapAsync = require("../utils/wrapAsync");
const { generateOtp, sendMail } = require("../utils/nodemailer");
const Otp = require("../models/otpSchema");
const Project = require("../models/projectSchema");
const Proposal = require("../models/proposalSchema");

//? User-Register Route 
exports.registerUser = wrapAsync(async(req, res) => {
    //? You have to parse the coming data, otherwise it will console 'undefined'

    const { name, email, phone, password } = req.body;
    const newUser = new User({
        name,
        email, 
        phone, 
        password,
        role: "client",
        isVerified: false
    });

    await newUser.save();

    const otp = generateOtp();
    await Otp.create({ email, otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await sendMail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });

    // res.status(201).json({ 
    //     message: "User registered successfully",
    //     user: { id: newUser.id, name: newUser.name, email: newUser.email }
    // });
});

exports.verifyOtp = wrapAsync(async(req, res) => {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });

    if(!record || record.expiresAt < Date.now()) {
        throw new ExpressError("Invalid or expired Otp", 401);
    }

    if(record.otp !== otp) {
        throw new ExpressError("Invalid Otp", 401);
    }

    // Change the user to verified
    const user = await User.findOneAndUpdate({email}, {isVerified: true}, { returnDocument: "after" });

    // Delete the Otp from the database
    await Otp.deleteOne({ email });

    const token = generateToken({id: user._id, email: user.email, role: user.role });
    res.json({ message: "Verification successful", token });
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

exports.getDashboard = wrapAsync(async(req, res) => {
    const user = await User.findById(req.user.id).select("-password -__v");

    let projects = [];
    let proposals = [];

    if(user.role === "client") {
        projects = await Project.find({ owner: user._id });
        proposals = await Proposal.find({ projectOwner: user._id });
    } else if(user.role === "developer") {
        proposals = await Proposal.findById({ user: user._id });
    }

    res.json({
        message: "Dashboard data",
        user,
        projects,
        proposals
    });
});

//? User-Logout Route
exports.logoutUser = (req, res) => {
    res.json({ message: "Logout successful" });
};