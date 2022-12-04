module.exports = {
  getUser: function () {
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
    window.localStorage.setItem("email", JSON.stringify(user));
    window.localStorage.setItem("token", JSON.stringify(token));
  },

  resetUserSession: function () {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("token");
  },
};
