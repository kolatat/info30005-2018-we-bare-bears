import * as express from 'express';
import * as debug from 'debug';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as fs from 'fs';
import indexRouter from './routes/indexRoutes';
import questionRouter from './routes/questionsRoutes';
import {isNullOrUndefined} from "util";
import {Facebook, FacebookApiException} from 'fb';
import * as model from "./model";
import * as usersRoutes from './routes/usersRoutes'
import {User} from './model/user'

require('dotenv').config();

const Log = debug('wbb:main');
Log("Welcome to We Bare Bears - Recyclabears! v1.0.0");
const routerLog = debug('wbb:router');

const app = express();
const port = process.env.PORT || 3000;
const apiRouter = express.Router();

const fb = new Facebook({
    appId: 590373231339046,
    appSecret: process.env.FB_APP_SECRET
});

const store = new model.MongoStore(process.env.MONGO_HOST, process.env.MONGO_PREFIX);
store.connect().then(() => {
    Log('mongodb connected');
});

//Testing -- To be Checked
// these statements config express to use these modules, and only need to be run once
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Testing -- To be Checked


Log("preparing web server...");
routerLog("setting up routes...");
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    routerLog(req.method + ' ' + req.url);
    next();
})
app.use('/', indexRouter);
app.use('/api', apiRouter);

interface WbbRequest extends express.Request {
    user: User
}

// default fields: id, first_name, last_name, name, name_format, picture, short_name
function fbAuth() {
    return function (req: WbbRequest, res, next) {
        var auth: string = req.header('authorization');
        if (isNullOrUndefined(auth) || !auth.startsWith('Facebook ')) {
            res.status(401).send({
                error: 'bad authentication'
            });
            return;
        }
        var accessToken = auth.substr(9);
        fb.api('me', {fields: 'id,name,email', access_token: accessToken}).then(res => {
            store.collection('users').findAndModify({
                fbId: res.id
            }, null, {
                $setOnInsert: {
                    fbId: res.id,
                    name: res.name,
                    email: res.email,
                    friends: {
                        list: [],
                        reqSent: [],
                        reqReceived: []
                    },
                    questions: [],
                    wallet: 10,
                    home: []
                },
                $currentDate: {
                    'lastAccessed.time': {$type: 'date'}
                },
                $set: {
                    'lastAccessed.ip': req.ip
                }
            }, {
                new: true,
                upsert: true
            }).then(res2 => {
                req.user = res2.value;
                next();
            })
        }).catch(err => {
            res.status(500).send({
                error: "Facebook server error",
                detail: err
            })
        });
    }
}

apiRouter.use(bodyParser.json());
apiRouter.use(fbAuth());
apiRouter.use('/questions', questionRouter);
apiRouter.use('/users', usersRoutes.createRouter(store));
apiRouter.use((req, res) => {
    var err = new Error('Not found');
    routerLog(err);
    res.status(404).send(JSON.stringify({
        error: err,
        message: "Not found"
    }));
})

app.use((req, res) => {
    res.render('error/404', {
        url: req.originalUrl
    });
});

if (process.env.SELF_SIGNED_SSL == 'True') {
    https.createServer({
        key: fs.readFileSync('ssl/privkey.pem'),
        cert: fs.readFileSync('ssl/cert.pem')
    }, app).listen(port);
    Log(`recyclabears listening on SSL! port ${port}`);
} else {
    app.listen(port, function () {
        Log(`recyclabears listening on port ${port}`);
    });
}