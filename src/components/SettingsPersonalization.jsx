import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaintRoller } from "@fortawesome/free-solid-svg-icons";
import { useServer, useAlert } from "../hooks/hooks";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";
import languages from "../languages";

export default function SettingsPersonalization() {
  let { settingsPersonalization } =
    languages[JSON.parse(localStorage.appData).userData.language];
  document.title = settingsPersonalization.pageTitle;
  const [myProfile, setMyProfile] = useState(
    JSON.parse(localStorage.appData).userData
  );
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.appData).userData.theme
  );

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

  useEffect(() => {
    if (!myProfile) return;
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
    let appData = JSON.parse(localStorage.appData);
    appData.userData.theme = theme;
    localStorage.appData = JSON.stringify(appData);
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
                <h6 className="m-0">{settingsPersonalization.title}</h6>
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
                    <h6 className="m-0">
                      {settingsPersonalization.chooseThemeText}
                    </h6>
                    <small className="m-0">
                      {settingsPersonalization.chooseThemeSubText}
                    </small>
                  </div>
                  <div className="ms-auto">
                    <select
                      value={theme}
                      onChange={(e) => changeTheme(e.target.value)}
                      className="form-select"
                    >
                      <option value="system">
                        {settingsPersonalization.themeSystem}
                      </option>
                      <option value="light">
                        {settingsPersonalization.themeLight}
                      </option>
                      <option value="dark">
                        {settingsPersonalization.themeDark}
                      </option>
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
