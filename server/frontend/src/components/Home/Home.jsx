import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const curr_user = sessionStorage.getItem("username");
    if (curr_user) {
      setUsername(curr_user);
    }
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    let logout_url = window.location.origin + "/djangoapp/logout";
    const res = await fetch(logout_url, {
      method: "GET",
    });
    const json = await res.json();
    if (json) {
      sessionStorage.removeItem("username");
      setUsername("");
      alert("Logging out...");
      navigate("/");
      window.location.reload();
    } else {
      alert("The user could not be logged out.");
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          className="card"
          style={{ width: "50%", marginTop: "50px", alignSelf: "center" }}
        >
          <img
            src="/static/car_dealership.jpg"
            className="card-img-top"
            alt="Car Dealership"
          />
          <div className="banner">
            <h5>Welcome to our Dealerships!</h5>
            <a href="/dealerships" className="btn btn-primary" style={{ margin: "10px" }}>
              View Dealerships
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
