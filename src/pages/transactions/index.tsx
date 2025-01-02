// src/pages/transactions/Transactions.tsx
import React, { useState } from 'react';
import DateRangePicker from './components/DateRangePicker';
import FilterDropdown from './components/FilterDropdown';
import TransactionGrid from './components/TransactionGrid';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import { Filters } from './types';
import styles from './Transactions.module.css';

const Transactions: React.FC = () => {
  const { options, loading: optionsLoading } = useFilterOptions();

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
            options={options.employees}
            value={filters.employee}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, employee: value }))
            }
            disabled={optionsLoading}
          />
          <FilterDropdown
            label="Project"
            options={options.projects}
            value={filters.project}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, project: value }))
            }
            disabled={optionsLoading}
          />
          <FilterDropdown
            label="Category"
            options={options.categories}
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
              filters.type === 'ALLOCATED' ? styles.active : ''
            }`}
            onClick={() =>
              setFilters((prev) => ({ ...prev, type: 'ALLOCATED' }))
            }
          >
            Allocated
          </button>
          <button
            className={`${styles.typeButton} ${
              filters.type === 'SPENT' ? styles.active : ''
            }`}
            onClick={() => setFilters((prev) => ({ ...prev, type: 'SPENT' }))}
          >
            Spent
          </button>
        </div>
      </div>

      <TransactionGrid filters={filters} searchTerm={searchTerm} />
    </div>
  );
};

export default Transactions;
