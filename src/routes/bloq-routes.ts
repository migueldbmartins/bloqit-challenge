import { Router } from 'express';
import { Service } from 'typedi';
import { BloqController } from '../controllers/bloq-controller';

@Service()
export class BloqRouter {
  private router: Router;

  constructor(private controller: BloqController) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes() {
    this.router.get('/bloqs', this.controller.listBloqs);
    this.router.get('/bloqs/:id', this.controller.getBloq);
    this.router.get('/bloqs/:id/lockers', this.controller.listLockersByBloqId);
  }

  public getRouter(): Router {
    return this.router;
  }
}
