"use client";

import { useEffect, useState, useRef } from "react";
import { initSocket, getSocket } from "./lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    const socket = initSocket();

    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    const socket = getSocket();
    if (newMessage.trim()) {
      socket.emit("message", { name, message: newMessage });
      setNewMessage("");
    }
  };

  const setNameHandler = () => {
    if (name.trim()) {
      setIsNameSet(true);
    }
  };

  return (
    <div className="p-5 grid justify-center items-center">
      <h1 className="font-bold text-center text-xl p-5">Marko's Server</h1>
      {!isNameSet ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inicio</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={setNameHandler}>Guardar nombre</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chat en tiempo real</CardTitle>
          </CardHeader>
          <CardContent>
            <Card className="pl-2 h-96 overflow-y-hidden scroll-smooth">
              {messages.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.name}:</strong> {msg.message}
                </p>
              ))}
              <div ref={messagesEndRef} />{" "}
            </Card>
          </CardContent>
          <CardFooter className="space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <Button onClick={sendMessage}>Enviar</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
