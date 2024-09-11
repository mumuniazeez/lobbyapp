import { Link, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faNewspaper,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
export default function MobileNav() {
  let { pathname } = useLocation();
  return (
    <>
      <Outlet />
      <div className="container-fluid text-bg-primary position-fixed bottom-0 py-2">
        <div className="row">
          <div className="col-4 text-center">
            <Link
              to="/"
              className="text-center align-items-center d-flex p-1 flex-column text-decoration-none text-white rounded-circle fs-2"
            >
              <FontAwesomeIcon
                icon={faUsers}
                className={`p-1 w-25 px-4 ${
                  pathname == "/" ? "text-bg-light rounded-pill" : ""
                }`}
              />
              <small style={{ fontSize: "10pt" }}>Communities</small>
            </Link>
          </div>
          <div className="col-4 text-center">
            <Link
              to="/discover"
              className="text-center align-items-center d-flex p-1 flex-column text-decoration-none text-white rounded-circle fs-2"
            >
              <FontAwesomeIcon
                icon={faNewspaper}
                className={`p-1 w-25 px-4 ${
                  pathname == "/discover" ? "text-bg-light rounded-pill" : ""
                }`}
              />
              <small style={{ fontSize: "10pt" }}>Discover</small>
            </Link>
          </div>
          <div className="col-4 text-center">
            <Link className="text-center align-items-center d-flex p-1 flex-column text-decoration-none text-white rounded-circle fs-2">
              <FontAwesomeIcon
                icon={faUser}
                className={`p-1 w-25 px-4 ${
                  pathname == "" ? "text-bg-light rounded-pill" : ""
                }`}
              />
              <small style={{ fontSize: "10pt" }}>Account</small>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
