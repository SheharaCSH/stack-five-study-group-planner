import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './core/Menu';
import Home from './core/Home';
import Signin from './lib/Signin';
import Signup from './user/Signup';
import Profile from './user/Profile';
function MainRouter() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/:userId" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default MainRouter;