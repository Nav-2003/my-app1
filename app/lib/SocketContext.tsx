"use client";

import React, { createContext, useContext,  useRef } from "react";

const SocketContext = createContext<WebSocket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = new WebSocket("wss://basic-ws.up.railway.app");
  const socketRef = useRef<WebSocket>(socket);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
