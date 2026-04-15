import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../Controllers/Redux/authSlice';
import './login.css';

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formInput, setFormInput] = useState({
    email: '',
    password: '',
  });

  function inputChanged(e) {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  }

  function submit(e) {
    e.preventDefault();
    dispatch(loginUser(formInput));
  }

  return (
    <div className="loginBG">
      <form className="login-panel" onSubmit={submit}>
        <h1>Sign in</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={inputChanged}
          value={formInput.email}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={inputChanged}
          value={formInput.password}
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
