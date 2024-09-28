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

export default function MobileNav() {
  document.title = "Lobby";

  let { pathname, search } = useLocation();

  let urlSearchParam = new URLSearchParams(search);
  const [communityId, setCommunityId] = useState(urlSearchParam.get("cId"));
  const [roomId, setRoomId] = useState(urlSearchParam.get("rId"));
  const [tab, setTab] = useState(urlSearchParam.get("tab"));

  const nav = useNavigate();
  const [asLoggedIn, setAsLoggedIn] = useState(false);
  useEffect(() => {
    useServer(`/user/me`, "GET", (res) => {
      if (
        res.message === "Unauthorized" ||
        res.message === "Error verifying token" ||
        res.message === "Failed to fetch"
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

  useEffect(() => {
    let urlSearchParam = new URLSearchParams(search);
    setCommunityId(urlSearchParam.get("cId"));
    setRoomId(urlSearchParam.get("rId"));
    setTab(urlSearchParam.get("tab"));
  }, [search]);
  return asLoggedIn ? (
    <>
      <div style={{ paddingBottom: "20px" }}>
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
                  <small style={{ fontSize: "10pt" }}>Communities</small>
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
                  <small style={{ fontSize: "10pt" }}>Discover</small>
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
                  <small style={{ fontSize: "10pt" }}>Profile</small>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  ) : (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <div className="container py-5">
        <LoadingAnimation addWhiteSpace={false} />
      </div>
    </div>
  );
}
