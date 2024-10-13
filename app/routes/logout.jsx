// frontend/routes/logout.jsx
import { redirect } from "@remix-run/node";
import { getSession, destroySession } from "../utils/auth";

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  // Destroy the session to log out the user
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const loader = async () => {
  // Prevent direct access to the logout page, always redirect back to login
  return redirect("/login");
};
