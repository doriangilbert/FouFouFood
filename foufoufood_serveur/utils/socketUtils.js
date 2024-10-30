const userSocketMap = new Map();

function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('Nouveau client connecté');

        socket.on('register', (userId) => {
            console.log(`Enregistrement de l'utilisateur ${userId} with avec le socket ${socket.id}`);
            userSocketMap.set(userId, socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Client déconnecté');
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });
    });
}

function notifyUser(io, userId, data) {
    const socketId = userSocketMap.get(userId);
    if (socketId) {
        console.log(`Envoi de notification à l'utilisateur ${userId} au socket ${socketId}`);
        io.to(socketId).emit('notification', data);
    } else {
        console.log(`Utilisateur ${userId} non connecté`);
    }
}

module.exports = {setupSocketIO, notifyUser};