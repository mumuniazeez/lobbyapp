import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faPaintRoller,
} from "@fortawesome/free-solid-svg-icons";
import { useServer, usePrompt, useAlert } from "../hooks/hooks";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import Chats from "./Chats";
import CreateCommunityModal from "./CreateCommunityModal";
import CreateRoomModal from "./CreateRoomModal";
import CommunityProfile from "./CommunityProfile";
import { socketIoConnection } from "../socket/socket";

export default function SettingsPersonalization() {
  const [myProfile, setMyProfile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(localStorage.theme);

  const nav = useNavigate();

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
    useServer("/user/me", "GET", setMyProfile);
  }, []);

  useEffect(() => {
    if (!myProfile) return;
    localStorage.setItem("theme", myProfile.theme);
    setTheme(myProfile.theme);
  }, [myProfile]);

  useEffect(() => {
    if (!theme) return;
    console.log(window.matchMedia("(prefers-color-scheme: dark)").matches);
    console.log(theme);

    if (theme === "system") {
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? (document.body.dataset.bsTheme = "dark")
        : (document.body.dataset.bsTheme = "light");
    } else document.body.dataset.bsTheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    useServer(
      "/user/changeTheme",
      "POST",
      (res) => {
        useAlert(res.message);
      },
      {
        theme: newTheme,
      }
    );
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <>
      {myProfile ? (
        <div
          className={`container bg-light p-0 ${
            isMobile ? "chat--container" : ""
          }`}
          style={{
            width: "100%",
            height: "100vh",
          }}
        >
          <div className="container w-100  border-bottom">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center py-3">
                <Link to={-1} className="text-decoration-none text-black me-3">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h6 className="m-0">Personalization</h6>
              </div>
            </div>
          </div>
          <div
            className="mb-3 overflow-hidden overflow-y-scroll bg-light"
            style={{ scrollBehavior: "smooth", height: "100%" }}
          >
            <div className="container my-5">
              <div className="row px-4">
                <div className="col-12 d-flex align-items-center bg-body-secondary text-start py-2 rounded-3">
                  <div>
                    <FontAwesomeIcon icon={faPaintRoller} className="fs-3" />
                  </div>
                  <div className="ms-3">
                    <h6 className="m-0">Choose your theme</h6>
                    <small className="m-0">
                      Change the theme of your Lobby App
                    </small>
                  </div>
                  <div className="ms-auto">
                    <select
                      value={theme}
                      onChange={(e) => changeTheme(e.target.value)}
                      className="form-select"
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}
