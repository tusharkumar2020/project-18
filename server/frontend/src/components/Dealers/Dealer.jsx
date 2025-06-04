import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);
  const [loading, setLoading] = useState(true);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("dealer"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let reviews_url = root_url+`djangoapp/reviews/dealer/${id}`;
  let post_review = root_url+`postreview/${id}`;
  
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      if(retobj.status === 200 && retobj.dealer && retobj.dealer.length > 0) {
        setDealer(retobj.dealer[0]);
      } else {
        setDealer(null);
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
      setDealer(null);
    } finally {
      setLoading(false);
    }
  }

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      if(retobj.status === 200) {
        if(retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  }

  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  }

  useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review}><img src={review_icon} style={{width:'10%',marginLeft:'10px',marginTop:'10px'}} alt='Post Review'/></a>);
    }
  }, []);  

  if (loading) {
    return (
      <div style={{margin:"20px"}}>
        <Header/>
        <Card sx={{ minWidth: 275, margin: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Loading dealer information...
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div style={{margin:"20px"}}>
        <Header/>
        <Card sx={{ minWidth: 275, margin: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Dealer not found
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{margin:"20px"}}>
      <Header/>
      <div style={{marginTop:"10px"}}>
        <Card sx={{ minWidth: 275, margin: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {dealer.full_name || 'Dealer Name Not Available'}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {dealer.city || 'City Not Available'}, {dealer.state || 'State Not Available'}
            </Typography>
            <Typography variant="body2">
              {dealer.address || 'Address Not Available'}
              <br />
              {dealer.zip || 'ZIP Not Available'}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <Typography>Loading Reviews...</Typography>
        ) : unreviewed ? (
          <Typography>No reviews yet!</Typography>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className='review_panel'>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment'/>
              <div className='review'>{review.review}</div>
              <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
          ))
        )}
      </div>  
      <Link to={`/dealer/${dealer.id}`}>
        <Button variant="primary">View Details</Button>
      </Link>
    </div>
  );
}

export default Dealer
