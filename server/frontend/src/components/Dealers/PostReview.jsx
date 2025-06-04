import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";
import "./PostReview.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let review_url = root_url+`djangoapp/add_review`;
  let carmodels_url = root_url+`djangoapp/get_cars`;

  const validateForm = () => {
    if (!model || review === "" || date === "" || year === "") {
      setError("All fields are required");
      return false;
    }
    if (year < 2015 || year > 2023) {
      setError("Year must be between 2015 and 2023");
      return false;
    }
    if (review.length < 10) {
      setError("Review must be at least 10 characters long");
      return false;
    }
    return true;
  };

  const postreview = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError("");
    
    try {
      let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
      if(name.includes("null")) {
        name = sessionStorage.getItem("username");
      }

      let model_split = model.split(" ");
      let make_chosen = model_split[0];
      let model_chosen = model_split[1];

      let jsoninput = JSON.stringify({
        "name": name,
        "dealership": id,
        "review": review,
        "purchase": true,
        "purchase_date": date,
        "car_make": make_chosen,
        "car_model": model_chosen,
        "car_year": year,
      });

      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      const json = await res.json();
      if (json.status === 200) {
        navigate(`/dealer/${id}`);
      } else {
        setError("Failed to post review. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      if(retobj.status === 200) {
        let dealerobjs = Array.from(retobj.dealer)
        if(dealerobjs.length > 0)
          setDealer(dealerobjs[0])
      }
    } catch (err) {
      setError("Failed to load dealer information");
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url, {
        method: "GET"
      });
      const retobj = await res.json();
      
      let carmodelsarr = Array.from(retobj.CarModels)
      setCarmodels(carmodelsarr)
    } catch (err) {
      setError("Failed to load car models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="review-container">
        <h1 className="dealer-title">{dealer.full_name}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="review-form">
          <div className="form-group">
            <label htmlFor="review">Your Review</label>
            <textarea 
              id="review" 
              className="review-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
              rows="7"
            />
          </div>

          <div className="form-group">
            <label htmlFor="purchase-date">Purchase Date</label>
            <input 
              type="date" 
              id="purchase-date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="car-model">Car Make and Model</label>
            <select 
              id="car-model"
              className="form-control"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="" disabled>Choose Car Make and Model</option>
              {carmodels.map((carmodel, index) => (
                <option key={index} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                  {carmodel.CarMake} {carmodel.CarModel}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="car-year">Car Year</label>
            <input 
              type="number" 
              id="car-year"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2015"
              max="2023"
              placeholder="Enter year (2015-2023)"
            />
          </div>

          <button 
            className="submit-review-btn"
            onClick={postreview}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting Review..." : "Post Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;