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
  faFaceSmile,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect, useRef } from "react";
import { useAlert, usePrompt, useServer } from "../hooks/hooks";
import LoadingAnimation from "./LoadingAnimation";
import { Link } from "react-router-dom";
import { socketIoConnection } from "../socket/socket";
import MessageCard from "./MessageCard";
import languages from "../languages";
import lobbyLogo from "../lobbyLogo.png";

export default function Chats({ communityId, roomId }) {
  const [roomInfo, setRoomInfo] = useState(null);
  const [communityInfo, setCommunityInfo] = useState(null);
  const [messages, setMessages] = useState(null);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [messageInfo, setMessageInfo] = useState({
    communityId,
    roomId,
    username: "",
    message: "",
  });
  const [fromLocalHost, setFromLocalHost] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [myProfile, setMyProfile] = useState(null);
  const [unSentMessages, setUnSentMessages] = useState([]);
  const [showDownBtn, setShowDownBtn] = useState(false);
  const messageInput = useRef(null);
  const chatSpaceRef = useRef(null);
  const socketRef = useRef(null);

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

  useEffect(() => {
    setFromLocalHost(true);
    // setRoomInfo(
    //   JSON.parse(localStorage.appData).rooms.filter(
    //     (room) => room.id === roomId
    //   )[0]
    // );

    setMessageInfo({ ...messageInfo, roomId });
    useServer(`/room/info/${roomId}`, "get", (res) => {
      // let prevRooms = JSON.parse(localStorage.appData).rooms.filter(
      //   (room) => room.id != roomId
      // );
      // prevRooms = prevRooms.concat(res);
      // let newAppData = JSON.parse(localStorage.appData);
      // newAppData.rooms = prevRooms;
      // localStorage.appData = JSON.stringify(newAppData);
      // setFromLocalHost(false);
      setRoomInfo(res);
    });
  }, [roomId]);

  useEffect(() => {
    setCommunityInfo(null);
    useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
  }, [communityId]);

  useEffect(() => {
    if (messages && chatSpaceRef.current && scrollToBottom) {
      chatSpaceRef.current.scrollTo(0, chatSpaceRef.current.scrollHeight);
      setScrollToBottom(false);
    }
  }, [messages, unSentMessages, chatSpaceRef.current, scrollToBottom]);

  useEffect(() => {
    if (chatSpaceRef.current) {
      chatSpaceRef.current.scrollTo(0, chatSpaceRef.current.scrollHeight);

      chatSpaceRef.current.onscroll = () => {
        console.log("scrolling");
        setShowDownBtn(
          chatSpaceRef.current.scrollTop + 494 <
            chatSpaceRef.current.scrollHeight
        );
        console.log(
          "🚀 ~ useEffect ~ chatSpaceRef.current.scrollHeight:",
          chatSpaceRef.current.scrollHeight
        );
        console.log(
          "🚀 ~ useEffect ~  chatSpaceRef.current.scrollTop:",
          chatSpaceRef.current.scrollTop
        );
      };
    }
  }, [chatSpaceRef.current]);

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
      socketRef.current.on("connect", () => {
        if (roomInfo) {
          socketRef.current.emit("joinRoom", messageInfo);
        }
      });

      socketRef.current.on("prevMessages", (msg) => {
        if (messages) setScrollToBottom(false);
        setMessages(msg);
      });
      socketRef.current.on("sendMessage", (msg) => {
        setScrollToBottom(true);
        setMessages((prevMessages) => [...prevMessages, msg]);
        setUnSentMessages(
          unSentMessages.filter((message) => message.message !== msg.message)
        );
        // if (msg.creator != myProfile.username) {
        //   Notification.requestPermission().then((perm) => {
        //     if (perm == "granted") {
        //       new Notification("You have a new message", {
        //         body: msg.message,
        //         icon: lobbyLogo,
        //       });
        //     } else {
        //       useAlert("Please allow notification");
        //     }
        //   });
        // }
      });
    }

    return () => {
      if (socketRef.current && messageInfo.username) {
        socketIoConnection.off("connect");
        socketIoConnection.off("sendMessage");
        socketIoConnection.off("prevMessage");
        socketRef.current.emit("leaveRoom", messageInfo);
      }
    };
  }, [roomInfo]);

  useEffect(() => {
    return () => {
      if (socketRef.current && messageInfo.username) {
        socketIoConnection.off("connect");
        socketIoConnection.off("sendMessage");
        socketIoConnection.off("prevMessage");
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
      setScrollToBottom(true);
      messageInput.current && messageInput.current.focus();
    }
  };

  let { chats } = languages[JSON.parse(localStorage.appData).userData.language];

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
                    {chats.sendingText}
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
    !messageInfo.message ? (e.target.style.height = "50px") : null;
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
      return chats.todayText;
    } else if (chatDate === yesterdayDate) {
      return chats.yesterdayText;
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
          className="mb-3 overflow-hidden overflow-y-scroll chat-container"
          style={{
            scrollBehavior: "smooth",
            height: `calc(87dvh - 50px)`,
          }}
        >
          {communityInfo.isInCommunity ? (
            messages && myProfile && chatSpaceRef.current ? (
              messages.length > 0 ? (
                <>
                  <h6 className="text-center my-3">{roomInfo.name}</h6>
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
                        <MessageCard
                          message={message}
                          myProfile={myProfile}
                          roomId={roomId}
                        />
                      </div>
                    );
                  })}
                  {unSentMessages.length > 0 && <UnsentMessages />}

                  {/* <div className="position-fixed bottom-5 left-5">
                    {showDownBtn && (
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
                    )}
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
                      {chats.communityInfoText}
                    </button>
                  </div>
                </div>
              )
            ) : (
              <>
                <LoadingAnimation />
                <h6 className="text-center">{chats.loadingChat}</h6>
              </>
            )
          ) : (
            <div className="container w-100 h-100 d-flex align-items-center justify-content-center text-center flex-column">
              <FontAwesomeIcon
                icon={faPlus}
                className="me-3 fs-1 text-secondary mb-4"
              />
              <h3>{chats.joinCommunityText}</h3>
              <Link
                to={`/discover?cId=${communityInfo.id}`}
                className="btn btn-outline-primary mt-3"
              >
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  className="me-2"
                />
                {chats.joinCommunityBtnText}
              </Link>
            </div>
          )}
        </div>
        {communityInfo.isInCommunity &&
        messages &&
        myProfile &&
        chatSpaceRef.current ? (
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
                  }
            }
          >
            {roomInfo.enablemessage || communityInfo.isAdmin ? (
              <>
                <div className="dropup">
                  <button
                    className="btn btn-light rounded-end-0 py-0 border-end"
                    type="button"
                    id="dropupMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ height: messageInfo.message ? "55px" : "50px" }}
                  >
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropupMenuButton"
                  >
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setMessageInfo({
                          ...messageInfo,
                          message: messageInfo.message + e.emoji,
                        });
                      }}
                      theme={
                        JSON.parse(localStorage.appData).userData.theme ===
                        "system"
                          ? "auto"
                          : JSON.parse(localStorage.appData).userData.theme
                      }
                    />
                  </ul>
                </div>
                <textarea
                  ref={messageInput}
                  name=""
                  id=""
                  rows={1}
                  className="bg-light w-100 px-4 chat-input-field rounded-3 d-flex align-items-center rounded-start-0"
                  placeholder={chats.chatInputPlaceHolder}
                  value={messageInfo.message}
                  autoFocus
                  onChange={(e) => {
                    handleMessageChange(e);
                  }}
                  style={!messageInfo.message ? { height: "50px" } : null}
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
                className="bg-light w-100 px-4 chat-input-field rounded-3 d-flex align-items-center disabled"
                disabled
                placeholder={chats.disabledInputPlaceHolder}
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
