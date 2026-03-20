export const BackgroundGlow = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Пляма зліва зверху (Основний зелений) */}
      <div
        className="absolute top-[10%] left-[5%] w-75 h-82  bg-[#6aff00] rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-float"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute -top-[10%] left-[55%] w-75 h-82  bg-[#6aff00] rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-float"
        style={{ animationDelay: "0s" }}
      />
      {/* Пляма справа зверху (Допоміжний синій) */}
      <div
        className="absolute top-0 -right-10 w-80 h-80 bg-[#0073ff] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div
        className="absolute bottom-0 left-10 w-80 h-80 bg-[#0073ff] rounded-full mix-blend-multiply filter blur-[90px] opacity-70 animate-float"
        style={{ animationDelay: "2s" }}
      />
      {/* Пляма знизу по центру (Основний зелений) */}
      <div
        className="absolute bottom-[-30%] left-[35%]  w-100 h-130 bg-[#97ef00] rounded-full mix-blend-multiply filter blur-[90px] opacity-60 animate-float"
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
};
