import * as express from 'express';

const router = express.Router();

/* GET Home page. */
router.get('/', function(req, res, next) {
    res.render('coming_soon');
});

/* GET New Play page. */
router.get('/new/play/', function(req, res, next) {
    res.render('play/');
});

router.get('/new/play_mult', function(req, res, next){
   res.render('play/mult_choice', req.query);
});

router.get('/new/play_blanks', function(req, res, next){
    res.render('play/blanks', req.query);
});

router.get('/new/play_video', function(req, res, next){
    res.render('play/video', req.query);
});


/**************************************************/
/* Old Stuff Below */
/* GET World page. */
router.get('/old/world/', function(req, res, next) {
    res.render('world');
});

/* GET FAQ page. */
router.get('/old/faq/', function(req, res, next) {
    res.render('faq');
});

/* GET Leaderboard page. */
router.get('/old/leaderboard/', function(req, res, next) {
    res.render('leaderboard');
});

/* GET Milestones page. */
router.get('/old/milestones/', function(req, res, next) {
    res.render('milestones');
});

/* GET Video page. */
router.get('/old/vid/', function(req, res, next) {
    res.render('vid');
});

/* GET Quiz page. */
router.get('/old/quiz/', function(req, res, next) {
    res.render('quiz');
});

/* GET Action page. */
router.get('/old/act/', function(req, res, next) {
    res.render('act');
});

export default router;
