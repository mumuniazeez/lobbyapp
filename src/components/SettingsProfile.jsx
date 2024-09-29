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

export default function SettingsProfile() {
  const [myProfile, setMyProfile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const nav = useNavigate();

  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
    useServer("/user/me", "GET", setMyProfile);
  }, []);

  const signOut = () => {
    usePrompt(
      "Sign out",
      "Are you sure you want to sign out ?",
      "danger",
      "Sign out",
      () => {
        localStorage.removeItem("token");
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
                <h6 className="m-0">Profile</h6>
              </div>
              <div>
                <button className="btn me-3" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>

                <ul className="dropdown-menu text-small w-25 pt-3">
                  <li>
                    <button className="dropdown-item" onClick={signOut}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="fa fa-share me-2"
                      />
                      Edit profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item bg-danger"
                      onClick={signOut}
                    >
                      <FontAwesomeIcon
                        icon={faSignOut}
                        className="fa fa-share me-2"
                      />
                      Sign out
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
            <div className="container px-5 border-bottom py-2 mt-4">
              <div className="container text-center">
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
            <div className="container px-5 border-bottom py-2">
              <small>Bio</small>
              <p>
                {myProfile.bio
                  ? myProfile.bio
                  : "You haven't add your bio yet."}
              </p>
              <small>
                Date of birth |{" "}
                <span className="text-secondary fw-bold">
                  Your date of birth isn't visible to other users
                </span>
              </small>

              <p>
                {myProfile.dob
                  ? `${new Date(myProfile.dob).getDate()}/${new Date(
                      myProfile.dob
                    ).getMonth()}/${new Date(myProfile.dob).getFullYear()}`
                  : "You haven't add your date of birth yet."}
              </p>
            </div>
            <div className="px-5 py-3 mb-5 container bg-light">
              <button className="btn btn-primary me-3" onClick={signOut}>
                <FontAwesomeIcon icon={faPen} className="me-2" />
                Edit profile
              </button>
              <button className="btn btn-danger me-3" onClick={signOut}>
                <FontAwesomeIcon icon={faSignOut} className="me-2" />
                Sign out
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
