import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

// BASE_URL
// USER_UID
// USER_PWD
// INVALID_PWD

if (!process.env.BASE_URL) {
    throw new Error("Missing BASE_URL in env...");
}
if (!process.env.USER_UID) {
    throw new Error("Missing USER_UID in env...");
}if (!process.env.USER_PWD) {
    throw new Error("Missing USER_PWD in env...");
}if (!process.env.INVALID_PWD) {
    throw new Error("Missing INVALID_PWD in env...");
}

export const ENV = {
    BASE_URL: process.env.BASE_URL,
    USER_UID: process.env.USER_UID,
    USER_PWD: process.env.USER_PWD,
    INVALID_PWD: process.env.INVALID_PWD,
}
