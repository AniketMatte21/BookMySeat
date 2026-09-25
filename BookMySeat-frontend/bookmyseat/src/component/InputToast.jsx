import React, { useState, useEffect, useRef } from "react";
import { FiMapPin, FiArrowRight, FiX } from "react-icons/fi";

export default function InputToast({ isOpen, onClose, onSubmit, placeholder = "Enter your city..." }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim().toLowerCase());
    setValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-2 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-indigo-950/30 text-white min-w-[280px]"
      >
        <span className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400">
          <FiMapPin size={15} />
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none"
        />

        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          title="Submit"
        >
          <FiArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
          title="Close"
        >
          <FiX size={14} />
        </button>
      </form>
    </div>
  );
}