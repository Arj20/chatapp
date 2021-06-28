let users = [];

//ADD USERS
const addUsers = (id, username, room) => {
  //   if (!username) return error("please enter the username");

  username = username.trim().toLowerCase();
  //   let ExistingUser = users.find(
  //     (user) => user.username == username && user.room === room
  //   );
  //   if (ExistingUser)
  //     return error("User already exists, use a differet username");

  let user = {
    id,
    username,
    room,
  };
  users.push(user);
  return user;
};

//GET USER
const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

//REMOVE USER
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

//GET ALL USERS IN THE ROOM
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUsers, getUser, removeUser, getUsersInRoom };
