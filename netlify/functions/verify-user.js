// netlify/functions/verify-user.js
import admin from 'firebase-admin';
import emails from '/references/emails';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
}

export async function handler(event) {
  try {
    const authHeader = event.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    console.log("Received token:", token ? token.slice(0,10)+"..." : "none");

    if (!token) return { statusCode: 401, body: 'Missing token' };

    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Decoded token:", decoded);

    //if (decoded.email.endsWith('@oakhill.nsw.edu.au')) { CHANGE TO ADD ! IN PRODUCTION

    //if (JSON.parse(process.env.WHITELISTED_USERS).includes(decoded.email)) {
    //  return { statusCode: 403, body: 'Access denied' };
    //}

    return { statusCode: 200, body: JSON.stringify({ message: 'Access granted', whitelist: JSON.parse(process.env.WHITELISTED_USERS)}) };
  } catch (err) {
    console.error("Token verification failed:", err);
    return { statusCode: 401, body: 'Invalid token' };
  }
}

