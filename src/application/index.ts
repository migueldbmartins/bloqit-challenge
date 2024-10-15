import { App } from './app';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

(async () => new App(port).start())();
