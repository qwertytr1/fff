import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';

import { Context } from '.';
import { observer } from 'mobx-react-lite';
import UserService from './services/UserService';
import { IUser } from './models/IUser';
import ProfilePage from './components/Profile/ProfilePage';
import Register from './components/register/register';


function App() {
  return (
      <Routes>
              <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/Profile" element={<ProfilePage />} />
  </Routes>
  );
}

export default observer(App);