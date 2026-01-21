import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import api from "@/api/axios"; 
import { isAxiosError } from "axios";
import { useState } from "react";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const authenticateUser = async (access_token: string) => {
    const profileResponse = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    setToken(access_token, profileResponse.data);
    navigate("/");
  };

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      await authenticateUser(response.data.access_token);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError("Невірний email або пароль");
      } else {
        setError("Помилка входу. Спробуйте пізніше.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Реалізувати на бекенді endpoint POST /auth/register

      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      // автоматичний вхід після реєстрації
      const loginResponse = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      await authenticateUser(loginResponse.data.access_token);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError("Користувач з таким email вже існує");
      } else {
        setError("Помилка реєстрації. Спробуйте пізніше.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, isLoading, error, setError };
}
