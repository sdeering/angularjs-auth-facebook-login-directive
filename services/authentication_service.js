/**
 * AuthService
 *
 * Handles requests for user authentication.
 */
angular.module("app").factory("AuthService", function($http, $sanitize, $location, SessionService) {

  var cacheSession   = function() {
    SessionService.set('authenticated', true);
  };

  var uncacheSession = function() {
    SessionService.unset('authenticated');
  };

  var sanitizeCredentials = function(credentials) {
    return {
      email: $sanitize(credentials.email),
      password: $sanitize(credentials.password)
    };
  };

  return {
    login: function(credentials) {

      if (credentials) {
        credentials = sanitizeCredentials(credentials);
      }
      var login = $http.post("/api/auth/login", credentials);
      login.success(function(res, status, headers, config) {

        if (!res.error) {
          //cache the session
          cacheSession();

          //display login success msg
          loginSuccessMsg(res.message);

          //redirect page
          $location.path('/home');
        }
        else {
          loginErrorMsg(res.message);
        }

      });
      login.error(function(res) {
        //handled in app.js
      });
      return login;
    },
    logout: function() {
      var logout = $http.get("/api/auth/logout");
      logout.success( function() {
        uncacheSession();
        $location.path('/login');
      });
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
});
