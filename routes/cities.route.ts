import {Router} from "express";
import citiesController from "../controllers/cities.controller.js";

const citiesRouter = Router();

citiesRouter.get("/cities/search", citiesController.searchCities)

export default citiesRouter