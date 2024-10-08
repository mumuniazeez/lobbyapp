import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFile,
  faInfoCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import languages from "../languages";

export default function SettingsHelp() {
  let { settingsHelp } =
    languages[JSON.parse(localStorage.appData).userData.language];
  document.title = settingsHelp.pageTitle;

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
              <h6 className="m-0">{settingsHelp.title}</h6>
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
                  <h6 className="m-0">{settingsHelp.helpCenterText}</h6>
                  <small className="m-0">
                    {settingsHelp.helpCenterSubText}
                  </small>
                </div>
              </Link>
              <Link className="btn col-12 mb-3 d-flex align-items-center bg-body-secondary text-start py-2 rounded-3">
                <div>
                  <FontAwesomeIcon icon={faFile} className="fs-3" />
                </div>
                <div className="ms-3">
                  <h6 className="m-0">{settingsHelp.termAndPrivacyText}</h6>
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
                  <h6 className="m-0">{settingsHelp.aboutLobbyText}</h6>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
