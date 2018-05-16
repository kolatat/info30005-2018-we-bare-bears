import * as mongo from 'mongodb'

export interface World {
    _id: mongo.ObjectID;
    owner: number;
    items: WorldItem[];
    rubbish: WorldRubbish[];
    lastDump: Date;
};

interface Item {
    name: string;
    x: number;
    y: number;
};

export interface WorldItem extends Item {
};

export interface WorldRubbish extends Item {
};