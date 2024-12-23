import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';

import { Context } from '.';
import { observer } from 'mobx-react-lite';
import UserService from './services/UserService';
import { IUser } from './models/IUser';
import ProfilePage from './components/Profile/ProfilePage';


function App() {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
      if (localStorage.getItem('token')) {
        console.log(true)
        store.checkAuth();
    }
}, []);

  async function getUsers() {
    try {
        const response = await UserService.fetchUsers();
        console.log("Fetched users:", response.data);
        setUsers(response.data);
    } catch (e) {
        console.error("Error fetching users:", e);
    }
}
  if (store.isLoading) {
    return <div>Загрузка...</div>
}

if (!store.isAuth) {
    return (
        <div>
            <Login/>
            <button onClick={getUsers}>Получить пользователей</button>
        </div>
    );
}
  return (
    <div className="App">
        {/* <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email} ${store.user.username}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
        <button onClick={() => store.logout()}>Выйти</button>
            <div>
                <button onClick={getUsers}>Получить пользователей</button>
            </div>
            {users.map(user =>
                <div key={user.email}>{user.email}</div>
            )} */}
      <ProfilePage/>
      </div>
  );
}

export default observer(App);