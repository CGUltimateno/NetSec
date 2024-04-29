module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING
        },
        FirstName: {
            type: Sequelize.STRING
        },
        LastName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });

    return User;
};