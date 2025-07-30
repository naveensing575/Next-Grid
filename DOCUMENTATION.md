# Zuperscore Data Grid - Technical Documentation

## Overview

The Zuperscore Data Grid is a comprehensive, feature-rich data grid component built with Next.js 14+, TypeScript, and Tailwind CSS. This document provides detailed technical information about the implementation, architecture, and usage of the data grid.


## 📸 Lighthouse & Accessibility

> 
![Lighthouse Desktop Report](https://github.com/naveensing575/zuperscore-grid/blob/master/src/assets/laptop.png?raw=true)


### Lighthouse Report - Mobile

![Lighthouse Mobile Report](https://github.com/naveensing575/zuperscore-grid/blob/master/src/assets/mobile.png?raw=true)

## Architecture

### Component Architecture

The data grid follows a modular component architecture with clear separation of concerns:

```
VirtualizedDataGrid (Main Container)
├── DataGridHeader (Sorting, Filtering, Column Management)
├── DataGridRow (Individual Row Rendering)
├── BulkActions (Bulk Operations Toolbar)
├── ColumnManager (Column Visibility & Configuration)
└── Pagination (Pagination Controls)
```

### State Management

The grid uses a combination of React Context API and useReducer for state management:

- **Global State**: Managed through `DataGridContext` for grid-wide configuration
- **Local State**: Component-specific state managed with `useState`
- **Persistence**: User preferences saved to localStorage via `useLocalStorage` hook

### Data Flow

2. **Filtering**: Data filtered based on search terms and column filters
3. **Sorting**: Data sorted according to sort model
4. **Pagination**: Data paginated for performance
5. **Rendering**: Virtualized rendering for large datasets

## Core Features Implementation

### 1. Virtual Scrolling

**File**: `src/hooks/useVirtualScroll.tsx`

Virtual scrolling is implemented using a custom hook that calculates visible items based on scroll position:

```typescript
interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number;
  offsetY: number;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}
```

**Key Features**:

- Configurable item height and container height
- Overscan for smooth scrolling
- Scroll position tracking
- Performance optimization for large datasets

### 2. Column Management

**File**: `src/components/DataGrid/ColumnManager.tsx`

Column management includes visibility, pinning, and freezing:

```typescript
interface ColumnManagerProps {
  allColumns: string[];
  visibleColumns: string[];
  onToggle: (col: string) => void;
  onReorder?: (newOrder: string[]) => void;
  pinnedColumns?: { left: string[]; right: string[] };
  onPinColumn?: (col: string, side: "left" | "right" | null) => void;
  frozenColumns?: string[];
  onToggleFrozen?: (col: string) => void;
}
```

**Features**:

- Column visibility toggle
- Column pinning (left/right)
- Column freezing
- Drag and drop reordering
- Persistent preferences

### 3. Sorting & Filtering

**File**: `src/utils/gridHelpers.ts`

Advanced sorting and filtering utilities:

```typescript
export const sortData = <T extends Record<string, any>>(
  data: T[],
  sortModel: SortModel[]
): T[] => {
  // Multi-column sorting implementation
};

export const filterData = <T extends Record<string, any>>(
  data: T[],
  filterModel: FilterModel,
  searchTerm?: string
): T[] => {
  // Global search and column-specific filtering
};
```

**Features**:

- Multi-column sorting
- Global search with debouncing
- Column-specific filters
- Type-aware filtering

### 4. Export Functionality

**File**: `src/utils/exportUtils.ts`

Comprehensive export capabilities:

```typescript
export const exportToCSV = (data: User[], filename: string): void
export const exportToExcel = (data: User[], filename: string): void
export const exportToPDF = (data: User[], filename: string): void
```

**Features**:

- CSV export with proper formatting
- Excel export using HTML table format
- PDF export with print-friendly layout
- Bulk export for selected rows

### 5. Theme Management

**File**: `src/context/ThemeContext.tsx`

Theme management with system preference detection:

```typescript
type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}
```

**Features**:

- Light/dark theme toggle
- System preference detection
- Persistent theme selection
- Automatic theme switching

## Performance Optimizations

### 1. Virtual Scrolling

- **Item Height**: Fixed item height for predictable calculations
- **Overscan**: Render extra items for smooth scrolling
- **Scroll Position**: Track scroll position for accurate rendering
- **Memory Management**: Only render visible items

### 2. Memoization

```typescript
const filteredData = useMemo(() => {
  // Filtering logic
}, [state.data, state.searchTerm, state.filterModel]);

const sortedData = useMemo(() => {
  // Sorting logic
}, [filteredData, state.sortModel]);
```

### 3. Debounced Search

```typescript
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
```

### 4. Optimistic Updates

- Immediate UI updates for better UX
- Background API calls
- Error handling with rollback

## Accessibility Features

### 1. ARIA Labels

```typescript
<button
  aria-label={`Sort ${column} in ${sortOrder === 'asc' ? 'descending' : 'ascending'} order`}
  onClick={() => handleSort(column)}
>
  {column}
</button>
```

### 2. Keyboard Navigation

```typescript
export const getNextFocusableElement = (
  currentElement: HTMLElement,
  direction: "up" | "down" | "left" | "right"
): HTMLElement | null => {
  // Keyboard navigation implementation
};
```

### 3. Screen Reader Support

- Semantic HTML structure
- Proper heading hierarchy
- Descriptive labels and alt text
- Focus management

## Type Safety

### 1. Type Definitions

**File**: `src/types/api.types.ts`

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  joinDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### 2. Grid State Types

**File**: `src/types/grid.types.ts`

```typescript
interface GridState {
  data: User[];
  columns: Column[];
  visibleColumns: string[];
  pinnedColumns: { left: string[]; right: string[] };
  sortModel: SortModel[];
  filterModel: FilterModel;
  selectedRows: Set<string>;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}
```

## Customization Guide

### 1. Custom Cell Renderers

```typescript
const customRenderers = {
  name: (value: string, user: User) => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
        {value.split(' ').map(n => n[0]).join('')}
      </div>
      <span>{value}</span>
    </div>
  ),
  salary: (value: number) => (
    <span className="font-mono">${value.toLocaleString()}</span>
  )
}
```

### 2. Custom Themes

```typescript
const customTheme = {
  colors: {
    primary: "#3B82F6",
    secondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
};
```

### 3. Custom Validation

```typescript
export const validateUser = (
  user: Partial<User>
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!user.name || user.name.trim().length === 0) {
    errors.push("Name is required");
  }

  // Additional validation rules

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

## Testing Strategy

### 1. Unit Tests

```typescript
describe("DataGrid", () => {
  it("should render data correctly", () => {
    // Test implementation
  });

  it("should handle sorting", () => {
    // Test implementation
  });

  it("should handle filtering", () => {
    // Test implementation
  });
});
```


## Deployment

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### 2. Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_APP_ENV=production
```

### 3. Build Optimization

```bash
# Analyze bundle size
npm run analyze

# Type checking
npm run type-check

# Linting
npm run lint
```

## Performance Monitoring

### 1. Bundle Analysis

```bash
npm run analyze
```

### 2. Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### 3. Memory Usage

- **Virtual Scrolling**: O(1) memory complexity
- **State Management**: Efficient updates with useReducer
- **Caching**: API response caching for better performance

## Security Considerations

### 1. Input Validation

```typescript
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "");
};
```

### 2. XSS Prevention

- React's built-in XSS protection
- Input sanitization
- Content Security Policy headers

### 3. Data Protection

- Secure API endpoints
- Input validation
- Error handling without sensitive data exposure

## Browser Compatibility

### Supported Browsers

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Polyfills

- **ES6+ Features**: Babel transpilation
- **CSS Grid**: Modern browser support
- **Intersection Observer**: Polyfill for older browsers

## Troubleshooting

### Common Issues

1. **Virtual Scrolling Not Working**
   - Check item height configuration
   - Verify container height
   - Ensure proper scroll event handling

2. **Performance Issues**
   - Reduce dataset size
   - Enable virtualization
   - Optimize render functions

3. **Theme Not Switching**
   - Check localStorage permissions
   - Verify theme context setup
   - Ensure CSS variables are defined

### Debug Tools

```typescript
// Enable debug mode
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Grid State:", state);
  console.log("Filtered Data:", filteredData);
}
```

## Future Enhancements

### Planned Features

1. **Real-time Updates**
   
2. **Advanced Filtering**

3. **Plugin System**

4. **Internationalization**

## Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Run tests: `npm test`
6. Submit a pull request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Testing**: 80%+ coverage required

### Commit Guidelines

```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

---
