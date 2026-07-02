import { useState, useEffect } from 'react';
import {
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineTable,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import DateFilter from './DateFilter';

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
];

const ReservationManager = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editForm, setEditForm] = useState({
    reservationDate: '',
    timeSlot: '',
    guests: 1,
    status: 'confirmed',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFilter) params.date = dateFilter;
      const { data } = await API.get('/reservations', { params });
      setReservations(data.reservations);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [dateFilter]);

  const openEdit = (reservation) => {
    setEditingReservation(reservation);
    setEditForm({
      reservationDate: reservation.reservationDate,
      timeSlot: reservation.timeSlot,
      guests: reservation.guests,
      status: reservation.status,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/reservations/${editingReservation._id}`, editForm);
      toast.success('Reservation updated');
      setShowEditModal(false);
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await API.patch(`/reservations/${id}/cancel`);
      toast.success('Reservation cancelled');
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark-100">Reservations</h2>
          <p className="text-sm text-dark-500">
            {reservations.length} reservation{reservations.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <DateFilter
          date={dateFilter}
          onChange={setDateFilter}
          onClear={() => setDateFilter('')}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <div className="card text-center py-12">
          <HiOutlineCalendar className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400">
            {dateFilter ? 'No reservations for this date.' : 'No reservations yet.'}
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/30">
                {reservations.map((r) => (
                  <tr key={r._id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-dark-200">{r.user?.name}</p>
                        <p className="text-xs text-dark-500">{r.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <HiOutlineTable className="w-4 h-4 text-primary-500" />
                        <span className="text-sm text-dark-300">#{r.table?.tableNumber}</span>
                        <span className="text-xs text-dark-500">({r.table?.capacity}s)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-300">
                      {formatDate(r.reservationDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-300">{r.timeSlot}</td>
                    <td className="px-6 py-4 text-sm text-dark-300">{r.guests}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          r.status === 'confirmed'
                            ? 'badge-confirmed'
                            : 'badge-cancelled'
                        }
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {r.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => openEdit(r)}
                              className="p-2 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-primary-500/5 transition-all"
                              title="Edit"
                            >
                              <HiOutlinePencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(r._id)}
                              className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                              title="Cancel"
                            >
                              <HiOutlineX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
              <h3 className="text-lg font-semibold text-dark-100">Edit Reservation</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-all"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-1.5">
                  <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
                  Date
                </label>
                <input
                  type="date"
                  value={editForm.reservationDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, reservationDate: e.target.value }))
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-1.5">
                  <HiOutlineClock className="w-4 h-4 text-primary-500" />
                  Time Slot
                </label>
                <select
                  value={editForm.timeSlot}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, timeSlot: e.target.value }))
                  }
                  className="input-field"
                  required
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-1.5">
                  <HiOutlineUserGroup className="w-4 h-4 text-primary-500" />
                  Guests
                </label>
                <input
                  type="number"
                  value={editForm.guests}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      guests: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="input-field"
                  min="1"
                  max="20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="input-field"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManager;
