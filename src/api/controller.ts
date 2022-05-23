import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import service from './service';
import { DroneInterface, Medication } from './interface';
import { nanoid } from 'nanoid';
import helper from './helper';

export default {
  newDrone: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const random = Math.floor(Math.random() * 4);
      const model: DroneInterface['model'][] = [
        'Lightweight',
        'Middleweight',
        'Cruiserweight',
        'Heavyweight',
      ];
      const data: DroneInterface = {
        serialNumber: nanoid(20),
        batteryCapacity: 100,
        weightLimit: (random + 2) * 100,
        state: 'IDLE',
        model: model[random],
        medication: [],
      };
      const result = await service.newDrone(data);
      if (!result) throw Error('server error.. try again');
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
  newMedication: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const data: Medication = {
        name: nanoid(20),
        weight: parseInt(req.params.weight),
        code: nanoid(10),
        image: req.file?.path ? req.file?.path : 'https://picsum.photos/200',
      };
      const result = await service.newMedication(data, id);
      if (!result) throw Error('server error.. try again');
      helper.task(result);
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
  getLoadableDrones: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await service.getLoadableDrones();
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
  getMedication: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await service.getMedication(id);
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
  getBattery: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await service.getBattery(id);
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await service.deleteDrone(id);
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getAllDrone();
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
  getLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getLogs();
      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  },
};
