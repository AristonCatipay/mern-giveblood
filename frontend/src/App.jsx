import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <>
      <Router>
        <Navigation />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound></NotFound>}></Route>
          </Routes>
        </Container>
      </Router>
    </>
  );
}

export default App;
