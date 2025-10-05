# Next Grid

A modern, feature-rich data table component built with Next.js 15, TypeScript, and Tailwind CSS v4.

## Features

### Core Functionality
- Row virtualization for handling 500+ rows
- Multi-column sorting with visual indicators
- Advanced filtering (text, number, select)
- Global search across all columns
- Responsive design for all screen sizes

### Advanced Features
- Multi-row selection with checkboxes
- Inline cell editing
- Bulk operations (delete, export, status change)
- Export to CSV, Excel, and PDF
- Column visibility management
- Dark/Light/System theme support

### UI/UX
- Smooth animations and transitions
- Premium color palette
- Professional icons (Lucide React)
- Custom scrollbars
- Loading states
- Touch-friendly controls

## Tech Stack

- **Framework**: Next.js 15.4 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter
- **Testing**: Jest + React Testing Library

## Installation

```bash
git clone <repository-url>
cd next-grid
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── DataGrid/
│   │   ├── VirtualizedDataGrid.tsx
│   │   ├── DataGridHeader.tsx
│   │   ├── DataGridRow.tsx
│   │   ├── BulkActions.tsx
│   │   ├── ColumnManager.tsx
│   │   └── Pagination.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   ├── useDataGrid.tsx
│   ├── useVirtualScroll.tsx
│   └── useLocalStorage.tsx
├── types/
│   ├── api.types.ts
│   └── grid.types.ts
└── utils/
    └── exportUtils.ts
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
npm run test             # Run tests
npm run test:coverage    # Generate test coverage
```

## Usage

### Basic Grid

```tsx
import VirtualizedDataGrid from '@/components/DataGrid/VirtualizedDataGrid'

export default function Page() {
  return <VirtualizedDataGrid />
}
```

### Button Component

```tsx
import Button from '@/components/ui/Button'
import { Eye } from 'lucide-react'

<Button
  label="View"
  onClick={handleView}
  color="primary"
  variant="ghost"
  size="sm"
  icon={Eye}
/>
```

### Theme Toggle

```tsx
import ThemeToggle from '@/components/ThemeToggle'

<ThemeToggle />
```

## Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Custom Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: #007aff;
  --success: #34c759;
  --error: #ff3b30;
}
```

## Performance

- Handles 500+ rows efficiently
- Virtual scrolling for smooth performance
- 60fps animations
- ~149 kB initial bundle size
- Build time: ~5 seconds

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Test Coverage: 41 passing tests

## Deployment

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Build Output
- Static pages: 5 routes
- First Load JS: ~149 kB

## License

MIT License

## Author

**Naveen Singh**
- GitHub: [@naveensing575](https://github.com/naveensing575)
- LinkedIn: [Naveen Singh](https://www.linkedin.com/in/naveensing575/)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
