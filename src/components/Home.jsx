import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowLeft,
  faUsers,
  faHouse,
  faPlusCircle,
  faEllipsisVertical,
  faPlus,
  faBell,
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
import lobbyLogo from "../lobbyLogo.png";
import languages from "../languages";

export default function Home() {
  let { home, discover } =
    languages[JSON.parse(localStorage.appData).userData.language];
  document.title = home.pageTitle;
  let { search } = useLocation();

  let urlSearchParam = new URLSearchParams(search);

  const [communityInfo, setCommunityInfo] = useState(null);
  const [communities, setCommunities] = useState(
    JSON.parse(localStorage.appData).joinedCommunities
  );
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
    useServer("/community/joined", "get", (res) => {
      let appData = JSON.parse(localStorage.appData);
      appData.joinedCommunities = res;
      localStorage.appData = JSON.stringify(appData);
      setCommunities(res);
    });
  }, [communityId, roomId]);

  useEffect(() => {
    setCommunityId(urlSearchParam.get("cId"));
    setRoomId(urlSearchParam.get("rId"));
    setShowCommunityProfile(urlSearchParam.get("sP"));
  }, [search]);

  useEffect(() => {
    if (communityId || roomId) {
      setCommunityInfo(
        JSON.parse(localStorage.appData).joinedCommunities.filter(
          (community) => community.id === communityId
        )[0]
      );

      useServer(`/community/profile/${communityId}`, "get", (res) => {
        let prevCommunity = JSON.parse(
          localStorage.appData
        ).joinedCommunities.filter((community) => community.id != communityId);
        prevCommunity = prevCommunity.concat(res);
        let newAppData = JSON.parse(localStorage.appData);
        newAppData.joinedCommunities = prevCommunity;
        localStorage.appData = JSON.stringify(newAppData);
        setCommunityInfo(res);
      });

      setRooms(
        JSON.parse(localStorage.appData).rooms.filter(
          (room) => room.communityid === communityId
        )
      );
      useServer(`/community/rooms/${communityId}`, "get", (res) => {
        let prevRoom = JSON.parse(localStorage.appData).rooms.filter(
          (room) => room.communityid != communityId
        );
        prevRoom = prevRoom.concat(res);
        let newAppData = JSON.parse(localStorage.appData);
        newAppData.rooms = prevRoom;
        localStorage.appData = JSON.stringify(newAppData);
        setRooms(res);
      });
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
                <h4>{home.sideNavTitle}</h4>
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
                          {home.sideNavMenu.create}
                        </span>
                      </button>
                    </li>
                    <li>
                      <Link to="/settings" className="dropdown-item">
                        <span className="">
                          <FontAwesomeIcon icon={faGear} className="me-2" />
                          {home.sideNavMenu.settings}
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
                  placeholder={home.searchPlaceholder}
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
                  {home.openDiscoverText}
                </Link>
                <button
                  className="w-100 btn btn-primary mt-3"
                  data-bs-toggle="modal"
                  data-bs-target="#createCommunityModal"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  {home.createCommunityText}
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
                            ? discover.member
                            : discover.members}
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
                        {home.addRoomBtn}
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
                            ? discover.member
                            : discover.members}
                        </small>
                      </div>
                    </Link>
                  </div>
                  <div className="container border-top  text-center py-5">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="me-3 fs-1 text-secondary mb-4"
                    />
                    <h6>{home.joinCommunityText}</h6>
                    <Link
                      to={`/discover?cId=${communityInfo.id}`}
                      className="w-100 btn btn-outline-primary mt-3"
                    >
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="me-2"
                      />
                      {home.openDiscoverToJoin}
                    </Link>
                  </div>
                </>
              )
            ) : (
              <>
                <LoadingAnimation />
                <h6 className="text-center">{home.loadingRooms}</h6>
              </>
            )
          ) : (
            <>
              <LoadingAnimation />
              <h6 className="text-center">{home.loadingCommunities}</h6>
            </>
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
        className={`col-md-9 p-0 ${
          isMobile && !communityId && !roomId && !showCommunityProfile
            ? "d-none"
            : ""
        }`}
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
              <img src={lobbyLogo} alt="lobby logo" width={100} />

              <h1>LOBBY WEB</h1>
              <p>{home.lobbyText}</p>
            </div>
          </>
        )}
      </div>
      <CreateCommunityModal />
      <CreateRoomModal communityId={communityId} />
    </>
  );
}
