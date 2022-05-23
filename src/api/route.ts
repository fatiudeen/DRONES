import { Router } from 'express';
import controller from './controller';
import middlewares from './middlewares';
import validator from './validator';

const router = Router();

router.get(
  '/new',
  validator.newDrone,
  middlewares.validator,
  controller.newDrone,
);
router.get(
  '/med',
  validator.newMed,
  middlewares.validator,
  // middlewares.upload.single('image'),
  controller.newMedication,
);
router.get(
  '/battery/:id',
  validator.id,
  middlewares.validator,
  controller.getBattery,
);
router.get('/', controller.getLoadableDrones);
router.get(
  '/:id',
  validator.id,
  middlewares.validator,
  controller.getMedication,
);
router.get(
  '/delete/:id',
  validator.id,
  middlewares.validator,
  controller.delete,
);
router.get('/log', controller.getLogs);

export default router;
