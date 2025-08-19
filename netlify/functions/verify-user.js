// netlify/functions/verify-user.js
import admin from 'firebase-admin';
import whitelist from "./whitelist.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
}

export default async (request, context) => {
  try {
    const email =
      context.jwt?.claims?.email || context.identity?.token?.email;

    if (!email) {
      return new Response("Unauthorized: No email found", { status: 401 });
    }

    const allowed = whitelist.emails.map(e => e.toLowerCase());
    if (!allowed.includes(email.toLowerCase())) {
      return new Response("Forbidden: Email not allowed", { status: 403 });
    }

    return context.next();
  } catch (err) {
    return new Response("Error in edge function: " + err.message, { status: 500 });
  }
};


