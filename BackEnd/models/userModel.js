const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {type: "String",required: true,
      default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {type: Boolean,required: true,default: false},
  },
  { timestaps: true }
);

userSchema.methods.matchPassword= async function(enteredPassword){
    const isMatch =await bcrypt.compare(enteredPassword,this.password);
    return isMatch;
}

userSchema.pre('save', async function(next){
  if (!this.isModified) {
    next();
  }
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds) 
})

module.exports =  mongoose.model("User" , userSchema);