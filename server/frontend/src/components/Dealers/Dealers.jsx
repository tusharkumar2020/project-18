import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    dealer_url_by_state = dealer_url_by_state+state;
    const res = await fetch(dealer_url_by_state, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers)
      setDealersList(state_dealers)
    }
  }

  const get_dealers = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      //Array.from(retobj.dealers)
      let all_dealers = [{
                            "id": 1,
                            "city": "El Paso",
                            "state": "Texas",
                            "st": "TX",
                            "address": "3 Nova Court",
                            "zip": "88563",
                            "lat": 31.6948,
                            "long": -106.3,
                            "short_name": "Holdlamis",
                            "full_name": "Holdlamis Car Dealership"
                          },
                          {
                            "id": 2,
                            "city": "Minneapolis",
                            "state": "Minnesota",
                            "st": "MN",
                            "address": "6337 Butternut Crossing",
                            "zip": "55402",
                            "lat": 44.9762,
                            "long": -93.2759,
                            "short_name": "Temp",
                            "full_name": "Temp Car Dealership"
                          },
                          {
                            "id": 3,
                            "city": "Birmingham",
                            "state": "Alabama",
                            "st": "AL",
                            "address": "9477 Twin Pines Center",
                            "zip": "35285",
                            "lat": 33.5446,
                            "long": -86.9292,
                            "short_name": "Sub-Ex",
                            "full_name": "Sub-Ex Car Dealership"
                          },
                          {
                            "id": 4,
                            "city": "Dallas",
                            "state": "Texas",
                            "st": "TX",
                            "address": "85800 Hazelcrest Circle",
                            "zip": "75241",
                            "lat": 32.6722,
                            "long": -96.7774,
                            "short_name": "Solarbreeze",
                            "full_name": "Solarbreeze Car Dealership"
                          },
                          {
                            "id": 5,
                            "city": "Baltimore",
                            "state": "Maryland",
                            "st": "MD",
                            "address": "93 Golf Course Pass",
                            "zip": "21203",
                            "lat": 39.2847,
                            "long": -76.6205,
                            "short_name": "Regrant",
                            "full_name": "Regrant Car Dealership"
                          },
                          {
                            "id": 6,
                            "city": "Wilkes Barre",
                            "state": "Pennsylvania",
                            "st": "PA",
                            "address": "2 Burrows Hill",
                            "zip": "18763",
                            "lat": 41.2722,
                            "long": -75.8801,
                            "short_name": "Stronghold",
                            "full_name": "Stronghold Car Dealership"
                          }]
                        
      let states = [];
      all_dealers.forEach((dealer)=>{
        states.push(dealer.state)
      });

      setStates(Array.from(new Set(states)))
      setDealersList(all_dealers)
    }
  }
  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div>
      <Header/>

     <table className='table'>
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
          <option value={state}>{state}</option>
      ))}
      </select>        

      </th>
      {isLoggedIn ? (
          <th>Review Dealer</th>
         ):<></>
      }
      </tr>
     {dealersList.map(dealer => (
        <tr>
          <td>{dealer['id']}</td>
          <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn ? (
            <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
           ):<></>
          }
        </tr>
      ))}
     </table>;
  </div>
)
}

export default Dealers
