export const AuthBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-sky-200" />

      <div
        className="absolute top-[10%] left-[5%] w-72 h-72 bg-sky-300/60 rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute -top-[5%] right-[10%] w-80 h-80 bg-blue-300/50 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-[10%] left-[30%] w-96 h-96 bg-sky-200/70 rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-blue-200/60 rounded-full blur-[80px] animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-[40%] left-[50%] w-56 h-56 bg-cyan-200/50 rounded-full blur-[90px] animate-float"
        style={{ animationDelay: "3s" }}
      />
    </div>
  );
};
