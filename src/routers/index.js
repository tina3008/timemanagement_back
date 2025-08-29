import { Router } from 'express';
import tasksRouter from './tasks.js';
import authRouter from './auth.js';
import resursesRouter from './resurses.js';
import notesRouter from './notes.js';

const router = Router();

router.use('/tasks', tasksRouter);
router.use('/auth', authRouter);
router.use('/note', notesRouter);
router.use('/resurse', resursesRouter);

export default router;
