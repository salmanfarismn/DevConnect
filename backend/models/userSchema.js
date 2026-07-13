const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minLength: [3, "Name should be atleast 3 character long."],
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    phone: {
        type: Number,
        required: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },
    role: {
        type: String,
        enum: ['client', 'developer', 'admin'],
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: [6, "Password must be at 6 characters"]
    },
    profileImage: {
        type: String,
    },
    bio: String,
    skills: [String],
    experience: String,
    linkedIn: String,
    github: String,
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

//? isModified prevents the re-hashing of already hashed passwords when the other fields are updated.  

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
