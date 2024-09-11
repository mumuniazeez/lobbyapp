import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useServer } from "../hooks/hooks";
import LoadingAnimation from "./LoadingAnimation";
import {
  PeopleFill,
  Gear,
  CheckCircle,
  PlusCircle,
  ThreeDotsVertical,
  ArrowLeft,
} from "react-bootstrap-icons";

export default function UserProfile() {
  let { search } = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [communities, setCommunities] = useState(null);

  useEffect(() => {
    let urlSearchParam = new URLSearchParams(search);
    let username = urlSearchParam.get("uN");
    useServer(`/user/profile/${username}`, "get", setUserInfo);
  }, []);
  useEffect(() => {
    let urlSearchParam = new URLSearchParams(search);
    let username = urlSearchParam.get("uN");
    useServer(
      `/community/myCommunities?username=${username}`,
      "get",
      setCommunities
    );
  }, []);

  return (
    <>
      {userInfo && communities ? (
        <>
          <div className="container bg-light rounded-3 p-3 mb-3">
            <div className="row">
              <div className="col-md-4">
                <svg
                  className="bd-placeholder-img flex-shrink-0 me-2 rounded"
                  width="100%"
                  height="150"
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
              </div>
              <div className="col-md-8">
                <h1>
                  {userInfo.firstname} {userInfo.lastname}
                </h1>
                <small className="text-secondary">{userInfo.username}</small>
                <p>{userInfo.bio || "I am on lobby."}</p>
              </div>
            </div>
          </div>
          <div className="container p-3 mb-3">
            <h3 className="text-center">
              {userInfo.firstname.trim()}'s communities
            </h3>
            <div className="row">
              {communities.map((community) => {
                return (
                  <CommunityCard community={community} key={community.id} />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}
