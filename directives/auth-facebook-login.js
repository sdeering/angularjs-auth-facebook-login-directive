/**
 * @ngdirective
 * Inserts a login with facebook button.
 * Adds functionality for social network authentication via a popup window.
 */
angular.module("app").directive("facebookLoginButton", function(AuthService) {
  return {
    restrict: 'A',
    templateUrl: 'facebook-login-button.html',
    scope: {
        heading: '@'
    },
    controller: 'LoginController',
    link: function($scope, $element, $attrs) {

      /**
       * socialAuth Login.
       */
      $scope.socialAuth = function(network) {

          //fixes dual-screen position (Most browsers/Firefox)
          var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
          var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
          dualWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
          dualHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

          // calculate position of popup window and set parameters.
          var width = 500,
              height = 500,
              left = ((dualWidth / 2) - (width / 2)) + dualScreenLeft,
              top = ((dualHeight / 2) - (height / 2)) + dualScreenTop,
              title = "Authenticate",
              url = window.location.origin+'/api/auth/' + network;

          //open the popup window.
          window.$windowScope = $scope;
          $scope.socialAuthWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+width+', height='+height+', top='+top+', left='+left);

          //check the status of the popup window.
          $scope.checkAuthStatus();

          //puts focus on the newWindow
          if (window.focus) {
              $scope.socialAuthWindow.focus();
          }

        };

        /**
         * socialAuth monitoring popup window for completion.
         */
        $scope.checkAuthStatus = function() {

          //check popup window url
          try {
            if ($scope.socialAuthWindow.document.domain === document.domain) {
              // console.log($scope.socialAuthWindow.document.URL);
              var code = $scope.getUrlParameters('code', $scope.socialAuthWindow.document.URL, true);
              //when auth is complete the code param will be present from facebook
              if (code) {
                console.log('AUTH COMPLETE.');
                $scope.socialAuthWindow.close();
              }
            }
          } catch(e) {
            //domain mismatch catch
            console.log('Checking auth...');
          }

          //on window close
          if ($scope.socialAuthWindow.closed) {
            console.log('AUTH WINDOW CLOSED.');
            $scope.authEnd();
          }
          else setTimeout($scope.checkAuthStatus, 200);

        };

        /**
         * socialAuth Popup Window Handler.
         */
        $scope.authEnd = function() {
          AuthService.login();
        };

        /**
         * Get the value of URL parameters either from current URL or static URL
         */
        $scope.getUrlParameters = function(parameter, staticURL, decode) {
           var currLocation = (staticURL.length)? staticURL : window.location.search,
               parArr = currLocation.split("?")[1].split("&"),
               returnBool = true;

           for(var i = 0; i < parArr.length; i++){
                parr = parArr[i].split("=");
                if(parr[0] == parameter){
                    return (decode) ? decodeURIComponent(parr[1]) : parr[1];
                    returnBool = true;
                }else{
                    returnBool = false;
                }
           }

           if(!returnBool) return false;
        };

    }
  }
});
