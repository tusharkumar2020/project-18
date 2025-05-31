import React from "react";

const Contact = () => {
  return (
    <div className="contact-container" style={{ maxWidth: "700px", margin: "40px auto", background: "white", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", padding: "30px 40px", fontFamily: "Arial, sans-serif" }}>
      <h1 className="title" style={{ fontSize: "2.5rem", color: "rgb(97, 64, 128)", marginBottom: "20px", textAlign: "center" }}>Contact Us</h1>
      <form action="#" method="POST" id="contactForm" style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="name" style={{ fontWeight: "bold", marginTop: "15px", marginBottom: "6px", color: "#333" }}>Name</label>
        <input type="text" id="name" name="name" placeholder="Your full name" required style={{ padding: "12px 15px", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1rem", resize: "vertical", transition: "border-color 0.3s ease" }} />
        <label htmlFor="email" style={{ fontWeight: "bold", marginTop: "15px", marginBottom: "6px", color: "#333" }}>Email</label>
        <input type="email" id="email" name="email" placeholder="Your email address" required style={{ padding: "12px 15px", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1rem", resize: "vertical", transition: "border-color 0.3s ease" }} />
        <label htmlFor="subject" style={{ fontWeight: "bold", marginTop: "15px", marginBottom: "6px", color: "#333" }}>Subject</label>
        <input type="text" id="subject" name="subject" placeholder="Subject of your message" required style={{ padding: "12px 15px", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1rem", resize: "vertical", transition: "border-color 0.3s ease" }} />
        <label htmlFor="message" style={{ fontWeight: "bold", marginTop: "15px", marginBottom: "6px", color: "#333" }}>Message</label>
        <textarea id="message" name="message" placeholder="Write your message here..." required style={{ padding: "12px 15px", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1rem", resize: "vertical", transition: "border-color 0.3s ease", minHeight: "120px" }}></textarea>
        <button type="submit" style={{ marginTop: "25px", padding: "15px", backgroundColor: "rgb(97, 64, 128)", color: "white", fontSize: "1.2rem", border: "none", borderRadius: "10px", cursor: "pointer", transition: "background-color 0.3s ease" }}>Send Message</button>
      </form>
      <div className="contact-info" style={{ marginTop: "30px", fontSize: "1rem", color: "#555", textAlign: "center" }}>
        <p>Or reach us at: <a href="mailto:support@example.com">support@example.com</a></p>
        <p>Phone: +1 (555) 123-4567</p>
      </div>
    </div>
  );
};

export default Contact;
