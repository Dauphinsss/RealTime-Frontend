"use client";

import { useEffect, useState } from "react";
import { initSocket, getSocket } from "../lib/socket";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  useEffect(() => {
    const socket = initSocket();

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    const socket = getSocket();
    if (newMessage.trim()) {
      socket.emit("message", { name, message: newMessage }); // Envía el nombre y el mensaje
      setNewMessage(""); // Limpia el campo de entrada
    }
  };

  const setNameHandler = () => {
    if (name.trim()) {
      setIsNameSet(true);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat en tiempo real</h1>

      {!isNameSet ? (
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre"
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={setNameHandler}>Guardar nombre</button>
        </div>
      ) : (
        <>
          <div
            style={{
              border: "1px solid gray",
              height: "300px",
              overflowY: "auto",
              padding: "10px",
            }}
          >
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.name}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            style={{ width: "80%", marginRight: "10px" }}
          />
          <button onClick={sendMessage}>Enviar</button>
        </>
      )}
    </div>
  );
}
