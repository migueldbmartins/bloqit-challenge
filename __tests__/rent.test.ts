import { Application } from 'express';
import request from 'supertest';
import lockersData from '../data/lockers.json';
import rentsData from '../data/rents.json';
import { App } from '../src/application/app';
import { RentSize, RentStatus } from '../src/model/rent';

describe('Rent', () => {
  let testApp: App;
  let app: Application;

  beforeAll(async () => {
    testApp = new App(5001);
    app = testApp.getApplication();
  });

  describe('create rent', () => {
    test('should return created rent', async () => {
      const expectedBody = {
        id: expect.any(String),
        lockerId: null,
        weight: 10,
        size: RentSize.S,
        status: RentStatus.CREATED,
      };
      const { status, body } = await request(app).post('/rents').send({
        weight: 10,
        size: RentSize.S,
      });

      expect(status).toBe(201);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when body params are invalid', async () => {
      const expectedBody = {
        code: 'Bad request',
        message: 'Validation error',
        errors: [
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['weight'],
            message: 'Required',
          },
        ],
      };
      const { status, body } = await request(app).post('/rents').send({
        size: RentSize.S,
      });

      expect(status).toBe(400);
      expect(body).toEqual(expectedBody);
    });
  });

  describe('get rent', () => {
    test('should return specified rent', async () => {
      const rentId = rentsData[0].id;
      const { status, body } = await request(app).get(`/rents/${rentId}`);

      expect(status).toBe(200);
      expect(body).toEqual(rentsData[0]);
    });

    test('should return error when specified rent does not exist', async () => {
      const expectedBody = {
        code: 'Not found',
        message: 'Rent does not exist',
      };
      const { status, body } = await request(app).get('/rents/123');

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });
  });

  describe('link rent', () => {
    test('should return linked rent waiting dropoff', async () => {
      const rentId = rentsData[1].id; // "lockerId": null
      const lockerId = lockersData[1].id; // "isOccupied": false
      const expectedBody = {
        ...rentsData[1],
        lockerId,
        status: RentStatus.WAITING_DROPOFF,
      };
      const { status, body } = await request(app).post(
        `/rents/${rentId}/lockers/${lockerId}`
      );

      expect(status).toBe(200);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when linking none existent rent to locker', async () => {
      const lockerId = lockersData[1].id; // "isOccupied": false
      const expectedBody = {
        code: 'Not found',
        message: 'Rent does not exist',
      };
      const { status, body } = await request(app).post(
        `/rents/123/lockers/${lockerId}`
      );

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when linking rent to occupied locker', async () => {
      const rentId = rentsData[0].id; // "lockerId": null
      const lockerId = lockersData[2].id; // "isOccupied": true
      const expectedBody = {
        code: 'Bad request',
        message: 'Locker already occupied',
      };
      const { status, body } = await request(app).post(
        `/rents/${rentId}/lockers/${lockerId}`
      );

      expect(status).toBe(400);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when linking rent to none existent locker', async () => {
      const rentId = rentsData[0].id; // "lockerId": null
      const expectedBody = {
        code: 'Not found',
        message: 'Locker does not exist',
      };
      const { status, body } = await request(app).post(
        `/rents/${rentId}/lockers/123`
      );

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });
  });

  describe('dropoff rent', () => {
    test('should dropoff rent and occupy locker', async () => {
      const rentId = rentsData[4].id;
      const expectedBody = {
        ...rentsData[4],
        status: RentStatus.WAITING_PICKUP,
      };

      const { status, body } = await request(app).post(
        `/rents/${rentId}/dropoff`
      );

      const { body: updatedLocker } = await request(app).get(
        `/lockers/${expectedBody.lockerId}`
      );

      expect(status).toBe(200);
      expect(body).toEqual(expectedBody);
      expect(updatedLocker).toEqual(
        expect.objectContaining({ isOccupied: true })
      );
    });

    test('should return error when rent does not exist', async () => {
      const expectedBody = {
        code: 'Not found',
        message: 'Rent does not exist',
      };
      const { status, body } = await request(app).post('/rents/123/dropoff');

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when rent is not available to dropoff', async () => {
      const rentId = rentsData[0].id;
      const expectedBody = {
        code: 'Bad request',
        message: 'Rent not available to dropoff',
      };

      const { status, body } = await request(app).post(
        `/rents/${rentId}/dropoff`
      );

      expect(status).toBe(400);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when rent linked locker does not exist', async () => {
      const rentId = rentsData[5].id;
      const expectedBody = {
        code: 'Bad request',
        message: 'Rent with invalid locker',
      };
      const { status, body } = await request(app).post(
        `/rents/${rentId}/dropoff`
      );

      expect(status).toBe(400);
      expect(body).toEqual(expectedBody);
    });
  });

  describe('pickup rent', () => {
    test('should pickup rent and free up locker', async () => {
      const rentId = rentsData[2].id;
      const expectedBody = {
        ...rentsData[2],
        status: RentStatus.DELIVERED,
      };

      const { status, body } = await request(app).post(
        `/rents/${rentId}/pickup`
      );

      const { body: updatedLocker } = await request(app).get(
        `/lockers/${expectedBody.lockerId}`
      );

      expect(status).toBe(200);
      expect(body).toEqual(expectedBody);
      expect(updatedLocker).toEqual(
        expect.objectContaining({ isOccupied: false })
      );
    });

    test('should return error when rent does not exist', async () => {
      const expectedBody = {
        code: 'Not found',
        message: 'Rent does not exist',
      };
      const { status, body } = await request(app).post('/rents/123/pickup');

      expect(status).toBe(404);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when rent is not available to pickup', async () => {
      const rentId = rentsData[0].id;
      const expectedBody = {
        code: 'Bad request',
        message: 'Rent not available to pickup',
      };
      const { status, body } = await request(app).post(
        `/rents/${rentId}/pickup`
      );

      expect(status).toBe(400);
      expect(body).toEqual(expectedBody);
    });

    test('should return error when rent linked locker does not exist', async () => {
      const rentId = rentsData[3].id;
      const expectedBody = {
        code: 'Bad request',
        message: 'Rent with invalid locker',
      };
      const { status, body } = await request(app).post(
        `/rents/${rentId}/pickup`
      );

      expect(status).toBe(400);
      expect(body).toEqual(expectedBody);
    });
  });
});
