// src/pages/Transactions/Transactions.tsx
import React, { useState } from 'react';
import DateRangePicker from './components/DateRangePicker';
import FilterDropdown from './components/FilterDropdown';
import TransactionGrid from './components/TransactionGrid';
import styles from './Transactions.module.css';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface Filters {
  dateRange: DateRange;
  employee: string;
  project: string;
  category: string;
  type: 'ALL' | 'CREDIT' | 'DEBIT';
}

const Transactions: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: { startDate: '', endDate: '' },
    employee: '',
    project: '',
    category: '',
    type: 'ALL',
  });

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Transactions</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <DateRangePicker
            value={filters.dateRange}
            onChange={(dateRange) =>
              setFilters((prev) => ({ ...prev, dateRange }))
            }
          />
          <FilterDropdown
            label="Employee"
            options={[
              { value: '', label: 'All Employees' },
              { value: 'emp1', label: 'John Doe' },
              { value: 'emp2', label: 'Jane Smith' },
            ]}
            value={filters.employee}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, employee: value }))
            }
          />
          <FilterDropdown
            label="Project"
            options={[
              { value: '', label: 'All Projects' },
              { value: '1', label: 'Website Redesign' },
              { value: '2', label: 'Mobile App' },
            ]}
            value={filters.project}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, project: value }))
            }
          />
          <FilterDropdown
            label="Category"
            options={[
              { value: '', label: 'All Categories' },
              { value: 'software', label: 'Software' },
              { value: 'hardware', label: 'Hardware' },
              { value: 'services', label: 'Services' },
            ]}
            value={filters.category}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value }))
            }
          />
        </div>

        <div className={styles.typeFilters}>
          <button
            className={`${styles.typeButton} ${
              filters.type === 'ALL' ? styles.active : ''
            }`}
            onClick={() => setFilters((prev) => ({ ...prev, type: 'ALL' }))}
          >
            All
          </button>
          <button
            className={`${styles.typeButton} ${
              filters.type === 'CREDIT' ? styles.active : ''
            }`}
            onClick={() => setFilters((prev) => ({ ...prev, type: 'CREDIT' }))}
          >
            Credits
          </button>
          <button
            className={`${styles.typeButton} ${
              filters.type === 'DEBIT' ? styles.active : ''
            }`}
            onClick={() => setFilters((prev) => ({ ...prev, type: 'DEBIT' }))}
          >
            Debits
          </button>
        </div>
      </div>

      <TransactionGrid filters={filters} searchTerm={searchTerm} />
    </div>
  );
};

export default Transactions;
