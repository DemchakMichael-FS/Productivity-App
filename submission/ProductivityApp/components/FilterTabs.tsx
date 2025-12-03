import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { FilterType } from '../types';
import { FILTER_LABELS } from '../constants';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: FilterType[] = ['all', 'active', 'completed'];

/**
 * FilterTabs component provides filter buttons to switch between
 * All, Active, and Completed task views.
 */
export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4">
      {FILTERS.map((filter) => (
        <Pressable
          key={filter}
          onPress={() => onFilterChange(filter)}
          className={`flex-1 py-2 px-4 rounded-lg ${
            activeFilter === filter
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : ''
          }`}
        >
          <Text
            className={`text-center text-sm font-medium ${
              activeFilter === filter
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {FILTER_LABELS[filter]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default FilterTabs;
