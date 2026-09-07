
import { DashboardCardProps } from "@/types";
import Link from "next/link";

// Responsive, reusable dashboard card
const DashboardCard = ({
  icon,
  title,
  count,
  linkTo,
  color,
  children, 
}: DashboardCardProps & { children?: React.ReactNode }) => (
  <Link href={linkTo} className="block h-full">
    <div className="bg-customTeal/5 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group h-full flex flex-col w-full min-h-[180px]">
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className={`${color} text-white p-2 sm:p-3 rounded-xl w-fit`}>
          {icon}
        </div>
        <h3 className="font-semibold mt-3 sm:mt-4 text-gray-800 text-base sm:text-lg">{title}</h3>
        <div className="mt-2 flex items-end justify-between flex-1">
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">{count}</span>
          <span className="text-xs sm:text-sm text-customTeal group-hover:underline">View details</span>
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  </Link>
);

export default DashboardCard;