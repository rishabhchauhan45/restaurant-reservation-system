import { useState, useEffect } from 'react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../api/axios';
import ReservationList from '../components/reservation/ReservationList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReservations = async () => {
    try {
      const { data } = await API.get('/reservations/my');
      setReservations(data.reservations);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
    );
  };

  const filteredReservations = reservations.filter((r) => {
    if (filter === 'confirmed') return r.status === 'confirmed';
    if (filter === 'cancelled') return r.status === 'cancelled';
    return true;
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <HiOutlineClipboardList className="w-8 h-8 text-primary-500" />
            My Reservations
          </h1>
          <p className="section-subtitle">{reservations.length} total reservations</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 glass rounded-xl">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === id
                  ? 'bg-primary-500/15 text-primary-400'
                  : 'text-dark-400 hover:text-dark-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ReservationList
          reservations={filteredReservations}
          onCancel={handleCancel}
          emptyMessage={
            filter !== 'all'
              ? `No ${filter} reservations found.`
              : 'You haven\'t made any reservations yet.'
          }
        />
      )}
    </div>
  );
};

export default MyReservations;
