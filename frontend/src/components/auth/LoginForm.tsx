import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import AppleIcon from "@/assets/icons/AppleIcon";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { cn, glassStyle } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Схема валідації для входу
const loginSchema = z.object({
  email: z.string().email({
    message: "Будь ласка, введіть дійсну електронну адресу.",
  }),
  password: z
    .string()
    .min(6, { message: "Пароль повинен містити щонайменше 6 символів." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Вхід</CardTitle>
        <CardDescription>Введіть свої дані для входу в систему</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Button variant="outline" type="button" disabled={isLoading || true}>
                <AppleIcon />
                Увійти з Apple
              </Button>
              <Button variant="outline" type="button" disabled={isLoading || true}>
                <GoogleIcon />
                Увійти з Google
              </Button>
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Або продовжити з email
            </FieldSeparator>
            <Field className="gap-1">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className={cn(glassStyle, "rounded-md")}
                required
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <div className="text-sm text-status-negative">{errors.email.message}</div>
              )}
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введіть пароль"
                  className={cn(glassStyle, "rounded-md")}
                  required
                  {...register("password")}
                  disabled={isLoading}
                />
                <Button
                  className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <Eye className="w-4 h-4 text-foreground-muted" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <div className="text-sm text-status-negative">
                  {errors.password.message}
                </div>
              )}
            </Field>
            <Field>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Завантаження..." : "Увійти"}
              </Button>
              {errors.root && (
                <div className="text-sm text-status-negative">{errors.root.message}</div>
              )}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
