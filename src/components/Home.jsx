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
} from "@fortawesome/free-solid-svg-icons";
import { useServer } from "../hooks/hooks";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import Chats from "./Chats";
import CreateCommunityModal from "./CreateCommunityModal";
import CreateRoomModal from "./CreateRoomModal";

export default function Home() {
  let { search } = useLocation();
  let urlSearchParam = new URLSearchParams(search);

  const [communityInfo, setCommunityInfo] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [communityId, setCommunityId] = useState(urlSearchParam.get("cId"));
  const [roomId, setRoomId] = useState(urlSearchParam.get("rId"));
  const [rooms, setRooms] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
  }, []);

  useEffect(() => {
    useServer("/community/joined", "get", setCommunities);
  }, []);

  useEffect(() => {
    setCommunityId(urlSearchParam.get("cId"));
    setRoomId(urlSearchParam.get("rId"));
  }, [search]);
  useEffect(() => {
    if (communityId || roomId) {
      useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
      // setCommunityInfo(communities.filter(community => community.id == communityId))

      useServer(`/community/rooms/${communityId}`, "get", setRooms);
    } else {
      setCommunityInfo(null);
      setRooms(null);
    }
  }, [communityId, roomId]);

  return (
    <>
      <div
        className={`col-md-3 p-0 bg-light ${
          isMobile && communityId && roomId ? "d-none" : ""
        }`}
        style={{ height: "100vh" }}
      >
        <div className="text-bg-primary p-2 pt-4">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <h1>Communities</h1>
            </div>
            <div>
              <span
                className="text-white text-decoration-none me-2"
                data-bs-toggle="modal"
                data-bs-target="#createCommunityModal"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
              </span>
              <span className="text-white me-2">
                <FontAwesomeIcon
                  data-bs-toggle="dropdown"
                  icon={faEllipsisVertical}
                  style={{ cursor: "pointer" }}
                />
                <ul class="dropdown-menu text-small w-25 pt-3">
                  <li>
                    <button class="dropdown-item">
                      <span
                        className=""
                        data-bs-toggle="modal"
                        data-bs-target="#createCommunityModal"
                      >
                        <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                        Create Community
                      </span>
                    </button>
                  </li>
                </ul>
              </span>
            </div>
          </div>
          <div className="input-group w-100 mb-3">
            <label htmlFor="search" className="input-group-text" id="search">
              <FontAwesomeIcon icon={faSearch} />
            </label>
            <input
              type="search"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search"
              id="search"
              name="search"
              className="form-control"
            />
          </div>
        </div>
        <div className="container overflow-hidden overflow-y-scroll h-75">
          {communities && !communityId ? (
            typeof communities.message == "string" ? (
              <div className="text-center mt-3">
                <h5>{communities.message}</h5>
                <p className="lead">
                  Open <Link to="/discover">Discover</Link>
                </p>
              </div>
            ) : (
              communities.map((community, index) => {
                return (
                  <>
                    <Link
                      to={`/?cId=${community.id}`}
                      className="btn btn-light text-start p-0 d-flex align-items-center mb-3 mt-3"
                    >
                      <div
                        class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 rounded-circle me-3"
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        <FontAwesomeIcon icon={faUsers} />
                      </div>
                      <p className="fw-bold fs-6 m-0">{community.name}</p>
                    </Link>
                  </>
                );
              })
            )
          ) : communityId ? (
            rooms && communityInfo ? (
              <>
                <div className="d-flex mt-3  mb-3">
                  <Link to="/" className="text-decoration-none text-black me-3">
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </Link>
                  <h6>{communityInfo.name}</h6>
                </div>
                {rooms.map((room) => {
                  return (
                    <>
                      <Link
                        to={`/?cId=${communityId}&rId=${room.id}`}
                        key={room.id}
                        className="w-100 border-top border-bottom py-1 d-flex align-items-center text-black text-decoration-none"
                      >
                        <div
                          class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 rounded-3 me-3"
                          style={{ width: "2.5rem", height: "2.5rem" }}
                        >
                          <FontAwesomeIcon icon={faHouse} />
                        </div>
                        {room.name}
                      </Link>
                    </>
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
              <LoadingAnimation />
            )
          ) : (
            <LoadingAnimation />
          )}
        </div>
      </div>
      <div
        className={`col-md-8 p-0 ${isMobile && !roomId ? "d-none" : ""}`}
        style={{ width: !isMobile ? "68.66666667%" : "100%", height: "100vh" }}
      >
        {roomId && communityId ? (
          <Chats communityId={communityId} roomId={roomId} />
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
