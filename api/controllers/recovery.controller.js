import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "./../models/user.model.js";
import { errorHandler } from "./../utils/error.js";
import jwt from "jsonwebtoken";
export const recoveryController = async (req, res, next) => {
  const { recipient_email } = req.body;

  try {
    const oldUser = await User.findOne({ email: recipient_email });
    console.log(oldUser);
    if (!oldUser) {
      return next(errorHandler(500, "Invalid email Id"));
    }

    const secrete = process.env.JWT_SECRET_KEY;
    const Recoverytoken = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      secrete,

      { expiresIn: "1m" }
    );

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.MY_EMAIL,
      to: req.body.recipient_email,
      subject: "Passord recovery OTP",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>You are a Valuable user to us. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${req.body.OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Koding 101 Inc</p>
      <p>1600 Amphitheatre Parkway</p>
      <p>California</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Handle email sending error
        next(errorHandler(error.statusCode, error.message));
      } else {
        // Email sent successfully, set the recovery token to cookies
       res.cookie("recovery_token", Recoverytoken, {
         httpOnly: false,
       });
       console.log("cookie");

        res
          .status(200)
          .json({ statusCode: 200, message: "Email has been sent." });
      }
    });
   
  } catch (error) {
     console.error("Error in recoveryController:", error);
    next(errorHandler(error.statusCode, error.message));
  }
};

export const resetPasswordController = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const { email } = req.user;
  console.log(email);

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return next(errorHandler(400, "Passwords do not match"));
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user's password in the database
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Send response
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    // Handle errors
    next(errorHandler(500, "Internal Server Error"));
  }
};
