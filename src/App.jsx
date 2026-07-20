import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Booking from "./pages/Booking";
import Seat from "./pages/Seat";
import Bus from "./pages/Bus";
import MyBooking from "./pages/MyBooking";
import Navbar from "./component/Navbar";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Bus />} />
          <Route path="/buses/:id/seats" element={<Seat />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/mybookings" element={<MyBooking />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
