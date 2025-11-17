"use client";

import React, { createContext, useContext,  useRef } from "react";

const SocketContext = createContext<WebSocket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = new WebSocket("http://51.20.72.89:8080/");
  const socketRef = useRef<WebSocket>(socket);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
