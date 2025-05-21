import React from "react";

interface Risk {
  id: number;
  name: string;
  impact: number; // 1 = Thấp, 4 = Rất cao
  likelihood: number; // 1 = Hiếm, 5 = Rất cao
}

const RiskMatrix: React.FC = () => {
  const risks: Risk[] = [
    { id: 1, name: "Rò rỉ dữ liệu", impact: 4, likelihood: 3 },
    { id: 2, name: "Mất điện", impact: 3, likelihood: 1 },
    { id: 3, name: "Thiết bị hỏng", impact: 2, likelihood: 4 },
    { id: 4, name: "Cháy nổ", impact: 4, likelihood: 5 },
    { id: 5, name: "Phòng", impact: 4, likelihood: 5 },
  ];

  const impactLevels = ["Thấp", "Trung bình", "Cao", "Rất cao"];
  const likelihoodLevels = ["Hiếm", "Thấp", "Vừa", "Cao", "Rất cao"];

  const getRiskColor = (impactIdx: number, likelihoodIdx: number) => {
    const score = (impactIdx + 1) * (likelihoodIdx + 1);
    if (score >= 15) return "bg-red-500 text-white";
    if (score >= 8) return "bg-yellow-400 text-black";
    return "bg-green-500 text-white";
  };

  const groupRisksByCell = (risks: Risk[]) => {
    const matrix: { [key: string]: Risk[] } = {};
    risks.forEach((risk) => {
      const key = `${risk.impact}-${risk.likelihood}`;
      if (!matrix[key]) matrix[key] = [];
      matrix[key].push(risk);
    });
    return matrix;
  };

  const grouped = groupRisksByCell(risks);

  return (
    <table className="table-fixed w-full border border-gray-400">
      <thead>
        <tr>
          <th className="border-1 border-black relative w-24 h-20 p-0">
            <div className="absolute inset-0">
              <svg width="100%" height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="100%"
                  stroke="black"
                  strokeWidth="1px"
                />
              </svg>

              {/* Tác động ↓ */}
              <div className="absolute top-1 right-1 text-xs text-left leading-tight ">
                <span className="block mt-2">Tác động</span>
              </div>

              {/* Khả năng → */}
              <div className="absolute bottom-1 left-1 text-xs text-right leading-tight ">
                <span className="block mb-2">Khả năng</span>
              </div>
            </div>
          </th>
          {likelihoodLevels.map((level, i) => (
            <th key={i} className="border-1 border-black px-2 py-1 text-sm">
              {level}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {impactLevels.map((impact, i) => (
          <tr key={i}>
            <td className="border-1 border-black px-2 py-1 text-sm font-semibold whitespace-nowrap w-32">
              {impact}
            </td>
            {likelihoodLevels.map((_, j) => {
              const key = `${i + 1}-${j + 1}`;
              const risksInCell = grouped[key] || [];
              return (
                <td
                  key={j}
                  className={`border-1 border-black px-2 py-2 align-top ${getRiskColor(
                    i,
                    j
                  )}`}
                >
                  <div className="text-[15px] font-bold">
                    {(i + 1) * (j + 1)}
                  </div>
                  {risksInCell.map((r) => (
                    <div key={r.id} className="text-[15px] leading-tight">
                      • {r.name}
                    </div>
                  ))}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RiskMatrix;
