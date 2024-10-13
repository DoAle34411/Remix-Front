// utils/auth.js
import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "session",
    secrets: [process.env.SESSION_SECRET],
    secure: true,
    httpOnly: true,
    path: "/",
    sameSite: "None",
  },
});
