import React from "react";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import Layout from "./components/Layout";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPanel />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="dealer/:id" element={<Dealer />} />
        <Route path="postreview/:id" element={<PostReview />} />
        <Route path="dealers" element={<Dealers />} />
      </Route>
    </Routes>
  );
}
export default App;