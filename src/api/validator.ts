import { param, body } from 'express-validator';

export default {
  id: [param('id').exists()],
  newDrone: [
    // body('model')
    //   .exists()
    //   .trim()
    //   .isIn(['Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight']),
    // param('weightLimit').exists(),
    // body('state')
    //   .exists()
    //   .trim()
    //   .isIn([
    //     'IDLE',
    //     'LOADING',
    //     'LOADED',
    //     'DELIVERING',
    //     'DELIVERED',
    //     'RETURNING',
    //   ]),
  ],
  newMed: [
    // body('name')
    //   .exists()
    //   .matches(/[a-zA-Z]+[0-9]+_-/i),
    param('weight').exists().isInt(),
    // body('code')
    //   .exists()
    //   .matches(/[A-Z]+[0-9]+_/i),
    // body('image').exists(),
    // param('id').exists(),
  ],
};
