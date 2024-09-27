import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidenav from "./components/Sidenav";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Discover from "./components/Discover";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import MobileNav from "./components/MobileNav";
import NoPage from "./components/NoPage";
import Settings from "./components/Settings";
import AboutLobby from "./components/AboutLobby";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  window.addEventListener("resize", () =>
    setIsMobile(window.innerWidth <= 762)
  );

  useEffect(() => {
    setIsMobile(window.innerWidth <= 762);
  }, []);
  return (
    <>
      <div id="modalContainer"></div>
      <div
        id="alertContainer"
        className="position-fixed text-center bottom-0 end-0 px-5"
      ></div>
      <main className="bg-body-secondary">
        <div
          className="container-fluid p-0"
          style={{ height: "100vh", width: "100wh" }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={isMobile ? <MobileNav /> : <Sidenav />}>
                <Route index element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/user" element={<UserProfile />} />
                {/* <Route path="/community/profile" element={<CommunityProfile />} /> */}
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<AboutLobby />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </main>
    </>
  );
}
