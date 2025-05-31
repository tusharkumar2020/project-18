import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState(0);
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);

  let params = useParams();
  let id = params.id;
  let dealer_url = `/djangoapp/dealer/${id}`;
  let review_url = `/djangoapp/dealer/${id}/add_review/`;
  let carmakes_url = `/djangoapp/get_carmakes`;
  let carmodels_url = `/djangoapp/get_cars`;

  const postreview = async (event) => {
    if(event) event.preventDefault();
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!selectedMake || !selectedModel || review === "" || date === "" || year === "" || rating === 0) {
      alert("All details including rating are mandatory");
      return;
    }

    let jsoninput = JSON.stringify({
      "name": name,
      "dealer_id": id,
      "review": review,
      "rating": rating,
      "purchase": true,
      "purchase_date": date,
      "car_make": selectedMake,
      "car_model": selectedModel,
      "car_year": year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: jsoninput,
      });

      if (res.status === 403) {
        alert("You must be logged in to post a review.");
        return;
      }
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const json = await res.json();
        if (json.status === 200) {
          window.location.href = window.location.origin+"/dealer/"+id;
        } else {
          alert("Failed to post review: " + (json.message || "Unknown error"));
        }
      } else {
        const text = await res.text();
        alert("Failed to post review. Response is not JSON: " + text);
      }
    } catch (error) {
      alert("Error posting review: " + error.message);
    }
  }

  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();

    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }

  const get_car_makes = async () => {
    try {
      const res = await fetch(carmakes_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        console.error("Failed to fetch car makes, status:", res.status);
        return;
      }
      const retobj = await res.json();
      setCarMakes(Array.from(retobj.CarMakes));
    } catch (error) {
      console.error("Error fetching car makes:", error);
    }
  }

  const get_car_models = async (make) => {
    try {
      const res = await fetch(carmodels_url, {
        method: "GET"
      });
      const retobj = await res.json();
      let allModels = Array.from(retobj.CarModels);
      let filteredModels = allModels.filter(cm => cm.CarMake === make || cm.CarMakeName === make);
      setCarModels(filteredModels);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  }

  useEffect(() => {
    get_dealer();
    get_car_makes();
  },[]);

  useEffect(() => {
    if(selectedMake) {
      get_car_models(selectedMake);
      setSelectedModel("");
    }
  }, [selectedMake]);

  return (
    <div style={{margin:"5%"}}>
      <h1 style={{color:"darkblue"}}>{dealer.full_name}</h1>
      <textarea id='review' cols='50' rows='7' placeholder="Write your review here..." onChange={(e) => setReview(e.target.value)}></textarea>
      <div className='input_field'>
        Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)}/>
      </div>
      <div className='input_field'>
        Car Make 
        <select name="carMake" id="carMake" value={selectedMake} onChange={(e) => { setSelectedMake(e.target.value); setSelectedModel(""); }}>
          <option value="" disabled hidden>Choose Car Make</option>
          {carMakes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>        
      </div >
      <div className='input_field'>
        Car Model 
        <select name="carModel" id="carModel" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedMake}>
          <option value="" disabled hidden>Choose Car Model</option>
          {carModels.map(model => (
            <option key={model.CarMake + model.CarModel} value={model.CarModel}>{model.CarModel}</option>
          ))}
        </select>        
      </div>
      <div className='input_field'>
        Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2023} min={2015}/>
      </div>
      <div className='input_field'>
        Rating: 
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          <option value={0} disabled>Select rating</option>
          <option value={1}>1 - Poor</option>
          <option value={2}>2 - Fair</option>
          <option value={3}>3 - Good</option>
          <option value={4}>4 - Very Good</option>
          <option value={5}>5 - Excellent</option>
        </select>
      </div>
      <div>
        <button className='postreview' onClick={postreview}>Post Review</button>
      </div>
    </div>
  )
}

export default PostReview;
