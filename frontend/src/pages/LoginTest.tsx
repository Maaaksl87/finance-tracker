import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Хук для навігації
import { useAuthStore } from "@/store/authStore"; // Наш склад
import api from "@/api/axios"; // Наш поштар

// Імпорти UI компонентів
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginTest = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = { email: "", password: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Будь ласка, введіть дійсну електронну адресу.";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Пароль повинен містити щонайменше 6 символів.";
    }
    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrors({ email: "", password: "" });
    setIsLoading(true);

    try {
      // 1. Відправляємо запит на логін
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // 2. Якщо успіх - дістаємо токен
      const { access_token } = response.data;
      // 3. Отримуємо профіль користувача
      const profileResponse = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const user = profileResponse.data;
      // 4. Зберігаємо токен і юзера в Zustand
      setToken(access_token, user);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setErrors({ email: "", password: "Невірний email або пароль" });
      } else {
        setErrors({
          email: "",
          password: "Сталася помилка. Спробуйте пізніше.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && password && !errors.email && !errors.password;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Вхід</CardTitle>
          <CardDescription>Введіть дані для входу в систему</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ваш пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {errors.email && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Входимо..." : "Увійти"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginTest;
