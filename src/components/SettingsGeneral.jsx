import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import languages from "../languages";
import { usePrompt, useServer } from "../hooks/hooks";
import LoadingAnimation from "./LoadingAnimation";

export default function SettingsGeneral() {
  let { settingsGeneral } = languages[localStorage.language || "en"];
  document.title = settingsGeneral.pageTitle;
  const [myProfile, setMyProfile] = useState(
    JSON.parse(localStorage.appData).userData
  );
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState(localStorage.language || "en");
  const [changeLang, setChangeLang] = useState(false);

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
    localStorage.language = myProfile.language;
    setLanguage(myProfile.language);
  }, [myProfile]);

  const changeLanguage = (newLanguage) => {
    setChangeLang(true);
    usePrompt(
      "Change language",
      "Are you sure you want to change your language <hr/> <small>Please click on change and restart then wait for the page to restart.</small>",
      "danger",
      "Change and Restart",
      () => {
        useServer(
          "/user/changeLanguage",
          "post",
          () => {
            let appData = JSON.parse(localStorage.appData);
            appData.userData.language = newLanguage;
            localStorage.appData = JSON.stringify(appData);
            localStorage.language = newLanguage;
            location.reload();
          },
          {
            language: newLanguage,
          }
        );
      },
      "primary",
      "Cancel",
      () => {
        setLanguage(localStorage.language);
        setChangeLang(false);
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
          <div className="container w-100 border-bottom">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center py-3">
                <Link to={-1} className="text-decoration-none text-black me-3">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h6 className="m-0">{settingsGeneral.title}</h6>
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
                <span className="fs-5">{settingsGeneral.languageText}</span>
              </p>
              <div className="">
                <select
                  name=""
                  id=""
                  className="form-select"
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  disabled={changeLang}
                  style={{ cursor: changeLang && "not-allowed" }}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Espanol</option>
                  <option value="ar">Arabic</option>
                  <option value="yo">Yoruba</option>
                  <option value="ha">Hausa</option>
                  <option value="tr">Turkish</option>
                </select>
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
