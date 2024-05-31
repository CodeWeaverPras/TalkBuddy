const router = require('express').Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatController");

const { authenticateUser } = require("../middlewares/authMiddleware");

// Apply authenticateUser middleware to all routes in the router
router.use(authenticateUser);

router.route("/").post(accessChat).get(fetchChats);
router.route("/group").post(createGroupChat);
router.route("/rename").patch(renameGroup);
router.route("/groupremove").patch(removeFromGroup);
router.route("/groupadd").patch(addToGroup);

module.exports = router;
