var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jsonwebtoken');


module.exports.usersGetOne = function (req, res) {

    var id = req.params.userId;

    console.log('GET userId', id);

    Users
        .findById(id)
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: doc
            };
            if (err) {
                console.log("Error finding user");
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log("UserId not found in database", id);
                response.status = 404;
                response.message = {
                    "message": "User ID not found " + id
                };
            }

            res
                .status(response.status)
                .json(response.message);
        });

};


// SIGN UP

module.exports.register = function(req, res) {

    console.log('registering user');

    var email = req.body.email;
    var password = req.body.password;

    Users.create({
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(16))
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        } else {
            console.log('user created', user);
            res.status(201).json(user);
        }
    });
};

// LOGIN

module.exports.login = function(req, res) {
    console.log('logging in user');
    var email = req.body.email;
    var password = req.body.password;

    Users
        .findOne({email: email})
        .exec(function(err, user) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                console.log('User found', user);
                var token = jwt.sign({ email: user.email }, 's3cr3t', { expiresIn: 10000 });
                res.status(200).json({success: true, token: token, id: user._id});
            } else {
                res.status(401).json('Unauthorized');
            }
        }
    });
};