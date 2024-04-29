import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/upload";

import SessionController from "./controllers/SessionController";
import PlaceController from "./controllers/PlaceController";

const routes = new Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);

routes.post('/places', upload.single('thumbnail') ,PlaceController.store);
routes.get('/places', PlaceController.index);
routes.put('/places/:place_id', upload.single('thumbnail'), PlaceController.update);
routes.delete('/places', PlaceController.destroy);

export default routes;