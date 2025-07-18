const TableHeader = () => {
  const rowStyle = "bg-[#f5f5f5] text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10";
  const wrapperStyle = "px-2 py-2 border-t border-b border-gray-200 bg-gray-50";
  
  return (
    <thead className="">
      <tr>
        <th className={`${rowStyle} w-[2rem]`}>
          <div className={`${wrapperStyle} border-l rounded-tl-lg relative`} style={{ left: '-1px', width: 'calc(100% + 1px)' }}>
            App
          </div>
        </th>
        <th className={rowStyle}>
          <div className={wrapperStyle}>
            Override
          </div>
        </th>
        <th className={rowStyle}>
          <div className={`${wrapperStyle} border-r rounded-tr-lg`}>
            Actions
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
