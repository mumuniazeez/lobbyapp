import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSearch,
  faMessage,
  faArrowLeft,
  faUsers,
  faEllipsisVertical,
  faThumbsDown,
  faSignOut,
  faSignIn,
  faSquareArrowUpRight,
  faSadCry,
  faPlus,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert, useServer } from "../hooks/hooks";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import CreateCommunityModal from "./CreateCommunityModal";
export default function Discover() {
  document.title = "Discover | Lobby";
  let { search } = useLocation();
  let nav = useNavigate();
  let urlSearchParam = new URLSearchParams(search);

  const [communityInfo, setCommunityInfo] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [communityId, setCommunityId] = useState(urlSearchParam.get("cId"));
  const [isMobile, setIsMobile] = useState(false);
  const [unFilterCommunities, setUnFilterCommunities] = useState(null);
  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
  }, []);

  useEffect(() => {
    useServer("/community/all/", "get", setUnFilterCommunities);
  }, []);
  useEffect(() => {
    setCommunityId(urlSearchParam.get("cId"));
  }, [search]);

  useEffect(() => {
    setCommunityInfo(null);
    if (communityId) {
      useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
    } else {
      setCommunityInfo(null);
    }
  }, [communityId]);

  useEffect(() => {
    if (!unFilterCommunities) return;
    if (typeof unFilterCommunities.message === "string") {
      setCommunities(unFilterCommunities);
      return;
    } else {
      setCommunities(
        unFilterCommunities.filter((community) => !community.isInCommunity)
      );
    }
  }, [unFilterCommunities]);

  const joinCommunity = (comID, e) => {
    e.target.disabled = true;

    useServer(`/community/join/${comID}`, "post", (res) => {
      useAlert(res.message);
      useServer("/community/all/", "get", setUnFilterCommunities);
      if (communityId)
        useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
      setTimeout(() => {
        e.target.disabled = false;
      }, 2000);
    });
  };
  const leaveCommunity = (comID, e) => {
    e.target.disabled = true;

    useServer(`/community/leave/${comID}`, "post", (res) => {
      useAlert(
        res.message,
        res.message === "Cannot leave your own community" ? "danger" : "primary"
      );
      useServer("/community/all/", "get", setUnFilterCommunities);
      if (communityId)
        useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
      setTimeout(() => {
        e.target.disabled = false;
      }, 2000);
    });
  };

  return (
    <>
      <div
        className={`col-md-3 border-end p-0 bg-light ${
          isMobile && communityId ? "d-none" : ""
        }`}
        style={{ height: isMobile ? "90vh" : "100vh" }}
      >
        <div className="p-2 pt-4">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <h4>Discover</h4>
            </div>
            <div>
              <div className="me-2">
                <button className="btn" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
                <ul className="dropdown-menu text-small pt-3">
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
        <div className="container overflow-hidden overflow-y-scroll h-75">
          {communities ? (
            typeof communities.message === "string" ? (
              <div className="container text-center py-5">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="me-3 fs-1 text-secondary mb-4"
                />
                <h6>{communities.message}</h6>
                <button
                  className="w-100 btn btn-primary mt-3"
                  data-bs-toggle="modal"
                  data-bs-target="#createCommunityModal"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create one
                </button>
              </div>
            ) : communities.length > 0 ? (
              communities.map((community) => {
                return (
                  <div key={communities.id}>
                    <div className="container  p-0 mt-3 mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <Link
                          to={`/discover?cId=${community.id}`}
                          className="btn text-start p-0 d-flex align-items-center"
                        >
                          <div
                            className="d-inline-flex align-items-center justify-content-center text-secondary bg-body-secondary bg-gradient fs-5 rounded-circle me-3"
                            style={{ width: "2.5rem", height: "2.5rem" }}
                          >
                            <FontAwesomeIcon icon={faUsers} />
                          </div>
                          <h6 style={{ textOverflow: "ellipsis" }}>
                            {community.name}
                          </h6>
                        </Link>
                        <div>
                          {isMobile ? (
                            <button
                              className="btn btn-outline-primary rounded-pill"
                              onClick={(e) => joinCommunity(community.id, e)}
                            >
                              Join <FontAwesomeIcon icon={faSignIn} />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="container text-center py-5">
                  <FontAwesomeIcon
                    icon={faSadCry}
                    className="me-3 fs-1 text-secondary mb-4"
                  />
                  <h6>No new community available.</h6>
                  <p className="lead">
                    Open <Link to="/">Joined community</Link>
                  </p>
                </div>
              </>
            )
          ) : (
            <>
              <LoadingAnimation />
              <h6 className="text-center">Loading communities</h6>
            </>
          )}
        </div>
      </div>

      <div
        className={`col-md-9 p-0 ${isMobile && !communityId ? "d-none" : ""}`}
      >
        {communityId ? (
          communityInfo ? (
            <>
              <div
                className={`container p-0 ${isMobile ? "chat--container" : ""}`}
                style={{
                  width: "100%",
                  height: "100vh",
                }}
              >
                <div className="bg-light container w-100 border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center py-2">
                        <Link
                          to="/discover"
                          className="text-decoration-none text-black me-3"
                        >
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <div
                          className="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 rounded-circle me-3"
                          style={{ width: "2.5rem", height: "2.5rem" }}
                        >
                          <FontAwesomeIcon icon={faUsers} className="fs-4" />
                        </div>
                        <h3>{communityInfo.name}</h3>
                      </div>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </div>
                  </div>
                </div>
                <div
                  className="mb-3 overflow-hidden overflow-y-scroll bg-light"
                  style={{ scrollBehavior: "smooth", height: "100%" }}
                >
                  <div className="container text-center">
                    <div
                      className="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-1 rounded-circle me-3"
                      style={{ width: "10rem", height: "10rem" }}
                    >
                      <FontAwesomeIcon
                        icon={faUsers}
                        style={{ fontSize: "50pt" }}
                      />
                    </div>
                    <h1>{communityInfo.name}</h1>
                    <p className="lead">{communityInfo.description}</p>
                    <p className="text-secondary">
                      Community | {communityInfo.members.length}{" "}
                      {communityInfo.members.length < 2 ? "member" : "members"}
                    </p>
                  </div>
                  <div className="container text-center">
                    <div>
                      {communityInfo.isInCommunity ? (
                        <>
                          <Link
                            to={`/?cId=${communityInfo.id}`}
                            className="ms-3 btn btn-primary me-3"
                          >
                            Open <FontAwesomeIcon icon={faSquareArrowUpRight} />
                          </Link>
                          <button
                            className="btn btn-outline-danger rounded-pill"
                            onClick={(e) => leaveCommunity(communityInfo.id, e)}
                          >
                            Leave <FontAwesomeIcon icon={faSignOut} />
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-outline-primary"
                          onClick={(e) => joinCommunity(communityInfo.id, e)}
                        >
                          Join <FontAwesomeIcon icon={faSignIn} />
                        </button>
                      )}
                      <button className="ms-3 btn btn-danger">
                        Report <FontAwesomeIcon icon={faThumbsDown} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <LoadingAnimation />
          )
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
    </>
  );
}
