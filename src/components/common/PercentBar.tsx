import { cn } from "@/lib/utils";

interface Percent {
  color: string;
  percent: number;
}
// Định nghĩa kiểu cho props
interface PercentBarProps {
  className?: string; // className là optional
  percents: Percent[];
}

export default function PercentBar({ className, percents }: PercentBarProps) {
  return (
    <div className="w-full flex">
      {percents.map((item, index) => {
        return (
          <div
            key={index}
            className={cn(
              `h-[20px] text-white flex items-center justify-center`,
              className
            )}
            style={{
              width: `${item.percent}%`,
              backgroundColor: item.color,
            }}
          >
            {item.percent}%
          </div>
        );
      })}
    </div>
  );
}
