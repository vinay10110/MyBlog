import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const {  setUserInfo } = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    setMessage('');
    setIsError(false);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Login successful!');
        setIsError(false);
        setUserInfo(data);
        setTimeout(() => setRedirect(true), 1000);
      } else {
        setMessage(data.message || 'Login failed');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsError(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      {message && (
        <div className={`message ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      <input type="text"
        placeholder='username'
        value={username}
        onChange={ev => setUsername(ev.target.value)}
      />
      <input type="password"
        placeholder='password'
        value={password}
        onChange={ev => setPassword(ev.target.value)}
      />
      <button>login</button>
    </form>
  );
};

export default LoginPage;