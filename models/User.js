import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword:{
      type:String,
      required:true
    }

  },
  { timestamps: false }
);
userSchema.index({name:1},{unique:false});

export default mongoose.model("User", userSchema);
