export interface World {
    owner: number;
    items: WorldItem[];
    rubbish: WorldRubbish[];
    lastDump: Date;
};

export interface WorldItem {
    name: string;
    x: number;
    y: number;
};

export interface WorldRubbish {
    name: string;
    x: number;
    y: number;
}