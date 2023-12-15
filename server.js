const express = require("express");
const dotenv = require("dotenv")
const morgan = require("morgan");
const connectDB = require("./config/db");
const Authrouter = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const path = require("path");



const app = express();
dotenv.config();

connectDB();
//middleware
app.use(express.json());
app.use(morgan("dev"))

app.use(express.static("build"))

app.use("/api/user", Authrouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

//----------Deployment----------


// const _dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production"){

//   app.use(express.static(path.join(_dirname1, "/client/build")));

//   app.get("*", (req,res) => {
//     res.sendFile(path.resolve(_dirname1, "build", "index.html"));
//   });

// } else {
//   app.get("/", (req,res) => {
//   res.status(200).json("api is running")
// })
// }
  //-----------deployment--------

  app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT

 

const server = app.listen(PORT, console.log(`server running in port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on("connection", (socket)=> {
   console.log("connected to socket.io");

   socket.on("setup", (userData)=> {
     socket.join(userData._id);
    //console.log(userData._id);
    socket.emit("connected");
   });

   socket.on("join chat", (room) => {
     socket.join(room);
     console.log(`user Joined room: ${room} `);
   });

   socket.on("typing", (room) => socket.in(room).emit("typing"));
   socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"));

   socket.on("new message", (newMessageRecived)=> {
     
    var chat = newMessageRecived.chat;

    if(!chat.users) return console.log("chat.users not defined");

    chat.users.forEach(user => {
      if(user._id == newMessageRecived.sender._id ) return;

      socket.in(user._id).emit("message recieved", newMessageRecived)
    });
   });

   socket.off("setup", ()=> {
    console.log(" user disconnected");
    socket.leave(userData._id);
   });
});