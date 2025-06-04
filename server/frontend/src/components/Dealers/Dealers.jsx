import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Container } from "react-bootstrap";
import Dealer from "./Dealer";
import PostReview from "./PostReview";
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useParams();
  const [dealersList, setDealersList] = useState([]);
  let [states, setStates] = useState([])

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
      let all_dealers = Array.from(retobj.dealers)
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

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch(
          `/api/dealerships/get_dealers?state=${state}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dealers");
        }
        const data = await response.json();
        setDealers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, [state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
  return (
    <Container>
      <Header/>
      <h2>Dealers in {state}</h2>
      <Row>
        {dealers.map((dealer) => (
          <Col key={dealer.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Dealer dealer={dealer} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <PostReview />
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
          ) : <></>}
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
            ) : <></>}
          </tr>
        ))}
      </table>
    </Container>
  );
};

export default Dealers;
