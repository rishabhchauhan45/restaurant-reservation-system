import { useState } from 'react';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUserGroup } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
];

const BookingForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    reservationDate: '',
    timeSlot: '',
    guests: 1,
  });
  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reservationDate || !formData.timeSlot || !formData.guests) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.guests < 1 || formData.guests > 20) {
      toast.error('Guests must be between 1 and 20');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/reservations', formData);
      toast.success(
        `Table ${data.reservation.table.tableNumber} reserved for ${formData.guests} guest${formData.guests > 1 ? 's' : ''}!`
      );
      setFormData({ reservationDate: '', timeSlot: '', guests: 1 });
      if (onSuccess) onSuccess(data.reservation);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create reservation';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
          <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
          Reservation Date
        </label>
        <input
          type="date"
          name="reservationDate"
          value={formData.reservationDate}
          onChange={handleChange}
          min={today}
          className="input-field"
          required
        />
      </div>

      {/* Time Slot */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
          <HiOutlineClock className="w-4 h-4 text-primary-500" />
          Time Slot
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                formData.timeSlot === slot
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/5'
                  : 'bg-dark-800/30 text-dark-400 border border-dark-700/30 hover:border-dark-600/50 hover:text-dark-300'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
          <HiOutlineUserGroup className="w-4 h-4 text-primary-500" />
          Number of Guests
        </label>
        <input
          type="number"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          min="1"
          max="20"
          className="input-field"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <HiOutlineCalendar className="w-5 h-5" />
            Reserve Table
          </>
        )}
      </button>
    </form>
  );
};

export default BookingForm;
