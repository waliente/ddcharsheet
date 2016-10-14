angular.module('app.controllers', [])

  .run(function ($rootScope, $window, $localStorage, $state) {

    // RECUPERO UTENTE GIA LOGGATO IN PASSATO
    $rootScope.user = $localStorage.get("user") || {};

    //Check every time route change
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      //Se NON sono loggato e cerco di accedere a contenuti privati
      if (!toState.free && !$rootScope.user.token) {
        event.preventDefault();
        $state.go("login");
      }
      if (toState.free && $rootScope.user && $rootScope.user.token) {
        event.preventDefault();
        $state.go("dashboard");
      }
    });

  })

  // LOGIN

  .controller('LoginCtrl', function ($scope, $http, $localStorage, $state, $appConfig, $ionicLoading, $window) {

    $scope.login = function () {

      $ionicLoading.show();

      $http.post($appConfig.API_URL + '/users/login', $scope.user)
        .then(function (result) {

          if (result.data.success) {

            console.log(result);

            $localStorage.set("user", result.data);
            $ionicLoading.hide();
            $window.location.href = "index.html"

          }

        })
        .catch(function (error) {
          console.log(error);
          $ionicLoading.hide();
          $scope.error_message = "Incorrect username or password"
        });

    };

  })


  // SIGN UP

  .controller('SignUpCtrl', function ($scope, $http, $appConfig, $ionicLoading, $state) {

    $scope.user = {
      email: $scope.email,
      password: $scope.password
    };

    $scope.register = function () {

      $ionicLoading.show();

      console.log($scope.user);

      $http.post($appConfig.API_URL + '/users/register', $scope.user)
        .then(function (result) {

          $ionicLoading.hide();
          $state.go('login');

        })
        .catch(function (error) {
          $ionicLoading.hide();
          console.log(error);
          $scope.error = error.data.errors;
        });

    };

  })


  // DASHBOARD

  .controller('DashboardCtrl', function ($scope, $ionicModal, $state, $http, $window, $rootScope, $localStorage) {

    // MODAL
    $ionicModal.fromTemplateUrl('templates/add-new-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    // CREATE NEW CHARACTER
    $scope.createCharacter = function (character) {
      $scope.character = character;
      $http.post("/api/users/" + $rootScope.user.id + "/characters/", character)
        .success(function (data) {
          console.log("Saving...");
          $scope.modal.hide();
          $window.location.href = "index.html";
        })
        .error(function () {
          console.log("Error");
          $scope.modal.hide();
        });
    };

    // LOGOUT
    $scope.logout = function () {

      $localStorage.clear();
      $rootScope.user = null;
      $state.go("login");

    };

  })


  // CHARACTER DETAIL

  .controller('CharacterCtrl', function ($scope, $http, $state, $stateParams, $ionicLoading, $rootScope) {

    $ionicLoading.show();

    $http.get("/api/users/" + $rootScope.user.id + "/characters/" + $stateParams.characterId)
      .success(function (data) {

        $ionicLoading.hide();

        $scope.character = data;

        console.log($scope.character);

        if ($scope.character.abilities.length <= 0) {
          $http.get("data/abilities.json")
            .success(function (result) {
              $scope.character.abilities = result;
            });
        }

        $scope.watchForModifier();

      });

    // ACTIVATE EDIT

    $scope.activeEdit = false;

    $scope.activateEdit = function () {
      $scope.activeEdit = true;
    };

    $scope.closeEdit = function () {
      $scope.activeEdit = false;
    };

    // WEAPON MANAGER

    $scope.showWeaponForm = false;

    $scope.addWeapon = function () {
      $scope.showWeaponForm = true;
    };

    $scope.closeWeapon = function () {
      $scope.showWeaponForm = false;
    };

    // push weapon in weapons
    $scope.saveWeapon = function () {

      $scope.character.weapons.unshift({
        name: $scope.character.weapons.name,
        damage: $scope.character.weapons.damage,
        hit_type: $scope.character.weapons.hit_type,
        proficient: $scope.character.weapons.proficient
      });

      $scope.showWeaponForm = false;

      $scope.character.weapons.name = "";
      $scope.character.weapons.damage = "";
      $scope.character.weapons.hit_type = "";
      $scope.character.weapons.proficient = false;

    };

    $scope.deleteWeapon = function (weapon) {
      var index = $scope.character.weapons.indexOf(weapon);
      $scope.character.weapons.splice(index, 1);
    };

    // EQUIPMENT MANAGER

    $scope.showEquipForm = false;

    $scope.addEquip = function () {
      $scope.showEquipForm = true;
    };

    $scope.closeEquip = function () {
      $scope.showEquipForm = false;
    };

    // push equip in equipment
    $scope.saveEquip = function () {

      $scope.character.equipment.unshift({
        name: $scope.character.equipment.name
      });

      $scope.showEquipForm = false;

      $scope.character.equipment.name = "";

    };

    $scope.deleteEquip = function (equip) {
      var index = $scope.character.equipment.indexOf(equip);
      $scope.character.equipment.splice(index, 1);
    };

    // TRAITS MANAGER

    $scope.showTraitForm = false;

    $scope.addTrait = function () {
      $scope.showTraitForm = true;
    };

    $scope.closeTrait = function () {
      $scope.showTraitForm = false;
    };

    // push trait in traits
    $scope.saveTrait = function () {

      $scope.character.traits.unshift({
        description: $scope.character.traits.description
      });

      $scope.showTraitForm = false;

      $scope.character.traits.description = "";

    };

    $scope.deleteTrait = function (trait) {
      var index = $scope.character.traits.indexOf(trait);
      $scope.character.traits.splice(index, 1);
    };

    // ARMOR PROFICIENCY MANAGER

    $scope.showArmorForm = false;

    $scope.addArmor = function () {
      $scope.showArmorForm = true;
    };

    $scope.closeArmor = function () {
      $scope.showArmorForm = false;
    };

    $scope.saveArmor = function () {
      $scope.showArmorForm = false;
    };

    // WEAPON PROFICIENCY MANAGER

    $scope.showWeaponsProficiencyForm = false;

    $scope.addWeaponsProficiency = function () {
      $scope.showWeaponsProficiencyForm = true;
    };

    $scope.closeWeaponsProficiency = function () {
      $scope.showWeaponsProficiencyForm = false;
    };

    $scope.saveWeaponsProficiency = function () {
      $scope.showWeaponsProficiencyForm = false;
    };

    // TOOLS PROFICIENCY MANAGER

    $scope.showToolsProficiencyForm = false;

    $scope.addToolsProficiency = function () {
      $scope.showToolsProficiencyForm = true;
    };

    $scope.closeToolsProficiency = function () {
      $scope.showToolsProficiencyForm = false;
    };

    $scope.saveToolsProficiency = function () {
      $scope.showToolsProficiencyForm = false;
    };

    // LANGUAGES MANAGER MANAGER

    $scope.showLanguagesForm = false;

    $scope.addLanguages = function () {
      $scope.showLanguagesForm = true;
    };

    $scope.closeLanguages = function () {
      $scope.showLanguagesForm = false;
    };

    $scope.saveLanguages = function () {
      $scope.showLanguagesForm = false;
    };

    // SAVE ALL AND SEND TO DB

    $scope.saveEdit = function () {

      $http.put("/api/users/" + $rootScope.user.id + "/characters/" + $stateParams.characterId, $scope.character)
        .success(function () {
          console.log("saved");
          $state.reload();
          console.log($scope.character);
        })
        .error(function (err) {
          console.log("Error" + err);
        });

      $scope.activeEdit = false;

    };


    // WATCH FOR MODIFIER AND SAVE TROUGHS

    $scope.watchForModifier = function () {

      $scope.$watch(function () {

        // strength
        if ($scope.character.strength) {

          if ($scope.character.strength.value >= 32) {
            $scope.character.strength.modifier = "+11";
          }
          if ($scope.character.strength.value >= 30 && $scope.character.strength.value <= 31) {
            $scope.character.strength.modifier = "+10"
          }
          if ($scope.character.strength.value >= 28 && $scope.character.strength.value <= 29) {
            $scope.character.strength.modifier = "+9"
          }
          if ($scope.character.strength.value >= 26 && $scope.character.strength.value <= 27) {
            $scope.character.strength.modifier = "+8"
          }
          if ($scope.character.strength.value >= 24 && $scope.character.strength.value <= 25) {
            $scope.character.strength.modifier = "+7"
          }
          if ($scope.character.strength.value >= 22 && $scope.character.strength.value <= 23) {
            $scope.character.strength.modifier = "+6"
          }
          if ($scope.character.strength.value >= 20 && $scope.character.strength.value <= 21) {
            $scope.character.strength.modifier = "+5"
          }
          if ($scope.character.strength.value >= 18 && $scope.character.strength.value <= 19) {
            $scope.character.strength.modifier = "+4"
          }
          if ($scope.character.strength.value >= 16 && $scope.character.strength.value <= 17) {
            $scope.character.strength.modifier = "+3"
          }
          if ($scope.character.strength.value >= 14 && $scope.character.strength.value <= 15) {
            $scope.character.strength.modifier = "+2"
          }
          if ($scope.character.strength.value >= 12 && $scope.character.strength.value <= 13) {
            $scope.character.strength.modifier = "+1"
          }
          if ($scope.character.strength.value >= 10 && $scope.character.strength.value <= 11) {
            $scope.character.strength.modifier = "0"
          }
          if ($scope.character.strength.value >= 8 && $scope.character.strength.value <= 9) {
            $scope.character.strength.modifier = "-1"
          }
          if ($scope.character.strength.value >= 6 && $scope.character.strength.value <= 7) {
            $scope.character.strength.modifier = "-2"
          }
          if ($scope.character.strength.value >= 4 && $scope.character.strength.value <= 5) {
            $scope.character.strength.modifier = "-3"
          }
          if ($scope.character.strength.value >= 2 && $scope.character.strength.value <= 3) {
            $scope.character.strength.modifier = "-4"
          }
          if ($scope.character.strength.value == 1) {
            $scope.character.strength.modifier = "-5"
          }

        }

        // dexterity
        if ($scope.character.dexterity) {

          if ($scope.character.dexterity.value >= 32) {
            $scope.character.dexterity.modifier = "+11";
          }
          if ($scope.character.dexterity.value >= 30 && $scope.character.dexterity.value <= 31) {
            $scope.character.dexterity.modifier = "+10"
          }
          if ($scope.character.dexterity.value >= 28 && $scope.character.dexterity.value <= 29) {
            $scope.character.dexterity.modifier = "+9"
          }
          if ($scope.character.dexterity.value >= 26 && $scope.character.dexterity.value <= 27) {
            $scope.character.dexterity.modifier = "+8"
          }
          if ($scope.character.dexterity.value >= 24 && $scope.character.dexterity.value <= 25) {
            $scope.character.dexterity.modifier = "+7"
          }
          if ($scope.character.dexterity.value >= 22 && $scope.character.dexterity.value <= 23) {
            $scope.character.dexterity.modifier = "+6"
          }
          if ($scope.character.dexterity.value >= 20 && $scope.character.dexterity.value <= 21) {
            $scope.character.dexterity.modifier = "+5"
          }
          if ($scope.character.dexterity.value >= 18 && $scope.character.dexterity.value <= 19) {
            $scope.character.dexterity.modifier = "+4"
          }
          if ($scope.character.dexterity.value >= 16 && $scope.character.dexterity.value <= 17) {
            $scope.character.dexterity.modifier = "+3"
          }
          if ($scope.character.dexterity.value >= 14 && $scope.character.dexterity.value <= 15) {
            $scope.character.dexterity.modifier = "+2"
          }
          if ($scope.character.dexterity.value >= 12 && $scope.character.dexterity.value <= 13) {
            $scope.character.dexterity.modifier = "+1"
          }
          if ($scope.character.dexterity.value >= 10 && $scope.character.dexterity.value <= 11) {
            $scope.character.dexterity.modifier = "0"
          }
          if ($scope.character.dexterity.value >= 8 && $scope.character.dexterity.value <= 9) {
            $scope.character.dexterity.modifier = "-1"
          }
          if ($scope.character.dexterity.value >= 6 && $scope.character.dexterity.value <= 7) {
            $scope.character.dexterity.modifier = "-2"
          }
          if ($scope.character.dexterity.value >= 4 && $scope.character.dexterity.value <= 5) {
            $scope.character.dexterity.modifier = "-3"
          }
          if ($scope.character.dexterity.value >= 2 && $scope.character.dexterity.value <= 3) {
            $scope.character.dexterity.modifier = "-4"
          }
          if ($scope.character.dexterity.value == 1) {
            $scope.character.dexterity.modifier = "-5"
          }

        }

        // constitution
        if ($scope.character.constitution) {

          if ($scope.character.constitution.value >= 32) {
            $scope.character.constitution.modifier = "+11";
          }
          if ($scope.character.constitution.value >= 30 && $scope.character.constitution.value <= 31) {
            $scope.character.constitution.modifier = "+10"
          }
          if ($scope.character.constitution.value >= 28 && $scope.character.constitution.value <= 29) {
            $scope.character.constitution.modifier = "+9"
          }
          if ($scope.character.constitution.value >= 26 && $scope.character.constitution.value <= 27) {
            $scope.character.constitution.modifier = "+8"
          }
          if ($scope.character.constitution.value >= 24 && $scope.character.constitution.value <= 25) {
            $scope.character.constitution.modifier = "+7"
          }
          if ($scope.character.constitution.value >= 22 && $scope.character.constitution.value <= 23) {
            $scope.character.constitution.modifier = "+6"
          }
          if ($scope.character.constitution.value >= 20 && $scope.character.constitution.value <= 21) {
            $scope.character.constitution.modifier = "+5"
          }
          if ($scope.character.constitution.value >= 18 && $scope.character.constitution.value <= 19) {
            $scope.character.constitution.modifier = "+4"
          }
          if ($scope.character.constitution.value >= 16 && $scope.character.constitution.value <= 17) {
            $scope.character.constitution.modifier = "+3"
          }
          if ($scope.character.constitution.value >= 14 && $scope.character.constitution.value <= 15) {
            $scope.character.constitution.modifier = "+2"
          }
          if ($scope.character.constitution.value >= 12 && $scope.character.constitution.value <= 13) {
            $scope.character.constitution.modifier = "+1"
          }
          if ($scope.character.constitution.value >= 10 && $scope.character.constitution.value <= 11) {
            $scope.character.constitution.modifier = "0"
          }
          if ($scope.character.constitution.value >= 8 && $scope.character.constitution.value <= 9) {
            $scope.character.constitution.modifier = "-1"
          }
          if ($scope.character.constitution.value >= 6 && $scope.character.constitution.value <= 7) {
            $scope.character.constitution.modifier = "-2"
          }
          if ($scope.character.constitution.value >= 4 && $scope.character.constitution.value <= 5) {
            $scope.character.constitution.modifier = "-3"
          }
          if ($scope.character.constitution.value >= 2 && $scope.character.constitution.value <= 3) {
            $scope.character.constitution.modifier = "-4"
          }
          if ($scope.character.constitution.value == 1) {
            $scope.character.constitution.modifier = "-5"
          }

        }

        // intelligence
        if ($scope.character.intelligence) {

          if ($scope.character.intelligence.value >= 32) {
            $scope.character.intelligence.modifier = "+11";
          }
          if ($scope.character.intelligence.value >= 30 && $scope.character.intelligence.value <= 31) {
            $scope.character.intelligence.modifier = "+10"
          }
          if ($scope.character.intelligence.value >= 28 && $scope.character.intelligence.value <= 29) {
            $scope.character.intelligence.modifier = "+9"
          }
          if ($scope.character.intelligence.value >= 26 && $scope.character.intelligence.value <= 27) {
            $scope.character.intelligence.modifier = "+8"
          }
          if ($scope.character.intelligence.value >= 24 && $scope.character.intelligence.value <= 25) {
            $scope.character.intelligence.modifier = "+7"
          }
          if ($scope.character.intelligence.value >= 22 && $scope.character.intelligence.value <= 23) {
            $scope.character.intelligence.modifier = "+6"
          }
          if ($scope.character.intelligence.value >= 20 && $scope.character.intelligence.value <= 21) {
            $scope.character.intelligence.modifier = "+5"
          }
          if ($scope.character.intelligence.value >= 18 && $scope.character.intelligence.value <= 19) {
            $scope.character.intelligence.modifier = "+4"
          }
          if ($scope.character.intelligence.value >= 16 && $scope.character.intelligence.value <= 17) {
            $scope.character.intelligence.modifier = "+3"
          }
          if ($scope.character.intelligence.value >= 14 && $scope.character.intelligence.value <= 15) {
            $scope.character.intelligence.modifier = "+2"
          }
          if ($scope.character.intelligence.value >= 12 && $scope.character.intelligence.value <= 13) {
            $scope.character.intelligence.modifier = "+1"
          }
          if ($scope.character.intelligence.value >= 10 && $scope.character.intelligence.value <= 11) {
            $scope.character.intelligence.modifier = "0"
          }
          if ($scope.character.intelligence.value >= 8 && $scope.character.intelligence.value <= 9) {
            $scope.character.intelligence.modifier = "-1"
          }
          if ($scope.character.intelligence.value >= 6 && $scope.character.intelligence.value <= 7) {
            $scope.character.intelligence.modifier = "-2"
          }
          if ($scope.character.intelligence.value >= 4 && $scope.character.intelligence.value <= 5) {
            $scope.character.intelligence.modifier = "-3"
          }
          if ($scope.character.intelligence.value >= 2 && $scope.character.intelligence.value <= 3) {
            $scope.character.intelligence.modifier = "-4"
          }
          if ($scope.character.intelligence.value == 1) {
            $scope.character.intelligence.modifier = "-5"
          }

        }

        // wisdom
        if ($scope.character.wisdom) {

          if ($scope.character.wisdom.value >= 32) {
            $scope.character.wisdom.modifier = "+11";
          }
          if ($scope.character.wisdom.value >= 30 && $scope.character.wisdom.value <= 31) {
            $scope.character.wisdom.modifier = "+10"
          }
          if ($scope.character.wisdom.value >= 28 && $scope.character.wisdom.value <= 29) {
            $scope.character.wisdom.modifier = "+9"
          }
          if ($scope.character.wisdom.value >= 26 && $scope.character.wisdom.value <= 27) {
            $scope.character.wisdom.modifier = "+8"
          }
          if ($scope.character.wisdom.value >= 24 && $scope.character.wisdom.value <= 25) {
            $scope.character.wisdom.modifier = "+7"
          }
          if ($scope.character.wisdom.value >= 22 && $scope.character.wisdom.value <= 23) {
            $scope.character.wisdom.modifier = "+6"
          }
          if ($scope.character.wisdom.value >= 20 && $scope.character.wisdom.value <= 21) {
            $scope.character.wisdom.modifier = "+5"
          }
          if ($scope.character.wisdom.value >= 18 && $scope.character.wisdom.value <= 19) {
            $scope.character.wisdom.modifier = "+4"
          }
          if ($scope.character.wisdom.value >= 16 && $scope.character.wisdom.value <= 17) {
            $scope.character.wisdom.modifier = "+3"
          }
          if ($scope.character.wisdom.value >= 14 && $scope.character.wisdom.value <= 15) {
            $scope.character.wisdom.modifier = "+2"
          }
          if ($scope.character.wisdom.value >= 12 && $scope.character.wisdom.value <= 13) {
            $scope.character.wisdom.modifier = "+1"
          }
          if ($scope.character.wisdom.value >= 10 && $scope.character.wisdom.value <= 11) {
            $scope.character.wisdom.modifier = "0"
          }
          if ($scope.character.wisdom.value >= 8 && $scope.character.wisdom.value <= 9) {
            $scope.character.wisdom.modifier = "-1"
          }
          if ($scope.character.wisdom.value >= 6 && $scope.character.wisdom.value <= 7) {
            $scope.character.wisdom.modifier = "-2"
          }
          if ($scope.character.wisdom.value >= 4 && $scope.character.wisdom.value <= 5) {
            $scope.character.wisdom.modifier = "-3"
          }
          if ($scope.character.wisdom.value >= 2 && $scope.character.wisdom.value <= 3) {
            $scope.character.wisdom.modifier = "-4"
          }
          if ($scope.character.wisdom.value == 1) {
            $scope.character.wisdom.modifier = "-5"
          }

        }

        // charisma
        if ($scope.character.charisma) {

          if ($scope.character.charisma.value >= 32) {
            $scope.character.charisma.modifier = "+11";
          }
          if ($scope.character.charisma.value >= 30 && $scope.character.charisma.value <= 31) {
            $scope.character.charisma.modifier = "+10"
          }
          if ($scope.character.charisma.value >= 28 && $scope.character.charisma.value <= 29) {
            $scope.character.charisma.modifier = "+9"
          }
          if ($scope.character.charisma.value >= 26 && $scope.character.charisma.value <= 27) {
            $scope.character.charisma.modifier = "+8"
          }
          if ($scope.character.charisma.value >= 24 && $scope.character.charisma.value <= 25) {
            $scope.character.charisma.modifier = "+7"
          }
          if ($scope.character.charisma.value >= 22 && $scope.character.charisma.value <= 23) {
            $scope.character.charisma.modifier = "+6"
          }
          if ($scope.character.charisma.value >= 20 && $scope.character.charisma.value <= 21) {
            $scope.character.charisma.modifier = "+5"
          }
          if ($scope.character.charisma.value >= 18 && $scope.character.charisma.value <= 19) {
            $scope.character.charisma.modifier = "+4"
          }
          if ($scope.character.charisma.value >= 16 && $scope.character.charisma.value <= 17) {
            $scope.character.charisma.modifier = "+3"
          }
          if ($scope.character.charisma.value >= 14 && $scope.character.charisma.value <= 15) {
            $scope.character.charisma.modifier = "+2"
          }
          if ($scope.character.charisma.value >= 12 && $scope.character.charisma.value <= 13) {
            $scope.character.charisma.modifier = "+1"
          }
          if ($scope.character.charisma.value >= 10 && $scope.character.charisma.value <= 11) {
            $scope.character.charisma.modifier = "0"
          }
          if ($scope.character.charisma.value >= 8 && $scope.character.charisma.value <= 9) {
            $scope.character.charisma.modifier = "-1"
          }
          if ($scope.character.charisma.value >= 6 && $scope.character.charisma.value <= 7) {
            $scope.character.charisma.modifier = "-2"
          }
          if ($scope.character.charisma.value >= 4 && $scope.character.charisma.value <= 5) {
            $scope.character.charisma.modifier = "-3"
          }
          if ($scope.character.charisma.value >= 2 && $scope.character.charisma.value <= 3) {
            $scope.character.charisma.modifier = "-4"
          }
          if ($scope.character.charisma.value == 1) {
            $scope.character.charisma.modifier = "-5"
          }

        }

      });

    };

    $scope.showSpellForm = false;

    $scope.addSpell = function () {
      $scope.showSpellForm = true;
    };

    $scope.closeSpell = function () {
      $scope.showSpellForm = false;
    };

    $scope.saveSpell = function () {

      $scope.character.spells.unshift({
        level: $scope.character.spells.level,
        name: $scope.character.spells.name
      });

      $scope.showSpellForm = false;
      $scope.character.spells.level = null;
      $scope.character.spells.name = "";

    };
    $scope.deleteSpell = function (spell) {
      var index = $scope.character.spells.indexOf(spell);
      $scope.character.spells.splice(index, 1);
    };


  })

;
