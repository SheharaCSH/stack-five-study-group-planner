import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './core/Menu';
import Home from './core/Home';          // 메인 화면 (스터디 그룹 목록)
import Signin from './lib/Signin';       // 로그인 화면
import Signup from './user/Signup';      // 회원가입 화면
import Profile from './user/Profile';    // 내 정보 / 프로필 (로그아웃, 계정 삭제 포함)

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