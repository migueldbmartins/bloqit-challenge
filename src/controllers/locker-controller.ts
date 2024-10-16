import { Request, Response } from 'express';
import { NotFoundError, OccupancyError } from '../common/errors';
import { LockerService } from '../services/locker-service';
import { Service } from 'typedi';

@Service()
export class LockerController {
  constructor(private lockerService: LockerService) {}

  // GET /lockers/:id
  public getLocker = (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const locker = this.lockerService.getLocker(id);
      response.status(200).send(locker);
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(404).send({
          code: 'Not found',
          message: error.message,
        });
      }
      response.status(500);
    }
  };

  // POST /lockers/:id/open
  public openLocker = (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const locker = this.lockerService.openLocker(id);
      response.status(200).send(locker);
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(404).send({
          code: 'Not found',
          message: error.message,
        });
      }

      if (error instanceof OccupancyError) {
        response.status(400).send({
          code: 'Bad request',
          message: error.message,
        });
      }

      response.status(500);
    }
  };

  // POST /lockers/:id/close
  public closeLocker = (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const locker = this.lockerService.closeLocker(id);
      response.status(200).send(locker);
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(404).send({
          code: 'Not found',
          message: error.message,
        });
      }

      response.status(500);
    }
  };
}
