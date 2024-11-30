import React, { useState } from 'react';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { getSession } from '../../utils/auth';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card.jsx';
import { Button } from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import { Alert, AlertDescription } from '../../components/Alert.jsx';
import Navbar from '../../components/Navbar.jsx';

// Loader function - this goes outside the component
export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  try {
    const response = await fetch(`https://api-express-web.onrender.com/users/cedula/${userId}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    return json({ user: userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return redirect("/login");
  }
}

const Usuario = () => {
  const { user } = useLoaderData();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch(`https://api-express-web.onrender.com/users/update-password/`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          email: user.email,
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating password');
      }
      
      setSuccess('Password updated successfully');
      setIsChangingPassword(false);
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.message || 'Error updating password');
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Cédula</h3>
                    <p>{user.cedula}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Nombre</h3>
                    <p>{user.name} {user.lastName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Teléfono</h3>
                    <p>{user.phoneNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Fecha de Nacimiento</h3>
                    <p>{new Date(user.birthDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Género</h3>
                    <p>{user.gender}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <Button 
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="w-full md:w-auto"
                  >
                    {isChangingPassword ? 'Cancelar' : 'Cambiar Contraseña'}
                  </Button>

                  {isChangingPassword && (
                    <form onSubmit={handleSubmitPassword} className="mt-4 space-y-4">
                      <div>
                        <Input
                          type="password"
                          name="oldPassword"
                          placeholder="Contraseña Actual"
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          name="newPassword"
                          placeholder="Nueva Contraseña"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirmar Nueva Contraseña"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full md:w-auto">
                        Actualizar Contraseña
                      </Button>
                    </form>
                  )}

                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="mt-4">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Usuario;