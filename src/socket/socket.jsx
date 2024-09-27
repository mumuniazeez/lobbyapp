import { io } from "socket.io-client";

let socketIoConnection = io("https://lobbyserver.vercel.app/");

window.onbeforeunload = () => {
  socketIoConnection.disconnect();
};

export { socketIoConnection };
