export interface DroneInterface {
  serialNumber: string;
  model: 'Lightweight' | 'Middleweight' | 'Cruiserweight' | 'Heavyweight';
  weightLimit: number;
  batteryCapacity: number;
  state:
    | 'IDLE'
    | 'LOADING'
    | 'LOADED'
    | 'DELIVERING'
    | 'DELIVERED'
    | 'RETURNING';
  medication?: Medication[];
  // eslint-disable-next-line semi
}

export type Medication = {
  name: string;
  weight: number;
  code: string;
  image: string;
};

export type Log = {
  status: DroneInterface['state'];
  time: Date;
  serialnumber: DroneInterface['serialNumber'];
};
export type Data = {
  drones: DroneInterface[];
  logs: Log[];
};

export type LogData = {
  logs: Log[];
};
