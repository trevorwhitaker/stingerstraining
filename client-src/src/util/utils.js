import constants from './constants';

const util = {

  /**
   * A function that returns a promise which will resolve to a bool value
   * indicating whether the user is logged in
   */
  async checkLogin() {
    const loggedIn = this.getWithExpiry('loggedIn');
    console.log('check login: ' + loggedIn);
    if (!loggedIn) {
      return false;
    }
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  
    const response = await fetch('/users/isLoggedIn', options);

    if (response.ok) {
      const jsonObj = await response.json();
      return jsonObj;
    } else {
      localStorage.removeItem('loggedIn');
      return false;
    }
  },

  async checkAdmin() {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  
    const response = await fetch(constants.isAdminEndpoint, options);

    if (response.ok) {
      const jsonObj = await response.json();
      return jsonObj;
    } else {
      return false;
    }
  },

  /**
   * A function to fetch all categories
   */
  async getCategories() {
    const loggedIn = this.getWithExpiry('loggedIn');
  
    if (!loggedIn) {
      return false;
    }
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  
    const response = await fetch(constants.categoriesEndpoint, options);

    if (response.ok) {
      const jsonObj = await response.json();
      return jsonObj;
    } else {
      return null;
    }
  },

  /**
   * A function to fetch all drills of a given category
   * @param {string} category the category to fetch the drills for
   */
  async getDrillByCategory(category) {
    const path=`${constants.drillsByCategoryEndpoint}/${category}`;
    const loggedIn = this.getWithExpiry('loggedIn');
  
    if (!loggedIn) {
      return false;
    }
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  
    const response = await fetch(path, options);

    if (response.ok) {
      const jsonObj = await response.json();
      return jsonObj;
    } else {
      return null;
    }
  },

  /**
   * A function to fetch data for a specific drill
   * @param {string} drill the name of the drill
   */
  async getDrillByName(drill) {
    const path = `${constants.drillByNameEndpoint}/${drill}`
    const loggedIn = this.getWithExpiry('loggedIn');
  
    if (!loggedIn) {
      return false;
    }
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  
    const response = await fetch(path, options);

    if (response.ok) {
      const jsonObj = await response.json();
      return jsonObj;
    } else {
      return null;
    }
  },

  setWithExpiry(key, value, ttl) {
    const now = new Date()
  
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
  },

  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }

}

export default util;