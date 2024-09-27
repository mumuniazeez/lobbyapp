import { BoxArrowDown, ArrowRight } from "react-bootstrap-icons";
import { useState, useEffect } from "react";
import { useAlert, useServer } from "../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Signup() {
  const nav = useNavigate();
  const [userData, setUserData] = useState({
    firstName: {
      data: "",
      valid: "",
    },
    lastName: {
      data: "",
      valid: "",
    },
    username: {
      data: "",
      valid: "",
      validationMSG: "",
    },
    email: {
      data: "",
      valid: "",
    },
    password: {
      data: "",
      valid: "",
    },
    cPassword: {
      data: "",
      valid: "",
    },
  });

  const [submitted, setSubmitted] = useState(false);

  const [serverData, setServerData] = useState(null);

  const validateUsername = async (username) => {
    let returnValue;
    if (username != "") {
      let usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (usernameRegex.test(username)) {
        // /user/profile/:username
        let data = await fetch(
          `http://localhost:3000/user/profile/@${username}`
        );

        console.log(data);
        if (!data.ok) {
          userData.username.valid = "is-valid";
          userData.username.validationMSG = `${username} is available`;
          returnValue = true;
        } else {
          userData.username.valid = "is-invalid";
          userData.username.validationMSG = `${username} is already taken`;
          returnValue = false;
        }
      } else {
        userData.username.valid = "is-invalid";
        userData.username.validationMSG =
          "Username must contain only letters, numbers and underscores";
        returnValue = false;
      }
    } else {
      userData.username.valid = "is-invalid";
      userData.username.validationMSG = "Enter username";
      returnValue = false;
    }

    setUserData({
      ...userData,
      username: {
        ...userData.username,
        data: username,
      },
    });
    return returnValue;
  };

  const validatePassword = (password) => {
    let returnValue;
    if (password) {
      let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;
      if (passwordRegex.test(password)) {
        userData.password.valid = "is-valid";
        returnValue = true;
      } else {
        userData.password.valid = "is-invalid";
        returnValue = false;
      }
    } else {
      userData.password.valid = "is-invalid";
      returnValue = false;
    }
    return returnValue;
  };

  useEffect(() => {
    setSubmitted(false);
    if (!serverData) return;
    if (serverData.message == "User created successfully!") {
      useAlert(serverData.message);
      nav("/login");
    }
  }, [serverData]);

  const formSubmit = async (e) => {
    e.preventDefault();
    let validated = true;
    if (userData.firstName.data) userData.firstName.valid = "";
    else {
      userData.firstName.valid = "is-invalid";
      validated = false;
    }
    if (userData.lastName.data) userData.lastName.valid = "";
    else {
      userData.lastName.valid = "is-invalid";
      validated = false;
    }
    if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(userData.email.data))
      userData.email.valid = "";
    else {
      userData.email.valid = "is-invalid";
      validated = false;
    }
    if (!validatePassword(userData.password.data)) validated = false;
    if (userData.cPassword.data) {
      if (userData.cPassword.data != userData.password.data) {
        userData.cPassword.valid = "is-invalid";
        validated = false;
      } else userData.cPassword.valid = "is-valid";
    } else {
      userData.cPassword.valid = "is-invalid";
      validated = false;
    }
    if (!(await validateUsername(userData.username.data))) validated = false;

    if (validated) {
      console.log("---validated---");
      setSubmitted(true);

      useServer("/signup", "POST", setServerData, {
        username: userData.username.data.trim(),
        email: userData.email.data.trim(),
        password: userData.password.data.trim(),
        firstname: userData.firstName.data.trim(),
        lastname: userData.lastName.data.trim(),
      });
    }
  };
  return (
    <>
      <div
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{ height: "100%" }}
      >
        <div className="container bg-light py-5 d-flex justify-content-center rounded-3 overflow-y-scroll h-100">
          <div className="container  rounded-3 row">
            <div className="col-md-12">
              <h1 className="fw-bold text-primary">Lobby</h1>
              <p>
                Join Lobby Today Discover a new way to connect, share, and grow
                with Lobby.{" "}
              </p>
              <p className="fs-5">Chat, Meetings and Education made Easy</p>
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
                      id="firstName"
                      placeholder="First name"
                      class={`form-control ${userData.firstName.valid}`}
                      value={userData.firstName.data}
                      onChange={(e) => {
                        if (e.target.value) userData.firstName.valid = "";
                        else {
                          userData.firstName.valid = "is-invalid";
                        }
                        setUserData({
                          ...userData,
                          firstName: {
                            ...userData.firstName,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <label htmlFor="firstName " className="">
                      First name
                    </label>
                    <div className="invalid-feedback">
                      Please fill in your first name
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Last name"
                      class={`form-control ${userData.lastName.valid}`}
                      value={userData.lastName.data}
                      onChange={(e) => {
                        if (e.target.value) userData.lastName.valid = "";
                        else {
                          userData.lastName.valid = "is-invalid";
                        }

                        setUserData({
                          ...userData,
                          lastName: {
                            ...userData.lastName,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <label htmlFor="lastName" className="">
                      Last name
                    </label>
                    <div className="invalid-feedback">
                      Please fill in your last name
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="input-group mb-3 h-100">
                    <span className="input-group-text" id="basic-addon1">
                      @
                    </span>
                    <input
                      type="text"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      class={`form-control ${userData.username.valid}`}
                      value={userData.username.data}
                      onChange={(e) => {
                        validateUsername(e.target.value);
                        setUserData({
                          ...userData,
                          username: {
                            ...userData.username,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <div className="valid-feedback">
                      {userData.username.validationMSG}
                    </div>
                    <div className="invalid-feedback">
                      {userData.username.validationMSG}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      class={`form-control ${userData.email.valid}`}
                      value={userData.email.data}
                      onChange={(e) => {
                        if (
                          /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(
                            e.target.value
                          )
                        )
                          userData.email.valid = "";
                        else {
                          userData.email.valid = "is-invalid";
                        }
                        setUserData({
                          ...userData,
                          email: {
                            ...userData.email,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <label htmlFor="email" className="">
                      Email
                    </label>
                    <div className="invalid-feedback">Enter a valid email</div>
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
                        validatePassword(e.target.value);
                        setUserData({
                          ...userData,
                          password: {
                            ...userData.password,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <label htmlFor="password" className="">
                      Password
                    </label>
                    <div className="valid-feedback">Looks okay</div>
                    <div className="invalid-feedback">
                      Password must contain:
                      <ul>
                        {!/.{8,}/.test(userData.password.data) && (
                          <li>At least 8 characters</li>
                        )}
                        {!/(?=.*[a-z])/.test(userData.password.data) && (
                          <li>Lowercase</li>
                        )}
                        {!/(?=.*[A-Z])/.test(userData.password.data) && (
                          <li>Uppercase</li>
                        )}
                        {!/(?=.*[0-9])/.test(userData.password.data) && (
                          <li>Number</li>
                        )}
                        {!/(?=.*\W)/.test(userData.password.data) && (
                          <li>Symbols</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="password"
                      id="cPassword"
                      placeholder="Confirm Password"
                      new-password
                      class={`form-control ${userData.cPassword.valid}`}
                      value={userData.cPassword.data}
                      onChange={(e) => {
                        if (e.target.value) {
                          if (e.target.value != userData.password.data) {
                            userData.cPassword.valid = "is-invalid";
                          } else userData.cPassword.valid = "is-valid";
                        } else userData.cPassword.valid = "is-invalid";
                        setUserData({
                          ...userData,
                          cPassword: {
                            ...userData.cPassword,
                            data: e.target.value,
                          },
                        });
                      }}
                    />
                    <label htmlFor="cPassword" className="">
                      Confirm Password
                    </label>
                    <div className="valid-feedback">Looks okay</div>
                    <div className="invalid-feedback">Incorrect password</div>
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
                  Signup
                </button>
              </form>
            </div>
            <div className="col-12">
              <p className="lead">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
