angular.module('dd-charsheet')

  .component('charactersList', {
    templateUrl: 'components/characters-list/characters-list.html',
    controller: 'CharactersList',
    bindings: {
      device: '<'
    }
  })

  .controller("CharactersList", function ($scope, $http, $rootScope) {

    $http.get("/api/users/" + $rootScope.user.id + "/characters")
      .success(function (data) {
        console.log(data);
        $scope.characters = data;
        document.getElementById("loader").style.display = 'none';
      });

  });
