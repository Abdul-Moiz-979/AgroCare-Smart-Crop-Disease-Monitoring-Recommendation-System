import { getSeverityColor, capitalizeFirst } from "@/lib/utils";

export default function PredictionCard({ prediction }) {
  if (!prediction) return null;

  const { name, severity, treatment, confidence } = prediction;
  const severityColorClass = getSeverityColor(severity);

  const severityClasses = {
    high: "bg-error/10 text-severity-high",
    medium: "bg-warning/10 text-severity-medium",
    low: "bg-success/10 text-severity-low",
    none: "bg-info/10 text-severity-none",
  };

  // Handle treatment as either a string (from API) or array (legacy)
  const treatmentItems = Array.isArray(treatment)
    ? treatment
    : typeof treatment === "string" && treatment.length > 0
      ? treatment
          .split(". ")
          .filter((s) => s.trim().length > 0)
          .map((s) => (s.endsWith(".") ? s : s + "."))
      : ["No treatment information available."];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b-2 border-gray-100 gap-4 md:gap-6">
        <div>
          <h2 className="text-3xl md:text-2xl font-bold text-gray-900 mb-2">
            {name}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${severityClasses[severityColorClass] || severityClasses.none}`}
            >
              {severity} Severity
            </span>
          </div>
        </div>
        <div className="relative w-20 h-20 md:self-center">
          <svg className="-rotate-90" width="80" height="80">
            <circle
              className="fill-none stroke-gray-200 stroke-6"
              cx="40"
              cy="40"
              r="35"
            />
            <circle
              className="fill-none stroke-primary stroke-6 rounded-full transition-all duration-500 ease-out"
              cx="40"
              cy="40"
              r="35"
              style={{
                strokeDasharray: `${2 * Math.PI * 35}`,
                strokeDashoffset: `${2 * Math.PI * 35 * (1 - confidence / 100)}`,
              }}
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center">
            <span className="text-lg font-bold text-primary leading-none">
              {confidence}%
            </span>
            <span className="text-xs text-gray-500 leading-none mt-0.5">
              Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Treatment Section */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
          <span className="text-2xl">💊</span>
          Recommended Treatment
        </h3>
        <ul className="list-none p-0 m-0">
          {treatmentItems.map((step, index) => (
            <li
              key={index}
              className="flex items-start gap-4 px-4 py-4 mb-2 bg-gray-50 rounded-md text-gray-600 leading-relaxed transition-all duration-150 hover:bg-gray-100 hover:translate-x-1"
            >
              <span className="flex items-center justify-center min-w-6 h-6 bg-gradient-primary text-white rounded-full text-sm font-bold leading-none">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Info Box */}
      {severity !== "None" && (
        <div className="flex items-start gap-4 p-6 bg-linear-to-br from-info/10 to-info/5 border-l-4 border-info rounded-md mt-8">
          <span className="text-xl shrink-0">ℹ️</span>
          <p className="text-gray-600 text-sm leading-relaxed m-0">
            For accurate diagnosis and treatment, consult with a local
            agricultural expert or extension officer.
          </p>
        </div>
      )}
    </div>
  );
}
