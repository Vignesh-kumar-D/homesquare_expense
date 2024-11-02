// src/pages/Transactions/components/DateRangePicker/DateRangePicker.tsx
import React from 'react';
import styles from './DateRangePicker.module.css';

interface DateRangePickerProps {
  value: {
    startDate: string;
    endDate: string;
  };
  onChange: (dateRange: { startDate: string; endDate: string }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>Date Range</div>
      <div className={styles.pickerGroup}>
        <input
          type="date"
          className={styles.dateInput}
          value={value.startDate}
          onChange={(e) =>
            onChange({
              ...value,
              startDate: e.target.value,
            })
          }
        />
        <span className={styles.separator}>to</span>
        <input
          type="date"
          className={styles.dateInput}
          value={value.endDate}
          min={value.startDate}
          onChange={(e) =>
            onChange({
              ...value,
              endDate: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
