// netlify/functions/verify-user.js
import admin from 'firebase-admin';
import { env } from "netlify:env";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
}

export default async (request, context) => {
  try {
    // decode JWT from Auth provider
    const claims = context.identity?.token?.user || {};
    const email = claims.email;

    if (!email) {
      return new Response("Unauthorized: No email found", { status: 401 });
    }

    // load whitelist from env
    const whitelist = (env.ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    //if (!whitelist.includes(email.toLowerCase())) {
      //return new Response("Forbidden: Email not allowed", { status: 403 });
    //}

    // ✅ Passed whitelist check
    return context.next();
  } catch (err) {
    return new Response("Error in edge function: " + err.message, { status: 500 });
  }
};


