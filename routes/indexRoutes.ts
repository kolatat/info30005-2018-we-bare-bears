import * as express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('coming_soon');
});

/* GET world page. */
router.get('/world/', function(req, res, next) {
    res.render('world');
});

/* GET faw page. */
router.get('/faq/', function(req, res, next) {
    res.render('faq');
});

export default router;
