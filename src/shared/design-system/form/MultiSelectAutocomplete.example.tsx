import React, { useState } from 'react';
import MultiSelectAutocomplete, { type Option } from './MultiSelectAutocomplete';

// Mock API function to simulate async data fetching
const mockSearchAPI = async (query: string): Promise<Option[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - in real usage, this would be an actual API call
  const mockData: Option[] = [
    { value: '1', label: 'React', description: 'A JavaScript library for building user interfaces' },
    { value: '2', label: 'Vue.js', description: 'The Progressive JavaScript Framework' },
    { value: '3', label: 'Angular', description: 'Platform for building mobile and desktop web applications' },
    { value: '4', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
    { value: '5', label: 'Next.js', description: 'The React Framework for Production' },
    { value: '6', label: 'Nuxt.js', description: 'The Intuitive Vue Framework' },
    { value: '7', label: 'Gatsby', description: 'Build blazing fast, modern apps and websites with React' },
    { value: '8', label: 'Remix', description: 'Full stack web framework focused on web standards' },
  ];
  
  // Filter based on search query
  return mockData.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );
};

const MultiSelectAutocompleteExample: React.FC = () => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<Option[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<Option[]>([]);

  return (
    <div className="space-y-6 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">MultiSelectAutocomplete Examples</h2>
      
      {/* Basic Example */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
        <MultiSelectAutocomplete
          label="Select Frameworks"
          placeholder="Search for frameworks..."
          value={selectedFrameworks}
          onChange={setSelectedFrameworks}
          onSearch={mockSearchAPI}
          minSearchLength={2}
        />
        
        {selectedFrameworks.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {selectedFrameworks.map(f => f.label).join(', ')}
          </div>
        )}
      </div>
      
      {/* With Max Items */}
      <div>
        <h3 className="text-lg font-semibold mb-2">With Maximum Selection (3 items)</h3>
        <MultiSelectAutocomplete
          label="Select Technologies (Max 3)"
          placeholder="Search for technologies..."
          value={selectedTechnologies}
          onChange={setSelectedTechnologies}
          onSearch={mockSearchAPI}
          maxSelectedItems={3}
          minSearchLength={1}
          debounceMs={200}
        />
        
        <div className="mt-2 text-sm text-gray-600">
          {selectedTechnologies.length}/{3} selected
        </div>
      </div>
      
      {/* Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Custom Styling</h3>
        <MultiSelectAutocomplete
          label="Custom Styled"
          placeholder="Search..."
          value={[]}
          onChange={() => {}}
          onSearch={mockSearchAPI}
          className="custom-multiselect"
          chipProps={{
            color: 'primary',
            variant: 'solid'
          }}
          inputProps={{
            variant: 'bordered',
            color: 'primary'
          }}
        />
      </div>
    </div>
  );
};

export default MultiSelectAutocompleteExample;