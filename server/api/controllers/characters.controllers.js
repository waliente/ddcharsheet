var mongoose = require('mongoose');
var Users = mongoose.model('Users');

// GET all characters for a user
module.exports.CharactersGetAll = function (req, res) {

    var id = req.params.userId;

    console.log('GET reviews for userId', id);

    Users
        .findById(id)
        .select('characters')
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: []
            };
            if (err) {
                console.log("Error finding user");
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log("User id not found in database", id);
                response.status = 404;
                response.message = {
                    "message": "User ID not found " + id
                };
            } else {
                response.message = doc.characters ? doc.characters : [];
            }
            res
                .status(response.status)
                .json(response.message);
        });
};


// GET single character for a user
module.exports.CharactersGetOne = function(req, res) {

    var userId = req.params.userId;

    var characterId = req.params.characterId;

    console.log('GET characterId ' + characterId + ' for userId ' + userId);

    Users
        .findById(userId)
        .select('characters')
        .exec(function(err, user) {
            var response = {
                status : 200,
                message : {}
            };
            if (err) {
                console.log("Error finding user");
                response.status = 500;
                response.message = err;
            } else if(!user) {
                console.log("User id not found in database", userId);
                response.status = 404;
                response.message = {
                    "message" : "User ID not found " + userId
                };
            } else {
                // Get the character
                response.message = user.characters.id(characterId);
                // If the character doesn't exist Mongoose returns null
                if (!response.message) {
                    response.status = 404;
                    response.message = {
                        "message" : "Character ID not found " + characterId
                    };
                }
            }
            res
                .status(response.status)
                .json(response.message);
        });

};

var _addCharacter = function (req, res, user) {
    user.characters.push({
        name : req.body.name,
        race : req.body.race,
        class : req.body.class,
        level: req.body.level
    });

    user.save(function(err, userUpdated) {
        if (err) {
            res
                .status(500)
                .json(err);
        } else {
            res
                .status(200)
                .json(userUpdated.characters[userUpdated.characters.length - 1]);
        }
    });

};

module.exports.CharactersAddOne = function(req, res) {

    var id = req.params.userId;

    console.log('POST character to userId', id);

    Users
        .findById(id)
        .select('characters')
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
            if (err) {
                console.log("Error finding user");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                console.log("UserID not found in database", id);
                response.status = 404;
                response.message = {
                    "message" : "User ID not found " + id
                };
            }
            if (doc) {
                _addCharacter(req, res, doc);
            } else {
                res
                    .status(response.status)
                    .json(response.message);
            }
        });

};

module.exports.CharactersUpdateOne = function(req, res) {
    var userId = req.params.userId;
    var characterId = req.params.characterId;
    console.log('PUT characterId ' + characterId + ' for hotelId ' + userId);

    Users
        .findById(userId)
        .select('characters')
        .exec(function(err, user) {
            var thisChar;
            var response = {
                status : 200,
                message : {}
            };
            if (err) {
                console.log("Error finding user");
                response.status = 500;
                response.message = err;
            } else if(!user) {
                console.log("User id not found in database", userId);
                response.status = 404;
                response.message = {
                    "message" : "User ID not found " + userId
                };
            } else {
                // Get the review
                thisChar = user.characters.id(characterId);
                // If the review doesn't exist Mongoose returns null
                if (!thisChar) {
                    response.status = 404;
                    response.message = {
                        "message" : "Character ID not found " + characterId
                    };
                }
            }
            if (response.status !== 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                thisChar.name = req.body.name;
                thisChar.race = req.body.race;
                thisChar.class = req.body.class;
                thisChar.level = req.body.level;
                thisChar.deity = req.body.deity;
                thisChar.hp = req.body.hp;
                thisChar.hit_dice = req.body.hit_dice;
                thisChar.iniziative = req.body.iniziative;
                thisChar.armor = req.body.armor;
                thisChar.speed = req.body.speed;
                thisChar.inspiration = req.body.inspiration;
                thisChar.proficiency = req.body.proficiency;
                thisChar.strength = req.body.strength;
                thisChar.dexterity = req.body.dexterity;
                thisChar.constitution = req.body.constitution;
                thisChar.intelligence = req.body.intelligence;
                thisChar.wisdom = req.body.wisdom;
                thisChar.charisma = req.body.charisma;
                thisChar.abilities = req.body.abilities;
                thisChar.weapons = req.body.weapons;
                thisChar.equipment = req.body.equipment;
                thisChar.traits = req.body.traits;
                thisChar.armors_proficiency = req.body.armors_proficiency;
                thisChar.weapons_proficiency = req.body.weapons_proficiency;
                thisChar.tools_proficiency = req.body.tools_proficiency;
                thisChar.languages = req.body.languages;
                thisChar.spells = req.body.spells;
                user.save(function(err, userUpdated) {
                    if (err) {
                        res
                            .status(500)
                            .json(err);
                    } else {
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });

};