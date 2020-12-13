import constants from './constants';

const util = {

  /**
   * A function that returns a promise which will resolve to a bool value
   * indicating whether the user is logged in
   */
   async checkLogin() {
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
  },

  /**
   * A function to fetch all categories
   */
  async getCategories() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return false;
    }
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token
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
    const token = localStorage.getItem('token');
  
    if (!token) {
      return false;
    }
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token
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
    const token = localStorage.getItem('token');
  
    if (!token) {
      return false;
    }
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
  
    const response = await fetch(path, options);

    if (response.ok) {
      const jsonObj = await response.json();
      return jsonObj;
    } else {
      return null;
    }
  }
}

export default util;