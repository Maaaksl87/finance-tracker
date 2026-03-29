export const AuthBackground = () => {
  return (
    // <div className="fixed inset-0 -z-10 overflow-hidden">
    //   <div className="absolute inset-0 bg-background" />

    //   <div
    //     className="absolute top-[10%] left-[5%] w-72 h-72 bg-secondary/60 rounded-full blur-[100px] animate-float"
    //     style={{ animationDelay: "0s" }}
    //   />
    //   <div
    //     className="absolute -top-[5%] right-[10%] w-80 h-80 bg-primary/50 rounded-full blur-[120px] animate-float"
    //     style={{ animationDelay: "2s" }}
    //   />
    //   <div
    //     className="absolute bottom-[10%] left-[30%] w-96 h-96 bg-background-gradient-to/70 rounded-full blur-[100px] animate-float"
    //     style={{ animationDelay: "4s" }}
    //   />
    //   <div
    //     className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-primary-light/60 rounded-full blur-[80px] animate-float"
    //     style={{ animationDelay: "1s" }}
    //   />
    //   <div
    //     className="absolute top-[40%] left-[50%] w-56 h-56 bg-secondary-light/50 rounded-full blur-[90px] animate-float"
    //     style={{ animationDelay: "3s" }}
    //   />
    // </div>

    <div className="min-h-screen w-full relative">
      {/* Aurora Dream Corner Whispers */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
        radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),
            radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),
            radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),
            radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      {/* Your content goes here */}
    </div>
  );
};
