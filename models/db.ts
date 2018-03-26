import * as faker from 'faker';

export var people = [];
var randomName;
var randomEmail;
var randomCity;
var randomCompany;

for (var i = 0; i < 10; i++) {
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
