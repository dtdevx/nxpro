# nxpro
Simple Next.js based tool to manage projects, tasks and subtasks

## Before first run

### Install all packages
Go to ```app``` folder and run ```npm install```.

### Run database migrations
In ```app``` folder, run:

```bash
npx prisma migrate deploy
npm run build
```

## Run the app
In ```app``` folder, run:

```bash
npm run start
```

The app should now be available under http://localhost:3000/