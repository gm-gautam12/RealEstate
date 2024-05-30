import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn.pages";
import SignUp from "./Pages/SignUp.pages";
import About from "./Pages/About.pages";
import Home from "./Pages/Home.pages";
import Profile from "./Pages/Profile.pages";
import Header from "./components/Header.components";

const App = () => {
    return <BrowserRouter>
    <Header />
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
       </Routes>
    </BrowserRouter>
    
}

export default App;