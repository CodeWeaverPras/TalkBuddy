const User = require('../models/userModel');
const { generateToken } = require('../utils/generateJWTtoken');

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  const userInfo = {
    name,
    email,
    password,
    pic,
  };

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please Enter all the Fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create(userInfo);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }
  res.status(201).json({ user, token: generateToken(user._id) });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({ user, token: generateToken(user._id) });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
};


const allUsers = async(req, res)=>{
  const searchQuery = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

    const users = await User.find(searchQuery).find({
      _id: { $ne: req.user._id },
    });

    res.status(200).send(users);
}


  module.exports = { allUsers, registerUser, authUser };
