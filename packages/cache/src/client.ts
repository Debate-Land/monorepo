import { createClient } from "redis";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const client = createClient({ url: process.env.REDIS_URL });
client.connect();

client.on('error', (err: any) => console.log('Redis Client Error', err));

export const redis = client;
