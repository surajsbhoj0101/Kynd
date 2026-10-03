import { useState, useRef, useEffect } from "react";
import { Palette, Check, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { currentTheme, allThemes, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-9999">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.swatch}, ${
            currentTheme.vars["--color-primary-container"] ||
            currentTheme.swatch
          })`,
        }}
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <Palette size={22} className="text-white" />
        )}
      </button>

      {/* Theme Panel */}
      {isOpen && (
        <div
          className="absolute bottom-18 right-0 w-72 rounded-2xl shadow-2xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-outline-variant)",
            animation: "themePanel 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            <h3
              className="font-bold text-base"
              style={{ color: "var(--color-on-surface)" }}
            >
              Choose a Theme
            </h3>
            <p
              className="text-xs mt-0.5 opacity-70"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              Pick a color that resonates with you
            </p>
          </div>

          {/* Theme Grid */}
          <div className="p-4 grid grid-cols-2 gap-3">
            {allThemes.map((theme) => {
              const isActive = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className="group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    backgroundColor: isActive
                      ? theme.vars["--color-primary-fixed"] || "#eee"
                      : "var(--color-surface-container)",
                    border: isActive
                      ? `2px solid ${theme.swatch}`
                      : "2px solid transparent",
                  }}
                  aria-label={`Select ${theme.name} theme`}
                  aria-pressed={isActive}
                >
                  {/* Swatch Circle */}
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full shadow-md transition-shadow group-hover:shadow-lg flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${theme.swatch}, ${
                          theme.vars["--color-primary-container"] ||
                          theme.swatch
                        })`,
                      }}
                    >
                      {isActive ? (
                        <Check size={18} className="text-white" />
                      ) : null}
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className="text-xs font-semibold text-center leading-tight"
                    style={{
                      color: isActive
                        ? theme.swatch
                        : "var(--color-on-surface-variant)",
                    }}
                  >
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes themePanel {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
