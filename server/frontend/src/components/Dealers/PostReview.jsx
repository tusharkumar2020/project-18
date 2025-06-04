import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";
import "./PostReview.css";
import "../assets/style.css";
import Header from '../Header/Header';
import { Form, Button, Alert } from "react-bootstrap";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState({
    name: "",
    purchase: false,
    purchase_date: "",
    car_make: "",
    car_model: "",
    car_year: "",
    review: "",
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...review,
          dealership: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post review");
      }

      setReview({
        name: "",
        purchase: false,
        purchase_date: "",
        car_make: "",
        car_model: "",
        car_year: "",
        review: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!review.car_model || review.review === "" || review.purchase_date === "" || review.car_year === "") {
      setError("All fields are required");
      return false;
    }
    if (review.car_year < 2015 || review.car_year > 2023) {
      setError("Year must be between 2015 and 2023");
      return false;
    }
    if (review.review.length < 10) {
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

      let model_split = review.car_model.split(" ");
      let make_chosen = model_split[0];
      let model_chosen = model_split[1];

      let jsoninput = JSON.stringify({
        "name": name,
        "dealership": id,
        "review": review.review,
        "purchase": review.purchase,
        "purchase_date": review.purchase_date,
        "car_make": make_chosen,
        "car_model": model_chosen,
        "car_year": review.car_year,
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
      <div className="container mt-5">
        <h2>Post a Review</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={review.name}
              onChange={(e) =>
                setReview({ ...review, name: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Did you purchase a car?"
              checked={review.purchase}
              onChange={(e) =>
                setReview({ ...review, purchase: e.target.checked })
              }
            />
          </Form.Group>
          {review.purchase && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  type="date"
                  value={review.purchase_date}
                  onChange={(e) =>
                    setReview({ ...review, purchase_date: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Car Make</Form.Label>
                <Form.Control
                  type="text"
                  value={review.car_make}
                  onChange={(e) =>
                    setReview({ ...review, car_make: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Car Model</Form.Label>
                <Form.Control
                  type="text"
                  value={review.car_model}
                  onChange={(e) =>
                    setReview({ ...review, car_model: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Car Year</Form.Label>
                <Form.Control
                  type="number"
                  value={review.car_year}
                  onChange={(e) =>
                    setReview({ ...review, car_year: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={review.review}
              onChange={(e) =>
                setReview({ ...review, review: e.target.value })
              }
              required
            />
          </Form.Group>
          <Button disabled={loading} type="submit">
            Submit Review
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PostReview;