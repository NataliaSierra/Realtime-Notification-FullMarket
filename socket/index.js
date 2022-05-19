import axios from "axios";
import FormData from 'form-data';
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (alias, socketId) => {
  !onlineUsers.some((user) => user.alias === alias) &&
    onlineUsers.push({ alias, socketId });
    var formSendU = new FormData();
    const SendUserOnline = async () => {
      formSendU.append("aliasU", alias)
      formSendU.append("socketIDU", socketId)
      axios.post('http://127.0.0.1:5000/postuseronline', formSendU).then(( res => {
        console.log('NewUsers');
      }))
    }
    SendUserOnline()
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (alias) => {
  return onlineUsers.find((user) => user.alias === alias);
};

io.on("connection", (socket) => {
  socket.on("newUser", (alias) => {
    addNewUser(alias, socket.id);
  });

  socket.once("sendNotification", async ({ senderName, receiverName, type }) => {
    var form = new FormData();
    const receiver = getUser(receiverName);

    const sendname = senderName
    const receivename = receiverName
    const typo = type

    const SendToDb = async () => {
      form.append("senderName", sendname)
      form.append("receiverName", receivename)
      form.append("typet", typo)
      await axios.post('http://127.0.0.1:5000/trytodb', form).then(( res => {
        console.log('enviado');
      }))
    }
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.once("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    }); 
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(5000);
