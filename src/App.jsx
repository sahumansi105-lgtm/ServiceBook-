import { BrowserRouter, Routes, Route } from "react-router-dom";


import "./App.css";

import Header from "./components/Header";
import Services from "./pages/Service";
import BookService from "./pages/BookService";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import MyBookings from "./pages/MyBooking";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyJob from "./pages/ApplyJobs";
import MyApplications from "./pages/MyApplications";
import JobDetails from "./pages/JobDetails";
import JobDashboard from "./pages/JobDashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>

      {/* Header */}
      <Header />

      {/* Pages */}
      <Routes>

        {/* User Pages */}
       
       <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        
        <Route path="/services" element={<Services />} />

         <Route path="/book-service" element={<BookService />} />

         <Route
  path="/user/dashboard"
  element={<UserDashboard />}
/>

<Route path="/jobs" element={<Jobs />} />

<Route path="/my-bookings" element={<MyBookings />} />

<Route
  path="/apply-job"
  element={<ApplyJob />}
/>

<Route
  path="/my-applications"
  element={<MyApplications />}
/>
  
  <Route
  path="/job-details/:id"
  element={<JobDetails />}
/>

<Route
  path="/job-dashboard"
  element={<JobDashboard />}
/>

<Route
  path="/footer"
  element={<Footer />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
