import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/style.css";
import "../assets/bootstrap.min.css";
import Breadcrumbs from './Breadcrumbs';

const Header = () => {
    const logout = async (e) => {
    e.preventDefault();
    let logout_url = window.location.origin+"/logout/";
    const res = await fetch(logout_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
  
    const json = await res.json();
    if (json.success) {
      let username = sessionStorage.getItem('username');
      sessionStorage.removeItem('username');
      window.location.href = window.location.origin;
      window.location.reload();
      alert("Logging out "+username+"...")
    }
    else {
      alert("The user could not be logged out.")
    }
  };
    
//The default home page items are the login details panel
let home_page_items =  <div></div>

//Gets the username in the current session
let curr_user = sessionStorage.getItem('username')

    if ( curr_user !== null &&  curr_user !== "") {
        home_page_items = <div className="input_panel">
          <text className='username'>{sessionStorage.getItem("username")}</text>
        <button className="nav_item" onClick={logout} style={{background:"none", border:"none", padding:"0", cursor:"pointer", color:"blue", textDecoration:"underline"}}>Logout</button>
      </div>
    }
    else {
      home_page_items = (
        <div className="input_panel">
          <a href="/login" className="nav_item" style={{marginRight: "10px", color:"blue", textDecoration:"underline"}}>Login</a>
          <a href="/register" className="nav_item" style={{color:"blue", textDecoration:"underline"}}>Register</a>
        </div>
      );
    }
    return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor:"darkturquoise",height:"1in"}}>
            <div className="container-fluid">
              <h2 style={{paddingRight: "5%"}}>Dealerships</h2>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" style={{fontSize: "larger"}} aria-current="page" to="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" style={{fontSize: "larger"}} to="/about">About Us</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" style={{fontSize: "larger"}} to="/contact">Contact Us</Link>
                  </li>
                </ul>
                <span className="navbar-text">
                  <div className="loginlink" id="loginlogout">
                  {home_page_items}
                  </div>
                  </span>
              </div>
            </div>
          </nav>
          <Breadcrumbs />
        </div>
    )
}

export default Header
