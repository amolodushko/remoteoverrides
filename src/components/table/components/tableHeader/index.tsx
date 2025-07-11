const TableHeader = () => {
  const rowStyle = "px-2 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200";
  
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th className={`${rowStyle} w-[2rem]`}>
          App
        </th>
        <th className={rowStyle}>
          Override
        </th>
        <th className={rowStyle}>
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
