import { Request, Response } from 'express';
import { z } from 'zod';
import {
  BadRequestError,
  NotFoundError,
  OccupancyError,
} from '../common/errors';
import { RentService } from '../services/rent-service';
import { RentSize } from '../model/rent';
import { Service } from 'typedi';

const createRentSchema = z.object({
  weight: z.number().positive('Weight must be a positive number'),
  size: z.enum([RentSize.XS, RentSize.S, RentSize.M, RentSize.L, RentSize.XL]),
});

@Service()
export class RentController {
  constructor(private rentService: RentService) {}

  // POST /rents
  public createRent = (request: Request, response: Response) => {
    try {
      const { weight, size } = createRentSchema.parse(request.body);
      const rent = this.rentService.createRent(weight, size);

      response.status(201).send(rent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        response.status(400).send({
          code: 'Bad request',
          message: 'Validation error',
          errors: error.errors,
        });
      }
      response.status(500);
    }
  };

  // GET /rents/:id
  public getRent = (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const rent = this.rentService.getRent(id);
      response.status(200).send(rent);
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

  // POST /rents/:rentId/lockers/:lockerId
  public linkRentToLocker = (request: Request, response: Response) => {
    const { rentId, lockerId } = request.params;

    try {
      const rent = this.rentService.linkRentToLocker(rentId, lockerId);
      response.status(200).send(rent);
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(404).send({
          code: 'Not found',
          message: error.message,
        });
      }

      if (error instanceof OccupancyError || error instanceof BadRequestError) {
        response.status(400).send({
          code: 'Bad request',
          message: error.message,
        });
      }
      response.status(500);
    }
  };

  // POST /rents/:id/dropoff
  public dropoffRent = (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const rent = this.rentService.dropoffRent(id);
      response.status(200).send(rent);
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(404).send({
          code: 'Not found',
          message: error.message,
        });
      }

      if (error instanceof BadRequestError) {
        response.status(400).send({
          code: 'Bad request',
          message: error.message,
        });
      }
      response.status(500);
    }
  };

  // POST /rents/:id/pickup
  public pickupRent = (request: Request, response: Response) => {
    const { id } = request.params;

    try {
      const rent = this.rentService.pickupRent(id);
      response.status(200).send(rent);
    } catch (error) {
      if (error instanceof NotFoundError) {
        response.status(404).send({
          code: 'Not found',
          message: error.message,
        });
      }

      if (error instanceof BadRequestError) {
        response.status(400).send({
          code: 'Bad request',
          message: error.message,
        });
      }
      response.status(500);
    }
  };
}
