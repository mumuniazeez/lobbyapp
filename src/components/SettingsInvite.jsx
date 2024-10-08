import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCopy,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../hooks/hooks";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import languages from "../languages";

export default function SettingsInvite() {
  let { settingsInvite } =
    languages[JSON.parse(localStorage.appData).userData.language];
  document.title = settingsInvite.title;

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
              <h6 className="m-0">{settingsInvite.title}</h6>
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
                  <FontAwesomeIcon icon={faUserPlus} className="fs-3" />
                </div>
                <div className="ms-3">
                  <h6 className="m-0">{settingsInvite.inviteFriendsText}</h6>
                  <small className="m-0">
                    {settingsInvite.inviteFriendsSubText}
                  </small>
                </div>
                <div className="ms-auto">
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          "http://localhost:5173/"
                        );
                        useAlert(settingsInvite.copyLinkAlert);
                      } catch (err) {
                        useAlert(err, "danger");
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faCopy} className="me-2" />
                    {settingsInvite.copyLinkBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
