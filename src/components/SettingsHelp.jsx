import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faFile,
  faInfoCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useServer, usePrompt } from "../hooks/hooks";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import Chats from "./Chats";
import CreateCommunityModal from "./CreateCommunityModal";
import CreateRoomModal from "./CreateRoomModal";
import CommunityProfile from "./CommunityProfile";
import { socketIoConnection } from "../socket/socket";

export default function SettingsHelp() {
  const [isMobile, setIsMobile] = useState(false);

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
  }, []);

  return (
    <>
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
              <h6 className="m-0">Help</h6>
            </div>
          </div>
        </div>
        <div
          className="mb-3 overflow-hidden overflow-y-scroll bg-light"
          style={{ scrollBehavior: "smooth", height: "100%" }}
        >
          <div className="container my-5">
            <div className="row px-4">
              <Link className="btn col-12 mb-3 d-flex align-items-center bg-body-secondary text-start py-2 rounded-3">
                <div>
                  <FontAwesomeIcon icon={faQuestionCircle} className="fs-3" />
                </div>
                <div className="ms-3">
                  <h6 className="m-0">Help center</h6>
                  <small className="m-0">Get help, contact us</small>
                </div>
              </Link>
              <Link className="btn col-12 mb-3 d-flex align-items-center bg-body-secondary text-start py-2 rounded-3">
                <div>
                  <FontAwesomeIcon icon={faFile} className="fs-3" />
                </div>
                <div className="ms-3">
                  <h6 className="m-0">Terms and Privacy Policy</h6>
                </div>
              </Link>
              <Link
                to="/about"
                className="btn col-12 mb-3 d-flex align-items-center bg-body-secondary text-start py-2 rounded-3"
              >
                <div>
                  <FontAwesomeIcon icon={faInfoCircle} className="fs-3" />
                </div>
                <div className="ms-3">
                  <h6 className="m-0">About Lobby</h6>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
