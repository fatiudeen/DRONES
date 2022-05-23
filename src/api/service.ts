import { LowSync, JSONFileSync } from 'lowdb';
import _ from 'lodash';
import { DroneInterface, Medication, LogData, Data, Log } from './interface';

class LowWithLodash<T> extends LowSync<T> {
  chain: _.ExpChain<this['data']> = _.chain(this).get('data');
}

const adapter = new JSONFileSync<Data>('./../../db.json');
const db = new LowWithLodash(adapter);
// db.data?.drones.push({} as DroneInterface);
let dr = {
  serialNumber: 'asdfghklpoiuytrewsxcvbn',
  model: 'Lightweight',
  weightLimit: 200,
  batteryCapacity: 150,
  state: 'IDLE',
  medication: [],
} as DroneInterface;

db.data = db.data || { drones: [dr], logs: [] };
db.write();

export default {
  async newDrone(data: DroneInterface) {
    try {
      console.log(data);
      const doc = db.chain.get('drones').value();
      console.log(doc);

      if (doc.length >= 10)
        throw new Error('Maximum number of drones reached!');
      db.chain.get('drones').push(data);
      db.write();
      db.read();
      const doc1 = db.chain.get('drones').value();
      console.log(doc1);
      const result = db.chain
        .get('drones')
        .find({ serialNumber: data.serialNumber })
        .value();
      console.log(result);

      return result;
    } catch (error) {
      throw error;
    }
  },
  async newMedication(
    data: Medication,
    serialNumber: DroneInterface['serialNumber'],
  ) {
    try {
      const drone = db.chain.get('drones').find({ serialNumber }).value();
      if (drone.batteryCapacity < 25)
        throw new Error('battery is less than 25%');

      let weight = drone.medication?.reduce((sum, val) => {
        return (sum += val.weight);
      }, 0);
      weight ? null : (weight = 0);

      if (weight + data.weight > drone.weightLimit)
        throw new Error('weight limit exceded');
      db.chain
        .get('drones')
        .find({ serialNumber })
        .assign({ medication: data });
      db.write();
      const result = db.chain
        .get('drones')
        .find({ serialNumber: serialNumber })
        .value();
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getLoadableDrones() {
    const result = db.chain.get('drones').find({ state: 'IDLE' }).value();
    return result;
  },
  async getMedication(serialNumber: DroneInterface['serialNumber']) {
    try {
      const result = db.chain.get('drones').find({ serialNumber }).value();
      return result.medication;
    } catch (error) {
      throw error;
    }
  },
  async getBattery(serialNumber: DroneInterface['serialNumber']) {
    try {
      const result = db.chain.get('drones').find({ serialNumber }).value();
      return result.batteryCapacity;
    } catch (error) {
      throw error;
    }
  },
  async deleteDrone(serialNumber: DroneInterface['serialNumber']) {
    const val = db.chain.get('drones').find({ serialNumber }).value();
    if (!val) throw new Error('invalid drone');

    db.chain.get('drones').remove({ serialNumber });
    db.write;
    const result = db.chain.get('drones').find({ serialNumber }).value();
    return result.medication;
  },
  async getAllDrone() {
    const result = db.chain.get('drones').value();
    return result;
  },
  async changeState(
    newState: DroneInterface['state'],
    id: DroneInterface['serialNumber'],
  ) {
    db.chain
      .get('drones')
      .find({ serialNumber: id })
      .assign({ state: newState });
    db.write();
    const result = db.chain.get('drones').find({ serialNumber: id }).value();
    return result.medication;
  },
  async log(
    state: DroneInterface['state'],
    serialNumber: DroneInterface['serialNumber'],
  ) {
    const date = Date.now();
    const data: Log = {
      status: state,
      time: new Date(date * 1000),
      serialnumber: serialNumber,
    };
    const result = db.chain.get('logs').push(data);
    db.write();
    return result;
  },
  async getLogs() {
    const result = db.chain.get('logs').value();
    return result;
  },
  async clearMeds(id: DroneInterface['serialNumber']): Promise<void> {
    db.chain
      .get('drones')
      .find({ serialNumber: id })
      .assign({
        medication: undefined,
        batteryCapacity: (await this.getBattery(id)) - 25,
      });
    db.write();
  },
};
