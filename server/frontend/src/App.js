import LoginPanel from "./components/Login/Login"
import Register from "./components/Register/Register"
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginPanel />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}
export default App;
