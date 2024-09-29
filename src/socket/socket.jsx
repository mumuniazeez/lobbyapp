import { io } from "socket.io-client";

let socketIoConnection = io(import.meta.env.VITE_SERVER_URL);

window.onbeforeunload = () => {
  socketIoConnection.disconnect();
};

export { socketIoConnection };
