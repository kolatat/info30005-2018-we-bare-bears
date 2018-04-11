import * as express from 'express';

const router = express.Router();

/* GET Home page. */
router.get('/', function(req, res, next) {
    res.render('coming_soon');
});

/* GET World page. */
router.get('/world/', function(req, res, next) {
    res.render('world');
});

/* GET FAQ page. */
router.get('/faq/', function(req, res, next) {
    res.render('faq');
});

/* GET Leaderboard page. */
router.get('/leaderboard/', function(req, res, next) {
    res.render('leaderboard');
});

/* GET Milestones page. */
router.get('/milestones/', function(req, res, next) {
    res.render('milestones');
});

export default router;
