import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "cart_session",
    path: "/",
    sameSite: "None",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET],
    httpOnly: true,
  }
});

export { getSession, commitSession, destroySession };