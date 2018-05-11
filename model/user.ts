export class User {
    fbId: string;
    friends: UserFriends;
    name: string;
    email: string;
    wallet: number;
}

interface UserFriends {
    list: string[];
    reqSent: string[];
    reqReceived: string[];
}
