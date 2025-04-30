import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`, {
  transports: ['websocket'],
});

export default socket;
