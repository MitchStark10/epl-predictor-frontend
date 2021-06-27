const bcrypt = require('bcrypt-nodejs');

function PasswordHasher() {}

PasswordHasher.prototype.hashPassword = (plainPassword) => {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainPassword, salt);
};

module.exports = () => {
    return new PasswordHasher();
};