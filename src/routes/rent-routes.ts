import { Router } from 'express';
import { RentController } from '../controllers/rent-controller';
import { Service } from 'typedi';

@Service()
export class RentRouter {
  private router: Router;

  constructor(private controller: RentController) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.post('/rents', this.controller.createRent);
    this.router.get('/rents/:id', this.controller.getRent);
    this.router.post(
      '/rents/:rentId/lockers/:lockerId',
      this.controller.linkRentToLocker
    );
    this.router.post('/rents/:id/dropoff', this.controller.dropoffRent);
    this.router.post('/rents/:id/pickup', this.controller.pickupRent);
  }

  public getRouter(): Router {
    return this.router;
  }
}
