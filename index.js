import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';
import multiparty from 'multiparty'
import path from 'path';

import tourRoute from './routes/tours.js';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import { login, register } from './controllers/authController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: true,
  credentials: true,
};

mongoose.connect(process.env.MONGO_URI);
const conn = mongoose.connection;

conn.once('open', () => {
  console.log('Successfully connected to the database');
});

conn.on('error', () => {
  console.log('Connection to the database failed');
});

// ...
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/tours', tourRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});
// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    //2. You can configure the object however you want
    const mail = {
      from: `${data.email}`,
      to:"mbabazilouangeliza@gmail.com",
      subject: "New contact form entry",
      text: `${data.firstName} ${data.lastName} <${data.email}> \n${data.message}`,
    };

    //3.
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});



app.get('/', (req, res) => {
  res.sendFile('homepage.html', { root: __dirname + '/public' });
});
app.get('/booking', (req, res) => {
  res.sendFile('booking.html', { root: __dirname + '/public' });
});
app.get('/about', (req, res) => {
  res.sendFile('aboutus.html', { root: __dirname + '/public' });
});
app.get('/contact', (req, res) => {
  res.sendFile('contacts.html', { root: __dirname + '/public' });
});
app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: __dirname + '/public' });
});
app.get('/register', (req, res) => {
  res.sendFile('signup.html', { root: __dirname + '/public' });
});

app.post('/register', register);
app.post('/login', login);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
