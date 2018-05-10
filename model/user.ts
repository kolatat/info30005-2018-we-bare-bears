export class User {
    fbId: string;
    friends: UserFriends;
    name:string;
    email:string
}

interface UserFriends {
    list: string[],
    reqSent: string[],
    reqReceived: string[]
}
