import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faArrowDown,
  faUsers,
  faEllipsisVertical,
  faPaperPlane,
  faUser,
  faInfo,
  faBell,
  faArrowUpRightFromSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { usePrompt, useServer } from "../hooks/hooks";
import LoadingAnimation from "./LoadingAnimation";
import { Link } from "react-router-dom";
import { socketIoConnection } from "../socket/socket";
import Linkify from "linkify-react";
import ReactMarkdown from "react-markdown";

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
  const [myProfile, setMyProfile] = useState(null);
  const [unSentMessages, setUnSentMessages] = useState([]);

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
    useServer("/user/me", "GET", setMyProfile);
  }, []);

  useEffect(() => {
    if (myProfile) {
      setMessageInfo({ ...messageInfo, username: myProfile.username });
    }
  }, [myProfile]);

  const chatSpaceRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    setRoomInfo(null);
    setMessageInfo({ ...messageInfo, roomId });
    useServer(`/room/info/${roomId}`, "get", setRoomInfo);
  }, [roomId]);

  useEffect(() => {
    setCommunityInfo(null);
    useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
  }, [communityId]);

  useEffect(() => {
    if (messages && chatSpaceRef.current) {
      chatSpaceRef.current.scrollTo(0, chatSpaceRef.current.scrollHeight);
    }
  }, [messages, unSentMessages, chatSpaceRef.current]);

  window.onbeforeunload = () => {
    if (socketRef.current && messageInfo.username) {
      socketRef.current.emit("leaveRoom", messageInfo);
    }
  };

  useEffect(() => {
    if (roomInfo) {
      setMessages(null);
      socketRef.current = socketIoConnection;

      socketRef.current.emit("joinRoom", messageInfo);

      socketRef.current.on("prevMessages", (msg) => {
        setMessages(msg);
      });
      socketRef.current.on("sendMessage", (msg) => {
        console.log("mmm");
        setMessages((prevMessages) => [...prevMessages, msg]);
        setUnSentMessages(
          unSentMessages.filter((message) => message.message !== msg.message)
        );
      });
    }

    return () => {
      if (socketRef.current && messageInfo.username) {
        socketRef.current.emit("leaveRoom", messageInfo);
      }
    };
  }, [roomInfo]);

  useEffect(() => {
    return () => {
      if (socketRef.current && messageInfo.username) {
        socketRef.current.emit("leaveRoom", messageInfo);
      }
    };
  }, []);

  const sendMessage = () => {
    if (messageInfo.message.trim()) {
      const newMessage = { ...messageInfo, status: "unsent" };
      setUnSentMessages([...unSentMessages, newMessage]);
      socketRef.current.emit("sendMessage", messageInfo);
      setMessageInfo({ ...messageInfo, message: "" });
    }
  };

  const UnsentMessages = () => {
    return (
      <div>
        {unSentMessages.map((message) => (
          <div key={message.id}>
            <div className="container w-100 mb-2 mt-2">
              <div
                className="p-2 rounded-top-3 d-flex ms-auto"
                style={{
                  width: "fit-content",
                  maxWidth: "70%",
                }}
              >
                <div className="p-2 rounded-bottom-3 message-container text-bg-primary ms-auto rounded-start-3">
                  <span style={{ fontSize: "10pt" }}>{message.username}</span>

                  <p>{message.message}</p>

                  <span
                    className="d-block lead w-100 text-end"
                    style={{ fontSize: "8pt" }}
                  >
                    Sending...
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const handleMessageChange = (e) => {
    e.target.style.height = "auto";
    const { scrollHeight } = e.target;
    e.target.style.height = scrollHeight < 50 ? "50" : scrollHeight + 5 + "px";
    setMessageInfo({
      ...messageInfo,
      message: e.target.value,
    });
  };

  const getTime = (timestamp) => {
    let dateObj = new Date(timestamp);

    return `${
      dateObj.getHours() < 13 ? dateObj.getHours() : dateObj.getHours() - 12
    }:${dateObj.getMinutes()} ${dateObj.getHours() < 12 ? "AM" : "PM"}`;
  };

  const renderDate = (timestamp) => {
    let chatDateObj = new Date(timestamp);
    let currentDateObj = new Date();
    let chatDate = `${chatDateObj.getDate()}/${chatDateObj.getMonth()}/${chatDateObj.getFullYear()}`;

    let yesterdayDate = `${
      currentDateObj.getDate() - 1
    }/${currentDateObj.getMonth()}/${currentDateObj.getFullYear()}`;
    let currentDate = `${currentDateObj.getDate()}/${currentDateObj.getMonth()}/${currentDateObj.getFullYear()}`;

    if (chatDate === currentDate) {
      return "Today";
    } else if (chatDate === yesterdayDate) {
      return "Yesterday";
    }
    return chatDate;
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
              <Link
                to={`/?cId=${communityId}`}
                className="text-decoration-none text-black me-3"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <div className="d-flex align-items-center">
                <div>
                  <div
                    className="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-circle me-3"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                </div>
                <div>
                  <h6 className="m-0">{communityInfo.name}</h6>

                  <small className="m-0">{roomInfo.name}</small>
                </div>
              </div>
            </div>
            <div>
              <FontAwesomeIcon
                data-bs-toggle="dropdown"
                icon={faEllipsisVertical}
                style={{ cursor: "pointer" }}
                className="me-3"
              />
              <ul className="dropdown-menu text-small w-25 pt-3">
                <li>
                  <button className="dropdown-item">
                    <i className="fa fa-share me-2"></i>Share
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          ref={chatSpaceRef}
          className="mb-3 overflow-hidden overflow-y-scroll"
          style={{
            scrollBehavior: "smooth",
            height: `calc(87dvh - 50px)`,
          }}
        >
          {communityInfo.isInCommunity ? (
            messages ? (
              messages.length > 0 ? (
                <>
                  <h6 className="text-center my-3">{roomInfo.name}</h6>
                  <div>
                    {messages.map((message, index) => {
                      return (
                        <div key={message.id}>
                          {index === 0 ||
                          renderDate(message.createdat) !==
                            renderDate(messages[index - 1].createdat) ? (
                            <div className="container d-flex justify-content-center position-sticky top-0">
                              <div
                                className="text-bg-secondary rounded-3 text-center p-1"
                                style={{ fontSize: "10pt" }}
                              >
                                <span>{renderDate(message.createdat)}</span>
                              </div>
                            </div>
                          ) : null}

                          {message.type === "normal" ? (
                            <>
                              <div
                                className="container w-100 mb-2 mt-2"
                                key={message.id}
                              >
                                <div
                                  className={`p-2 rounded-top-3 d-flex ${
                                    message.creator === roomInfo.username
                                      ? "ms-auto"
                                      : ""
                                  }`}
                                  style={{
                                    width: "fit-content",
                                    maxWidth: "70%",
                                  }}
                                >
                                  {message.creator != roomInfo.username ? (
                                    <div className="mb-1">
                                      <button className="btn btn-primary rounded-circle me-2">
                                        <FontAwesomeIcon icon={faUser} />
                                      </button>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <div
                                    className={`p-2 rounded-bottom-3 message-container ${
                                      message.creator === roomInfo.username
                                        ? "text-bg-primary ms-auto rounded-start-3"
                                        : "text-bg-secondary rounded-end-3"
                                    }`}
                                  >
                                    <span style={{ fontSize: "10pt" }}>
                                      {message.creator}
                                    </span>

                                    <Linkify
                                      as="p"
                                      options={{
                                        render: {
                                          url: ({ attributes, content }) => {
                                            return (
                                              <a
                                                {...attributes}
                                                target="_blank"
                                              >
                                                {content}
                                              </a>
                                            );
                                          },
                                        },
                                      }}
                                    >
                                      {message.message}
                                    </Linkify>

                                    <span
                                      className="d-block lead w-100 text-end"
                                      style={{ fontSize: "8pt" }}
                                    >
                                      {getTime(message.createdat)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : message.type === "notice" ? (
                            <>
                              <div className="container d-flex justify-content-center py-0">
                                <div
                                  className="text-bg-secondary rounded-3 text-center py-0"
                                  style={{ width: "400px" }}
                                >
                                  <small>{message.message}</small>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* <div className="position-fixed bottom-0 left-5">
                    {chatSpaceRef.current &&
                    chatSpaceRef.current.scrollTop <
                      chatSpaceRef.current.scrollHeight ? (
                      <button
                        className="btn btn-primary rounded-circle"
                        onClick={() => {
                          if (chatSpaceRef.current) {
                            chatSpaceRef.current.scrollTo(
                              0,
                              chatSpaceRef.current.scrollHeight
                            );
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                    ) : null}
                  </div> */}
                </>
              ) : (
                <div className="container pt-5 d-flex align-items-center justify-content-center">
                  <div className="bg-light p-2 py-5 rounded-3 mx-auto w-50 text-center">
                    <div
                      className="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-1 rounded-circle me-3"
                      style={{ width: "7rem", height: "7rem" }}
                    >
                      <FontAwesomeIcon
                        icon={
                          roomInfo.type === "announcement" ? faBell : faUsers
                        }
                        style={{ fontSize: "30pt" }}
                      />
                    </div>
                    <h3>{roomInfo.name}</h3>
                    <p>
                      {communityInfo.members.length}{" "}
                      {communityInfo.members.length < 2 ? "member" : "members"}
                    </p>
                    <button className="btn btn-primary rounded-pill">
                      {" "}
                      <FontAwesomeIcon icon={faInfo} className="me-2" />
                      Community info
                    </button>
                  </div>
                </div>
              )
            ) : (
              <LoadingAnimation />
            )
          ) : (
            <div className="container w-100 h-100 d-flex align-items-center justify-content-center text-center flex-column">
              <FontAwesomeIcon
                icon={faPlus}
                className="me-3 fs-1 text-secondary mb-4"
              />
              <h3>You haven't join this community</h3>
              <Link
                to={`/discover?cId=${communityInfo.id}`}
                className="btn btn-outline-primary mt-3"
              >
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className="me-2"
                />
                Join to see messages
              </Link>
            </div>
          )}
          {unSentMessages.length > 0 && <UnsentMessages />}
        </div>
        {communityInfo.isInCommunity && messages ? (
          <div
            className="container py-0 chat-input-field-container d-flex align-items-center justify-content-center"
            style={
              isMobile
                ? {
                    position: "fixed",
                    right: 0,
                    left: 0,
                    button: 0,
                  }
                : {
                    flex: 1,
                    overflowY: "hidden",
                  }
            }
          >
            {roomInfo.enablemessage || communityInfo.isAdmin ? (
              <>
                <textarea
                  name=""
                  id=""
                  rows={1}
                  className="bg-light w-100 px-4 chat-input-field rounded-3 d-flex align-items-center"
                  placeholder="Type your message"
                  value={messageInfo.message}
                  autoFocus
                  onChange={(e) => {
                    handleMessageChange(e);
                  }}
                ></textarea>
                {messageInfo.message.trim() ? (
                  <button
                    className="btn btn-light ms-2 me-2"
                    style={{ height: "55px" }}
                    onClick={sendMessage}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                ) : null}
              </>
            ) : (
              <textarea
                name=""
                id=""
                rows={1}
                className="w-100 border px-4 chat-input-field rounded-3 d-flex align-items-center disabled"
                disabled
                placeholder="Only admin can send message."
              ></textarea>
            )}
          </div>
        ) : null}
      </div>
    </>
  ) : (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="container py-5">
        <LoadingAnimation addWhiteSpace={false} />
      </div>
    </div>
  );
}
