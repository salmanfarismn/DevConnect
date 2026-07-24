const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email: String,
    otp: String,
    expiresAt: {
        type: Date,
        expires: 300
    }
});

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;