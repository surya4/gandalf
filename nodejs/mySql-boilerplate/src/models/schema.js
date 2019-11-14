var Sequelize = require('sequelize');
var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('userTables', {
        name: DataTypes.STRING,
        username: { type: DataTypes.STRING, unique: true },
        email: { type: DataTypes.STRING, unique: true, allowNull: false, },
        password: { type: DataTypes.STRING },
        passwordResetToken: DataTypes.VIRTUAL,
        passwordResetExpires: DataTypes.VIRTUAL,
        gender: DataTypes.STRING,
        location: DataTypes.TEXT,
        website: DataTypes.STRING,
        picture: DataTypes.STRING,
        facebook: DataTypes.STRING,
        twitter: DataTypes.STRING,
        google: DataTypes.STRING,
        github: DataTypes.STRING,
        vk: DataTypes.STRING
    }, {

        getterMethods: {
            gravatar: function() {
                if (!this.get('email')) {
                    return 'https://gravatar.com/avatar/?s=200&d=retro';
                }
                var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
                return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
            }
        }
    });
    return User;
};