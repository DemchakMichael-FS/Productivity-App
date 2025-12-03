# Development Reflection

## Project Overview

This productivity app was built as a 3-day assignment to demonstrate proficiency in cross-platform mobile development using Expo, TypeScript, and modern React Native practices.

## What I Learned

### 1. Expo and React Native Development
- Setting up an Expo project with TypeScript from scratch
- Understanding the Expo Router file-based navigation system
- Working with native modules like SQLite and SecureStore
- Building responsive layouts that work across mobile and web

### 2. NativeWind and Styling
- Integrating Tailwind CSS with React Native through NativeWind
- Implementing dark mode using Tailwind's `dark:` prefix
- Creating consistent design systems with custom color palettes
- Building reusable styled components

### 3. State Management
- Using React Context for global state (theme management)
- Managing local component state with useState
- Handling async operations with useEffect and useCallback
- Implementing data refresh patterns with useFocusEffect

### 4. Data Persistence
- Working with SQLite for structured data storage
- Using SecureStore for sensitive user preferences
- Implementing platform-specific storage fallbacks (localStorage for web)
- Error handling patterns for database operations

### 5. TypeScript Best Practices
- Defining clear interfaces for data models
- Using type guards and type assertions appropriately
- Creating reusable type definitions
- Leveraging TypeScript for better code documentation

## Challenges Faced

### Challenge 1: Cross-Platform Compatibility
**Problem**: SQLite and SecureStore behave differently on web vs. native platforms.

**Solution**: Implemented platform detection and fallback mechanisms. For SecureStore, created a web fallback using localStorage. For SQLite, accepted the limitation that web uses in-memory storage.

### Challenge 2: Dark Mode Implementation
**Problem**: Ensuring dark mode applies consistently across all components and screens.

**Solution**: Created a ThemeContext that wraps the entire app, persists theme preference to SecureStore, and applies the appropriate class to enable NativeWind's dark mode classes.

### Challenge 3: NativeWind Configuration
**Problem**: Setting up NativeWind v4 with Expo SDK 52 required specific configuration.

**Solution**: Carefully followed the NativeWind documentation, configured babel.config.js, metro.config.js, and tailwind.config.js correctly, and ensured global.css was properly imported.

### Challenge 4: Form Validation and User Feedback
**Problem**: Providing consistent user feedback across platforms (Alert on native, window.alert on web).

**Solution**: Implemented platform-specific alert handling using Platform.OS checks, ensuring users receive appropriate feedback regardless of platform.

## What I Would Do Differently

1. **Add Unit Tests**: Include Jest tests for services and components to ensure reliability.

2. **Implement Task Editing**: Add the ability to edit existing tasks, not just create and delete.

3. **Add Due Dates**: Include task due dates with reminder functionality.

4. **Implement Categories/Tags**: Allow users to organize tasks into categories.

5. **Add Data Export**: Provide functionality to export tasks as JSON or CSV.

6. **Improve Animations**: Add smooth transitions and micro-interactions for better UX.

## Technical Decisions

### Why Expo Router?
- File-based routing is intuitive and reduces boilerplate
- Built-in support for deep linking
- Seamless integration with Expo's ecosystem

### Why NativeWind?
- Familiar Tailwind CSS syntax
- Excellent dark mode support
- Reduces the need for StyleSheet objects
- Consistent styling across platforms

### Why SQLite over AsyncStorage?
- Better performance for structured data
- SQL query capabilities for filtering and sorting
- More suitable for larger datasets

### Why SecureStore for Settings?
- Encrypted storage for sensitive data
- Simple key-value API
- Native platform security features

## Conclusion

This project provided valuable hands-on experience with modern React Native development practices. The combination of Expo, TypeScript, NativeWind, and SQLite creates a powerful stack for building cross-platform applications. The challenges faced during development helped deepen my understanding of platform differences and the importance of thoughtful architecture decisions.

The app successfully meets all assignment requirements:
- ✅ Task management with CRUD operations
- ✅ Priority levels with color indicators
- ✅ Task filtering and statistics
- ✅ SQLite persistence
- ✅ SecureStore for settings
- ✅ Dark mode implementation
- ✅ Cross-platform compatibility (mobile + web)
- ✅ Responsive design
- ✅ TypeScript throughout
- ✅ Clean code organization
