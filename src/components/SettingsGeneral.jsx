import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLaptop,
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
  faKey,
  faPaintBrush,
  faExclamationCircle,
  faGlobe,
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

export default function SettingsGeneral() {
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
        <div className="container w-100 border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center py-3">
              <Link to={-1} className="text-decoration-none text-black me-3">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <h6 className="m-0">General</h6>
            </div>
            
          </div>
        </div>
        <div
          className="overflow-hidden overflow-y-scroll bg-light"
          style={{ scrollBehavior: "smooth", height: "100%" }}
        >
          <div className="container my-5 px-4">
            <p>
              <FontAwesomeIcon icon={faGlobe} className="fs-5 me-2" />
              <span className="fs-5">Language</span>
            </p>
            <div className="">
              <select name="" id="" className="form-select">
                <option value="">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
