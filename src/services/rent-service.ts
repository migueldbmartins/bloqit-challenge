import { randomUUID } from 'crypto';
import rentsData from '../../data/rents.json';
import {
  BadRequestError,
  NotFoundError,
  OccupancyError,
} from '../common/errors';
import { Rent, RentSize, RentStatus } from '../model/rent';
import { LockerService } from './locker-service';
import { Service } from 'typedi';

@Service()
export class RentService {
  private rents: Rent[] = rentsData as Rent[];

  constructor(private lockerService: LockerService) {}

  public createRent(weight: number, size: RentSize): Rent {
    const rent: Rent = {
      id: randomUUID(),
      lockerId: null,
      weight,
      size,
      status: RentStatus.CREATED,
    };

    this.rents.push(rent);
    return rent;
  }

  public getRent(id: string): Rent {
    const rent = this.rents.find((rent) => rent.id === id);
    if (!rent) throw new NotFoundError('Rent does not exist');

    return rent;
  }

  public linkRentToLocker(rentId: string, lockerId: string): Rent {
    const rent = this.getRent(rentId);
    if (rent.lockerId) {
      throw new BadRequestError('Rent already linked');
    }

    const locker = this.lockerService.getLocker(lockerId);
    if (locker.isOccupied) throw new OccupancyError('Locker already occupied');

    const updatedRent = this.updateRent(rentId, {
      lockerId,
      status: RentStatus.WAITING_DROPOFF,
    });

    return updatedRent;
  }

  public dropoffRent(id: string): Rent {
    const rent = this.getRent(id);

    if (rent.status !== RentStatus.WAITING_DROPOFF) {
      throw new BadRequestError('Rent not available to dropoff');
    }

    this.updateRent(id, { status: RentStatus.WAITING_PICKUP });

    try {
      this.lockerService.updateLocker(rent.lockerId as string, {
        isOccupied: true,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new BadRequestError('Rent with invalid locker');
      }
      throw error;
    }

    return rent;
  }

  public pickupRent(id: string): Rent {
    const rent = this.getRent(id);

    if (rent.status !== RentStatus.WAITING_PICKUP) {
      throw new BadRequestError('Rent not available to pickup');
    }

    this.updateRent(id, { status: RentStatus.DELIVERED });

    try {
      this.lockerService.updateLocker(rent.lockerId as string, {
        isOccupied: false,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new BadRequestError('Rent with invalid locker');
      }
      throw error;
    }

    return rent;
  }

  public updateRent(
    id: string,
    update: Partial<Pick<Rent, 'lockerId' | 'status'>>
  ): Rent {
    const { lockerId, status } = update;
    const rent = this.getRent(id);

    if (status) rent.status = status;
    if (lockerId) rent.lockerId = lockerId;

    return rent;
  }
}
