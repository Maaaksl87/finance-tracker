import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Реєстрація</CardTitle>
          <CardDescription>
            Введіть свої дані для реєстрації в системі
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" disabled={isLoading}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Реєстрація з Apple
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Реєстрація з Google
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Або продовжити з email
              </FieldSeparator>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded text-center">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Ім'я</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше ім'я"
                  {...register("name")}
                  disabled={isLoading}
                />

                {errors.name && (
                  <div className="text-sm text-red-500">
                    {errors.name.message}
                  </div>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="text-sm text-red-500">
                    {errors.email.message}
                  </div>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Мінімум 6 символів"
                  {...register("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <div className="text-sm text-red-500">
                    {errors.password.message}
                  </div>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Підтвердіть пароль
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Повторіть пароль"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                />
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
                <FieldDescription className="text-center">
                  Вже маєте акаунт?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Увійти
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
