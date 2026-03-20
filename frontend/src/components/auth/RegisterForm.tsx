import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardWithBackdrop,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, glassStyle } from "@/lib/utils";

import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import AppleIcon from "@/assets/icons/AppleIcon";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Ім'я повинно містити щонайменше 2 символи"),
    email: z.string().email("Введіть дійсну електронну адресу"),
    password: z.string().min(6, "Пароль повинен містити щонайменше 6 символів"),
    confirmPassword: z.string().min(1, "Підтвердіть пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch (err) {}
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <CardWithBackdrop>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Реєстрація</CardTitle>
          <CardDescription>Введіть свої дані для реєстрації в системі</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" disabled={isLoading || true}>
                  <AppleIcon />
                  Реєстрація з Apple
                </Button>
                <Button variant="outline" type="button" disabled={isLoading || true}>
                  <GoogleIcon />
                  Реєстрація з Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Або продовжити з email
              </FieldSeparator>

              {error && (
                <div className="p-3 text-sm text-center text-red-500 rounded bg-red-50">
                  {error}
                </div>
              )}

              <Field className="gap-1">
                <FieldLabel htmlFor="name">Ім'я</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  className={cn(glassStyle, "rounded-md ")}
                  placeholder="Ваше ім'я"
                  {...register("name")}
                  disabled={isLoading}
                />

                {errors.name && (
                  <div className="text-sm text-red-500">{errors.name.message}</div>
                )}
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  className={cn(glassStyle, "rounded-md ")}
                  placeholder="example@mail.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="text-sm text-red-500">{errors.email.message}</div>
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
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <div className="text-sm text-red-500">{errors.password.message}</div>
                )}
              </Field>

              <Field className="gap-1">
                <FieldLabel htmlFor="confirmPassword">Підтвердіть пароль</FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={cn(glassStyle, "rounded-md ")}
                    placeholder="Повторіть пароль"
                    {...register("confirmPassword")}
                    disabled={isLoading}
                  />
                  <Button
                    className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </Field>

              <Field>
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? "Реєстрація..." : "Зареєструватися"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </CardWithBackdrop>
    </div>
  );
}
