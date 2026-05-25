import api from './api';

export async function login(email: string, password: string) {

    const response = await api.post('/auth/login', {
        email,
        password
    });

    return response.data;
}

export async function register(
    nombre: string,
    email: string,
    password: string,
    rol: string
) {

    const response = await api.post('/auth/register', {
        nombre,
        email,
        password,
        rol
    });

    return response.data;
}