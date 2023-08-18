import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
// import LatestUser from '../models/latestuser.js';

dotenv.config();




  

// user registration
export const register = async (req, res) => {
  // hashing password
 
  try {
    const salt = bcrypt.genSaltSync(10)
    const password=req.body.password;
      const existingUser = await User.findOne({ email: req.body.email });
  
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }


    if(!password){
        throw new Error('password is missing')
    }
    const hash = bcrypt.hashSync(req.body.password, salt)


    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      confirmPassword:req.body.confirmPassword
    });
   const savedUser=await newUser.save();

       // Send confirmation email to the user
       const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: 'mbabazilouangeliza@gmail.com',
          pass: 'thptgwaajzhnbmpd'
        },
      });
  
      const mail = {
        from: 'mbabazilouangeliza@gmail.com', 
        to: savedUser.email,
        subject: "Welcome to our platform!",
        text: `Hello ${savedUser.name},\n\nThank you for registering on our platform. Your account has been successfully created.\n\nBest regards,\nThe Dream Discover Team`
      };
  
      transporter.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent successfully to:", savedUser.email);
        }
      });


    res.status(200).json({ success: true, message: 'Successfully registered' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create. Try again' })
    console.error(err)
  }
}


export const login = async (req, res) => {
  const email = req.body.email

  try {
    const user = await User.findOne({ email })

    // if the user doesn't exist
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // if the user exists then check the password
    const checkPassword = await bcrypt.compare(req.body.password, user.password)

    // if passwords don't match
    if (!checkPassword) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' })
    }

    // Create an information object with necessary user information (excluding password and sensitive data)
    const information = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other user-specific information you want to include in the token
    };
    const { password, role, ...rest } = user._doc;

    // create jwt token
    const token = jwt.sign(information, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // set token in the browser cookies and send the response to the client
    res
      .cookie('accessToken', token, {
        httpOnly: true,
        expiresIn: '1h', // Note that expiresIn is not a property of the token; it should be set here in your code
      })
      .status(200)
      .json({
        success: true,
        token,
        information,
        message: 'Successfully logged in',
      });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to login' });
  }
}


  



  
