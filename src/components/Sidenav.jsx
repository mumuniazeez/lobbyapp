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
import { useEffect, useState, useRef } from "react";
import { useServer, usePrompt } from "../hooks/hooks";
import lobbyLogo from "../lobbyLogo.png";

export default function Sidenav() {
  document.title = "Lobby";
  // /community/myCommunities
  const nav = useNavigate();
  const [asLoggedIn, setAsLoggedIn] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);

  const sNav = useRef(null);

  let { pathname, search } = useLocation();

  useEffect(() => {
    if (localStorage.theme === "system") {
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? (document.body.dataset.bsTheme = "dark")
        : (document.body.dataset.bsTheme = "light");
    } else document.body.dataset.bsTheme = localStorage.theme;
  }, []);

  useEffect(() => {
    useServer(`/user/me`, "GET", (res) => {
      if (
        res.message === "Unauthorized" ||
        res.message === "Error verifying token"
      ) {
        setAsLoggedIn(false);
        sessionStorage.setItem("urlRef", `${pathname}${search}`);
        nav("/login");
      } else {
        localStorage.setItem("theme", res.theme);
        if (res.theme === "system") {
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? (document.body.dataset.bsTheme = "dark")
            : (document.body.dataset.bsTheme = "light");
          window.matchMedia("(prefers-color-scheme: dark)").onchange = (e) => {
            if (res.theme !== "system") return;
            e.matches
              ? (document.body.dataset.bsTheme = "dark")
              : (document.body.dataset.bsTheme = "light");
          };
        } else document.body.dataset.bsTheme = res.theme;
        setAsLoggedIn(true);
      }
    });
  }, []);

  // window.addEventListener("click", (e) => {
  //   console.log(sNav.current === e.target);
  //   if (!sNav.current && sNav.current === e.target) return;

  //   setExpandMenu(false);
  //   sNav.current.classList.remove("nav-expanded");
  // });

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
  return asLoggedIn ? (
    <>
      <div className="row" style={{ height: "100vh" }}>
        <div
          className="col-1"
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
                    className={`p-2 fs-6 ${
                      pathname === "/" ? "" : "text-black"
                    }`}
                    icon={faUsers}
                  />
                  <span className="ms-3 text-black fs-6">Communities</span>
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
                  <span className="ms-3 text-black fs-6">Discover</span>
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
                <span className="ms-3 text-black fs-6">Settings</span>
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
                <span className="ms-3 text-black fs-6">Profile</span>
              </Link>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </>
  ) : (
    <div
      className="container-fluid d-flex align-items-center justify-content-center flex-column"
      style={{ height: "100vh" }}
    >
        <img src={lobbyLogo} alt="lobby logo" width={100} className="animatedLogo" />
    </div>
  );
}
