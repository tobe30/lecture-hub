import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/session.js";

export const Register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
             return res.status(400).json({ message: "Invalid email format" });
        }

           if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

        const existingUser = await User.findOne({email});
        if(existingUser){
        return res.status(400).json({ message: "Email already exists, please use a different one"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        try {
            await upsertStreamUser({
            id:newUser._id.toString(),
            name: newUser.name,
            role: newUser.role,
        });
        console.log(`Stream user created for ${newUser.name }`)
        } catch (error) {
            console.log("Error creating  Stream user", error)
        }

        const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    return res.status(201).json({ success: true, user:newUser });
        
    } catch (error) {
        console.log("Error in register controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    console.log("Generated JWT token:", token); // Debugging log

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

   res.status(200).json({success: true, user});
  } catch (error) {
    console.log("Error in login controller", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export function logout(req, res){
    res.clearCookie("jwt")
    res.status(200).json({success: true, message: "Logout successful"});

}


