import React, { useEffect, useState } from "react";

export default function BookMySeatIntro({ duration = 4500, onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out 600ms before total duration ends
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 600);

    // Completely unmount after duration
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  const appName = "BookMySeat";
  const tagline = "Reserve your comfort in seconds.";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-700 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Animated App Name (Split Character Reveal) */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight flex overflow-hidden">
          {appName.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block transform animate-fade-slide-up bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent"
              style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Animated Subtitle / Tagline */}
        <p
          className="mt-4 text-sm sm:text-base text-slate-400 font-medium tracking-wide animate-fade-in opacity-0"
          style={{
            animationDelay: `${appName.length * 80 + 300}ms`,
            animationFillMode: "forwards",
          }}
        >
          {tagline}
        </p>

        {/* Subtle Loading / Progress Indicator */}
        <div className="mt-8 w-40 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress"
            style={{
              animationDuration: `${duration - 600}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}