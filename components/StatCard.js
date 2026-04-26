export default function StatCard({
  icon,
  label,
  value,
  trend,
  trendValue,
  color = "primary",
}) {
  const colorVariants = {
    primary: "before:bg-gradient-primary",
    secondary: "before:bg-gradient-secondary",
    success:
      "before:bg-gradient-to-br before:from-success before:to-success/80",
    warning:
      "before:bg-gradient-to-br before:from-warning before:to-warning/80",
    info: "before:bg-gradient-to-br before:from-info before:to-info/80",
  };

  const trendVariants = {
    up: "bg-success/10 text-success",
    down: "bg-error/10 text-error",
  };

  return (
    <div
      className={`
            relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-md flex gap-4 sm:gap-6 items-start transition-all duration-250
            hover:-translate-y-1 hover:shadow-xl
            before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:transition-all before:duration-250
            hover:before:h-1.5
            ${colorVariants[color]}
        `}
    >
      {/* Icon Container */}
      <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-card backdrop-blur-md shrink-0">
        <span className="text-2xl md:text-3xl">{icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider m-0 mb-1">
          {label}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 m-0 mb-2 leading-tight">
          {value}
        </h3>

        {trend && (
          <div
            className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                        ${trendVariants[trend] || ""}
                    `}
          >
            <span className="text-sm font-bold">
              {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}
            </span>
            <span className="leading-none">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
