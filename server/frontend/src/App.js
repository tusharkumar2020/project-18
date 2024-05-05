import Register from "./components/Register/Register";
import LoginPanel from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />// 添加注册页面的路由
    </Routes>
  );
}
export default App;
