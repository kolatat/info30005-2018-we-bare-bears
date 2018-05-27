import * as debug from 'debug';
import {sendError, WbbRouter} from "../utils";
import {Item, ShopItem, BinItem} from "../model/item";
import {User} from "../model/user";
import {isNullOrUndefined} from "util";

const Log = debug('wbb:model:items');

export function initRouter(router: WbbRouter): WbbRouter {

    function getItemByName(name): Promise<Item> {
        return new Promise((resolve, reject) => {
           router.mongo('items').findOne({
               name: name
           }, (err, dat) => {
               if (err) {
                   Log(err);
                   reject(err);
               } else {
                   Log(dat);
                   resolve(dat);
               }
           });
        });
    }


    router.get('/shop', (req, res) => {
        res.sendPromise(router.mongo('items').find(
            {}).toArray().then(doc => {
                // Returning an object (?) that contains an array of all items in db
                return {docs: doc};
        }));
    });





    return router;
}