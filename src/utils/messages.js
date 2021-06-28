const generateMessage = (username, message) => {
  return {
    username,
    text: message,
    time: new Date().getTime(),
  };
};

const generateLocation = (username, { latitude, longitude }) => {
  const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  return {
    username,
    url,
    time: new Date().getTime(),
  };
};

module.exports = { generateMessage, generateLocation };
