import * as express from 'express'

const router = express.Router();

// No landing page atm, redirect to login page
router.get('/', (req, res)=> {
    res.redirect('/login');
});

export default router;
