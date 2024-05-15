import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload";

import SessionController from "./controllers/SessionController";
import PlaceController from "./controllers/PlaceController";
import DashboardController from './controllers/DashboardController';
import ReserveController from "./controllers/ReserveController";

const routes = new Router();
const upload = multer(uploadConfig);


routes.post('/places', upload.single('thumbnail') ,PlaceController.store);

routes.get('/places', PlaceController.index);
routes.get('/placefind', PlaceController.id_find);
routes.put('/places/:place_id', upload.single('thumbnail'), PlaceController.update);
routes.delete('/places', PlaceController.destroy);

// routes.post('/sessions', upload.single('avatar'), SessionController.store);
routes.post('/sessions', SessionController.store);

routes.get('/dashboard', DashboardController.show);

routes.post('/places/:place_id/reserve', ReserveController.store);
routes.get('/reserves', ReserveController.index);
routes.delete('/reserves/cancel', ReserveController.destroy);

export default routes;