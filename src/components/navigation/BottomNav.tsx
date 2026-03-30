import { motion } from "framer-motion";
import { BarChart3, Lightbulb, TrendingUp, Upload } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { icon: Upload, label: "Upload", path: "/" },
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: TrendingUp, label: "Tendencias", path: "/trends" },
  { icon: Lightbulb, label: "Insights", path: "/insights" },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sticky bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className="relative flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-colors"
            >
              {isActive ? (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : null}
              <tab.icon
                className={`relative z-10 h-5 w-5 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
