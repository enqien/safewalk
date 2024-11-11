import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Case from "./Case";
import AllCases from "./AllCases";
import Login from "./Login";
import SignUp from "./SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/allcases" element={<AllCases />} />
        <Route path="/case/:id" element={<Case />} />
      </Routes>
    </Router>
  );
}
export default App;
