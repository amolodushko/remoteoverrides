import { Tooltip } from "react-tooltip";
import { useOverrideValue } from "../../hooks/useOverrideValue";

const OverrideColumn = ({ app }: { app: string }) => {
  const override = useOverrideValue(app);

  return (
    <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-500 w-[396px]">
      <span
        data-tooltip-id={`tooltip-app-${app}`}
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          override
            ? "bg-yellow-100 text-yellow-900"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {override ?? "No override..."}
        {override && (
          <Tooltip
            id={`tooltip-app-${app}`}
            content={`${app}@${override}`}
            className="bg-gray-900 text-white px-3 py-2 text-sm rounded-lg shadow-lg z-50"
          />
        )}
      </span>
    </td>
  );
};

export default OverrideColumn;
