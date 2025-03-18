import mongoose from "mongoose";
import bcrypt from "bcrypt";

const systemManagerSchema = mongoose.Schema({
    UserName: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Contact_No: { type: String, required: true },
    DOB: { type: Date, required: true },
    Email: { type: String, required: true, unique: true },
    Address: { type: String, required: true },
});

// Hash password before saving
systemManagerSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const SystemManager = mongoose.model("SystemManager", systemManagerSchema);

export default SystemManager;
