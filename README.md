# stingerstraining

## To run locally:

1) Make sure to have needed `.env` variables set (See `.env.example`):
``` bash
MONGODB_CONN_STRING=
JWT_SECRET=
```

2) Install dependancies
``` bash
npm install
npm run client:install
```

3) Run the server in terminal window
``` bash
npm run start:dev
```

4) Run the client in another terminal window
``` bash
npm run client:start
```

In a browser, go to `http://localhost:3000` to start developing, all files are auto rebuilt on change.

## For production builds:

``` bash
npm run client:build
```

## Ports:
The backend server runs on port 8080 if an env var is not specified, the front end runs on 3000 and proxies any unknown requests to the backend server on port 8080.