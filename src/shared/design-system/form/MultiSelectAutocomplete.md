# MultiSelectAutocomplete Component

A flexible multi-select autocomplete component with async data support, built with HeroUI components.

## Features

- ✅ Async data fetching with debounced search
- ✅ Multiple selection with chips display
- ✅ Customizable search debounce timing
- ✅ Maximum selection limit
- ✅ Loading states and error handling
- ✅ Keyboard navigation support
- ✅ Fully customizable styling
- ✅ TypeScript support

## Basic Usage

```tsx
import { MultiSelectAutocomplete, Option } from '@/shared/design-system/form';

const MyComponent = () => {
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);

  const searchFunction = async (query: string): Promise<Option[]> => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
  };

  return (
    <MultiSelectAutocomplete
      label="Select Items"
      placeholder="Search for items..."
      value={selectedItems}
      onChange={setSelectedItems}
      onSearch={searchFunction}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `placeholder` | `string` | `'Search and select...'` | Input placeholder |
| `value` | `Option[]` | `[]` | Selected options |
| `onChange` | `(options: Option[]) => void` | - | Callback when selection changes |
| `onSearch` | `(query: string) => Promise<Option[]>` | - | Async search function |
| `isLoading` | `boolean` | `false` | External loading state |
| `isDisabled` | `boolean` | `false` | Disable the component |
| `isInvalid` | `boolean` | `false` | Show invalid state |
| `errorMessage` | `string` | - | Error message to display |
| `minSearchLength` | `number` | `1` | Minimum characters to trigger search |
| `debounceMs` | `number` | `300` | Debounce delay in milliseconds |
| `maxSelectedItems` | `number` | - | Maximum number of selectable items |
| `noOptionsText` | `string` | `'No options found'` | Text when no options available |
| `searchingText` | `string` | `'Searching...'` | Text during search |
| `className` | `string` | - | Additional CSS classes |
| `chipProps` | `object` | - | Props for selected item chips |
| `inputProps` | `object` | - | Props for the input field |

## Option Interface

```tsx
interface Option {
  value: string;        // Unique identifier
  label: string;        // Display text
  description?: string; // Optional description
  [key: string]: any;   // Additional properties
}
```

## Advanced Examples

### With API Integration

```tsx
const searchUsers = async (query: string): Promise<Option[]> => {
  try {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
    const users = await response.json();
    
    return users.map(user => ({
      value: user.id,
      label: user.name,
      description: user.email
    }));
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};

<MultiSelectAutocomplete
  label="Select Team Members"
  placeholder="Search users by name or email..."
  value={selectedUsers}
  onChange={setSelectedUsers}
  onSearch={searchUsers}
  minSearchLength={2}
  debounceMs={500}
  maxSelectedItems={5}
/>
```

### With Custom Styling

```tsx
<MultiSelectAutocomplete
  label="Select Tags"
  value={selectedTags}
  onChange={setSelectedTags}
  onSearch={searchTags}
  chipProps={{
    color: 'primary',
    variant: 'solid',
    size: 'sm'
  }}
  inputProps={{
    variant: 'bordered',
    color: 'primary',
    radius: 'lg'
  }}
  className="custom-multiselect"
/>
```

### With Form Integration

```tsx
import { useForm, Controller } from 'react-hook-form';

const MyForm = () => {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="selectedItems"
        control={control}
        render={({ field, fieldState }) => (
          <MultiSelectAutocomplete
            label="Required Selection"
            value={field.value || []}
            onChange={field.onChange}
            onSearch={searchFunction}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </form>
  );
};
```

## Performance Tips

1. **Debouncing**: Adjust `debounceMs` based on your API response time
2. **Minimum Search Length**: Set `minSearchLength` to reduce unnecessary API calls
3. **Memoization**: Memoize your search function to prevent unnecessary re-renders
4. **Error Handling**: Always handle errors in your search function

## Accessibility

- Supports keyboard navigation
- ARIA labels for screen readers
- Focus management
- Proper contrast ratios

## Dependencies

- `@heroui/react` - UI components
- `react-icons/tb` - Icons
- `lodash` - Debounce utility