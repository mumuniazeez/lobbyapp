import React, { useState, useEffect, useRef } from 'react';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';

export default function Message() {
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("you");
  const [messages, setMessages] = useState(null);
  const chatSpaceRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("sendMessage", (name, message) => {
      setMessages((prevMessages) => [...prevMessages, { name, message }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatSpaceRef.current) {
      chatSpaceRef.current.scrollTop = chatSpaceRef.current.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    if (inputValue.trim()) {
      const newMessage = { name, message: inputValue };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socketRef.current.emit("message", name, inputValue);
      setInputValue("");
    }
  }

  return (
    <div className="container mt-4">
      <h3 className="text-center">Chat Room</h3>
      <div
        id="chat-space"
        ref={chatSpaceRef}
        style={{ height: "400px", overflowY: "auto", backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "5px" }}
        className="shadow-sm"
      >
        {messages.map((msg, index) => (
          <div key={index} className="d-flex justify-content-between align-items-center my-3">
            <div className="d-flex align-items-center bg-white py-2 px-3 shadow-sm rounded">
              <img src="https://avatars.githubusercontent.com/u/102069366?v=4" alt="" width="40" height="40" className="rounded-circle me-2" />
              <div className="ms-2">
                <div className="fw-bold">{msg.name}</div>
                <div className="text-muted">{msg.message}</div>
              </div>
            </div>
            <ThreeDotsVertical className="text-muted" />
          </div>
        ))}
      </div>
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
