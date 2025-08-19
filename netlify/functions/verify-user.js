// netlify/functions/verify-user.js
import admin from 'firebase-admin';


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
    
    if (decoded.email == 'wafflestraws@icloud.com') {
        return { statusCode: 403, body: 'Access denied' };
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Access granted' }) };
  } catch (err) {
    console.error("Token verification failed:", err);
    return { statusCode: 401, body: 'Invalid token' };
  }
}