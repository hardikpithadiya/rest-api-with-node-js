let io;

module.exports = {
  init: (httpServer) => {
    // Socket io setup
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket io not defined");
    }
    return io;
  },
};
