// netlify/functions/verify-user.js
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
}

export async function handler(event) {
  const authHeader = event.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return { statusCode: 401, body: 'Missing token' };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded.email.endsWith('@oakhill.nsw.edu.au')) {
      return { statusCode: 403, body: 'Access denied' };
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Access granted' }) };
  } catch (err) {
    return { statusCode: 401, body: 'Invalid token' };
  }
}
