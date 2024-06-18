import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn.pages";
import SignUp from "./Pages/SignUp.pages";
import About from "./Pages/About.pages";
import Home from "./Pages/Home.pages";
import Profile from "./Pages/Profile.pages";
import Header from "./components/Header.components";
import PrivateRoute from "./components/PrivateRoute.components";
import CreateListing from "./Pages/CreateListing.pages";
import UpdateListing from "./Pages/UpdateListing.pages";
import Listing from "./Pages/Listing.pages";
import Search from "./Pages/Search.pages";



const App = () => {
    return <BrowserRouter>
    <Header />
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
       </Routes>
    </BrowserRouter>
    
}

export default App;