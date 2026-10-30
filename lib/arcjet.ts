import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
    key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
    rules: [
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            characteristics: ["userId"], // track requests by a custom user ID
            refillRate: 5, // refill 5 tokens per interval
            interval: 86400, // refill every 86400 seconds
            capacity: 20, // bucket maximum capacity of 20 tokens
        }),
    ],
});

export default aj;
