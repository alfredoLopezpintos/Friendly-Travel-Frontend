module.exports = {
    getUser: function() {
      console.log(sessionStorage)
      const user = sessionStorage.getItem('email');
      if (user === 'undefined' || !user) {
        return null;
      } else {
        return JSON.parse(user);
      }
    },
  
    getToken: function() {
      return sessionStorage.getItem('token');
    },
  
    setUserSession: function(user, token) {
      sessionStorage.setItem('email', JSON.stringify(user));
      sessionStorage.setItem('token', token);
    },
  
    resetUserSession: function() {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
  }