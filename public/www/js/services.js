angular.module('app.services', [])

  .factory('AuthFactory', function () {

    var auth = {
      isLoggedIn: false
    };

    return {
      auth: auth
    };

  })

  .factory('AuthInterceptor', function ($q, $location, $window, AuthFactory) {

    return {
      request: request,
      response: response,
      responseError: responseError
    };

    function request(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    }

    function response(response) {
      if (response.status === 200 && $window.sessionStorage.token && !AuthFactory.isLoggedIn) {
        AuthFactory.isLoggedIn = true;
      }
      if (response.status === 401) {
        AuthFactory.isLoggedIn = false;
      }
      return response || $q.when(response);
    }

    function responseError(rejection) {
      if (rejection.status === 401 || rejection.status === 403) {
        delete $window.sessionStorage.token;
        AuthFactory.isLoggedIn = false;
        $location.path('/');
      }

      return $q.reject(rejection);
    }

  })

  .factory('$appConfig', function () {

    return {

      API_URL: "https://ddcharsheet.herokuapp.com/api"

    }

  });
