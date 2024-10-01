import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPen,
  faTrash,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import Linkify from "linkify-react";
import { socketIoConnection } from "../socket/socket";
import { useState } from "react";

export default function MessageCard({ message, myProfile, roomId }) {
  const [deleting, setDeleting] = useState(false);
  const getTime = (timestamp) => {
    let dateObj = new Date(timestamp);

    return `${
      dateObj.getHours() < 13 ? dateObj.getHours() : dateObj.getHours() - 12
    }:${dateObj.getMinutes()} ${dateObj.getHours() < 12 ? "AM" : "PM"}`;
  };
  return message.type === "normal" ? (
    <>
      <div className="container w-100 mb-2 mt-2 dropup">
        <div
          className={`p-2 rounded-top-3 d-flex ${
            message.creator === myProfile.username ? "ms-auto" : ""
          }`}
          style={{
            width: "fit-content",
            maxWidth: "70%",
            overflowWrap: "anywhere",
          }}
          data-bs-toggle="dropdown"
        >
          {message.creator != myProfile.username ? (
            <div className="mb-1">
              <button className="btn btn-primary rounded-circle me-2">
                <FontAwesomeIcon icon={faUser} />
              </button>
            </div>
          ) : (
            ""
          )}

          <div
            className={`p-2 rounded-bottom-3 message-container ${
              message.creator === myProfile.username
                ? "text-bg-primary ms-auto rounded-start-3"
                : "text-bg-secondary rounded-end-3"
            }`}
          >
            <span style={{ fontSize: "10pt" }}>{message.creator}</span>

            <Linkify
              as="p"
              options={{
                render: {
                  url: ({ attributes, content }) => {
                    return (
                      <a {...attributes} target="_blank">
                        {content}
                      </a>
                    );
                  },
                },
                formatHref: {
                  mention: (href) => "https://example.com/profiles" + href,
                },
              }}
            >
              {message.message}
            </Linkify>

            <span
              className="d-block lead w-100 text-end"
              style={{ fontSize: "8pt" }}
            >
              {deleting ? "Deleting" : getTime(message.createdat)}
            </span>
          </div>
        </div>
        {!deleting && (
          <ul className="dropdown-menu text-small">
            {/* {message.creator === myProfile.username ? (
            <li>
              <button className="dropdown-item">
                <span className="">
                  <FontAwesomeIcon icon={faPen} className="me-2" />
                  Edit
                </span>
              </button>
            </li>
          ) : null} */}
            {message.creator === myProfile.username ? (
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setDeleting(true);
                    socketIoConnection.emit("deleteMessage", {
                      id: message.id,
                      roomId,
                    });
                  }}
                >
                  <span className="">
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Delete
                  </span>
                </button>
              </li>
            ) : null}
            {message.creator != myProfile.username ? (
              <li>
                <button className="dropdown-item">
                  <span className="">
                    <FontAwesomeIcon icon={faThumbsDown} className="me-2" />
                    Report
                  </span>
                </button>
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </>
  ) : message.type === "notice" ? (
    <>
      <div className="container d-flex justify-content-center py-0">
        <div
          className="text-bg-secondary rounded-3 text-center py-0"
          style={{ width: "400px" }}
        >
          <small>{message.message}</small>
        </div>
      </div>
    </>
  ) : message.type === "deleted" ? (
    <>
      <div className="container w-100 mb-2 mt-2 $">
        <div
          className={`p-2 rounded-top-3 d-flex ${
            message.creator === myProfile.username ? "ms-auto" : ""
          }`}
          style={{
            width: "fit-content",
            maxWidth: "70%",
          }}
        >
          {message.creator != myProfile.username ? (
            <div className="mb-1">
              <button className="btn btn-primary rounded-circle me-2">
                <FontAwesomeIcon icon={faUser} />
              </button>
            </div>
          ) : (
            ""
          )}

          <div
            className={`p-2 rounded-bottom-3 message-container ${
              message.creator === myProfile.username
                ? "text-bg-primary bg-primary-subtle ms-auto rounded-start-3"
                : "text-bg-secondary bg-primary-subtle rounded-end-3"
            }`}
          >
            <p>
              <small>{message.message}</small>
            </p>

            <span
              className="d-block lead w-100 text-end"
              style={{ fontSize: "8pt" }}
            >
              Deleted
            </span>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
