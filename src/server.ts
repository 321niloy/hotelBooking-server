import { setServers } from 'node:dns/promises';
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    setServers(['1.1.1.1', '8.8.8.8']);

    
    await mongoose.connect(config.database_url as string);
    await seedSuperAdmin();
    console.log('🚀 Database connected successfully!');
    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`UnahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`UncaughtException is detected , shutting down ...`);
  process.exit(1);
});
