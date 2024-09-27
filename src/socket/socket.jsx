import { io } from "socket.io-client";

let socketIoConnection = io("https://lobbyserver.onrender.com");

window.onbeforeunload = () => {
  socketIoConnection.disconnect();
};

export { socketIoConnection };
