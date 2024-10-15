import { NotFoundError, OccupancyError } from '../common/errors';
import { Locker, LockerStatus } from '../model/locker';
import lockersData from '../../data/lockers.json';
import { Service } from 'typedi';

@Service()
export class LockerService {
  private lockers: Locker[] = lockersData as Locker[];

  constructor() {}

  public getLocker(id: string): Locker {
    const locker = this.lockers.find((locker) => locker.id === id);
    if (!locker) throw new NotFoundError('Locker does not exist');

    return locker;
  }

  public openLocker(id: string): Locker {
    const locker = this.lockers.find((locker) => locker.id === id);
    if (!locker) throw new NotFoundError('Locker does not exist');
    if (locker.isOccupied) throw new OccupancyError('Locker is occupied');

    this.updateLocker(id, { status: LockerStatus.OPEN });
    return locker;
  }

  public closeLocker(id: string): Locker {
    const locker = this.lockers.find((locker) => locker.id === id);
    if (!locker) throw new NotFoundError('Locker does not exist');

    this.updateLocker(id, { status: LockerStatus.CLOSED });
    return locker;
  }

  public listLockersByBloqId(bloqId: string, occupancy?: boolean): Locker[] {
    const lockers = this.lockers.filter(
      (locker) =>
        locker.bloqId === bloqId &&
        (occupancy === undefined || locker.isOccupied === occupancy)
    );

    return lockers;
  }

  public updateLocker(
    id: string,
    update: Partial<Pick<Locker, 'isOccupied' | 'status'>>
  ): Locker {
    const locker = this.getLocker(id);
    if (update.isOccupied !== undefined) locker.isOccupied = update.isOccupied;
    if (update.status) locker.status = update.status;

    return locker;
  }
}
