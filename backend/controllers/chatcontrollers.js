const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.statusCode(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.statusCode(200).send(fullChat);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields." });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(req.user);

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
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

// const addtoGroup = asyncHandler(async (req, res) => {
//   const { chatId, chatName } = req.body;

//   const added = Chat.findByIdAndUpdate(
//     chatId,
//     { $push: { users: userId } },
//     { new: true }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!added) {
//     res.status(404);
//     throw new Error("Chat not found");
//   } else {
//     res.json(updatedChat);
//   }
// });

const addtoGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    throw new Error("chatId and userId are required");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  // Optional: Prevent non-admins from adding
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only admins can add users");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $addToSet: { users: userId } }, // $addToSet avoids duplicates
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(updatedChat);
});

// const removeFromGroup = asyncHandler(async (req, res) => {
//   const { chatId, chatName } = req.body;

//   const removed = Chat.findByIdAndUpdate(
//     chatId,
//     { $pull: { users: userId } },
//     { new: true }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!removed) {
//     res.status(404);
//     throw new Error("Chat not found");
//   } else {
//     res.json(updatedChat);
//   }
// });

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    throw new Error("chatId and userId are required");
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addtoGroup,
  removeFromGroup,
};
