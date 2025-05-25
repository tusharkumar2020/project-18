import LoginPanel from "./components/Login/Login"
import Register from "./components/Register/Register"
import Layout from "./components/Layout";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<></>} />
        <Route path="login" element={<LoginPanel />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<></>} />
        <Route path="contact" element={<></>} />
        <Route path="dealer/:id" element={<Dealer />} />
        <Route path="postreview/:id" element={<PostReview />} />
      </Route>
    </Routes>
  );
}
export default App;
