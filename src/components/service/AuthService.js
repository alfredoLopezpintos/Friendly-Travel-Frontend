module.exports = {
  getUser: function () {
    //console.log(sessionStorage)
    const user = window.localStorage.getItem("email");
    if (user === "undefined" || !user) {
      return null;
    } else {
      return JSON.parse(user);
    }
  },

  getToken: function () {
    return window.localStorage.getItem("token");
  },

  setUserSession: function (user, token) {
    //sessionStorage.setItem('email', JSON.stringify(user));
    //sessionStorage.setItem('token', token);
    window.localStorage.setItem("email", JSON.stringify(user));
    window.localStorage.setItem("token", JSON.stringify(token));
  },

  resetUserSession: function () {
    //sessionStorage.removeItem('email');
    //sessionStorage.removeItem('token');
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("token");
  },
};
