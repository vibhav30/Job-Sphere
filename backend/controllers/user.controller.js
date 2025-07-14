import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Upload resume if present
        let resumeUrl = null;
        let resumeOriginalName = null;
        if (req.file) {
            const originalName = req.file.originalname.replace(/\.[^/.]+$/, "");
            const timestamp = Date.now();
            const publicId = `${originalName}-${timestamp}`;
            const fileUri = getDataUri(req.file);

            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw",
                folder: "resumes",
                public_id: publicId,
                use_filename: true,
                unique_filename: false,
            });

            resumeUrl = cloudResponse.secure_url;
            resumeOriginalName = req.file.originalname;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                resume: resumeUrl,
                resumeOriginalName: resumeOriginalName
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; // From auth middleware

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Convert skills string to array
        let skillsArray = [];
        if (skills && typeof skills === "string") {
            skillsArray = skills
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean);
        }

        // Update basic info
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray.length > 0) user.profile.skills = skillsArray;

        // Upload resume if file is included
        if (req.file) {
            const originalName = req.file.originalname.replace(/\.[^/.]+$/, "");
            const timestamp = Date.now();
            const publicId = `${originalName}-${timestamp}`;
            const fileUri = getDataUri(req.file);

            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto",
                folder: "resumes",
                public_id: publicId,
                use_filename: true,
                unique_filename: false,
            });

            if (cloudResponse?.secure_url) {
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = req.file.originalname;
            }
        }

        await user.save();

        // Sanitize returned user object
        const sanitizedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: sanitizedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating profile."
        });
    }
};
