import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SkeletonPlaceholder } from 'carbon-components-react';

import util from '../../util/utils';

import './Register.scss';

export default function Register() {
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const check = async () => {
      const isLoggedin = await util.checkLogin();
      setIsLoggedin(isLoggedin);
    };
    check();
  }, []);

  function validateForm() {
    return (
      username.length > 0 && password.length > 0 && passwordCheck === password
    );
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
        passwordCheck: passwordCheck,
      }),
    };

    const response = await fetch('/users/register', options);
    if (response) {
      if (response.ok) {
        setSuccess(true);
      } else {
        const jsonObj = await response.json();
        setError(jsonObj?.msg);
      }
    } else {
      setError('no response');
      setSuccess(false);
    }
  };

  return (
    <div className='Register'>
      {success && (
        <div className='registration-success'>
          success! Login <a href='/login'>here</a>
        </div>
      )}
      {error && (
        <div className='registration-error'>
          There was an error registering: {error}
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
          <Form.Group size='lg' controlId='password'>
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control
              type='password'
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </Form.Group>
          <Button block size='lg' type='submit' disabled={!validateForm()}>
            Register
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
