import React, { useState } from 'react'
import {Navigate} from 'react-router-dom'
const Register = () => {
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [redirect,setRedirect]=useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  async function register(ev){
    ev.preventDefault();
    setMessage('');
    setIsError(false);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/api/auth/register`,{
        method:"POST",
        body:JSON.stringify({username,password}),
        headers:{
          'content-type':'application/json'
        },
      });
      
      const data = await response.json();
      
      if(response.ok){
        setMessage(data.message || 'Registration successful!');
        setIsError(false);
        setTimeout(() => setRedirect(true), 1500);
      } else {
        setMessage(data.message || 'Registration failed');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsError(true);
    }
  }
if(redirect){
  return <Navigate to={'/login'} />
}
  return (
    <form className="register" onSubmit={register}>
        <h1>Register</h1>
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
<input type="text" 
placeholder='username'
value={username}
onChange={ev=>setUsername(ev.target.value)}
/>
<input type="password" 
placeholder='password'
value={password}
onChange={ev=>setPassword(ev.target.value)}
/>
<button>Register</button>
    </form>
  )
}

export default Register
