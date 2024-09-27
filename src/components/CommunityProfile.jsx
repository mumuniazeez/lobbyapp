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
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { useServer } from "../hooks/hooks";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";

export default function CommunityProfile({ communityId }) {
  // let { search } = useLocation();
  // let nav = useNavigate();
  // let urlSearchParam = new URLSearchParams(search);
  // const [communityId, setCommunityId] = useState(urlSearchParam.get("cId"));
  const [communityInfo, setCommunityInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //     setCommunityId(urlSearchParam.get("cId"));
  // }, [search]);

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
  }, []);

  useEffect(() => {
    setCommunityInfo(null);
    if (communityId) {
      useServer(`/community/profile/${communityId}`, "get", setCommunityInfo);
    } else {
      setCommunityInfo(null);
    }
  }, [communityId]);

  return (
    <>
      
        {
          communityInfo ? (
            <>
              <div
                className={`container p-0 ${isMobile ? "chat--container" : ""}`}
                style={{
                  width: "100%",
                  height: "100vh",
                }}
              >
                <div className="bg-light container w-100 border-bottom"

                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center py-2">
                        <Link
                          to={`/?cId=${communityId}`}
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
                  <div className="container">
                    {communityInfo.members.map((member) => {
                      return (<h1>{member}</h1>)
                    })}
                  </div>
                </div>
              </div>

            </>
          ) : (
            <LoadingAnimation />
          )
        }
    </>
  )
}