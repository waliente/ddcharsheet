angular.module('app.services', [])

  .factory('AuthFactory', function () {

    var auth = {
      isLoggedIn: false
    };

    return {
      auth: auth
    };

  })

  .factory('AuthInterceptor', function ($q, $location, $window, AuthFactory, $rootScope) {

    return {
      request: request,
      response: response,
      responseError: responseError
    };

    function request(config) {
      config.headers = config.headers || {};
      if ($rootScope.user.token) {
        config.headers.Authorization = 'Bearer ' + $rootScope.user.token;
      }
      return config;
    }

    function response(response) {
      if (response.status === 200 && $rootScope.user.token && !AuthFactory.isLoggedIn) {
        AuthFactory.isLoggedIn = true;
      }
      if (response.status === 401) {
        AuthFactory.isLoggedIn = false;
      }
      return response || $q.when(response);
    }

    function responseError(rejection) {
      if (rejection.status === 401 || rejection.status === 403) {
        delete $rootScope.user.token;
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
