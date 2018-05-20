import * as mongo from 'mongodb'

export interface World {
    _id: mongo.ObjectID;
    owner: number;
    items: WorldItem[];
    rubbish: WorldRubbish[];
    lastDump: Date;
    genesis: Date;
};

interface Item {
    name: string;
    image: string;  // path to image
    x: number;
    y: number;
};

export interface WorldItem extends Item {
};

export interface WorldRubbish extends Item {
};