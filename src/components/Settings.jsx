import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faMessage,
  faArrowLeft,
  faUsers,
  faEllipsisVertical,
  faBell,
  faPaintBrush,
  faExclamationCircle,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useServer } from "../hooks/hooks";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import SettingsGeneral from "./SettingsGeneral";
import SettingsProfile from "./SettingsProfile";
import SettingsPersonalization from "./SettingsPersonalization";
import SettingsHelp from "./SettingsHelp";
import SettingsInvite from "./SettingsInvite";

export default function Settings() {
  let { search } = useLocation();
  let urlSearchParam = new URLSearchParams(search);

  let nav = useNavigate();

  const [myProfile, setMyProfile] = useState(null);
  const [tab, setTab] = useState(urlSearchParam.get("tab"));
  const [rooms, setRooms] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchData, setSearchData] = useState("");
  const socketRef = useRef(null);
  document.title = "Settings";

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
    useServer("/user/me", "GET", setMyProfile);
  }, []);

  useEffect(() => {
    urlSearchParam = new URLSearchParams(search);
    setTab(urlSearchParam.get("tab"));
  }, [search]);
  return (
    <>
      <div
        className={`col-md-3 border-end p-0 bg-light ${
          isMobile && tab ? "d-none" : ""
        }`}
        style={{ height: isMobile ? "100vh" : "100vh" }}
      >
        {myProfile ? (
          <>
            {isMobile ? (
              <div className="container w-100 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center py-3">
                    <Link
                      to={-1}
                      className="text-decoration-none text-black me-3"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <h6 className="m-0">Settings</h6>
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
            ) : null}
            <div className="container p-3 d-flex align-items-center">
              <div className="">
                <div
                  className="d-inline-flex align-items-center justify-content-center text-secondary bg-secondary-subtle bg-gradient fs-2 rounded-circle me-3"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <FontAwesomeIcon icon={faUsers} className="fs-4" />
                </div>
              </div>
              <div className="">
                <h6 className="m-0 p-0">
                  {myProfile.firstname} {myProfile.lastname}
                </h6>
                <small className="m-0 p-0">{myProfile.username}</small>
              </div>
            </div>

            <div className="container overflow-hidden overflow-y-scroll h-75 pb-5">
              <div className="m-2 my-3 item">
                <Link
                  to="/settings?tab=general"
                  className="rounded bg-body-secondary btn w-100 p-2 text-start "
                  style={{
                    borderLeft: tab === "general" ? "3px solid #0d6efd" : "",
                  }}
                >
                  <FontAwesomeIcon icon={faLaptop} className="btn" />
                  <small style={{ fontSize: "15px" }}>General</small>
                </Link>
              </div>
              <div className="m-2 my-3 item">
                <Link
                  to="/settings?tab=profile"
                  className="rounded bg-body-secondary btn w-100 p-2 text-start "
                  style={{
                    borderLeft: tab === "profile" ? "3px solid #0d6efd" : "",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} className="btn" />
                  <small style={{ fontSize: "15px" }}>Profile</small>
                </Link>
              </div>
              <div className="m-2 my-3 item">
                <div className="rounded bg-body-secondary btn w-100 p-2 text-start ">
                  <FontAwesomeIcon icon={faMessage} className="btn" />
                  <small style={{ fontSize: "15px" }}>Chats</small>
                </div>
              </div>
              <div className="m-2 my-3 item">
                <div className="rounded bg-body-secondary btn w-100 p-2 text-start ">
                  <FontAwesomeIcon icon={faBell} className="btn" />
                  <small style={{ fontSize: "15px" }}>Notification</small>
                </div>
              </div>
              <div className="m-2 my-3 item">
                <Link
                  to="/settings?tab=personalization"
                  className="rounded bg-body-secondary btn w-100 p-2 text-start "
                  style={{
                    borderLeft:
                      tab === "personalization" ? "3px solid #0d6efd" : "",
                  }}
                >
                  <FontAwesomeIcon icon={faPaintBrush} className="btn" />
                  <small style={{ fontSize: "15px" }}>Personalization</small>
                </Link>
              </div>
              <div className="m-2 my-3 item">
                <Link
                  to="/settings?tab=help"
                  className="rounded bg-body-secondary btn w-100 p-2 text-start "
                  style={{
                    borderLeft: tab === "help" ? "3px solid #0d6efd" : "",
                  }}
                >
                  <FontAwesomeIcon icon={faExclamationCircle} className="btn" />
                  <small style={{ fontSize: "15px" }}>Help</small>
                </Link>
              </div>
              <div className="m-2 my-3 item">
                <Link
                  to="/settings?tab=invite"
                  className="rounded bg-body-secondary btn w-100 p-2 text-start "
                  style={{
                    borderLeft: tab === "invite" ? "3px solid #0d6efd" : "",
                  }}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="btn" />
                  <small style={{ fontSize: "15px" }}>Invite friends</small>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <LoadingAnimation />
        )}
      </div>
      <div
        className={`col-md-8 p-0 ${isMobile && !tab ? "d-none" : ""}`}
        style={{ width: !isMobile ? "68.66666667%" : "100%", height: "100vh" }}
      >
        {tab === "general" ? (
          <SettingsGeneral />
        ) : tab === "profile" ? (
          <SettingsProfile />
        ) : tab === "personalization" ? (
          <SettingsPersonalization />
        ) : tab === "help" ? (
          <SettingsHelp />
        ) : tab === "invite" ? (
          <SettingsInvite />
        ) : null}
      </div>
    </>
  );
}
