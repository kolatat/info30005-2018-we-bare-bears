import * as express from 'express';
import * as controller from '../controllers/usersController';

const router = express.Router();

//router.get('/', controller.sayHello);
//router.get('/bye', controller.sayGoodbye);
router.get('/', controller.fetchUsers);
router.get('/:id', controller.fetchUser);

export default router;
