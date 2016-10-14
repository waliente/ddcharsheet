angular.module('app.services', [])

  .factory('$appConfig', function () {

    return {

      API_URL: "https://ddcharsheet.herokuapp.com/api"

    }

  });
