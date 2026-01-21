import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Tabs defaultValue="login">
          <TabsList className="flex w-full max-w-sm">
            <TabsTrigger value="login">
              <LogIn className="mr-2 h-4 w-4" />
              login
            </TabsTrigger>
            <TabsTrigger value="register">
              <UserPlus className="mr-2 h-4 w-4" />
              register
            </TabsTrigger>
          </TabsList>
          {/* Вміст для входу */}
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          {/* Вміст для реєстрації */}
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// TODO: Реалізувати компонент сторінки аутентифікації
