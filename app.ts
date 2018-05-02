import * as express from 'express';
import * as debug from 'debug';
import userRouter from './routes/usersRoutes';
import indexRouter from './routes/indexRoutes';

require('dotenv').config()

const Log = debug('wbb:main');

const MongoClient = require('mongodb').MongoClient

Log('connection string: '+process.env.MONGO_URI)
MongoClient.connect(process.env.MONGO_HOST, (err,client)=>{
    if(err){
        Log(err.message)
    } else {
        const db = client.db(process.env.MONGO_DB)
        var questions = db.collection(process.env.MONGO_PREFIX+'questions')
        questions.find({}).toArray((err,docs)=>{
            if(err){
                Log(err.message)
            } else {
                Log(docs)
            }
        })
    }
})

const app = express();
const port = process.env.PORT || 3000;
const apiRouter = express.Router();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/', indexRouter);
app.use('/api', apiRouter);

apiRouter.use('/users', userRouter);
apiRouter.use((req, res) => {
    res.status(404).send(JSON.stringify({
        error: new Error('Not found'),
        message: "Not found"
    }));
})

app.use((req,res)=>{
    res.render('error/404', {
        url: req.originalUrl
    });
});

app.listen(port, function () {
    Log(`express listening on port ${port}`);
});
