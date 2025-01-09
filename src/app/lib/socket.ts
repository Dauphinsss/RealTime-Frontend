import { io, Socket } from "socket.io-client";

let socket: Socket | undefined; 

const backend: string = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(backend);
  }
  return socket!;
};

export const getSocket = (): Socket | undefined => socket; 
