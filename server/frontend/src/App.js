import LoginPanel from "./components/Login/Login"
import Register from "./components/Register/Register";
import { Routes, Route } from "react-router-dom";


// Register route code
//<Route path="/register" element={<Register />} /> from "./components/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
        <Route path="/register" element={<Register />} />
    </Routes>
  );
}
export default App;
