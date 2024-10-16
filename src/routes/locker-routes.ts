import { Router } from 'express';
import { LockerController } from '../controllers/locker-controller';
import { Service } from 'typedi';

@Service()
export class LockerRouter {
  private router: Router;

  constructor(private controller: LockerController) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get('/lockers/:id', this.controller.getLocker);
    this.router.post('/lockers/:id/open', this.controller.openLocker);
    this.router.post('/lockers/:id/close', this.controller.closeLocker);
  }

  public getRouter(): Router {
    return this.router;
  }
}
