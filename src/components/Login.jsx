import { useState, useEffect } from "react";
import { useServer, useAlert } from "../hooks/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({
    userId: {
      data: "",
      valid: "",
    },
    password: {
      data: "",
      valid: "",
    },
  });

  const nav = useNavigate();

  const [submitted, setSubmitted] = useState(false);

  const [serverData, setServerData] = useState(null);

  useEffect(() => {
    setSubmitted(false);
    if (!serverData) return;
    if (!serverData.message) {
      localStorage.setItem("token", serverData.token);
      nav(sessionStorage.getItem("urlRef") || "/");
    } else useAlert(serverData.message, "danger");
  }, [serverData]);

  const formSubmit = async (e) => {
    e.preventDefault();
    let validated = true;
    if (userData.userId.data) userData.userId.valid = "";
    else {
      userData.userId.valid = "is-invalid";
      validated = false;
    }

    if (userData.password.data) userData.password.valid = "";
    else {
      userData.password.valid = "is-invalid";
      validated = false;
    }

    if (validated) {
      console.log("---validated---");
      setSubmitted(true);
      useServer("/login", "POST", setServerData, {
        userId: userData.userId.data.trim(),
        password: userData.password.data.trim(),
      });
    }
  };
  return (
    <>
      <div
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <div className="container bg-light py-5 d-flex justify-content-center rounded-3">
          <div className="container  rounded-3 row">
            <div className="col-md-12">
              <h1 className="fw-bold text-primary">Lobby</h1>
              <p>Welcome back. </p>
              <p className="fs-5">Login to connect to people and communities</p>
            </div>
            <div className="col-md-12">
              <form
                className="row  justify-content-center"
                onSubmit={(e) => formSubmit(e)}
              >
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      id="userId"
                      placeholder="Enter email or username"
                      class={`form-control ${userData.userId.valid}`}
                      value={userData.userId.data}
                      onChange={(e) => {
                        if (e.target.value) userData.userId.valid = "";
                        else {
                          userData.userId.valid = "is-invalid";
                        }
                        setUserData({
                          ...userData,
                          userId: {
                            ...userData.userId,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <label htmlFor="firstName " className="">
                      Enter email or username
                    </label>
                    <div className="invalid-feedback">
                      Please fill in your email or username
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="password"
                      id="password"
                      placeholder="Password"
                      class={`form-control ${userData.password.valid}`}
                      value={userData.password.data}
                      new-password
                      onChange={(e) => {
                        if (e.target.value) userData.password.valid = "";
                        else {
                          userData.password.valid = "is-invalid";
                        }
                        setUserData({
                          ...userData,
                          password: {
                            ...userData.password,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <label htmlFor="password">Password</label>
                    <div className="invalid-feedback">Enter your password</div>
                  </div>
                </div>

                <button
                  className="btn btn-primary col-md-6"
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
                  Login
                </button>
              </form>
            </div>
            <div className="col-12">
              <p className="lead">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
