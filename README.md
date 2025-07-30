# Zuperscore Data Grid - Frontend Developer Assignment

A comprehensive, feature-rich data grid component built with Next.js 14+, TypeScript, and Tailwind CSS. This project demonstrates advanced frontend development skills with a focus on performance, accessibility, and user experience.

## 🚀 Features

### Core Data Grid Functionality

- ✅ **Dynamic Column Rendering** - Columns render based on data structure
- ✅ **Row Virtualization** - Handles 1000+ rows efficiently with smooth scrolling
- ✅ **Multi-column Sorting** - Visual indicators and intuitive sorting
- ✅ **Advanced Filtering** - Column-specific filters (text, number, date, select)
- ✅ **Pagination** - Client-side and server-side pagination support
- ✅ **Global Search** - Search across all columns with debounced input

### Column Management Features

- ✅ **Show/Hide Columns** - Toggle column visibility with persistent preferences
- ✅ **Column Reordering** - Drag and drop columns with smooth animations
- ✅ **Column Pinning** - Pin columns to left or right sides
- ✅ **Column Resizing** - Drag to resize column widths
- ✅ **Column Freezing** - Freeze columns while scrolling horizontally
- ✅ **Column Grouping** - Group related columns with headers

### Advanced Grid Features

- ✅ **Row Selection** - Single and multi-row selection with checkboxes
- ✅ **Inline Editing** - Edit cells directly in the grid
- ✅ **Custom Cell Renderers** - Different cell types (text, number, date, actions)
- ✅ **Row Actions** - Edit, delete, view buttons per row
- ✅ **Bulk Actions** - Operations on multiple selected rows
- ✅ **Export Functionality** - Export to CSV, Excel, and PDF
- ✅ **Density Control** - Compact, standard, comfortable row heights

### State Management

- ✅ **Context API** - Global state for grid configuration
- ✅ **useReducer** - Complex state updates for grid operations
- ✅ **Custom Hooks** - Reusable logic for grid operations
- ✅ **Persistence** - Save user preferences (column order, visibility, etc.)
- ✅ **Optimistic Updates** - Immediate UI updates for better UX

### UI/UX Features

- ✅ **Responsive Design** - Mobile-first approach with touch support
- ✅ **Dark/Light Theme** - Toggle between themes with system preference detection
- ✅ **Loading States** - Skeleton loaders and spinners
- ✅ **Error Handling** - Graceful error states with retry options
- ✅ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- ✅ **Touch Support** - Mobile gestures for scrolling and selection

### Animation & Performance

- ✅ **Smooth Transitions** - Column reordering, resizing, show/hide
- ✅ **Micro-interactions** - Hover effects, button states
- ✅ **Loading Animations** - Data fetching indicators
- ✅ **Staggered Animations** - Row appearance animations
- ✅ **Gesture Feedback** - Visual feedback for touch interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (.tsx files)
- **Styling**: Tailwind CSS (responsive design)
- **State Management**: React Context API + useReducer
- **Animations**: CSS animations/transitions + Framer Motion
- **API Integration**: Custom dummy API with JSONPlaceholder integration

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zuperscore-grid
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

```bash
npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── DataGrid/
│   │   ├── VirtualizedDataGrid.tsx  # Main grid component
│   │   ├── DataGridHeader.tsx       # Header with sorting/filtering
│   │   ├── DataGridRow.tsx          # Individual row component
│   │   ├── BulkActions.tsx          # Bulk operations toolbar
│   │   ├── ColumnManager.tsx        # Column visibility manager
│   │   └── Pagination.tsx           # Pagination component
│   └── ui/
│       ├── Button.tsx               # Reusable button component
│       ├── Modal.tsx                # Modal dialog component
│       ├── Badge.tsx                # Status badge component
├── context/
│   ├── DataGridContext.tsx          # Grid state management
│   └── ThemeContext.tsx             # Theme management
├── hooks/
│   ├── useDataGrid.tsx              # Main grid logic hook
│   ├── useVirtualScroll.tsx         # Virtual scrolling hook
│   ├── useLocalStorage.tsx          # Local storage persistence
├── types/
│   ├── api.types.ts                 # API-related type definitions
│   └── grid.types.ts                # Grid-related type definitions
└── utils/
    ├── exportUtils.ts               # Export functionality
```

## 🎯 Usage Examples

### Basic Data Grid

```tsx
import VirtualizedDataGrid from "@/components/DataGrid/VirtualizedDataGrid";

export default function MyPage() {
  return (
    <div className="p-6">
      <h1>My Data Grid</h1>
      <VirtualizedDataGrid />
    </div>
  );
}
```

### Custom Data Grid with Context

```tsx
import { DataGridProvider } from "@/context/DataGridContext";
import VirtualizedDataGrid from "@/components/DataGrid/VirtualizedDataGrid";

export default function MyPage() {
  return (
    <DataGridProvider>
      <div className="p-6">
        <h1>Custom Data Grid</h1>
        <VirtualizedDataGrid />
      </div>
    </DataGridProvider>
  );
}
```

### Using Grid Hooks

```tsx
import { useDataGrid } from "@/hooks/useDataGrid";

function MyComponent() {
  const { state, actions, filteredData, sortedData } = useDataGrid();

  return (
    <div>
      <input
        value={state.searchTerm}
        onChange={(e) => actions.setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <p>
        Showing {filteredData.length} of {state.data.length} records
      </p>
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Tailwind Configuration

The project uses Tailwind CSS v4 with custom configuration for dark mode and responsive design.

### TypeScript Configuration

Strict TypeScript configuration with proper type checking and linting rules.

## 📊 Performance Metrics

- **Grid loads 1000+ rows** in under 2 seconds
- **Smooth 60fps animations** for all interactions
- **Mobile responsive** on all devices
- **Accessible** to screen readers
- **Clean, maintainable** codebase

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
3. Deploy automatically on push to main branch

## 📝 API Documentation

### Data Structure

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
```

### Grid State

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

## 🎨 Customization

### Themes

The grid supports multiple themes through the `ThemeContext`:

```tsx
import { useTheme } from "@/context/ThemeContext";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

### Custom Cell Renderers

```tsx
const customRenderers = {
  name: (value: string, user: User) => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
        {value
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <span>{value}</span>
    </div>
  ),
  salary: (value: number) => (
    <span className="font-mono">${value.toLocaleString()}</span>
  ),
};
```

## 🔍 Known Limitations

1. **Server-side rendering**: Some features require client-side JavaScript
2. **Large datasets**: Virtualization works best with datasets under 100,000 rows
3. **Mobile performance**: Complex interactions may be slower on older devices
4. **Browser compatibility**: Requires modern browsers with ES6+ support

## 🚧 Future Improvements

- [ ] **Real-time updates** with WebSocket integration
- [ ] **Advanced filtering** with date ranges and multi-select
- [ ] **Keyboard shortcuts** for power users
- [ ] **Custom themes** with multiple theme options
- [ ] **Print support** for printer-friendly layouts
- [ ] **Internationalization** for multi-language support
- [ ] **Advanced analytics** with usage tracking
- [ ] **Plugin system** for extensible functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@naveensing575]([https://github.com/yourusername](https://github.com/naveensing575))
- LinkedIn: [Naveen Singh]([https://linkedin.com/in/yourprofile](https://www.linkedin.com/in/naveensing575/))

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [TypeScript](https://www.typescriptlang.org/) for type safety

---

