import React from "react";

const About = () => {
  return (
    <div className="card" style={{ width: "80%", margin: "auto", marginTop: "5%" }}>
      <div className="banner" name="about-header">
        <h1>About Us</h1>
        Welcome to Best Cars dealership, home to the best cars in India. We sell domestic and imported cars at reasonable prices.
      </div>
      <div style={{ display: "flex", flexDirection: "row", margin: "auto" }}>
        {[1, 2, 3].map((person) => (
          <div key={person} className="card" style={{ width: "30%" }}>
            <img className="card-img-top" src="/static/person.JPG" alt="" />
            <div className="card-body">
              <p className="title">Person{person}</p>
              <p>Person{person} Title</p>
              <p className="card-text">Some text that explains the person{person} in about 2 short sentences</p>
              <p>person{person}@example.com</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
