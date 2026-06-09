import { Router } from 'express';
import { search } from '../controllers/search.js';

const searchRouter = Router();
searchRouter.get('/', search);
export default searchRouter;
