import { Queue } from "bullmq";
import redis from "../config/redis.js";

export type emailJobPayload =
    | { type: 'verify-email'; to: string; name: string; token: string }
    | { type: 'reset-password'; to: string; name: string; token: string }
    | { type: 'reservation-confirmed'; to: string; name: string; reservationId: string };

export const emailQueue = new Queue<emailJobPayload>('email-queue', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {type: 'exponential', delay: 5000},
        removeOnComplete: true,
        removeOnFail: false,
    }
});