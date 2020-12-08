const util = {
   async checkLogin() {
    console.log('check login')
    const token = localStorage.getItem('token');
  
    if (!token) {
      return false;
    }
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
  
    const response = await fetch('/users/isTokenValid', options);

    if (response.ok) {
      const jsonObj = await response.json();
      return jsonObj;
    } else {
      return false;
    }
  }
}

export default util;