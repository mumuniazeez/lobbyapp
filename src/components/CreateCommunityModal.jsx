import { useServer } from "../hooks/hooks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateCommunityModal() {
  const [communityInfo, setCommunityInfo] = useState({
    name: "",
    description:
      "This is a community on lobby. Join and connect with like mind people",
  });
  const [submitted, setSubmitted] = useState(false);
  let nav = useNavigate();
  const submitHandle = (e) => {
    e.preventDefault();
    setSubmitted(true);
    useServer(
      "/community/create",
      "post",
      (res) => {
        document.querySelector(".com.btn-close").click();
        setCommunityInfo({
          name: "",
          description:
            "This is a community on lobby. Join and connect with like mind people",
        });
        setSubmitted(false);

        nav(`/?cId=${res.communityId}`);
      },
      communityInfo
    );
  };
  return (
    <>
      <div
        class="modal fade"
        id="createCommunityModal"
        tabIndex="-1"
        aria-labelledby="createCommunityModalTitle"
        style={{ display: "none" }}
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="createCommunityModalTitle">
                Create Community
              </h1>
              <button
                type="button"
                class="com btn-close"
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
                    value={communityInfo.name}
                    onChange={(e) =>
                      setCommunityInfo({
                        ...communityInfo,
                        name: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    id="description"
                    name="description"
                    required
                    value={communityInfo.description}
                    onChange={(e) =>
                      setCommunityInfo({
                        ...communityInfo,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                  <label htmlFor="description">Description</label>
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
                    Create Community
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
