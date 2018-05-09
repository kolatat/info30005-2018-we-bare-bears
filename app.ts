import * as express from 'express';
import * as debug from 'debug';
import * as bodyParser from 'body-parser';

require('dotenv').config();

import indexRouter from './routes/indexRoutes';
import questionRouter from './routes/questionsRoutes';

const Log = debug('wbb:main');
Log("Welcome to We Bare Bears - Recyclabears! v1.0.0");
const routerLog = debug('wbb:router');

const app = express();
const port = process.env.PORT || 3000;
const apiRouter = express.Router();


//Testing -- To be Checked
// these statements config express to use these modules, and only need to be run once
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

apiRouter.use(bodyParser.json());
apiRouter.use('/questions', questionRouter);
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

app.listen(port, function () {
    Log(`recyclabears listening on port ${port}`);
});
