import { Worker } from "bullmq";
import type { emailJobPayload } from "./email.queue.js";
import { env } from "../config/env.js";
import { verifyEmailTemplate } from "./email.template.js";
import { transporter } from "../config/mailer.js";
import redis from "../config/redis.js";

export const emailWorker = new Worker<emailJobPayload>('email-queue',
    async (job) => {
        const {data} = job;

        // Handle different email types based on the job payload
        if (data.type === 'verify-email') {
            const verifyUrl = `${env.appBaseUrl}/auth/verify-email?token=${data.token}`;
            const { subject, html } = verifyEmailTemplate(data.name, verifyUrl);

            // Send the verification email
            await transporter.sendMail({
                from: env.emailFrom,
                to: data.to,
                subject,
                html,
            });
        };
    },
    {
        connection: redis,
        concurrency: 5, 
    }
);

emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err);
});