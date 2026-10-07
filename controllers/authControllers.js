const User = require('../models/user');

const bcrypt = require('bcrypt');


const { SALT_ROUNDS } = require('../utils/config');


const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
/* const { response } = require('../app'); */


const authController = {

    register: async (req, res) => {
        try {

            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: "User alredy exists" });
            }

            const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));

            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });
            await newUser.save();

            await sendEmail( email, "Welcome to Job Portal",`Hi ${name}, \n
                \n 
                Thank you for registering on our job portal. We are excited to have you on board!
                Best regards, \n
                Job Portal Team`
);


            return res.status(201).json({ message: "User registered successfully" });
        } catch (e) {
            return res.status(500).json({
                message: e.message
            });
        }
    },

    login: async (req, res) => {
        try {

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "Invalid User or user dose not exist" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(400).json({ message: "invalid password" });
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.ENV === 'production',
                sameSite: process.env.ENV === 'production' ? 'none' : 'lax',
                maxAge: 3600000

            })
            return res.status(200).json({ message: "User logged in SucessFully" });

        } catch (e) {
            return res.status(500).json({
                message: e.message
            });
        }
    },

    me: async (req, res) => {
        try {

            const userId = req.userId;

            const user = await User.findById(userId).select("-password -__v");

            return res.status(200).json(user);
        } catch (e) {
            return res.status(500).json({
                message: e.message
            });
        }
    },

    logout: async (req, res) => {
        try {
                 // clear cooki
              res.clearCookie('token',{
                  httpOnly: true,
                 secure: process.env.ENV === 'production',
                 sameSite: process.env.ENV === 'prodcution' ? ' none':'lax', 
                  maxAge: 3600000
                     
                }) 

                  return res.status(200).json({
            message: "User logged out successfully"
        });
} catch (e) {
            return res.status(500).json({
                message: e.message
            });
        }
    },
       uploadProfilePicture: async (req, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({
                    message: 'No file uploaded'
                });
            }

            const user = await User.findByIdAndUpdate(
                req.userId,
                {
                   profilePicture: req.file.path.replace(/\\/g, '/')
                },
                {
                    new: true
                }
            ).select('-password');

            res.status(200).json({
                success: true,
                message: 'Profile picture uploaded successfully',
                user
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: 'Error uploading profile picture',
                error: error.message
            });

        }
    },

     uploadResume: async (req, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({
                    message: 'No file uploaded'
                });
            }

            const user = await User.findByIdAndUpdate(
                req.userId,
                {
                    resume: req.file.path
                },
                {
                    new: true
                }
            ).select('-password');

            res.status(200).json({
                success: true,
                message: 'Resume uploaded successfully',
                user
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: 'Error uploading resume',
                error: error.message
            });

        }
    }

};

module.exports = authController;