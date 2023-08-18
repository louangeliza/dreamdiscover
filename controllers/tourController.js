import Tour from '../models/Tour.js'
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

//creating a new tour


export const createTour=async (req,res)=>{
    const newTour=new Tour(req.body)
    try{
        const savedTour=await newTour.save()

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: 'mbabazilouangeliza@gmail.com',
                pass: 'thptgwaajzhnbmpd'
            },
        });
        console.log('Request Body:', req.body); 

        const mailOptions = {
            from: 'mbabazilouangeliza@gmail.com',
            to: req.body.email, 
            subject: 'Booking Confirmation',
            text: `Your booking for ${savedTour.firstname} ${savedTour.lastname} is confirmed!\n\n Details:\n ${savedTour}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({success:true,message:'successfully created', data:savedTour})
    }catch (err){
console.log(err);
        res.status(500).json({success:false, message:'Failed to create. Try again'})
    }
}
//updating tour
export const updateTour=async(req,res)=>{
    const id=req.params.id
    try{
const updatedTour=await Tour.findByIdAndUpdate(id,{
    $set:req.body,
},{new:true})


res.status(200).json({success:true,message:'successfully updated', data:updatedTour,
});
    }catch(err){
        res.status(500).json
        ({success:false,message:'failed to update'})
    }
};
//Deleting a tour 
export const deleteTour=async(req,res)=>{
    const id=req.params.id
    try{
await Tour.findByIdAndDelete(id)


res.status(200).json({success:true,message:'successfully deleted'
});
    }catch(err){
        res.status(500).json
        ({success:false,message:'failed to delete'})
    }
};
//get a single tour
export const getSingleTour=async(req,res)=>{
    const id=req.params.id
    try{
const tour=await Tour.findById(id)


res.status(200).json({success:true,message:'successful',
data:tour
});
    }catch(err){
        res.status(404).json
        ({success:false,message:'not found'})
    }
};

//get all tours
export const getAllTour=async(req,res)=>{
    try{
const tours=await Tour.find({})
res.status(200).json({success:true,message:'successful',
data:tours})
    }catch(err){
        res.status(404).json
        ({success:false,message:'not found'})  
    }
};