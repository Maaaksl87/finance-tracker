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
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "var(--bg-gradient)",
        }}
      />
      <div className="relative flex items-center justify-center w-full p-6 min-h-screen md:p-10">
        <div className="relative z-10 w-full max-w-sm">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="flex-row w-full max-w-sm">
              <TabsTrigger value="login" onClick={() => navigate("/auth/login")}>
                <LogIn className="w-4 h-4 mr-2" />
                Увійти
              </TabsTrigger>
              <TabsTrigger value="register" onClick={() => navigate("/auth/register")}>
                <UserPlus className="w-4 h-4 mr-2" />
                Зареєструватися
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col w-full max-w-sm gap-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
