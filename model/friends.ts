import * as faker from 'faker';

export var friends = [];
var name;
var score;
var photo;
var id;

for (var i = 0; i < 10; i++) {
    name = faker.name.findName();
    score = faker.random.number(1000);
    photo = faker.image.avatar();
    id = i;

    friends[i] = {
        name: name,
        score: score,
        photo: photo,
        id: id
    };
}

export function getUser(id) {
    for (var i = 0; i < 10; i++) {
        if (friends[i].id == id){
            return friends[i];
        }
    }
    return null;
}
