import * as faker from 'faker';

export var friends = [];
var name;
var score;
var photo;

for (var i = 0; i < 10; i++) {
    name = faker.name.findName();
    score = faker.random.number(1000);
    photo = faker.image.avatar();

    friends[i] = {
        name: name,
        score: score,
        photo: photo
    };
}
