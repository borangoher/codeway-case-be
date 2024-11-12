# Codeway BE Demo

This is the backend for the Codeway case demo.

## How to Run

In the project directory, run

```sh
npm install
```

to install dependencies and

```sh
npm run start
```

to start new instance of the server.

## Project Details

This backend exposes 4 REST endpoints. All endpoints are gated behind Firebase
authentication. The authentication token can be obtained through signing in with the
Client SDK and must be supplied in the header when making a request. The endpoints
are as follows.

- GET /parameters

- PUT /parameters

- POST /parameters

- DELETE /parameters

A valid Firebase service account key is needed to properly run this project as it is
required for checking authentication tokens. The key has **not** been obscured on
purpose so you directly run it without setting key info. This project is hosted at
<https://codewaydemodeploy.lm.r.appspot.com/>.
