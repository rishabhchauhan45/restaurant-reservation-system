import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlinePlusCircle,
  HiOutlineClock,
  HiOutlineTable,
} from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import API from '../api/axios';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ upcoming: 0, total: 0, cancelled: 0 });
  const [recentReservations, setRecentReservations] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/reservations/my');
        const reservations = data.reservations;
        const today = new Date().toISOString().split('T')[0];

        setStats({
          upcoming: reservations.filter(
            (r) => r.status === 'confirmed' && r.reservationDate >= today
          ).length,
          total: reservations.length,
          cancelled: reservations.filter((r) => r.status === 'cancelled').length,
        });

        setRecentReservations(reservations.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const statCards = [
    {
      label: 'Upcoming',
      value: stats.upcoming,
      icon: HiOutlineClock,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
    },
    {
      label: 'Total Bookings',
      value: stats.total,
      icon: HiOutlineCalendar,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: HiOutlineClipboardList,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="section-title">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
            {user?.name}
          </span>
        </h1>
        <p className="section-subtitle">Manage your dining reservations with ease.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-100">{value}</p>
                <p className="text-sm text-dark-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/book" className="card group hover:border-primary-500/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiOutlinePlusCircle className="w-6 h-6 text-dark-950" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-100 group-hover:text-primary-400 transition-colors">
              Book a Table
            </h3>
            <p className="text-sm text-dark-500">Reserve your perfect dining spot</p>
          </div>
        </Link>
        <Link
          to="/my-reservations"
          className="card group hover:border-primary-500/30 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiOutlineClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-100 group-hover:text-blue-400 transition-colors">
              My Reservations
            </h3>
            <p className="text-sm text-dark-500">View and manage your bookings</p>
          </div>
        </Link>
      </div>

      {/* Recent Reservations */}
      {recentReservations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-200">Recent Reservations</h2>
            <Link
              to="/my-reservations"
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentReservations.map((r) => (
              <div
                key={r._id}
                className="glass rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      r.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    <HiOutlineTable className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-200">
                      Table {r.table?.tableNumber} · {r.guests} guest{r.guests > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-dark-500">
                      {formatDate(r.reservationDate)} at {r.timeSlot}
                    </p>
                  </div>
                </div>
                <span
                  className={r.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
