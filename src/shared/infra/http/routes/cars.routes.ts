import { Router } from 'express';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailabeCars/ListAvailableCarsController';
import { ensureAdmin } from '@shared/infra/http/middleware/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middleware/ensureAuthenticated';

const carsRoutes = Router();

const createCarsController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarsController.handle,
);

carsRoutes.get('/available', listAvailableCarsController.handle);

export { carsRoutes };
