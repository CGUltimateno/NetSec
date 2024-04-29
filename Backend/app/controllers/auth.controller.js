const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");

const SECRET_KEY = "aelwfhlaef";

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        FirstName: CryptoJS.AES.encrypt(JSON.stringify(req.body.FirstName), SECRET_KEY).toString(),
        LastName: CryptoJS.AES.encrypt(JSON.stringify(req.body.LastName), SECRET_KEY).toString(),
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({
                            message: "User was registered successfully!",
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                FirstName: user.FirstName,
                                LastName: user.LastName,
                            }
                        });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({
                        message: "User was registered successfully!",
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            FirstName: user.FirstName,
                            LastName: user.LastName,
                        }
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};


exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id },
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400, // 24 hours
                });

            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    roles: authorities,
                    accessToken: token
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};