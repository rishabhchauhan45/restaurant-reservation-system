import { useState, useEffect } from 'react';
import {
  HiOutlinePlusCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineTable,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ tableNumber: '', capacity: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTables = async () => {
    try {
      const { data } = await API.get('/tables');
      setTables(data.tables);
    } catch (error) {
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openModal = (table = null) => {
    if (table) {
      setEditing(table);
      setFormData({ tableNumber: table.tableNumber, capacity: table.capacity });
    } else {
      setEditing(null);
      setFormData({ tableNumber: '', capacity: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setFormData({ tableNumber: '', capacity: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tableNumber || !formData.capacity) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await API.put(`/tables/${editing._id}`, {
          tableNumber: parseInt(formData.tableNumber),
          capacity: parseInt(formData.capacity),
        });
        toast.success(`Table ${formData.tableNumber} updated`);
      } else {
        await API.post('/tables', {
          tableNumber: parseInt(formData.tableNumber),
          capacity: parseInt(formData.capacity),
        });
        toast.success(`Table ${formData.tableNumber} created`);
      }
      closeModal();
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (table) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Table ${table.tableNumber}?`
      )
    )
      return;

    try {
      await API.delete(`/tables/${table._id}`);
      toast.success(`Table ${table.tableNumber} deleted`);
      fetchTables();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete table');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark-100">Tables</h2>
          <p className="text-sm text-dark-500">{tables.length} tables configured</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary text-sm flex items-center gap-2">
          <HiOutlinePlusCircle className="w-4 h-4" />
          Add Table
        </button>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table._id} className="card group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <HiOutlineTable className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-100">Table {table.tableNumber}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <HiOutlineUserGroup className="w-3.5 h-3.5 text-dark-500" />
                    <span className="text-sm text-dark-400">{table.capacity} seats</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openModal(table)}
                  className="p-2 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-primary-500/5 transition-all"
                  title="Edit"
                >
                  <HiOutlinePencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(table)}
                  className="p-2 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                  title="Delete"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="card text-center py-12">
          <HiOutlineTable className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400">No tables configured yet.</p>
          <button onClick={() => openModal()} className="btn-primary text-sm mt-4">
            Add First Table
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
              <h3 className="text-lg font-semibold text-dark-100">
                {editing ? 'Edit Table' : 'Add New Table'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-dark-800 transition-all"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">
                  Table Number
                </label>
                <input
                  type="number"
                  value={formData.tableNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tableNumber: e.target.value }))
                  }
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">
                  Capacity (seats)
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, capacity: e.target.value }))
                  }
                  className="input-field"
                  min="1"
                  max="20"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;
