import { resolve } from "node:path";
import dotenv from "dotenv";

const envPath = {
    development: "dev.env",
    production: "prod.env"
};

dotenv.config({
    path: resolve(`config/${envPath.development}`)
});

export const PORT = process.env.PORT || 5000;
export const DB_URI = process.env.DB_URI;
export const ENC_BYTE = process.env.ENC_BYTE;
export const SALAT_ROUNDS = process.env.SALAT_ROUNDS;
export const ENC_KEY = process.env.ENC_KEY;
export const JWT_USER_SECRET_ACCESS = process.env.JWT_USER_SECRET_ACCESS;
export const JWT_USER_SECRET_REFRESH = process.env.JWT_USER_SECRET_REFRESH;
export const JWT_ADMIN_SECRET_ACCESS = process.env.JWT_ADMIN_SECRET_ACCESS;
export const JWT_ADMIN_SECRET_REFRESH = process.env.JWT_ADMIN_SECRET_REFRESH;
export const JWT_EXPIRES_IN_ACCESS = process.env.JWT_EXPIRES_IN_ACCESS;
export const JWT_EXPIRES_IN_REFRESH = process.env.JWT_EXPIRES_IN_REFRESH;
export const CLIENT_ID = process.env.CLIENT_ID;