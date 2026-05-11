
import { env } from './config/env.js';
import app from "./app.js";
import { startExpiredLockJobs } from './jobs/releaseExpiredLocks.js';
import './jobs/email.worker.js';

const PORT = env.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startExpiredLockJobs();
});