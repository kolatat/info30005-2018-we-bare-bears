const users = require('../models/db');

module.exports.sayHello = function(req,res){
    res.send("Hello World!!!");
};

module.exports.sayGoodbye = function(req,res){
    res.send("Goodbye world!");
};

module.exports.fetchUsers = function(req,res){
    //var users = users.getAllUsers;
    //var numUsers = users.length;
    res.render('users', {users: users});
};

module.exports.fetchUser = function (req, res) {
    const userId = req.params.id;
    res.render('single_user', {user: users[userId -1], userId: userId});
}