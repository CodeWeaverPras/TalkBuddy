const jwt = require('jsonwebtoken');

const generateToken = (payload)=>{
    const token = jwt.sign({payload}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_DATE });
    return token;
}

module.exports ={generateToken};

