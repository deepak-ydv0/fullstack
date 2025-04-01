import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
  //get data
  //validate
  //check if usre already exist
  //create a user in db
  //create a verifiaction taken
  // save token in db
  //send token as email to user
  //send success statuse to user

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  if (!email.includes("@")) {
    return res.status(400).json({
      message: "Please enter a valid email",
    });
  }
  if (!password.length > 4) {
    return res.status(400).json({
      message: "Please enter min 4 digit password",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User alredy exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email", // Subject line
      text: `Please click on the following link ${process.env.BASE_URL}/api/v1/users.verify/${token}`, // plain text body
    };

    await transporter.sendMail(mailOption);

    res.status(200).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  //get user from params
  //validate
  //find user based on token
  //if note
  //set isverified feild true
  //remove verification token
  // save
  // return response

  const { token } = req.params;

  if (!token) {
    res.status(400).json({
      message: "Invalid token",
    });
  }
  try {
    const user = await User.findOne({
      verificationToken: token,
    });
    console.log(user);

    if (!user) {
      res.status(400).json({
        message: "Invalid user token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(201).json({
      message: "User verify successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: "User not verified",
      error,
      success: false,
    });
  }
};

const login = async (req, res) => {
  //get email password
  // check email exist or not
  // validate password
  // generate sessionToken
  //validate sessionToken

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "User not verified. Please veryfy user",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const cookieOption = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "User not login",
      error,
      success: false,
    });
  }
};

export { registerUser, verifyUser, login };
