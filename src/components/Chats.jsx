import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faUsers,
  faEllipsisVertical,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useServer } from "../hooks/hooks";
import LoadingAnimation from "./LoadingAnimation";
import { Link, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

export default function Chats({ communityId, roomId }) {
  const [roomInfo, setRoomInfo] = useState(null);
  const [communityInfo, setCommunityInfo] = useState(null);
  const [messages, setMessages] = useState(null);
  const [messageInfo, setMessageInfo] = useState({
    communityId,
    roomId,
    username: "",
    message: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
  }, []);

  const chatSpaceRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    setRoomInfo(null);
    useServer(`/room/info/${roomId}`, "get", setRoomInfo);
  }, [roomId]);
  useEffect(() => {
    if (roomInfo)
      setMessageInfo({ ...messageInfo, username: roomInfo.username });
  }, [roomInfo]);
  useEffect(() => {
    setCommunityInfo(null);
    useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
  }, [communityId]);

  useEffect(() => {
    if (chatSpaceRef.current) {
      chatSpaceRef.current.scrollTo(0, chatSpaceRef.current.scrollHeight);
    }
  }, [messages]);

  useEffect(() => {
    if (messageInfo.username) {
      socketRef.current = io("http://localhost:3000");

      socketRef.current.emit("joinRoom", messageInfo);

      socketRef.current.on("prevMessages", (msg) => {
        setMessages(msg);
        console.log(msg);
      });
      socketRef.current.on("sendMessage", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
    return () => {
      if (socketRef.current && messageInfo.username) {
        socketRef.current.emit("leaveRoom", messageInfo);
        socketRef.current.disconnect();
      }
    };
  }, [roomInfo]);

  useEffect(() => {
    return () => {
      if (socketRef.current && messageInfo.username) {
        socketRef.current.emit("leaveRoom", messageInfo);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (messageInfo.message.trim()) {
      socketRef.current.emit("sendMessage", messageInfo);
      setMessageInfo({ ...messageInfo, message: "" });
    }
  };

  return roomInfo && communityInfo ? (
    <>
      <div
        className={`container p-0 ${isMobile ? "chat--container" : ""}`}
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="bg-light container w-100">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center py-2">
              <Link to="/" className="text-decoration-none text-black me-3">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <div className="d-flex align-items-center">
                <div>
                  <div
                    class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-circle me-3"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                </div>
                <div>
                  <h4 className="m-0">{communityInfo.name}</h4>

                  <small className="m-0">{roomInfo.name}</small>
                </div>
              </div>
            </div>
            <div>
              <FontAwesomeIcon
                data-bs-toggle="dropdown"
                icon={faEllipsisVertical}
                style={{cursor:"pointer"}}
              />
              <ul class="dropdown-menu text-small w-25 pt-3">
                <li>
                  <button class="dropdown-item">
                    <i class="fa fa-share me-2"></i>Share
                  </button>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
        <div
          ref={chatSpaceRef}
          className="h-75 mb-3 overflow-hidden overflow-y-scroll"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages ? (
            messages.length > 0 ? (
              <>
                <h1 className="text-center my-3">{roomInfo.name}</h1>
                {messages.map((message) => {
                  return (
                    <>
                      <div
                        className="container w-100 mb-2 mt-2"
                        key={message.id}
                      >
                        <div
                          className={`p-2 rounded-top-3 ${
                            message.creator == roomInfo.username
                              ? "ms-auto"
                              : ""
                          }`}
                          style={{ width: "fit-content" }}
                        >
                          <div className="mb-1">
                            <button className="btn btn-primary rounded-circle me-2">
                              <FontAwesomeIcon icon={faUser} />
                            </button>
                            {message.creator}
                          </div>
                          <div
                            className={`p-2 rounded-top-3 ${
                              message.creator == roomInfo.username
                                ? "text-bg-primary ms-auto rounded-start-3"
                                : "text-bg-secondary rounded-end-3"
                            }`}
                          >
                            {message.message}
                            <br />
                            <span
                              className="d-block w-100 text-end"
                              style={{ fontSize: "5pt" }}
                            >
                              {message.createdat}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </>
            ) : (
              <div className="container pt-5 text-center">
                <div className="bg-light p-2 py-5 rounded-3 mx-auto w-50">
                  <div
                    class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-1 rounded-circle me-3"
                    style={{ width: "7rem", height: "7rem" }}
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      style={{ fontSize: "30pt" }}
                    />
                  </div>
                  <h3>{roomInfo.name}</h3>
                  <p>
                    {communityInfo.members.length}{" "}
                    {communityInfo.members.length < 2 ? "member" : "members"}
                  </p>
                  <p>No message yet.</p>
                </div>
              </div>
            )
          ) : (
            <LoadingAnimation />
          )}
        </div>
        <div className="d-flex px-4">
          {roomInfo.enablemessage || communityInfo.isAdmin ? (
            <>
              <input
                type="text"
                name=""
                id=""
                autoFocus
                className="form-control w-100"
                placeholder="Type your message"
                value={messageInfo.message}
                onChange={(e) => {
                  setMessageInfo({ ...messageInfo, message: e.target.value });
                }}
              />
              <button
                className="btn btn-primary rounded-circle ms-2"
                onClick={sendMessage}
                disabled={messageInfo.message.trim() ? false : true}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </>
          ) : (
            <input
              type="text"
              disabled
              name=""
              id=""
              className="form-control w-100 disabled"
              placeholder="Only admin can send message"
            />
          )}
        </div>
      </div>
    </>
  ) : (
    <LoadingAnimation />
  );
}
