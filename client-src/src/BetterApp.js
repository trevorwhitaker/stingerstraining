import React, { useState, useEffect } from 'react';

const BetterApp = () => {

  const [ results, setResults ] = useState(null)
  const [ error, setError ] = useState(false);

  const fetchTest = () => {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };
    console.log(options)
    fetch('http://localhost:3009/test', options)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((jsonObj) => {
              setResults(jsonObj);
            })
            .catch(() => {
               setError(true);
            });
        }
        setError(true);
      })
      .catch(() => {
        setError(true);
      });
  }

  return (
    <>
      <button onClick={fetchTest}>Click to fetch</button>
      <div>hello, fetch results</div>
      {results && <pre>{JSON.stringify(results)}</pre>}
      {error && <div>{error}</div>}
    </>
  )

}

export default BetterApp;