import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

//서버 생성
const server = http.createServer(app);

//webSocket 서버 생성
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        //각 브라우저를 aSocket으로 표시하고 메시지를 보낸다는 의미임
        sockets.forEach((aSocket) => {
          //모든 소켓을 거쳐서 메시지 보내줌
          aSocket.send(
            `${socket.nickname} : ${message.payload.toString("utf8")}`
          );
        });
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});
//-> 같은 서버에서 http, webSocket 둘 다 작동시키는 것
// http 서버 위에 webSocket 서버 만든 것
// 동일한 포트 내에서 http와 ws request 모두 가능할 것임

server.listen(3000, handleListen);
