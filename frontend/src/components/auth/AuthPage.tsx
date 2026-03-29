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
          // Previous softer palette:
          // background: `
          //   radial-gradient(ellipse 85% 65% at 8% 8%, rgba(120, 200, 255, 0.45), transparent 60%),
          //       radial-gradient(ellipse 75% 60% at 78% 22%, rgba(45, 110, 255, 0.38), transparent 62%),
          //       radial-gradient(ellipse 70% 60% at 18% 82%, rgba(150, 220, 255, 0.42), transparent 62%),
          //       radial-gradient(ellipse 70% 60% at 84% 72%, rgba(175, 240, 200, 0.40), transparent 62%),
          //       radial-gradient(ellipse 65% 55% at 92% 92%, rgba(180, 255, 120, 0.36), transparent 64%),
          //       linear-gradient(180deg, #fffde6 0%, #eaf8ff 100%)
          //   `,
          //НАСИЧЕНИЙ
          //     background: `
          //   radial-gradient(ellipse 88% 68% at 7% 8%, rgba(75, 190, 255, 0.58), transparent 60%),
          //       radial-gradient(ellipse 76% 60% at 80% 18%, rgba(20, 90, 255, 0.52), transparent 62%),
          //       radial-gradient(ellipse 72% 62% at 16% 84%, rgba(120, 215, 255, 0.52), transparent 62%),
          //       radial-gradient(ellipse 70% 60% at 82% 70%, rgba(120, 232, 170, 0.48), transparent 62%),
          //       radial-gradient(ellipse 66% 56% at 92% 92%, rgba(155, 245, 85, 0.45), transparent 64%),
          //       radial-gradient(ellipse 62% 54% at 52% 96%, rgba(255, 236, 130, 0.28), transparent 66%),
          //       linear-gradient(180deg, #fff8c6 0%, #dff4ff 100%)
          // `,
          // робочий варіант
          background: `
            radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
                radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
                radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
                radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
                linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
          `,
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
