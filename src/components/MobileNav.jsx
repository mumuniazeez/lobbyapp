import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faNewspaper,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useServer } from "../hooks/hooks";
import LoadingAnimation from "./LoadingAnimation";
import lobbyLogo from "../lobbyLogo.png";
import languages from "../languages";

export default function MobileNav() {
  document.title = "Lobby";

  let { pathname, search } = useLocation();

  let urlSearchParam = new URLSearchParams(search);
  const [communityId, setCommunityId] = useState(urlSearchParam.get("cId"));
  const [roomId, setRoomId] = useState(urlSearchParam.get("rId"));
  const [tab, setTab] = useState(urlSearchParam.get("tab"));
  const [loadingText, setLoadingText] = useState("");
  const [progress, setProgress] = useState(0);

  const nav = useNavigate();
  const [asLoggedIn, setAsLoggedIn] = useState(false);

  useEffect(() => {
    if (!localStorage.appData) return;
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

  useEffect(() => {
    let urlSearchParam = new URLSearchParams(search);
    setCommunityId(urlSearchParam.get("cId"));
    setRoomId(urlSearchParam.get("rId"));
    setTab(urlSearchParam.get("tab"));
  }, [search]);
  if (asLoggedIn) {
    let { sideNavMobileNavMenu } =
      languages[JSON.parse(localStorage.appData).userData.language || "en"];

    return asLoggedIn ? (
      <>
        <div style={{ paddingBottom: "20px", width: "100vw" }}>
          <Outlet />
        </div>

        {!roomId && pathname != "/settings" ? (
          <>
            <div className="container-fluid text-bg-primary position-fixed bottom-0 py-1">
              <div className="row">
                <div className="col-4 text-center">
                  <Link
                    to="/"
                    className="text-center align-items-center d-flex p-1 flex-column text-decoration-none text-white rounded-circle fs-5"
                  >
                    <FontAwesomeIcon
                      icon={faUsers}
                      className={`p-1 w-25 px-4 ${
                        pathname === "/" ? "text-bg-light rounded-pill" : ""
                      }`}
                    />
                    <small style={{ fontSize: "10pt" }}>
                      {sideNavMobileNavMenu.communitiesText}
                    </small>
                  </Link>
                </div>
                <div className="col-4 text-center">
                  <Link
                    to="/discover"
                    className="text-center align-items-center d-flex p-1 flex-column text-decoration-none text-white rounded-circle fs-5"
                  >
                    <FontAwesomeIcon
                      icon={faNewspaper}
                      className={`p-1 w-25 px-4 ${
                        pathname === "/discover"
                          ? "text-bg-light rounded-pill"
                          : ""
                      }`}
                    />
                    <small style={{ fontSize: "10pt" }}>
                      {sideNavMobileNavMenu.discoverText}
                    </small>
                  </Link>
                </div>
                <div className="col-4 text-center">
                  <Link
                    to="/settings?tab=profile"
                    className="text-center align-items-center d-flex p-1 flex-column text-decoration-none text-white rounded-circle fs-5"
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className={`p-1 w-25 px-4 ${
                        pathname + search === "/settings?tab=profile"
                          ? "text-bg-light rounded-pill"
                          : ""
                      }`}
                    />
                    <small style={{ fontSize: "10pt" }}>
                      {sideNavMobileNavMenu.profileText}
                    </small>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : null}
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
}
