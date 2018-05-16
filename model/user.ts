export interface User {
    fbId: string;
    friends: UserFriends;
    name: string;
    email: string;
    wallet: number;
    inventory: UserItem[];
}

interface UserFriends {
    list: string[];
    reqSent: string[];
    reqReceived: string[];
}

interface UserItem {
    name: string;
    quantity: number;
}