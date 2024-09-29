import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMessage,
  faArrowLeft,
  faUsers,
  faHouse,
  faPlusCircle,
  faEllipsisVertical,
  faPlus,
  faBell,
  faSadCry,
  faArrowUpRightFromSquare,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useServer } from "../hooks/hooks";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import Chats from "./Chats";
import CreateCommunityModal from "./CreateCommunityModal";
import CreateRoomModal from "./CreateRoomModal";
import CommunityProfile from "./CommunityProfile";
import { socketIoConnection } from "../socket/socket";

export default function Home() {
  document.title = "Community | Lobby";
  let { search } = useLocation();
  let urlSearchParam = new URLSearchParams(search);

  const [communityInfo, setCommunityInfo] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [communityId, setCommunityId] = useState(urlSearchParam.get("cId"));
  const [roomId, setRoomId] = useState(urlSearchParam.get("rId"));
  const [showCommunityProfile, setShowCommunityProfile] = useState(
    urlSearchParam.get("sP")
  );
  const [rooms, setRooms] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchData, setSearchData] = useState("");
  const socketRef = useRef(null);

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
    socketRef.current = socketIoConnection;
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("sendNotification", (messageInfo) => {
      console.log(messageInfo);

      if (!communities) return;
      let currentCom = communities.filter(
        (community) => community.id === messageInfo.communityid
      )[0];

      let i = communities.findIndex(currentCom);

      currentCom.newNotice = true;

      communities[i] = currentCom;

      console.log(communities[i]);
    });
  }, [socketRef.current, communities]);

  useEffect(() => {
    useServer("/community/joined", "get", setCommunities);
  }, [communityId, roomId]);

  useEffect(() => {
    setCommunityId(urlSearchParam.get("cId"));
    setRoomId(urlSearchParam.get("rId"));
    setShowCommunityProfile(urlSearchParam.get("sP"));
  }, [search]);

  useEffect(() => {
    if (communityId || roomId) {
      useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
      // setCommunityInfo(communities.filter(community => community.id === communityId))

      useServer(`/community/rooms/${communityId}`, "get", setRooms);
    } else {
      setCommunityInfo(null);
      setRooms(null);
    }
  }, [communityId, roomId]);

  // useEffect(() => {
  //   if (searchData) {
  //     useServer(`/community/search/${searchData}`, "get", setCommunities);
  //   } else {
  //     useServer("/community/joined", "get", setCommunities);
  //   }
  // }, [searchData]);

  return (
    <>
      <div
        className={`col-md-3 border-end p-0 bg-light ${
          isMobile && communityId && (roomId || showCommunityProfile)
            ? "d-none"
            : ""
        }`}
        style={{ height: isMobile ? "90vh" : "100vh" }}
      >
        {!communityId ? (
          <div className="p-2 pt-4">
            <div className="d-flex justify-content-between mb-2">
              <div>
                <h4>Communities</h4>
              </div>
              <div>
                <div>
                  <button className="me-2 btn" data-bs-toggle="dropdown">
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                  <ul className="dropdown-menu text-small">
                    <li>
                      <button className="dropdown-item">
                        <span
                          className=""
                          data-bs-toggle="modal"
                          data-bs-target="#createCommunityModal"
                        >
                          <FontAwesomeIcon
                            icon={faPlusCircle}
                            className="me-2"
                          />
                          Create Community
                        </span>
                      </button>
                    </li>
                    <li>
                      <Link to="/settings" className="dropdown-item">
                        <span className="">
                          <FontAwesomeIcon icon={faGear} className="me-2" />
                          Settings
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="search">
              <div className="input-group border-bottom border-primary rounded bg-body-secondary">
                <input
                  type="search"
                  className="form-control-lg form-control bg-body-secondary border-0"
                  style={{ fontSize: "12px" }}
                  placeholder="Search communities"
                />
                <FontAwesomeIcon icon={faSearch} className="btn" />
              </div>
            </div>
          </div>
        ) : null}
        <div className="container overflow-hidden overflow-y-scroll h-75">
          {communities && !communityId ? (
            typeof communities.message === "string" ? (
              <div className="container text-center py-5">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="me-3 fs-1 text-secondary mb-4"
                />
                <h6>{communities.message}</h6>
                <Link
                  to="/discover"
                  className="w-100 btn btn-outline-primary mt-3"
                >
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="me-2"
                  />
                  Open Discover
                </Link>
                <button
                  className="w-100 btn btn-primary mt-3"
                  data-bs-toggle="modal"
                  data-bs-target="#createCommunityModal"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create one
                </button>
              </div>
            ) : (
              communities.map((community) => {
                return (
                  <div key={community.id}>
                    <Link
                      to={`/?cId=${community.id}`}
                      className="btn btn-light text-start p-0 d-flex align-items-center mb-3 mt-3"
                    >
                      <div
                        className="d-inline-flex align-items-center justify-content-center text-secondary bg-body-secondary fs-5 rounded-circle me-3"
                        style={{ width: "2.5rem", height: "2.5rem" }}
                      >
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                      <h6>{community.name}</h6>
                    </Link>
                  </div>
                );
              })
            )
          ) : communityId ? (
            rooms && communityInfo ? (
              communityInfo.isInCommunity ? (
                <>
                  <div className="d-flex mt-3 align-items-center  mb-3">
                    <Link
                      to="/"
                      className="text-decoration-none text-black me-3"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <Link
                      to={`/?cId=${communityInfo.id}&sP=true`}
                      className="btn py-0 px-0 w-100 d-flex align-items-center"
                    >
                      <div
                        className="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-5 rounded-circle me-3"
                        style={{ width: "2.5rem", height: "2.5rem" }}
                      >
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                      <div>
                        <h6 className="m-0">{communityInfo.name}</h6>
                        <small className="m-0">
                          {communityInfo.members.length}{" "}
                          {communityInfo.members.length < 2
                            ? "member"
                            : "members"}
                        </small>
                      </div>
                    </Link>
                  </div>
                  <hr />
                  {rooms.map((room) => {
                    return (
                      <div key={room.id}>
                        <Link
                          to={`/?cId=${communityId}&rId=${room.id}`}
                          key={room.id}
                          className="w-100 py-1 d-flex align-items-center text-black text-decoration-none"
                        >
                          <div
                            className="d-inline-flex align-items-center justify-content-center text-secondary bg-body-secondary fs-5 rounded-circle me-3"
                            style={{ width: "2.5rem", height: "2.5rem" }}
                          >
                            <FontAwesomeIcon
                              icon={
                                room.type === "announcement" ? faBell : faHouse
                              }
                            />
                          </div>
                          <h6>{room.name}</h6>
                        </Link>
                      </div>
                    );
                  })}
                  {communityInfo.isAdmin ? (
                    <div className="container mt-5">
                      <button
                        className="btn btn-primary w-100 rounded-5"
                        data-bs-toggle="modal"
                        data-bs-target="#createRoomModal"
                      >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Add Room
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="d-flex mt-3 align-items-center  mb-3">
                    <Link
                      to="/"
                      className="text-decoration-none text-black me-3"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <Link
                      to={`/?cId=${communityInfo.id}&sP=true`}
                      className="btn py-0 px-0 w-100 d-flex align-items-center"
                    >
                      <div
                        className="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-5 rounded-circle me-3"
                        style={{ width: "2.5rem", height: "2.5rem" }}
                      >
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                      <div>
                        <h6 className="m-0">{communityInfo.name}</h6>
                        <small className="m-0">
                          {communityInfo.members.length}{" "}
                          {communityInfo.members.length < 2
                            ? "member"
                            : "members"}
                        </small>
                      </div>
                    </Link>
                  </div>
                  <div className="container border-top  text-center py-5">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="me-3 fs-1 text-secondary mb-4"
                    />
                    <h6>You haven't join this community</h6>
                    <Link
                      to={`/discover?cId=${communityInfo.id}`}
                      className="w-100 btn btn-outline-primary mt-3"
                    >
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="me-2"
                      />
                      Open Discover to join
                    </Link>
                  </div>
                </>
              )
            ) : (
              <LoadingAnimation />
            )
          ) : (
            <LoadingAnimation />
          )}
        </div>

        {!communityId ? (
          <div
            className="container text-end"
            style={{
              marginTop: "-80px",
              paddingRight: "30px",
            }}
          >
            <button
              className="btn btn-primary rounded-circle"
              data-bs-toggle="modal"
              data-bs-target="#createCommunityModal"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        ) : null}
      </div>
      <div
        className={`col-md-8 p-0 ${
          isMobile && !communityId && !roomId && !showCommunityProfile
            ? "d-none"
            : ""
        }`}
        style={{ width: !isMobile ? "68.66666667%" : "100%", height: "100vh" }}
      >
        {roomId && communityId && !showCommunityProfile ? (
          <Chats communityId={communityId} roomId={roomId} />
        ) : showCommunityProfile ? (
          <>
            <CommunityProfile communityId={communityId} />
          </>
        ) : (
          <>
            <div className="container w-100 h-100 d-flex align-items-center justify-content-center text-primary flex-column">
              <FontAwesomeIcon icon={faMessage} style={{ fontSize: "50pt" }} />

              <h1>LOBBY WEB</h1>
              <p>
                Send and receive messages without keeping your phone online.
              </p>
            </div>
          </>
        )}
      </div>
      <CreateCommunityModal />
      <CreateRoomModal communityId={communityId} />
    </>
  );
}
