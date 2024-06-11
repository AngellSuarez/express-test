module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('New connection:', socket.id);
  
      socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
      });
    });
  };