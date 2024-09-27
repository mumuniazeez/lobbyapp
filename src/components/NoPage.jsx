import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLaptop,
  faMessage,
  faArrowLeft,
  faUsers,
  faEllipsisVertical,
  faBell,
  faKey,
  faPaintBrush,
  faExclamationCircle,
  faPlug,
  faSadCry,
  faUnlink,
} from "@fortawesome/free-solid-svg-icons";

export default function NoPage() {
  return (
    <>
      <div className="container-fluid d-flex justify-content-center align-items-center h-100 w-100">
        <div className="text-center">
          <h1 className="display-3">
            <FontAwesomeIcon icon={faUnlink} className="display-1 py-2 me-3" />
            404
          </h1>
          <h1>Page Not Found</h1>
        </div>
      </div>
    </>
  );
}
