import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import botRouter from "./bot";
import commandsRouter from "./commands";
import bypassRouter from "./bypass";
import statusRouter from "./status";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(botRouter);
router.use(commandsRouter);
router.use(bypassRouter);
router.use(statusRouter);

export default router;
