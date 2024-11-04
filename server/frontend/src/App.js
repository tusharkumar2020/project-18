// import LoginPanel from "./components/Login/Login"
// import { Routes, Route } from "react-router-dom";
// import Register from './components/Register/Register';

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<LoginPanel />} />
//       <Route path="/register" element={<Register />} />
//     </Routes>
//   );
// }
// export default App;

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {/* Other routes */}
      </Switch>
    </Router>
  );
}

