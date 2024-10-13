// frontend/routes/register.jsx
import { Form, useActionData, useNavigation } from "@remix-run/react";  
import { redirect, json } from "@remix-run/node"; 
import { getSession } from "../utils/auth";
import { useEffect } from "react";
import styles from "../styles/generalStyles.module.css";
import { isCedula } from "validator-ec";

// Loader to protect the route (authenticated users are redirected)
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/home"); // Redirect to home if authenticated
  }
  return null; // Allow access to register page if not authenticated
};

// Action to handle form submission and user registration
export const action = async ({ request }) => {
  const formData = await request.formData();

  // Collect data from the form
  const cedula = formData.get("cedula");
  const email = formData.get("email");
  const name = formData.get("name");
  const lastName = formData.get("lastName");
  const birthDate = formData.get("birthDate");
  const phoneNumber = formData.get("phoneNumber");
  const password = formData.get("password");
  const gender = formData.get("gender");

  // Simple client-side validation
  if (!cedula || !email || !name || !password) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    // Send data to the Express.js backend
    const response = await fetch("https://api-express-web.onrender.com/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cedula,
        email,
        name,
        lastName,
        birthDate,
        phoneNumber,
        password,
        gender
      }),
    });

    // Check if response content-type is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return json({ error: "Unexpected response from server" }, { status: 500 });
    }

    const data = await response.json();

    // If backend sends an error status, handle it
    if (!response.ok) {
      return json({ error: data.message || "Registration failed" }, { status: 400 });
    }

    // If successful, redirect to the login page
    return redirect("/login");
  } catch (error) {
    // Catch any network or server errors
    return json({ error: "An unexpected error occurred" }, { status: 500 });
  }
};


// Main Register component
export default function Register() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.redirectTo) {
      window.location.href = actionData.redirectTo;
    }
  }, [actionData]);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.title}>Registro de usuario</div>
        <div className="register-container">
          {actionData?.error && <p className="error text-red-500">{actionData.error}</p>}
          <Form method="post" className={styles.form}>
            <div className={styles.formGroup}>
              <label>Cedula: </label>
              <input type="text" name="cedula" required className="input" />
            </div>
            <div className={styles.formGroup}>
              <label>Correo Electrónico: </label>
              <input type="email" name="email" required className="input" />
            </div>
            <div className={styles.formGroup}>
              <label>Nombres: </label>
              <input type="text" name="name" required className="input" />
            </div>
            <div className={styles.formGroup}>
              <label>Apellidos: </label>
              <input type="text" name="lastName" required className="input" />
            </div>
            <div className={styles.formGroup}>
              <label>Fecha de Nacimiento: </label>
              <input type="date" name="birthDate" required className="input" />
            </div>
            <div className={styles.formGroup}>
              <label>Número de Teléfono: </label>
              <input type="tel" name="phoneNumber" required className="input" />
            </div>
            <div className={styles.formGroup}>
              <label>Contraseña: </label>
              <input type="password" name="password" required className="input" />
            </div>
            <div className={styles.formGroup}>
              <label>Género: </label>
              <select name="gender" required className="input">
                  <option value="">Seleccione el género</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
            </div>
            <button type="submit" disabled={isSubmitting} className={`${styles.customButton} ${styles.btn3}`}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}