import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SkeletonPlaceholder } from 'carbon-components-react';

import util from '../../util/utils';
import './Login.scss';

export default function Login() {
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const check = async () => {
      const isLoggedin = await util.checkLogin();
      setIsLoggedin(isLoggedin);
    }
    check();
  }, [])

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const handleSubmit = async (event) => {

    event.preventDefault();

    // Reset states
    setError(null);
    setSuccess(null);

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    const response = await fetch('/users/login', options);
    let token;
    if (response) {
      const resObj = await response.json();
      if (response.ok) {
        token = resObj?.token;
        if (token) {
          localStorage.setItem('token', token);
          setSuccess(true);
          setTimeout(() => {
            window.location = '/'
          }, 5000);
        } else {
          setError('no token')
          setSuccess(false);
        }
      } else {
        setError(resObj?.msg);
        setSuccess(false);
      }
    } else {
      setError('no response');
      setSuccess(false);
    }
  }

  return (
    <div className='Login'>
      {success && <div className='login-success'>success! Redirecting in 5 seconds...</div>}
      {error && (
        <div className='login-error'>
          There was an error logging in: {error}
        </div>
      )}
      {isLoggedin === false && !success && (
        <Form onSubmit={handleSubmit}>
          <Form.Group size='lg' controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type='text'
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </Form.Group>
          <Form.Group size='lg' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button block size='lg' type='submit' disabled={!validateForm()}>
            Login
          </Button>
        </Form>
      )}
      {isLoggedin && <div className='logged-in'>You are already logged in</div>}
      {isLoggedin === null && 
        <div className='loading-skeleton-container'>
          <SkeletonPlaceholder className='loading-skeleton-1' />
        </div>
      }
    </div>
  );
}
