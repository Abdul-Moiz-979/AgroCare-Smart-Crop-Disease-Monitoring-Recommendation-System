export function PieChart({ data, title }) {
  const total = data.reduce((sum, item) => sum + item.scans, 0);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-md">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
        {title}
      </h3>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = (item.scans / total) * 100;
              const cumulativeBefore = data
                .slice(0, index)
                .reduce(
                  (sum, current) => sum + (current.scans / total) * 100,
                  0,
                );
              const startAngle = (cumulativeBefore / 100) * 360;
              const endAngle = ((cumulativeBefore + percentage) / 100) * 360;

              const startX =
                50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
              const startY =
                50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
              const endX =
                50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
              const endY =
                50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));

              const largeArc = percentage > 50 ? 1 : 0;
              const pathData = `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArc} 1 ${endX} ${endY} Z`;

              const colors = [
                "hsl(142, 76%, 36%)",
                "hsl(45, 93%, 47%)",
                "hsl(197, 71%, 52%)",
              ];

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="transition-opacity duration-300 hover:opacity-80 cursor-pointer"
                />
              );
            })}
          </svg>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {data.map((item, index) => {
            const colors = [
              "hsl(142, 76%, 36%)",
              "hsl(45, 93%, 47%)",
              "hsl(197, 71%, 52%)",
            ];
            return (
              <div key={index} className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="text-gray-900 font-medium">{item.crop}</span>
                <span className="text-gray-500 ml-auto">
                  {item.scans} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BarChart({ data, title }) {
  const maxValue = Math.max(...data.map((item) => item.scans), 0);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-md">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
        {title}
      </h3>
      <div className="flex items-end justify-between gap-4 h-64">
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.scans / maxValue) * 100 : 0;
          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 gap-2"
            >
              <div
                className="relative w-full flex items-end justify-center"
                style={{ height: "200px" }}
              >
                <div
                  className="w-full bg-gradient-primary rounded-t-lg transition-all duration-500 hover:opacity-90 relative group"
                  style={{ height: `${height}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-900">
                    {item.scans}
                  </span>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LineChart({ data, title }) {
  const maxValue = Math.max(...data.map((item) => item.scans));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.scans / maxValue) * 80;
    return { x, y, value: item.scans, label: item.month };
  });

  const pathData = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    })
    .join(" ");

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-md">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
        {title}
      </h3>
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-64"
        >
          {/* Grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              className="stroke-gray-200"
              strokeWidth="0.5"
            />
          ))}

          {/* Line path */}
          <path d={pathData} className="fill-none stroke-primary stroke-2" />

          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              className="fill-primary stroke-white stroke-1"
            />
          ))}
        </svg>

        <div className="flex justify-between mt-4">
          {data.map((item, index) => (
            <span key={index} className="text-sm text-gray-600 font-medium">
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Charts({ type = "bar", data, title }) {
  if (type === "pie") {
    return <PieChart data={data} title={title} />;
  } else if (type === "line") {
    return <LineChart data={data} title={title} />;
  }
  return <BarChart data={data} title={title} />;
}
