const faker = require('faker');

var people = [];
var randomName;
var randomEmail;
var randomCity;
var randomCompany;

for(i=0; i<10; i++){
    randomName = faker.name.findName();
    randomEmail = faker.internet.email();
    randomCity = faker.address.city();
    randomCompany = faker.company.companyName();

    people[i] = {
        name: randomName,
        email: randomEmail,
        city: randomCity,
        company: randomCompany
    };
}

module.exports = people;

/**
module.exports = {

    getAllUsers: people,

    getUser: function(i) {
        return people[i];
    }
}
*/