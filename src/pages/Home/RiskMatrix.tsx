import type { IssueDto } from "@/interfaces/Issue/IssueDto";
import { Flex, Tooltip } from "antd";
import React, { useEffect, useState } from "react";

interface Risk {
  id: number;
  name: string;
  impact: number; // 1 = Thấp, 4 = Rất cao
  likelihood: number; // 1 = Hiếm, 5 = Rất cao
}

interface StatusItem {
  id: number;
  color: string;
  count: number;
  label: string;
  textColor: string;
}

interface MarkercoutProps {
  issues: IssueDto[];
}

const RiskMatrix: React.FC<MarkercoutProps> = ({ issues }: MarkercoutProps) => {
  const [statusList, setStatusList] = useState<StatusItem[]>([
    {
      id: 1,
      color: "bg-green-500",
      count: 0,
      label: "Thấp",
      textColor: "text-white",
    },
    {
      id: 2,
      color: "bg-yellow-200",
      count: 0,
      label: "Vừa",
      textColor: "text-white",
    },
    {
      id: 3,
      color: "bg-yellow-400",
      count: 0,
      label: "Cao",
      textColor: "text-white",
    },
    {
      id: 4,
      color: "bg-red-500",
      count: 0,
      label: "Nghiêm trọng",
      textColor: "text-white",
    },
    {
      id: 5,
      color: "bg-white",
      count: 0,
      label: "Chưa đánh giá",
      textColor: "text-black",
    },
  ]);

  const risks: Risk[] = [
    { id: 1, name: "Rò rỉ dữ liệu", impact: 4, likelihood: 3 },
    { id: 2, name: "Mất điện", impact: 3, likelihood: 1 },
    { id: 3, name: "Thiết bị hỏng", impact: 2, likelihood: 4 },
    { id: 4, name: "Cháy nổ", impact: 4, likelihood: 5 },
    { id: 5, name: "Phòng", impact: 4, likelihood: 5 },
  ];

  useEffect(() => {
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;
    let s4 = 0;
    let s5 = 0;
    for (const item of issues) {
      if (item.score == undefined) {
        s5++;
      } else if (item.score >= 15) {
        s4++;
      } else if (item.score >= 8) {
        s3++;
      } else if (item.score >= 4) {
        s2++;
      } else {
        s1++;
      }
    }
    setStatusList([
      {
        id: 1,
        color: "bg-green-500",
        count: s1,
        label: "Thấp",
        textColor: "text-white",
      },
      {
        id: 2,
        color: "bg-yellow-200",
        count: s2,
        label: "Vừa",
        textColor: "text-white",
      },
      {
        id: 3,
        color: "bg-yellow-400",
        count: s3,
        label: "Cao",
        textColor: "text-white",
      },
      {
        id: 4,
        color: "bg-red-500",
        count: s4,
        label: "Nghiêm trọng",
        textColor: "text-white",
      },
      {
        id: 5,
        color: "bg-white",
        count: s5,
        label: "Chưa đánh giá",
        textColor: "text-black",
      },
    ]);
  }, [issues]);

  const impactLevels = ["Rất thấp", "Thấp", "Trung bình", "Cao", "Rất cao"];
  const likelihoodLevels = [
    "Rất nhỏ",
    "Nhỏ",
    "Trung bình",
    "Nghiêm trọng",
    "Thảm họa",
  ];

  const getRiskColor = (impactIdx: number, likelihoodIdx: number) => {
    const score = (impactIdx + 1) * (likelihoodIdx + 1);
    if (score >= 15) return "bg-red-500 text-white";
    if (score >= 8) return "bg-yellow-400 text-black";
    if (score >= 4) return "bg-yellow-200 text-black";
    return "bg-green-500 text-white";
  };

  const groupRisksByCell1 = (risks: IssueDto[]) => {
    const matrix: { [key: string]: IssueDto[] } = {};
    risks.forEach((risk) => {
      const key = `${risk.conseQuence}-${risk.likeLiHood}`;
      if (!matrix[key]) matrix[key] = [];
      matrix[key].push(risk);
    });
    return matrix;
  };

  const grouped = groupRisksByCell1(issues);

  return (
    <Flex vertical justify="space-between" style={{ height: "500px" }}>
      <table className="table-fixed h-full w-full border border-gray-400 mb-5">
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
                      <Tooltip title={r.issueName}>
                        <div
                          key={r.id}
                          className="text-[10px] w-full leading-tight truncate overflow-hidden whitespace-nowrap"
                        >
                          • {r.issueName}
                        </div>
                      </Tooltip>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Flex>
        <div className="flex gap-10 items-center">
          {statusList.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div
                className={`rounded-md px-3 py-1 font-bold text-sm ${item.color} ${item.textColor}`}
              >
                {item.count}
              </div>
              <span className={`text-gray-800 font-medium whitespace-nowrap`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Flex>
    </Flex>
  );
};

export default RiskMatrix;
