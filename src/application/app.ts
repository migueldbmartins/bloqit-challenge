import express, { Application, Express } from 'express';
import 'reflect-metadata';
import { Container } from 'typedi';
import { BloqRouter } from '../routes/bloq-routes';
import { LockerRouter } from '../routes/locker-routes';
import { RentRouter } from '../routes/rent-routes';

export class App {
  private app: Express;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initMiddlewares();
    this.initControllers();
  }

  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.log(`App is running on http://localhost:${this.port}`);
    });
  }

  public getApplication(): Application {
    return this.app;
  }

  private initMiddlewares(): void {
    this.app.use(express.json());
  }

  private initControllers(): void {
    const bloqRouter = Container.get(BloqRouter);
    const lockerRouter = Container.get(LockerRouter);
    const rentRouter = Container.get(RentRouter);

    this.app.use(bloqRouter.getRouter());
    this.app.use(lockerRouter.getRouter());
    this.app.use(rentRouter.getRouter());
  }
}
