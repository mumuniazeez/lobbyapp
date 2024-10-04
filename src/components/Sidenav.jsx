import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUsers,
  faGear,
  faNewspaper,
  faNavicon,
  faUser,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useServer } from "../hooks/hooks";
import lobbyLogo from "../lobbyLogo.png";
import languages from "../languages";

export default function Sidenav() {
  document.title = "Lobby";
  const nav = useNavigate();
  const [asLoggedIn, setAsLoggedIn] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [progress, setProgress] = useState(0);

  let { pathname, search } = useLocation();

  useEffect(() => {
   if (!JSON.parse(localStorage.appData)) return;
    if (JSON.parse(localStorage.appData).theme === "system") {
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? (document.body.dataset.bsTheme = "dark")
        : (document.body.dataset.bsTheme = "light");
    } else document.body.dataset.bsTheme = localStorage.theme;
  }, []);

  useEffect(() => {
    if (!localStorage.appData) {
      let appData = {};
      setLoadingText("Loading user data");
      setProgress(0);
      useServer(`/user/me`, "GET", (res) => {
        if (
          res.message === "Unauthorized" ||
          res.message === "Error verifying token" ||
          res.message === "User not found"
        ) {
          setAsLoggedIn(false);
          sessionStorage.setItem("urlRef", `${pathname}${search}`);
          nav("/login");
        } else {
          appData.userData = res;
          setProgress(25);
          setLoadingText("Loading communities");

          useServer("/community/joined", "get", (res) => {
            appData.joinedCommunities = res;
            setProgress(50);
            setLoadingText("Loading rooms");
            appData.rooms = [];
            let communities = res;
            communities.forEach((community, index) => {
              useServer(`/community/rooms/${community.id}`, "get", (res) => {
                appData.rooms = appData.rooms.concat(res);
                console.log("🚀 ~ useServer ~ rooms:", appData.rooms);
                console.log(appData.rooms);
                if (index === communities.length - 1) {
                  setProgress(75);
                  useServer("/community/all/", "get", (res) => {
                    setLoadingText("Loading discover");
                    setProgress(100);
                    appData.discover = res;
                    setTimeout(() => {
                      localStorage.appData = JSON.stringify(appData);
                      location.reload();
                    }, 2000);
                  });
                }
              });
            });
          });
        }
      });
    } else {
      useServer(`/user/me`, "GET", (res) => {
        if (
          res.message === "Unauthorized" ||
          res.message === "Error verifying token" ||
          res.message === "User not found"
        ) {
          setAsLoggedIn(false);
          sessionStorage.setItem("urlRef", `${pathname}${search}`);
          nav("/login");
        } else {
          let appData = JSON.parse(localStorage.appData);
          appData.userData = res;
          localStorage.appData = JSON.stringify(appData);
          if (res.theme === "system") {
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? (document.body.dataset.bsTheme = "dark")
              : (document.body.dataset.bsTheme = "light");
            window.matchMedia("(prefers-color-scheme: dark)").onchange = (
              e
            ) => {
              if (res.theme !== "system") return;
              e.matches
                ? (document.body.dataset.bsTheme = "dark")
                : (document.body.dataset.bsTheme = "light");
            };
          } else document.body.dataset.bsTheme = res.theme;
          setAsLoggedIn(true);
        }
      });
    }
  }, []);
  let sideNavMobileNavMenu;
  sideNavMobileNavMenu =
    asLoggedIn &&
    languages[JSON.parse(localStorage.appData).userData.language || "en"];

  return asLoggedIn ? (
    <>
      <div
        className=""
        style={{
          width: "65px",
        }}
      >
        <div
          class={`d-flex flex-column flex-shrink-0 p-0 h-100 align-items-start justify-content-start text-start nav-expanded ${
            expandMenu ? "active border-end shadow rounded-end-3" : ""
          }`}
          style={{
            width: "65px",
          }}
          onMouseLeave={(e) => {
            if (!expandMenu) return;
            window.onclick = () => {
              setExpandMenu(false);
            };
          }}
          onMouseEnter={(e) => {
            window.onclick = () => {};
          }}
        >
          <ul className="nav nav-pills nav-flush flex-column mb-auto text-center p-0">
            <li className="nav-item">
              <div className="d-flex align-items-center justify-content-start fs-4 fw-bold p-2">
                <FontAwesomeIcon
                  className={`p-2 fs-5 ${
                    expandMenu ? "text-primary" : "text-secondary"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandMenu(!expandMenu)}
                  icon={expandMenu ? faClose : faNavicon}
                />
              </div>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className="d-flex align-items-center justify-content-start p-2 text-decoration-none"
              >
                <FontAwesomeIcon
                  className={`p-2 fs-6 ${pathname === "/" ? "" : "text-black"}`}
                  icon={faUsers}
                />
                <span className="ms-3 text-black fs-6">
                  {sideNavMobileNavMenu.communitiesText}
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/discover"
                className="d-flex align-items-center justify-content-start p-2 text-decoration-none"
              >
                <FontAwesomeIcon
                  className={`p-2 fs-5 ${
                    pathname === "/discover" ? "" : "text-black"
                  }`}
                  icon={faNewspaper}
                />
                <span className="ms-3 text-black fs-6">
                  {sideNavMobileNavMenu.discoverText}
                </span>
              </Link>
            </li>
          </ul>
          <div className="border-top w-100">
            <Link
              to="/settings"
              className="d-flex align-items-center justify-content-start p-2 text-decoration-none"
            >
              <FontAwesomeIcon
                icon={faGear}
                className={`p-2 fs-5 ${
                  pathname === "/settings" ? "" : "text-black"
                }`}
              />
              <span className="ms-3 text-black fs-6">
                {sideNavMobileNavMenu.settingsText}
              </span>
            </Link>
            <Link
              to="/settings?tab=profile"
              className="d-flex align-items-center justify-content-start p-2 text-decoration-none"
            >
              <FontAwesomeIcon
                icon={faUser}
                className={`p-2 fs-5 ${
                  pathname + search === "/settings?tab=profile"
                    ? ""
                    : "text-black"
                }`}
              />
              <span className="ms-3 text-black fs-6">
                {sideNavMobileNavMenu.profileText}
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ width: "100vw" }}>
        <div className="row" style={{ height: "100vh" }}>
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <div
      className="container-fluid d-flex align-items-center justify-content-center flex-column"
      style={{ height: "100vh" }}
    >
      <img
        src={lobbyLogo}
        alt="lobby logo"
        width={100}
        className="animatedLogo"
      />
      {loadingText && (
        <div className="mt-5 pt-5">
          <div className="progress mb-3 w-100 border">
            <div
              className={"progress-bar w-" + progress}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
          <div className="text-center">
            <h6>Loading App data || {loadingText}..</h6>
            <p>This take place only when logging.</p>
          </div>
        </div>
      )}
    </div>
  );
}
