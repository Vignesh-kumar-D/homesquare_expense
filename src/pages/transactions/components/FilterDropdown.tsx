// src/pages/Transactions/components/FilterDropdown/FilterDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './FilterDropdown.module.css';

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <label className={styles.label}>{label}</label>

      <div className={styles.dropdown}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.selectedText}>
            {selectedOption?.label || 'Select...'}
          </span>
          <svg
            className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={styles.menu}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.search}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className={styles.optionsList}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`${styles.option} ${
                      option.value === value ? styles.selected : ''
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    {option.label}
                    {option.value === value && (
                      <svg
                        className={styles.checkmark}
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L4.5 7.5L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className={styles.noResults}>No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterDropdown;
