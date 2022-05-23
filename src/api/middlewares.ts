import multer from 'multer';
import path from 'path';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from './Error';
import service from './service';
import { Medication } from './interface';
import { nanoid } from 'nanoid';
import helper from './helper';

const uploadFolder = './upload';

export default {
  upload: multer({
    storage: multer.diskStorage({
      destination(_req, _file, cb) {
        cb(null, uploadFolder);
      },
      filename(_req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(
          // eslint-disable-next-line comma-dangle
          Math.random() * 1e9,
        )}-${path.extname(file.originalname)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
      },
    }),
  }),
  error404: (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not Found',
    });
  },
  errorHandler: (
    err: ErrorResponse | Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    _next: NextFunction,
  ) => {
    const error = { ...err };

    error.message = err.message;

    let statusCode: number;
    if ('statusCode' in error) {
      statusCode = error.statusCode;
    } else {
      statusCode = 500;
    }

    res.status(statusCode).json({
      sucess: false,
      message: error.message || 'Server Error',
      error,
    });
  },
  validator: (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array();
      throw new ErrorResponse('user input validation error', 400, error);
    }
    next();
  },
  periodicTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drones = await service.getAllDrone();

      if (drones === [] || !drones) return next();
      const idleDrones = drones.concat().reduce((sum: number, val): number => {
        if (val.state === 'IDLE') return sum + 1;
        else return sum + 0;
      }, 0);
      if (idleDrones < 3) return next();
      let randomDrone;
      for (let index = 0; index < 11; ) {
        if (drones[index] === undefined) {
          randomDrone = drones[Math.floor(Math.random() * 10)];
          index++;
        } else if (index > 10) {
          return next();
        } else {
          break;
        }
      }
      if (!randomDrone) return next();
      // const randomDrone = drones[Math.floor(Math.random() * 10)];
      const data: Medication = {
        name: nanoid(20),
        weight:
          Math.floor(Math.random() * (randomDrone.weightLimit / 100)) * 100,
        code: nanoid(10),
        image: 'https://picsum.photos/200',
      };
      await service.newMedication(data, randomDrone.serialNumber);
      helper.task(randomDrone);
      next();
    } catch (error) {
      next(error);
    }
  },
};

function random() {
  return Math.floor(Math.random() * 10);
}
