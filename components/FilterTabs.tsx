import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FilterType } from '../types';
import { FILTER_LABELS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: FilterType[] = ['all', 'active', 'completed'];

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const { isDark } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
      {FILTERS.map((filter) => (
        <Pressable
          key={filter}
          onPress={() => onFilterChange(filter)}
          style={[styles.tab, activeFilter === filter && { backgroundColor: isDark ? '#374151' : '#ffffff' }]}
        >
          <Text style={[styles.tabText, { color: activeFilter === filter ? '#3b82f6' : (isDark ? '#9ca3af' : '#4b5563') }]}>
            {FILTER_LABELS[filter]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  tabText: { textAlign: 'center', fontSize: 14, fontWeight: '500' },
});

export default FilterTabs;
