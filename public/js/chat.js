const messageForm = document.querySelector(".send-msg");
const messageInput = document.querySelector("#message");
const messageButton = document.querySelector("#send-btn");
const exit = document.querySelector("#exit");
const messageLocation = document.querySelector("#location");
const messageArea = document.querySelector(".message-area");
const roomname = document.querySelector("#roomname");
const userList = document.querySelector("#userList");

//EXIT ROOM
exit.addEventListener("click", () => {
  window.location.href = "/";
});

const autoscroll = () => {
  messageArea.scrollTop = messageArea.scrollHeight;
};

//OPTIONS
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

socket.on("message", (message) => {
  roomname.innerText = room;

  const html = `
  <div id="chat">
  <div id="inner-chat">
  <p id="time"><span>${message.username}</span><span>${moment(
    message.time
  ).format("h:mm a")}</span></p>
  <p>
  ${message.text}  
  </p>
  </div>
  </div>`;

  messageArea.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("UsersInRoom", (users) => {
  userList.innerHTML = "";
  users.map((user) => {
    let html = `<li>${user.username}</li>`;
    userList.insertAdjacentHTML("afterbegin", html);
  });

  autoscroll();
});

socket.on("messageLocation", (message) => {
  const html = `
  <div id="loc">
  <div id="inner-chat">
    <p id="time"><span>${message.username}</span><span>${moment(
    message.time
  ).format("h:mm a")}</span></p>
    <a href="${message.url}" target="_blank">
    <i class="fas fa-map-marker-alt"></i> mylocation 
    </a>
    </div></div>`;

  messageArea.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

//Send Messages
messageForm.addEventListener("submit", (e) => {
  messageButton.setAttribute("disabled", "disabled");
  e.preventDefault();
  let message = messageInput.value;
  socket.emit("sendmessage", message);
  messageButton.removeAttribute("disabled");
  messageInput.value = "";
  messageInput.focus();
});

//Send location coordinates
messageLocation.addEventListener("click", (e) => {
  messageLocation.setAttribute("disabled", "disabled");
  e.preventDefault();
  if (!navigator.geolocation)
    return alert("Your browser does not support geolocation!");
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("locationmessage", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
  messageLocation.removeAttribute("disabled");
});

socket.emit("join", { username, room }, (error) => {
  if (error) console.log(error);
});
