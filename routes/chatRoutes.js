const express = require("express");
const { protect } = require("../middleware/authMiddlewire");
const {accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require("../controller/chatControllers");

const chatRouter = express.Router();


 chatRouter.route("/").post(protect, accessChat);
 chatRouter.route("/").get(protect, fetchChat);
 chatRouter.route("/group").post(protect, createGroupChat);
 chatRouter.put("/rename", protect, renameGroup );
 chatRouter.put("/groupadd", protect, addToGroup);
 chatRouter.put("/groupremove", protect, removeFromGroup);
 

module.exports = chatRouter;