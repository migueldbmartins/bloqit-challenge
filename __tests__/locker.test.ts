import { Application } from 'express';
import request from 'supertest';
import lockersData from '../data/lockers.json';
import { App } from '../src/application/app';
import { LockerStatus } from '../src/model/locker';

describe('Locker', () => {
  let testApp: App;
  let app: Application;

  beforeAll(async () => {
    testApp = new App(5001);
    app = testApp.getApplication();
  });

  describe('get locker', () => {
    test('should return specified locker', async () => {
      const lockerId = lockersData[0].id;
      const { status, body } = await request(app).get(`/lockers/${lockerId}`);

      expect(status).toBe(200);
      expect(body).toEqual(lockersData[0]);
    });

    test('should return error when specified locker does not exist', async () => {
      const { status, body } = await request(app).get('/lockers/123');
      const expectedBody = {
        code: 'Not found',
        message: 'Locker does not exist',
      };

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });
  });

  describe('open locker', () => {
    test('should return and open specified locker', async () => {
      const lockerId = lockersData[1].id; // "isOccupied": false
      const expectedBody = { ...lockersData[1], status: LockerStatus.OPEN };
      const { status, body } = await request(app).post(
        `/lockers/${lockerId}/open`
      );

      expect(status).toBe(200);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when opening specified locker does not exist', async () => {
      const { status, body } = await request(app).post('/lockers/123/open');
      const expectedBody = {
        code: 'Not found',
        message: 'Locker does not exist',
      };

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when specified locker is occupied', async () => {
      const lockerId = lockersData[0].id; //  "isOccupied": true
      const { status, body } = await request(app).post(
        `/lockers/${lockerId}/open`
      );
      const expectedBody = {
        code: 'Bad request',
        message: 'Locker is occupied',
      };

      expect(status).toBe(400);
      expect(body).toEqual(expectedBody);
    });
  });

  describe('close locker', () => {
    test('should return and close specified locker', async () => {
      const lockerId = lockersData[1].id;
      const expectedBody = { ...lockersData[1], status: LockerStatus.CLOSED };
      const { status, body } = await request(app).post(
        `/lockers/${lockerId}/close`
      );

      expect(status).toBe(200);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when closing specified locker does not exist', async () => {
      const { status, body } = await request(app).post('/lockers/123/close');
      const expectedBody = {
        code: 'Not found',
        message: 'Locker does not exist',
      };

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });
  });
});
