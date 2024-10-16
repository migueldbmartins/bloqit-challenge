import { Request, Response } from 'express';
import { Service } from 'typedi';
import { NotFoundError } from '../common/errors';
import { BloqService } from '../services/bloq-service';
import { LockerService } from '../services/locker-service';

@Service()
export class BloqController {
  constructor(
    private bloqService: BloqService,
    private lockerService: LockerService
  ) {}

  // GET /bloqs
  public listBloqs = (request: Request, response: Response) => {
    const bloqs = this.bloqService.listBloqs();
    response.status(200).send(bloqs);
  };

  // GET /bloqs/:id
  public getBloq = (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const bloq = this.bloqService.getBloq(id);
      response.status(200).send(bloq);
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

  // GET /bloqs/:id/lockers?occupancy=false
  public listLockersByBloqId = (request: Request, response: Response) => {
    const { id } = request.params;
    const { occupancy } = request.query;

    const lockers = this.lockerService.listLockersByBloqId(
      id,
      typeof occupancy === 'string' ? JSON.parse(occupancy) : occupancy
    );

    response.status(200).send(lockers);
  };
}
