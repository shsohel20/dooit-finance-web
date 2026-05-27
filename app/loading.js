export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Subtle radial glow behind logo */}
      <div
        className="absolute rounded-full opacity-10 blur-3xl animate-pulse"
        style={{
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, #00d87e 0%, #005964 60%, transparent 100%)",
        }}
      />

      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Dooit Logo"
        className="relative z-10 h-10 w-auto mb-10 opacity-90"
        style={{ filter: "drop-shadow(0 2px 8px rgba(0,89,100,0.18))" }}
      />

      {/* Pill progress track */}
      <div
        className="relative z-10 rounded-full overflow-hidden"
        style={{
          width: 200,
          height: 4,
          background: "#e8f4f5",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "45%",
            borderRadius: 9999,
            background: "linear-gradient(90deg, #005964, #00d87e)",
            animation: "dooit-slide 1.5s cubic-bezier(0.45,0,0.55,1) infinite",
          }}
        />
      </div>

      {/* Status label */}
      <p
        className="relative z-10 mt-5 text-xs tracking-widest uppercase font-medium"
        style={{ color: "#005964", letterSpacing: "0.18em", opacity: 0.7 }}
      >
        Securing your session
        <span className="animate-pulse">...</span>
      </p>

      {/* Keyframes injected via a style tag — no extra CSS file needed */}
      <style>{`
        @keyframes dooit-slide {
          0%   { left: -50%; }
          100% { left: 110%; }
        }
      `}</style>
    </div>
  );
}
