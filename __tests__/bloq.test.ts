import request from 'supertest';
import { App } from '../src/application/app';
import { Application } from 'express';
import bloqsData from '../data/bloqs.json';
import lockersData from '../data/lockers.json';

describe('Bloq', () => {
  let testApp: App;
  let app: Application;

  beforeAll(async () => {
    testApp = new App(5001);
    app = testApp.getApplication();
  });

  describe('list bloqs', () => {
    test('should return all bloqs', async () => {
      const { status, body } = await request(app).get('/bloqs');

      expect(status).toBe(200);
      expect(body).toEqual(bloqsData);
    });
  });

  describe('get bloq', () => {
    test('should return specified bloq', async () => {
      const bloqId = bloqsData[0].id;
      const { status, body } = await request(app).get(`/bloqs/${bloqId}`);

      expect(status).toBe(200);
      expect(body).toEqual(bloqsData[0]);
    });

    test('should return error when specified bloq does not exist', async () => {
      const { status, body } = await request(app).get('/bloqs/123');
      const expectedBody = {
        code: 'Not found',
        message: 'Bloq does not exist',
      };

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });
  });

  describe('list lockers by bloq', () => {
    test('should return free lockers from specified bloq', async () => {
      const bloqId = lockersData[0].bloqId;
      const expectedBody = lockersData.filter(
        (locker) => locker.bloqId === bloqId && locker.isOccupied === true
      );
      const { status, body } = await request(app)
        .get(`/bloqs/${bloqId}/lockers`)
        .query({ occupancy: true });

      expect(status).toBe(200);
      expect(body).toEqual(expectedBody);
    });
  });
});
