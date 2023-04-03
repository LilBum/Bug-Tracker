import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';


//Reducers
import authReducer from './Controllers/Redux/authSlice';
import bugReducer from './Controllers/Redux/bugSlice';
import userReducer from './Controllers/Redux/userSlice';

//Redux configure
const reducer = combineReducers({
  auth: authReducer,
  bugs: bugReducer,
  user: userReducer,
})

const store = configureStore({ reducer });
const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

