const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("form#nickname");
const messageForm = document.querySelector("form#message");

const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (msg) => {
  const li = document.createElement("li");
  li.innerText = msg.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

const submitNicknameHandler = (e) => {
  e.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
};

const submitHandler = (e) => {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";

  const li = document.createElement("li");
  li.innerText = `You : ${input.value}`;
  messageList.append(li);
};

nicknameForm.addEventListener("submit", submitNicknameHandler);
messageForm.addEventListener("submit", submitHandler);
