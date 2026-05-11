export const verifyEmailTemplate = (name: string, verifyUrl: string) => {
    return {
        subject: 'Verify your email',
        html: `
            <p>Hi ${name},</p>
            <p>Thank you for registering. Please click the link below to verify your email address:</p>
            <a href="${verifyUrl}">Verify Email</a>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Best regards,<br/>The Team</p>`
    }
};