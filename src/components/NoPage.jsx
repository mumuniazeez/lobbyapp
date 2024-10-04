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
import languages from "../languages";

export default function NoPage() {
  let { notFound } =
    languages[JSON.parse(localStorage.appData).userData.language];
  document.title = notFound.pageTitle;
  return (
    <>
      <div className="container-fluid d-flex justify-content-center align-items-center h-100 w-100">
        <div className="text-center">
          <h1 className="display-3">
            4<FontAwesomeIcon icon={faUnlink} className="" />4
          </h1>
          <h1>{notFound.title}</h1>
        </div>
      </div>
    </>
  );
}
