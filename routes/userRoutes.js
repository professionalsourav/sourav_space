const express = require("express");
const { regiserUser, authUser, allUsers } = require("../controller/userController");
const { protect } = require("../middleware/authMiddlewire");



const Authrouter = express.Router();

Authrouter.route("/signup").post(regiserUser);
 Authrouter.post("/login", authUser);
 Authrouter.get("/search", protect,allUsers);

module.exports = Authrouter;