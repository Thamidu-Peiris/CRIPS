import express from "express";
import { addGrowerPlant } from "../controllers/GrowerHandler/plantController.js";

const router = express.Router();

router.post("/addGrowerPlant", addGrowerPlant);

export default router;
