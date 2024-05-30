import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn.components";
import SignUp from "./components/SignUp.components";
import About from "./components/About.components";
import Home from "./components/Home.components";
import Profile from "./components/Profile.components";

const App = () => {
    return <BrowserRouter>
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