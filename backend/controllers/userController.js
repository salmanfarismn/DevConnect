const User = require("../models/userSchema");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

exports.getAllUsers = wrapAsync(async(req, res) => {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password -__v");
    if(users.length === 0) {
        throw new ExpressError("No users found", 404);
    }
    res.status(200).json({ message: "All users are retrieved", users });
});

exports.getUserById = wrapAsync(async(req, res) => {
    const user = await User.findOne({ _id: req.params.userId , role: { $ne: "admin" } }).select("-password -__v");
    if(!user) 
        throw new ExpressError("User not found", 404);

    res.status(200).json({ message: "User retrieved", user });
});

exports.deleteUser = wrapAsync(async(req, res) => {
    const user = await User.findById(req.params.userId);

    if(!user) {
        throw new ExpressError("User not found", 404);
    }

    if(req.user.role === "client" && req.user.id !== user._id.toString()) {
        throw new ExpressError("You're not authorized to delete this user", 403);
    }

    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted successfully" });
});