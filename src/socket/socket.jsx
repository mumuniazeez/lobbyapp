import { io } from "socket.io-client";
import { useAlert } from "../hooks/hooks";

let socketIoConnection = io(import.meta.env.VITE_SERVER_URL);

let interval;
let disconnected = false;

socketIoConnection.on("disconnect", () => {
  if (disconnected) return;
  interval = setInterval(() => {
    useAlert("Disconnected, Reconnecting..", "danger");
  }, 5090);
  disconnected = true;
});

socketIoConnection.on("connect", () => {
  if (!disconnected) return;
  useAlert("Connected", "success");
  interval ? clearInterval(interval) : null;
  disconnected = false;
});

window.onbeforeunload = () => {
  socketIoConnection.disconnect();
};

export { socketIoConnection };
