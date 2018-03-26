import * as express from 'express';
import * as debug from 'debug';
import router from './routes/usersRoutes';

const Log = debug('wbb:main');

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use('/', (req, res, next) => {
    Log(`${req.hostname}[${req.ip}] ${req.method} ${req.url}`);
    next();
});
app.use('/users', router);

app.use((req, res) => {
    res.status(404).send(JSON.stringify({
        error: new Error('Not found')
    }));
})

app.listen(port, function () {
    Log(`express listening on port ${port}`);
});
