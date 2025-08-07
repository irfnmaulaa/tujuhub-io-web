import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chip, Spinner } from '@heroui/react';
import { TbChevronDown, TbSearch } from 'react-icons/tb';
import { cn } from '@heroui/theme';
import TextField from './TextField';

export interface Option {
  value: string;
  label: string;
  [key: string]: any;
}

export interface MultiSelectAutocompleteProps {
  label?: string;
  placeholder?: string;
  value?: Option[];
  onChange?: (selectedOptions: Option[]) => void;
  onSearch?: (query: string) => Promise<Option[]>;
  initialOptions?: Option[];
  isLoading?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  minSearchLength?: number;
  debounceMs?: number;
  maxSelectedItems?: number;
  noOptionsText?: string;
  searchingText?: string;
  className?: string;
  chipProps?: any;
  inputProps?: any;
}

const MultiSelectAutocomplete: React.FC<MultiSelectAutocompleteProps> = ({
  label,
  placeholder = 'Search and select...',
  value = [],
  onChange,
  onSearch,
  initialOptions = [],
  isLoading = false,
  isDisabled = false,
  isInvalid = false,
  errorMessage,
  minSearchLength = 1,
  debounceMs = 300,
  maxSelectedItems,
  noOptionsText = 'No options found',
  searchingText = 'Searching...',
  className,
  chipProps,
  inputProps,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (!onSearch || query.length < minSearchLength) {
            setOptions([]);
            setIsSearching(false);
            return;
          }

          setIsSearching(true);
          try {
            const results = await onSearch(query);
            setOptions(results || []);
          } catch (error) {
            console.error('Search error:', error);
            setOptions([]);
          } finally {
            setIsSearching(false);
          }
        }, debounceMs);
      };
    })(),
    [onSearch, minSearchLength, debounceMs]
  );

  // Handle search input change
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      setOptions(initialOptions);
      setIsSearching(false);
    }
  }, [searchQuery, debouncedSearch, initialOptions]);

  // Update options when initialOptions change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setOptions(initialOptions);
    }
  }, [initialOptions, searchQuery]);

  // Handle option selection
  const handleOptionSelect = (option: Option) => {
    if (isDisabled) return;
    
    const isAlreadySelected = value.some(item => item.value === option.value);
    if (isAlreadySelected) return;

    if (maxSelectedItems && value.length >= maxSelectedItems) return;

    const newValue = [...value, option];
    onChange?.(newValue);
    inputRef.current?.focus(); // Keep focus on input after selection
  };

  // Handle option removal
  const handleOptionRemove = (optionToRemove: Option) => {
    if (isDisabled) return;
    
    const newValue = value.filter(item => item.value !== optionToRemove.value);
    onChange?.(newValue);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (!isDisabled) {
      setIsOpen(true);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay closing to allow option selection
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 150);
  };

  // Filter out already selected options
  const availableOptions = options.filter(
    option => !value.some(selected => selected.value === option.value)
  );

  return (
    <div className={cn('w-full relative', className)}>
      <TextField
          ref={inputRef}
          label={label}
          placeholder={placeholder}
          value={searchQuery}
          onValueChange={setSearchQuery}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
          errorMessage={errorMessage}
          startContent={<TbSearch className="text-default-400" />}
          endContent={
            <TbChevronDown 
              className={cn(
                'text-default-400 transition-transform',
                isOpen && 'rotate-180'
              )} 
            />
          }
          {...inputProps}
        />

      {/* Search results dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="block w-full mt-1 bg-white border border-default-200 rounded-lg overflow-y-auto resize-y"
          style={{ maxHeight: '200px' }}
        >
          {isSearching || isLoading ? (
            <div className="flex items-center justify-center p-4 text-default-500">
              <Spinner size="sm" className="mr-2" />
              {searchingText}
            </div>
          ) : availableOptions.length > 0 ? (
            <div className="py-1">
              {availableOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-3 py-2 cursor-pointer hover:bg-default-100 transition-colors"
                  onClick={() => handleOptionSelect(option)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-default-500 mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : searchQuery.length >= minSearchLength ? (
            <div className="p-4 text-center text-default-500 text-sm">
              {noOptionsText}
            </div>
          ) : initialOptions.length === 0 ? (
            <div className="p-4 text-center text-default-500 text-sm">
              Type {minSearchLength} or more characters to search
            </div>
          ) : null}
        </div>
      )}

      {/* Selected items as chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((option) => (
            <Chip
              key={option.value}
              size="sm"
              variant="flat"
              onClose={() => handleOptionRemove(option)}
              isDisabled={isDisabled}
              {...chipProps}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectAutocomplete;