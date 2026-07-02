import { useState, useEffect } from 'react';
import {
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineTable,
  HiOutlineClock,
} from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import API from '../api/axios';
import ReservationManager from '../components/admin/ReservationManager';
import TableManager from '../components/admin/TableManager';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');
  const [stats, setStats] = useState({
    totalReservations: 0,
    todayReservations: 0,
    totalTables: 0,
    confirmedToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [reservationsRes, todayRes, tablesRes] = await Promise.all([
          API.get('/reservations'),
          API.get(`/reservations?date=${today}`),
          API.get('/tables'),
        ]);

        setStats({
          totalReservations: reservationsRes.data.count,
          todayReservations: todayRes.data.count,
          totalTables: tablesRes.data.count,
          confirmedToday: todayRes.data.reservations.filter(
            (r) => r.status === 'confirmed'
          ).length,
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Reservations',
      value: stats.totalReservations,
      icon: HiOutlineClipboardList,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
    },
    {
      label: "Today's Bookings",
      value: stats.todayReservations,
      icon: HiOutlineCalendar,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Confirmed Today',
      value: stats.confirmedToday,
      icon: HiOutlineClock,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Total Tables',
      value: stats.totalTables,
      icon: HiOutlineTable,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  const tabs = [
    { id: 'reservations', label: 'Reservations', icon: HiOutlineClipboardList },
    { id: 'tables', label: 'Tables', icon: HiOutlineTable },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="section-title">
          Admin{' '}
          <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="section-subtitle">
          Welcome, {user?.name}. Manage reservations and tables.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-dark-100">{value}</p>
                <p className="text-xs text-dark-500 truncate">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 glass rounded-xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === id
                ? 'bg-primary-500/15 text-primary-400 shadow-lg shadow-primary-500/5'
                : 'text-dark-400 hover:text-dark-300 hover:bg-dark-800/30'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'reservations' ? <ReservationManager /> : <TableManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
