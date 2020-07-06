const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  // outputUsers(users);
});

// Message from server
socket.on('message', (msg) => {
  console.log(msg);
  outputMessage(msg);

  // Scroll down to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

/**
 * Output Message to DOM
 * @param {string} message A message from user sent from server
 */
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
  <p class="meta"> ${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
};

// Add room name to DOM
/**
 * Function to get room name and replace room HTML
 * @param {*} room
 */
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
/**
 * Funciton to get users in same room and replace users HTML
 * @param {*} users
 */
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join('')}
  `

}