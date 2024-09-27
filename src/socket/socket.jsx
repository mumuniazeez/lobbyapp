import { io } from "socket.io-client";

let socketIoConnection = io("http://localhost:3005");

window.onbeforeunload = () => {
  socketIoConnection.disconnect();
};

export { socketIoConnection };
