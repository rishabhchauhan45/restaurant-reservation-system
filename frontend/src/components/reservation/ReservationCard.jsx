import { useState } from 'react';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineTable,
  HiOutlineX,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const ReservationCard = ({ reservation, onCancel, showUser = false }) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    setCancelling(true);
    try {
      await API.patch(`/reservations/${reservation._id}/cancel`);
      toast.success('Reservation cancelled successfully');
      if (onCancel) onCancel(reservation._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isConfirmed = reservation.status === 'confirmed';

  return (
    <div className="card animate-fade-in group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isConfirmed
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            <HiOutlineTable className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-100">
              Table {reservation.table?.tableNumber}
            </h3>
            <p className="text-xs text-dark-500">
              {reservation.table?.capacity} seats
            </p>
          </div>
        </div>
        <span className={isConfirmed ? 'badge-confirmed' : 'badge-cancelled'}>
          {reservation.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <HiOutlineCalendar className="w-4 h-4 text-dark-500 shrink-0" />
          <span className="text-dark-300">{formatDate(reservation.reservationDate)}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <HiOutlineClock className="w-4 h-4 text-dark-500 shrink-0" />
          <span className="text-dark-300">{reservation.timeSlot}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <HiOutlineUserGroup className="w-4 h-4 text-dark-500 shrink-0" />
          <span className="text-dark-300">
            {reservation.guests} guest{reservation.guests > 1 ? 's' : ''}
          </span>
        </div>
        {showUser && reservation.user && (
          <div className="flex items-center gap-3 text-sm pt-1 border-t border-dark-700/30">
            <div className="w-4 h-4 rounded bg-primary-500/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-primary-400">
                {reservation.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-dark-400">
              {reservation.user.name} &middot; {reservation.user.email}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {isConfirmed && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="btn-danger w-full text-sm flex items-center justify-center gap-2"
        >
          <HiOutlineX className="w-4 h-4" />
          {cancelling ? 'Cancelling...' : 'Cancel Reservation'}
        </button>
      )}
    </div>
  );
};

export default ReservationCard;
