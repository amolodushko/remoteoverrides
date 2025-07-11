import { Tooltip } from 'react-tooltip';

const NameColumn = ({
  id,
  app,
  label,
}: {
  id: number;
  app: string;
  label: string;
}) => {
  return (
    <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
      <span
        data-tooltip-id={`tooltip-app-${id}`}
        className="cursor-pointer"
      >
        {app}
      </span>
      <Tooltip 
        id={`tooltip-app-${id}`}
        content={label}
        className="bg-gray-900 text-white px-3 py-2 text-sm rounded-lg shadow-lg z-50"
      />
    </td>
  );
};

export default NameColumn;
