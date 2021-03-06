import http from "http";
import express from "express";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

//서버 생성
const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  //모든 이벤트를 살피는 작은 스파이
  socket.onAny((e) => {
    console.log(`Socket Event : ${e}`);
  });
  socket.on("enter_room", (roomName, showRoom) => {
    //chat room에 참가
    socket.join(roomName);
    // setTimeout(() => {
    //   done("hello from the backend!!");
    // }, 5000);
    showRoom();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });
  socket.on("new_message", (msg, roomName, done) => {
    console.log(roomName, msg);
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    console.log(nickname);
    socket["nickname"] = nickname;
  });
});

httpServer.listen(3000, handleListen);
