import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
    res.status(201).json({
      message: "User not registered",
      error,
      success: false,
    });
  }
};

export { registerUser };
