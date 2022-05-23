import { DroneInterface } from './interface';
import service from './service';

export default {
  task: (randomDrone: DroneInterface) => {
    setTimeout(async () => {
      await service.changeState('LOADING', randomDrone.serialNumber);
      await service.log('LOADING', randomDrone.serialNumber);
      setTimeout(async () => {
        await service.changeState('LOADED', randomDrone.serialNumber);
        await service.log('LOADED', randomDrone.serialNumber);

        setTimeout(async () => {
          await service.changeState('DELIVERING', randomDrone.serialNumber);
          await service.log('DELIVERING', randomDrone.serialNumber);

          setTimeout(async () => {
            await service.changeState('DELIVERED', randomDrone.serialNumber);
            await service.log('DELIVERED', randomDrone.serialNumber);

            setTimeout(async () => {
              await service.changeState('RETURNING', randomDrone.serialNumber);
              await service.log('RETURNING', randomDrone.serialNumber);

              setTimeout(async () => {
                await service.changeState('IDLE', randomDrone.serialNumber);
                await service.log('IDLE', randomDrone.serialNumber);
                await service.clearMeds(randomDrone.serialNumber);
              }, 1000 * 60 * random());
            }, 1000 * 60 * random());
          }, 1000 * 60 * random());
        }, 1000 * 60 * random());
      }, 1000 * 60 * random());
    }, 1000 * 60 * random());
  },
};
function random() {
  return Math.floor(Math.random() * 10);
}
