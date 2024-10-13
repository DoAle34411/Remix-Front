import { redirect } from "@remix-run/node";
import { getSession } from "../utils/auth"; // Adjust the path as necessary

// Check if the user is logged in
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return redirect("/login");
  return null;
};

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <form method="post" action="/logout">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
