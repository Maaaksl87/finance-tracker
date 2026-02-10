import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/auth") {
      navigate("/auth/login", { replace: true });
    }
  }, [location, navigate]);

  const activeTab = location.pathname.includes("register") ? "register" : "login";
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="flex w-full max-w-sm">
            <TabsTrigger value="login" onClick={() => navigate("/auth/login")}>
              <LogIn className="mr-2 h-4 w-4" />
              login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => navigate("/auth/register")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              register
            </TabsTrigger>
          </TabsList>

          <div className="flex w-full max-w-sm flex-col gap-6">
            <Outlet /> {/* Тут рендериться або LoginForm, або RegisterForm */}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
