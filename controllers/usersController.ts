import {people as users} from '../models/db';
import * as express from 'express';

export function sayHello(req: express.Request, res: express.Response) {
    res.send("Hello World!!!");
};

export function sayGoodbye(req: express.Request, res: express.Response) {
    res.send("Goodbye world!");
};

export function fetchUsers(req: express.Request, res: express.Response) {
    //var users = users.getAllUsers;
    //var numUsers = users.length;
    res.render('users', {users: users});
};

export function fetchUser(req: express.Request, res: express.Response) {
    const userId = req.params.id;
    res.render('single_user', {user: users[userId - 1], userId: userId});
};
