import * as express from "express";
import {isNullOrUndefined} from "util";
import {User} from "./model/user";
import {MongoStore} from "./model";
import {Collection} from "mongodb";
import * as Q from 'q'

require('dotenv').config();

export function sendError(res: express.Response, msg: string, err?: Error, code: number = 500) {
    var errObj: any = {
        error: msg
    }
    if (!isNullOrUndefined(err)) {
        errObj.detail = msg;
        if (err instanceof WbbError) {
            code = err.errorCode;
        }
    }
    res.status(code).send(errObj);
}

export interface WbbRequest extends express.Request {
    user: User
}

export interface WbbResponse extends express.Response {
    sendPromise(promise: PromiseLike<any>): any
}

export class WbbError extends Error {
    public errorCode: number;

    public constructor(detail: string, errCode: number = 500) {
        super(detail);
        this.errorCode = errCode;
    }
}

interface RouteHandler {
    (req: WbbRequest, res: WbbResponse, next: express.NextFunction): any
}

export class WbbRouter {
    protected router: express.Router;
    protected store: MongoStore;
    public config: any;

    public constructor(store: MongoStore, router?: express.Router) {
        this.router = isNullOrUndefined(router) ? express.Router() : router;
        this.store = store;
    }

    public getRouter(): express.Router {
        return this.router;
    }

    public mongo(collectionName: string): Collection {
        return this.store.collection(collectionName);
    }

    protected wrap(handler: RouteHandler): express.RequestHandler {
        return function (req: express.Request, res: express.Response, next: express.NextFunction) {
            // request is modified to conform to Wbb elsewhere
            (<WbbResponse> res).sendPromise = function (promise: PromiseLike<any>) {
                Q(promise).then(val => {
                    res.send(val);
                }).catch(err => {
                    sendError(res, "Generic Error", err);
                });
            };
            handler(<WbbRequest> req, <WbbResponse> res, next);
        }
    }

    public get(path: string, handler: RouteHandler) {
        this.router.get(path, this.wrap(handler));
    }

    public post(path: string, handler: RouteHandler) {
        this.router.post(path, this.wrap(handler));
    }

    public put(path: string, handler: RouteHandler) {
        this.router.put(path, this.wrap(handler));
    }

    public delete(path: string, handler: RouteHandler) {
        this.router.delete(path, this.wrap(handler));
    }

}