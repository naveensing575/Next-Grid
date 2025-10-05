# Next Grid - Advanced Data Table Component

A premium, feature-rich data grid component built with Next.js 15, TypeScript, and Tailwind CSS v4. Inspired by Samsung One UI and iOS design systems with smooth animations, beautiful icons, and eye-soothing color palettes.

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Premium Features

### 🎨 Beautiful UI Design
- **Samsung One UI & iOS Inspired** - Premium color palette with eye-soothing backgrounds
- **Smooth Animations** - 60fps transitions with Framer Motion
- **Lucide Icons** - Professional icons throughout (Mail, Briefcase, Calendar, etc.)
- **Inter Font Family** - Crisp, modern typography
- **Dark/Light/System Themes** - Smooth theme switching with next-themes
- **Custom Scrollbars** - Sleek iOS-style scrollbars

### 📊 Core Data Grid Functionality
- ✅ **Row Virtualization** - Handles 500+ rows efficiently with smooth scrolling
- ✅ **Multi-column Sorting** - Visual indicators with animated arrows
- ✅ **Advanced Filtering** - Column-specific filters (text, number, select)
- ✅ **Global Search** - Search across all columns with icon
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### 🎯 Advanced Features
- ✅ **Row Selection** - Multi-row selection with premium checkboxes
- ✅ **Inline Editing** - Edit cells directly in the grid
- ✅ **Bulk Actions** - Operations on multiple selected rows
- ✅ **Export Functionality** - Export to CSV, Excel, and PDF
- ✅ **Column Management** - Show/hide columns with modal
- ✅ **Status Badges** - Color-coded with icons (Active/Inactive)
- ✅ **Action Buttons** - Ghost buttons with icons (View/Edit/Delete)

### 🚀 Performance & UX
- ✅ **Virtual Scrolling** - Smooth performance with large datasets
- ✅ **Optimized Rendering** - React optimization techniques
- ✅ **Loading States** - Animated spinner with text
- ✅ **Hover Effects** - Premium glow effects on rows
- ✅ **Touch Support** - Mobile-friendly interactions
- ✅ **Toggle Switches** - iOS-style animated toggles

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15.4 (App Router) |
| **Language** | TypeScript 5.0 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Fonts** | Inter (via @fontsource) |
| **Theme** | next-themes |
| **Testing** | Jest + React Testing Library |

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd next-grid

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main page with Next Grid
│   └── globals.css             # Premium color palette & animations
├── components/
│   ├── DataGrid/
│   │   ├── VirtualizedDataGrid.tsx    # Main grid with virtualization
│   │   ├── DataGridHeader.tsx         # Header with sorting/filtering
│   │   ├── DataGridRow.tsx            # Row with icons & badges
│   │   ├── BulkActions.tsx            # Bulk operations toolbar
│   │   ├── ColumnManager.tsx          # Column visibility manager
│   │   └── Pagination.tsx             # Pagination component
│   ├── ui/
│   │   ├── Button.tsx                 # Premium button (solid/outline/ghost)
│   │   ├── Modal.tsx                  # Modal dialog
│   │   └── Badge.tsx                  # Status badge
│   └── ThemeToggle.tsx                # Animated theme dropdown
├── hooks/
│   ├── useDataGrid.tsx                # Main grid logic
│   ├── useVirtualScroll.tsx           # Virtual scrolling
│   └── useLocalStorage.tsx            # Persistence
├── types/
│   ├── api.types.ts                   # API types
│   └── grid.types.ts                  # Grid types
└── utils/
    └── exportUtils.ts                 # CSV/Excel/PDF export
```

## 🎨 Color Palette

### Light Mode
```css
--background: #f8f9fa          /* Soft white */
--primary: #007aff             /* iOS blue */
--success: #34c759             /* iOS green */
--error: #ff3b30               /* iOS red */
--warning: #ff9500             /* iOS orange */
```

### Dark Mode
```css
--background: #000000          /* Pure black (OLED) */
--primary: #0a84ff             /* Bright blue */
--success: #32d74b             /* Bright green */
--error: #ff453a               /* Bright red */
--warning: #ff9f0a             /* Bright orange */
```

## 🚀 Available Scripts

```bash
npm run dev              # Start development server (Turbopack)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## 📊 Key Components

### VirtualizedDataGrid
Main grid component with virtualization, sorting, filtering, and all features.

```tsx
import VirtualizedDataGrid from '@/components/DataGrid/VirtualizedDataGrid'

<VirtualizedDataGrid />
```

### Button Component
Premium button with 3 variants and icons.

```tsx
import Button from '@/components/ui/Button'
import { Eye } from 'lucide-react'

<Button
  label="View"
  onClick={handleView}
  color="primary"      // primary | success | error | warning | secondary
  variant="ghost"      // solid | outline | ghost
  size="sm"            // sm | md | lg
  icon={Eye}
/>
```

### ThemeToggle
Animated dropdown for Light/Dark/System themes.

```tsx
import ThemeToggle from '@/components/ThemeToggle'

<ThemeToggle />
```

## 🎯 Features Showcase

### Premium Toggle Switches
- iOS-style animated toggles
- Smooth sliding animation
- Icons for each feature (Zap, Edit, CheckSquare)

### Status Badges
- **Active**: Green with CheckCircle icon
- **Inactive**: Gray with XCircle icon
- Rounded with glow effects

### Cell Icons
- **Email**: Mail icon with clickable mailto link
- **Role**: Briefcase icon
- **Department**: Building icon
- **Salary**: Dollar icon with formatted currency
- **Join Date**: Calendar icon with formatted date

### Action Buttons
- **View**: Eye icon (secondary/ghost)
- **Edit**: Edit icon (primary/ghost)
- **Delete**: Trash icon (error/ghost)

## 📱 Responsive Design

- **Desktop** (1600px+): Full table with all features
- **Tablet** (768-1600px): Horizontal scroll for wide tables
- **Mobile** (<768px): Touch-optimized with stacked controls

## ✅ Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Test Coverage**: 41 passing tests across components, hooks, and context.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build Output
- Static pages: 5 routes
- First Load JS: ~149 kB
- Build time: ~5 seconds

## 🎨 Customization

### Custom Color Palette
Edit `src/app/globals.css` to change colors:

```css
:root {
  --primary: #your-color;
  --success: #your-color;
  /* ... */
}
```

### Custom Cell Renderers
Add custom renderers in `VirtualizedDataGrid.tsx`:

```tsx
const customRenderers = {
  customField: (value, user) => (
    <div className="your-custom-component">
      {value}
    </div>
  )
}
```

## 🔧 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📈 Performance Metrics

- ✅ Grid loads 500 rows in < 2 seconds
- ✅ Smooth 60fps animations
- ✅ Mobile responsive on all devices
- ✅ Accessible to screen readers
- ✅ Clean, maintainable codebase

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Naveen Singh**

- GitHub: [@naveensing575](https://github.com/naveensing575)
- LinkedIn: [Naveen Singh](https://www.linkedin.com/in/naveensing575/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Inter Font](https://rsms.me/inter/) - Typography

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
