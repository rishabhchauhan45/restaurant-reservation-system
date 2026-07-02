import { HiOutlineCalendar, HiOutlineX } from 'react-icons/hi';

const DateFilter = ({ date, onChange, onClear }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input
          type="date"
          value={date}
          onChange={(e) => onChange(e.target.value)}
          className="input-field !pl-10"
          placeholder="Filter by date"
        />
      </div>
      {date && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-dark-400 hover:text-dark-200 bg-dark-800/30 border border-dark-700/30 hover:border-dark-600/50 transition-all"
        >
          <HiOutlineX className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  );
};

export default DateFilter;
