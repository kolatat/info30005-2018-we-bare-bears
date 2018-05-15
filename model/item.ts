export interface Item {
    display: string;
    name: string;
    type: string;
    price: number;
    image: string;
    description: string
};

export interface ShopItem extends Item {
}

export interface BinItem extends Item {
    binType: string
}

/*
{
        name: "Ice Bear",
        type: "animal",
        price: 1000,
        image: "/assets/images/items/ice_bear.png",
        description: "The strongest and youngest bear."
    }
 */