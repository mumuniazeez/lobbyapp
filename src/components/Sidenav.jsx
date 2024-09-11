import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUsers,
  faGear,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useServer } from "../hooks/hooks";

export default function Sidenav() {
  // /community/myCommunities
  const nav = useNavigate();
  const [asLoggedIn, setAsLoggedIn] = useState(false);
  let { pathname, search } = useLocation();
  useServer(`/community/all`, "GET", (res) => {
    if (res.message == "Unauthorized") {
      sessionStorage.setItem("urlRef", `${pathname}${search}`);
      nav("/login");
    } else setAsLoggedIn(true);
  });
  return asLoggedIn ? (
    <>
      <div className="row" style={{ height: "100vh" }}>
        <div
          class="d-flex flex-column flex-shrink-0 col-1 p-0 ps-2"
          style={{
            width: "80px",
          }}
        >
          <ul class="nav nav-pills nav-flush flex-column mb-auto text-center p-0">
            <li class="nav-item">
              <Link
                to="/"
                className="d-flex align-items-center justify-content-center fs-1 fw-bold p-2"
              >
                <FontAwesomeIcon
                  className={`border border-1 rounded-circle p-2 fs-3 ${
                    pathname == "/"
                      ? "border-secondary text-bg-secondary"
                      : "border-dark text-black"
                  }`}
                  icon={faUsers}
                />
              </Link>
            </li>
            <li class="nav-item">
              <Link
                to="/discover"
                className="d-flex align-items-center justify-content-center fs-1 fw-bold p-2"
              >
                <FontAwesomeIcon
                  className={`border border-1 rounded-circle p-2 fs-2 ${
                    pathname == "/discover"
                      ? "border-secondary text-bg-secondary"
                      : "border-dark text-black"
                  }`}
                  icon={faNewspaper}
                />
              </Link>
            </li>
          </ul>
          <div className="border-top">
            <Link
              to=""
              className="d-flex align-items-center justify-content-center fs-5 link-body-emphasis p-3"
            >
              <FontAwesomeIcon icon={faGear} />
            </Link>
            <div class="dropdown border-top">
              <a
                href="#"
                class="d-flex align-items-center justify-content-center p-3 link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/mdo.png"
                  alt="mdo"
                  width="24"
                  height="24"
                  class="rounded-circle"
                />
              </a>
              <ul class="dropdown-menu text-small shadow">
                <li>
                  <a class="dropdown-item" href="#">
                    New project...
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </>
  ) : null;
}

function CommunityLink({ to, title, verified, createdBy }) {
  return (
    <Link to={to} className="nav-link">
      <div className="d-flex text-body-secondary pt-3">
        <svg
          className="bd-placeholder-img flex-shrink-0 me-2 rounded"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Placeholder: 32x32"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>Placeholder</title>
          <rect width="100%" height="100%" fill="#007bff"></rect>
          <text x="50%" y="50%" fill="#007bff" dy=".3em">
            32x32
          </text>
        </svg>
        <div className="pb-3 mb-0 small lh-sm w-100">
          <div className="d-flex justify-content-between">
            <strong className="text-gray-dark">{title}</strong>
          </div>
          <span className="d-block">
            {verified && <CheckCircle className="text-primary" />} Verified
          </span>
        </div>
      </div>
    </Link>
  );
}

function RoomLink({ title, createdBy }) {
  return (
    <div className="my-3 p-3 bg-body rounded shadow-sm">
      <div className="d-flex text-body-secondary pt-3">
        <div className="pb-3 mb-0 small lh-sm w-100">
          <div className="d-flex justify-content-between">
            <strong className="text-gray-dark">{title}</strong>
          </div>
          <span className="d-block">Created by {createdBy}</span>
        </div>
      </div>
    </div>
  );
}
