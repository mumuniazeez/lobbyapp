import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faFile,
  faInfoCircle,
  faMessage,
  faQuestionCircle,
  faShare,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../hooks/hooks";

export default function AboutLobby() {
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
        className="container bg-light p-0"
        style={{
          width: "100wh",
          height: "100vh",
        }}
      >
        <div className="container w-100  border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center py-3">
              <Link to={-1} className="text-decoration-none text-black me-3">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <h6 className="m-0">About Lobby</h6>
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
                  <button
                    className="dropdown-item"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          "http://localhost:5173/"
                        );
                        useAlert("&#x1F4CB Link copied to clipboard");
                      } catch (err) {
                        useAlert(err, "danger");
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      className="fa fa-share me-2"
                    />
                    Share
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="mb-3 bg-body-secondary overflow-hidden overflow-y-scroll d-flex align-items-center justify-content-center flex-column"
          style={{ scrollBehavior: "smooth", height: "100%" }}
        >
          <h1 className="mb-3">Lobby App</h1>
          <FontAwesomeIcon icon={faMessage} style={{ fontSize: "50pt" }} />
          <button className="btn btn-primary rounded-pill mt-3">
            Open Lincence
          </button>
        </div>
      </div>
    </>
  );
}
