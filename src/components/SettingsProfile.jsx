import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUsers,
  faEllipsisVertical,
  faSignOut,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useServer, usePrompt } from "../hooks/hooks";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import languages from "../languages";
export default function SettingsProfile() {
  let { settingsProfile } = languages[localStorage.language || "en"];
  document.title = settingsProfile.pageTitle;
  const [myProfile, setMyProfile] = useState(
    JSON.parse(localStorage.appData).userData
  );
  const [isMobile, setIsMobile] = useState(false);

  const nav = useNavigate();

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
    useServer("/user/me", "GET", (res) => {
      let appData = JSON.parse(localStorage.appData);
      appData.userData = res;
      localStorage.appData = JSON.stringify(appData);
      setMyProfile(res);
    });
  }, []);

  const signOut = () => {
    usePrompt(
      "Sign out",
      "Are you sure you want to sign out ?",
      "danger",
      "Sign out",
      () => {
        localStorage.removeItem("appData");
        localStorage.removeItem("token");
        localStorage.removeItem("language");
        localStorage.removeItem("theme");
        document.body.dataset.bsTheme = "system";
        nav("/login");
      }
    );
  };

  return (
    <>
      {myProfile ? (
        <div
          className={` bg-light p-0 ${
            isMobile ? "container-fluid" : "container"
          }`}
          style={{
            width: "100",
            height: "100vh",
          }}
        >
          <div
            className={`border-bottom ${
              isMobile ? "container-fluid" : "container"
            }`}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center py-3">
                <Link to={-1} className="text-decoration-none text-black me-3">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h6 className="m-0">{settingsProfile.title}</h6>
              </div>
              <div>
                <button className="btn" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>

                <ul className="dropdown-menu text-small w-25 pt-3">
                  {/* <li>
                    <button className="dropdown-item" onClick={signOut}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="fa fa-share me-2"
                      />
                      Edit profile
                    </button>
                  </li> */}
                  <li>
                    <button
                      className="dropdown-item bg-danger"
                      onClick={signOut}
                    >
                      <FontAwesomeIcon
                        icon={faSignOut}
                        className="fa fa-share me-2"
                      />
                      {settingsProfile.signOutText}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className="mb-3 overflow-hidden overflow-y-scroll bg-light"
            style={{ scrollBehavior: "smooth", height: "100%" }}
          >
            <div
              className={`px-5 border-bottom py-2 mt-4 ${
                isMobile ? "container-fluid" : "container"
              }`}
            >
              <div
                className={`text-center ${
                  isMobile ? "container-fluid" : "container"
                }`}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center text-bg-secondary bg-gradient fs-1 rounded-circle me-3 mb-3"
                  style={{ width: "7rem", height: "7rem" }}
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{ fontSize: "30pt" }}
                  />
                </div>
                <h3 className="mb-0">
                  {myProfile.firstname} {myProfile.lastname}{" "}
                </h3>
                <p className="mt-0">{myProfile.username}</p>
              </div>
            </div>
            <div
              className={`px-5 border-bottom py-2 ${
                isMobile ? "container-fluid" : "container"
              }`}
            >
              <small>{settingsProfile.bioText}</small>
              <p>{myProfile.bio ? myProfile.bio : settingsProfile.noBioText}</p>
              <small>
                {settingsProfile.dobText} |{" "}
                <span className="text-secondary fw-bold">
                  {settingsProfile.dobSubText}
                </span>
              </small>

              <p>
                {myProfile.dob
                  ? `${new Date(myProfile.dob).getDate()}/${new Date(
                      myProfile.dob
                    ).getMonth()}/${new Date(myProfile.dob).getFullYear()}`
                  : settingsProfile.noDobText}
              </p>
            </div>
            <div
              className={`px-5 py-3 mb-5 container bg-light ${
                isMobile ? "container-fluid" : "container"
              }`}
            >
              {/* <button className="btn btn-primary me-3 my-1" onClick={signOut}>
                <FontAwesomeIcon icon={faPen} className="me-2" />
                Edit profile
              </button> */}
              <button
                className={`btn btn-danger me-3 my-1 ${
                  isMobile ? "w-100 rounded-pill" : ""
                }`}
                onClick={signOut}
              >
                <FontAwesomeIcon icon={faSignOut} className="me-2" />
                {settingsProfile.signOutText}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}
