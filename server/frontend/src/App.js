import LoginPanel from "./components/Login/Login"
import RegisterPanel from "./components/Register/Register"; 
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<RegisterPanel />} /> {/* ✅ Register route */}
    </Routes>
  );
}
export default App;
