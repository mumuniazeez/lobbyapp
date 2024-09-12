import { useServer } from "../hooks/hooks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateRoomModal({ communityId }) {
  const [roomInfo, setRoomInfo] = useState({
    name: "",
    enableMessage: true,
  });
  let nav = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const submitHandle = (e) => {
    e.preventDefault();
    setSubmitted(true);

    useServer(
      `/room/create/${communityId}`,
      "post",
      (res) => {
        document.querySelector(".room.btn-close").click();
        setRoomInfo({
          name: "",
          enableMessage: true,
        });
        setSubmitted(false);

        nav(`/?cId=${res.communityId}&rId=${res.roomId}`);
      },
      roomInfo
    );
  };
  return (
    <>
      <div
        class="modal fade"
        id="createRoomModal"
        tabIndex="-1"
        aria-labelledby="createRoomModalTitle"
        style={{ display: "none" }}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="createRoomModalTitle">
                Create Room
              </h1>
              <button
                type="button"
                class="room btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={(e) => submitHandle(e)}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    id="name"
                    name="name"
                    required
                    value={roomInfo.name}
                    onChange={(e) =>
                      setRoomInfo({
                        ...roomInfo,
                        name: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="mb-3">
                  <label htmlFor="enableMessage">
                    Allow community members to send message:
                  </label>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={roomInfo.enableMessage}
                    onClick={(e) =>
                      setRoomInfo({
                        ...roomInfo,
                        enableMessage: !roomInfo.enableMessage,
                      })
                    }
                    className="ms-3"
                  />
                </div>
                <div className="container text-center">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={submitted}
                  >
                    {submitted ? (
                      <div
                        className="spinner-border text-light me-3"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : null}
                    Create Room
                  </button>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
