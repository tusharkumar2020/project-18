import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const goHome = () => {
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    let register_url = `${window.location.origin}/djangoapp/register`;

    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        password,
        firstName,
        lastName,
        email,
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (json.status) {
      sessionStorage.setItem('username', json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with the same username is already registered");
      goHome();
    }
  };

  return (
    <div className="register_container">
      <div className="header">
        <span className="text">Sign Up</span>
        <a href="/" onClick={goHome}>
          <img className="close_icon" src={close_icon} alt="Close" />
        </a>
      </div>
      <hr />
      <form onSubmit={register}>
        <div className="inputs">
          {[
            { placeholder: "Username", value: userName, setValue: setUserName },
            { placeholder: "First Name", value: firstName, setValue: setFirstName },
            { placeholder: "Last Name", value: lastName, setValue: setLastName },
            { placeholder: "Email", type: "email", value: email, setValue: setEmail },
            { placeholder: "Password", type: "password", value: password, setValue: setPassword },
          ].map((input, index) => (
            <div className="input" key={index}>
              <img src={input.type === "email" ? email_icon : user_icon} className="img_icon" alt={input.placeholder} />
              <input
                type={input.type || "text"}
                placeholder={input.placeholder}
                className="input_field"
                value={input.value}
                onChange={(e) => input.setValue(e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <div className="submit_panel">
          <button className="submit" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;