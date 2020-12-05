# stingerstraining

## To run locally:

Open a terminal on the root folder:

``` bash
npm run setup
npm run start:dev
```

In a new terminal:
``` bash
cd client-src
npm run start
```

In a browser, go to `http://localhost:3000` to start developing, all files are auto rebuilt on change.

## For production builds:

``` bash
npm run build
```

## Ports:
The backend server runs on port 8080 if an env var is not specified, the front end runs on 3000 and proxies any unknown requests to the backend server on port 8080.