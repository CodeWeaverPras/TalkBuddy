const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log('Userid is missing');
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
        .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name email pic',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatname: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

// fetch all chats for a user
const fetchChats = async (req, res) => {
    try {
      const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
  
      const populatedResults = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
  
      res.status(200).send(populatedResults);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };

// create a group for chat
const createGroupChat = async(req, res)=>{
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
      }
      var users = JSON.parse(req.body.users);

      if (users.length < 2) {
        return res
          .status(400)
          .send("Group chat requires at least two users to participate");
      }

      users.push(req.user);//  add current logged in user to the list of users
      // console.log(users)

      try {
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: users,
          isGroupChat: true,
          groupAdmin: req.user,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
    
        res.status(200).json(fullGroupChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
}

// remove a user from a group
const removeFromGroup = async(req, res)=>{
  const { chatId, userId } = req.body;


  const chat = await Chat.findById(chatId);

  // Check if the requester is the group admin
  // console.log(chat.groupAdmin._id.toString(), req.user._id.toString());
  if (chat.groupAdmin._id.toString() !== req.user._id.toString()) {
    return res.status(403).send("You do not have permission to perform this action");
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
}


// add a new user to a group 
const addToGroup = async(req, res)=>{
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
}

// rename a group 
const renameGroup = async(req, res)=>{
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,{chatName}, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
}


module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
};

/* The reason for using `$elemMatch` and `$eq` is to ensure that both `req.user._id` and `userId` exist in the `users` array simultaneously. If you were to use `user: req.user._id` instead, it would simply check if `req.user._id` exists in the `users` array, but it wouldn't ensure that both `req.user._id` and `userId` exist in the array at the same time. */
