# Code Challenge Notes

## Table of contents

1.  [Requirements](#requirements)
2.  [Installation](#installation)
3.  [Testing](#testing)
4.  [Considerations](#considerations)
    - [Endpoints](#endpoints)
      - [Bloqs](#bloqs)
      - [Lockers](#lockers)
      - [Rents](#rents)
5.  [Improvements](#improvements)

## Requirements <a name="requirements"></a>

- Node 22
- Npm 10

## Installation <a name="installation"></a>

1. Install packages and dependencies needed:

```
npm install
```

2. Start the application:

```
npm run start
```

## Testing <a name="testing"></a>

To run the tests execute `npm run test`.

## Considerations <a name="considerations"></a>

Took the liberty to look into your [documentation](https://docs.api.bloq.it/) to better understand and fullfil the requirements of the challenge.

To my understanding of your product, based on the data Model presented and in order to _assist first, middle, and last-mile deliveries_ I've decided that the following endpoints were the most important behaviors to cover;
(besides these I would also implement the CRUD operations for each resource).

### Endpoints: <a name="endpoints"></a>

#### Bloqs <a name="bloqs"></a>

1. List Bloqs

```bash
curl --request GET 'http://localhost:3000/bloqs'
```

2. Get Bloq

```bash
curl --request GET 'http://localhost:3000/bloqs/:id'
```

3. List Lockers by Bloq

```bash
curl --request GET 'http://localhost:3000/bloqs/:id/lockers'
```

#### Lockers <a name="lockers"></a>

1. Get Locker

```bash
curl --request GET 'http://localhost:3000/lockers/:id'
```

2. Open Locker

```bash
curl --request GET 'http://localhost:3000/lockers/:id/open'
```

3. Close Locker

```bash
curl --request GET 'http://localhost:3000/lockers/:id/close'
```

#### Rents <a name="rents"></a>

1. Create Rent

```bash
curl --request GET 'http://localhost:3000/rents'
```

2. Get Rent

```bash
curl --request GET 'http://localhost:3000/rents/:id'
```

3. Link Rent to Locker

```bash
curl --request GET 'http://localhost:3000/rents/:id/lockers/:id'
```

4. Dropoff Rent

```bash
curl --request GET 'http://localhost:3000/rents/:id/dropoff'
```

5. Pickup Rent

```bash
curl --request GET 'http://localhost:3000/rents/:id/pickup'
```

## Improvements <a name="improvements"></a>

- Improve security by adding authorization to the API (i.e api_key or custom authorizer).
- Implement pagination capabilities (Database would be required)
- The project does not contain unit tests. They should exist to improve coverage granularity.
- Build more integration/e2e tests for a more robust application.

---

**Please reach out if you have any troubles with the installation or any related questions.**
