import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';

const Dealer = () => {

  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)

  let curr_url    = window.location.href;
  let root_url    = curr_url.substring(0,curr_url.indexOf("dealer"));
  let params      = useParams();
  let id          = params.id;
  let dealer_url  = root_url+`djangoapp/dealer/${id}`;
  let reviews_url = root_url+`djangoapp/reviews/dealer/${id}`;
  let post_review = root_url+`postreview/${id}`;
  
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      setDealer(dealerobjs[0])
    }
  }

  const get_reviews = async ()=>{
    const res = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      if(retobj.reviews.length > 0){
        setReviews(retobj.reviews)
      } else {
        setUnreviewed(true);
      }
    }
  }

  const senti_icon = (sentiment)=>{
    let icon = sentiment === "positive"?positive_icon:sentiment==="negative"?negative_icon:neutral_icon;
    return icon;
  }

  useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review}><img src={review_icon} style={{width:'10%',marginLeft:'10px',marginTop:'10px'}} alt='Post Review'/></a>)
    }
    
    get_dealer();
    get_reviews();
    let icon = "positive";
    setPostReview(<a href={post_review}><img src={review_icon} style={{width:'10%',marginLeft:'10px',marginTop:'10px'}} alt='Post Review'/></a>);




},[]);  


return(
  <div style={{margin:"20px"}}>
      <Header/>
      <div style={{marginTop:"10px"}}>
        <h1 style={{color:"grey"}}>{'Regrant Car Dealersip'}{postReview}</h1>
        <h4  style={{color:"grey"}}>{"Baltimore"},{'93 Golf Course Pass'}, Zip - {'21203'}, {'Baltimore'} </h4>
      </div>
      <div class="reviews_panel">
        <div className='review_panel'>
            <img class='review_img' src={positive_icon} className="emotion_icon" alt='Sentiment'/>
            <div class='review_review'>Total grid-enabled service-desk</div>
            <div class='review_reviewee'>Berkly Shepley Audi A6 2010"</div>
        </div>
        <div className='review_panel'>
            <img class='review_img' src={positive_icon} className="emotion_icon" alt='Sentiment'/>
            <div class='review_review'>Excellent Dealership. Highly Recommended.</div>
            <div class='review_reviewee'>Jauvhree NISSAN XTRAIL 2023</div>
        </div>
      
    </div>  
  </div>
)
}

export default Dealer
