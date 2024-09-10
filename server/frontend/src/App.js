import LoginPanel from "./components/Login/Login"
import { Routes, Route } from "react-router-dom";
import RegistrationPanel from './components/Register/Register';
import Dealers from './components/Dealers/Dealers';
import PostReview from "./components/Dealers/PostReview"

function App() {
    return (
        <Routes>
          {/* Define routes for different components */}
          
          <Route path="/login" element={<LoginPanel />} />
          <Route path="/register" element={<RegistrationPanel />} />
          <Route path="/dealers" element={<Dealers/>} />
          <Route path="/postreview/:id" element={<PostReview/>} />
          
    
        </Routes>
      );
    }
export default App;
