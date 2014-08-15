/**
 * LoginController
 *
 * Controls the login view.
 */
angular.module("app").controller("LoginController", function($http, $scope, $location, AuthService) {

  /**
   * Login.
   */
  $scope.credentials = { email: "", password: "" };
  $scope.login = function(credentials) {
    if ($scope.login_form.$valid) {
      AuthService.login($scope.credentials);
    }
  };

});
