import { HiOutlineCalendar } from 'react-icons/hi';
import ReservationCard from './ReservationCard';

const ReservationList = ({ reservations, onCancel, showUser = false, emptyMessage }) => {
  if (!reservations || reservations.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-800/50 flex items-center justify-center mb-4">
          <HiOutlineCalendar className="w-8 h-8 text-dark-600" />
        </div>
        <h3 className="text-lg font-semibold text-dark-300 mb-1">No Reservations</h3>
        <p className="text-sm text-dark-500 max-w-sm">
          {emptyMessage || 'No reservations found. Book a table to get started!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation._id}
          reservation={reservation}
          onCancel={onCancel}
          showUser={showUser}
        />
      ))}
    </div>
  );
};

export default ReservationList;
