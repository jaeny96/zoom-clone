const socket = io();

const welcome = document.getElementById("welcome");
const nameForm = welcome.querySelector("form#name");
const form = welcome.querySelector("form");

const room = document.getElementById("room");

room.hidden = true;

let roomName = "";
let nickName = "";

const addMessage = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");

  li.innerText = msg;
  ul.appendChild(li);
};

const backendDone = (msg) => {
  console.log("backend says : ", msg);
};

const messageSubmitHandler = (e) => {
  e.preventDefault();
  const input = room.querySelector("form#msg input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You : ${value}`);
  });

  input.value = "";
};

const nameSubmitHandler = (e) => {
  e.preventDefault();
  const input = nameForm.querySelector("input");

  socket.emit("nickname", input.value);
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const msgForm = room.querySelector("form#msg");

  msgForm.addEventListener("submit", messageSubmitHandler);
};

const roomSubmitHandler = (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
  // socket.emit("enter_room", input.value, backendDone);
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
};

nameForm.addEventListener("submit", nameSubmitHandler);
form.addEventListener("submit", roomSubmitHandler);

socket.on("welcome", (user) => {
  addMessage(`${user} Joined!`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left ㅠㅠ`);
});

socket.on("new_message", addMessage);
