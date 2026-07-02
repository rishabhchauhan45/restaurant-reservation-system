import TableManager from '../components/admin/TableManager';
import { HiOutlineTable } from 'react-icons/hi';

const ManageTables = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="section-title flex items-center gap-3">
          <HiOutlineTable className="w-8 h-8 text-primary-500" />
          Manage Tables
        </h1>
        <p className="section-subtitle">Add, edit, or remove restaurant tables</p>
      </div>
      <TableManager />
    </div>
  );
};

export default ManageTables;
