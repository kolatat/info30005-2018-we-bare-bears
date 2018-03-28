import * as express from 'express';
import * as debug from 'debug';
import userRouter from './routes/usersRoutes';
import indexRouter from './routes/indexRoutes';

const Log = debug('wbb:main');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.set('view engine', 'ejs');

// app.use('/', (req, res, next) => {
//     Log(`${req.hostname}[${req.ip}] ${req.method} ${req.url}`);
//     next();
// });

app.use('/', indexRouter);
app.use('/users', userRouter);


app.use((req, res) => {
    res.status(404).send(JSON.stringify({
        error: new Error('Not found')
    }));
})

app.listen(port, function () {
    Log(`express listening on port ${port}`);
});
