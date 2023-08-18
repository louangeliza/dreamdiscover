import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      
    },
    lastname: {
      type: String,
     
    },
    code: {
        type: String,
        required: true,
        default:'+250'
        
      },
    mobilenumber: {
      type: String,
      required: true,
      // unique:true
    },
    email: {
      type: String,
      required: true,
      // unique:true
    },
    departure: {
        type: String,
        required: true,
      },
    arrival: {
        type: String,
        required: true,
      },
   guest: {
      type: String,
      required: false,
    }, 
    checkin:{
      type: String,
      required: true,
    },
    checkout:{
      type:String,
      required:true,
    },
    activity:{
      type:String,
      required:true
    },
    preferences:{
      type:String,
      required:false
    },
    requests:{
      type:String,
      required:false
    }
  },
);

export default mongoose.model("Tour", tourSchema);