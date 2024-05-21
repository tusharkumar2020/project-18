import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  let [states, setStates] = useState([]);

  let dealer_url = "/djangoapp/get_dealers";
  let dealer_url_by_state = "/djangoapp/get_dealers/";

  const filterDealers = async (state) => {
    const url = dealer_url_by_state + state;
    console.log(`Filtering dealers by state from: ${url}`);
    try {
      const res = await fetch(url, {
        method: "GET"
      });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealers) {
        let state_dealers = Array.from(retobj.dealers);
        setDealersList(state_dealers);
      } else {
        console.error("Failed to fetch state dealers:", retobj.message);
        setDealersList([]);
      }
    } catch (error) {
      console.error("Error fetching state dealers:", error);
      setDealersList([]);
    }
  }

  const get_dealers = async () => {
    console.log(`Fetching all dealers from: ${dealer_url}`);
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealers) {
        let all_dealers = Array.from(retobj.dealers);
        let states = [];
        all_dealers.forEach((dealer) => {
          states.push(dealer.state);
        });

        setStates(Array.from(new Set(states)));
        setDealersList(all_dealers);
      } else {
        console.error("Failed to fetch all dealers:", retobj.message);
        setDealersList([]);
      }
    } catch (error) {
      console.error("Error fetching all dealers:", error);
      setDealersList([]);
    }
  }

  useEffect(() => {
    get_dealers();
  }, []);

  let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;

  // 登录和注册按钮的函数
  const logout = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/djangoapp/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        let username = sessionStorage.getItem('username');
        sessionStorage.removeItem("username");
        document.getElementById("loginlogout").innerHTML =
          '<a class="homepage_links" href="/login">Login</a>' +
          '<a class="homepage_links" href="/register">Register</a>';
        alert("Logging out " + username + "...");
        window.location.href = '/login/';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };

  const checkSession = () => {
    let curr_user = sessionStorage.getItem("username");

    if (curr_user && curr_user !== "") {
      document.getElementById("loginlogout").innerHTML =
        '<span class="homepage_links">' + curr_user + '</span>' +
        '<a class="homepage_links" onclick="logout(event)" href="/">Logout</a>'
    } else {
      document.getElementById("loginlogout").innerHTML =
        '<a class="homepage_links" href="/login">Login</a>' +
        '<a class="homepage_links" href="/register">Register</a>'
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div>
      <Header />
      
      {/* 添加登录和注册按钮 */}
      <div className="auth-links" id="loginlogout">
        {/* 这里会由 checkSession 函数填充 */}
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                <option value="" selected disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td>
                <a href={`/dealer/${dealer.id}`} onClick={() => console.log(`Navigating to: /dealer/${dealer.id}`)}>
                  {dealer.full_name}
                </a>
              </td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn && (
                <td><a href={`/postreview/${dealer.id}`}><img src={review_icon} className="review_icon" alt="Post Review" /></a></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dealers;