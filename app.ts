import * as express from 'express';
import * as debug from 'debug';
import * as bodyParser from 'body-parser';
import * as https from 'https';
import * as fs from 'fs';
import indexRouter from './routes/indexRoutes';
import * as questionRoutes from './routes/questionsRoutes';
import * as model from "./model";
import * as usersRoutes from './routes/usersRoutes'
import {sendError, WbbRouter} from './utils'
import {fbAuth} from "./facebook";

const Log = debug('wbb:main');
Log("Welcome to We Bare Bears - Recyclabears! v1.0.0");
const routerLog = debug('wbb:router');

const app = express();
const port = process.env.PORT || 3000;
const apiRouter = express.Router();


const store = new model.MongoStore(process.env.MONGO_HOST, process.env.MONGO_PREFIX);
var mongoStatus = store.connect();

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
app.get('/config/fbAppId', (_, res) => {
    res.send(process.env.FB_APP_ID);
})
app.use('/api', apiRouter);

apiRouter.use(bodyParser.json());
apiRouter.use(fbAuth(store));
apiRouter.use('/questions', questionRoutes.initRouter(new WbbRouter(store)).getRouter());
apiRouter.use('/users', usersRoutes.initRouter(new WbbRouter(store)).getRouter());
apiRouter.use((_, res) => {
    sendError(res, "Not Found", null, 404);
})

app.use((req, res) => {
    res.render('error/404', {
        url: req.originalUrl
    });
});

// init sequence
mongoStatus.then(() => {
    Log('MongoDB connected');

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
});

