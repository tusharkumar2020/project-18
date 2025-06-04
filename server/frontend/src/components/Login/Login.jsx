import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Form, Alert } from "react-bootstrap";

import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to sign in");
    }
    setLoading(false);
  };

  if (!loading) {
    return (
      <div>
        <Header/>
        <div onClick={onClose}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className='modalContainer'
          >
            <Form onSubmit={handleSubmit}>
              <h2>Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button disabled={loading} type="submit">
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header/>
        <div onClick={onClose}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className='modalContainer'
          >
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }
};

export default Login;
