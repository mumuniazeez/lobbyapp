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
} from "@fortawesome/free-solid-svg-icons";
import { useServer } from "../hooks/hooks";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
export default function Discover() {
  let { search } = useLocation();
  let nav = useNavigate();
  let urlSearchParam = new URLSearchParams(search);

  const [communityInfo, setCommunityInfo] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [communityId, setCommunityId] = useState(urlSearchParam.get("cId"));
  const [isMobile, setIsMobile] = useState(false);
  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
  }, []);

  useEffect(() => {
    useServer("/community/all/", "get", setCommunities);
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

  const joinCommunity = (comID) => {
    useServer(`/community/join/${comID}`, "post", (res) => {
      useServer("/community/all/", "get", setCommunities);
      if (communityId)
        useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
    });
  };
  const leaveCommunity = (comID) => {
    useServer(`/community/leave/${comID}`, "post", (res) => {
      useServer("/community/all/", "get", setCommunities);
      if (communityId)
        useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
    });
  };

  return (
    <>
      <div
        className={`col-md-3 p-0 bg-light ${
          isMobile && communityId ? "d-none" : ""
        }`}
        style={{ height: "100vh" }}
      >
        <div className="text-bg-primary p-2 pt-4">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <h1>Discover</h1>
            </div>
            <div>
              <Link className="text-white text-decoration-none me-2">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Link>
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
          {communities ? (
            typeof communities.message == "string" ? (
              <h6>{communities.message}</h6>
            ) : (
              communities.map((community, index) => {
                return (
                  <>
                    <div className="container  p-0 mt-3 mb-3" key={index}>
                      <div className="d-flex align-items-center justify-content-between">
                        <Link
                          to={`/discover?cId=${community.id}`}
                          className="btn text-start p-0 d-flex align-items-center"
                        >
                          <div
                            class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 rounded-circle me-3"
                            style={{ width: "3rem", height: "3rem" }}
                          >
                            <FontAwesomeIcon icon={faUsers} />
                          </div>
                          <p className="fw-bold fs-6 m-0">{community.name}</p>
                        </Link>
                        <div>
                          {community.isInCommunity ? (
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => leaveCommunity(community.id)}
                            >
                              Leave <FontAwesomeIcon icon={faSignOut} />
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => joinCommunity(community.id)}
                            >
                              Join <FontAwesomeIcon icon={faSignIn} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            )
          ) : (
            <LoadingAnimation />
          )}
        </div>
      </div>

      <div
        className={`col-md-8 p-5 ${isMobile && !communityId ? "d-none" : ""}`}
        style={{ height: "100vh" }}
      >
        {communityId ? (
          communityInfo ? (
            <>
              <div className="container border-bottom bg-light p-2 rounded-top-3 m-0 ">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Link
                        to="/discover"
                        className="text-decoration-none text-black me-3"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </Link>
                      <div
                        class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 rounded-circle me-3"
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
                className="container bg-light p-2 rounded-bottom-3 m-0 overflow-hidden overflow-y-scroll"
                style={{ scrollBehavior: "smooth", height: "60vh" }}
              >
                <div className="container text-center">
                  <div
                    class="d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-1 rounded-circle me-3"
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
                          className="btn btn-outline-danger"
                          onClick={() => leaveCommunity(communityInfo.id)}
                        >
                          Leave <FontAwesomeIcon icon={faSignOut} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => joinCommunity(communityInfo.id)}
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
    </>
  );
}
