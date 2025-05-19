import type { StatusFilterValue } from "@/interfaces/Components/StatusFilterValue";
interface StatusFilterProps {
  status: StatusFilterValue[];
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}
export default function StatusFilter({
  status,
  value,
  setValue,
}: StatusFilterProps) {
  const clickStatus = (newStatus: StatusFilterValue) => {
    setValue(newStatus.value);
  };
  return (
    <div className="w-full flex">
      {status.map((x: StatusFilterValue) => (
        <span
          onClick={() => clickStatus(x)}
          className={`px-2 py-0.25 rounded-full transition cursor-pointer ${
            value == x.value
              ? "bg-emerald-600 text-white"
              : "text-gray-600 hover:text-black"
          }`}
        >
          {x.name}
        </span>
      ))}
    </div>
  );
}
