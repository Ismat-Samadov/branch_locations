# Azerbaijan Bank Branch Network Dashboard

An interactive Next.js dashboard for visualizing and analyzing bank branch distribution across Azerbaijan.

## Features

- **Interactive Map**: View all 585 bank branches across 20 banks in Azerbaijan using Leaflet maps
- **Real-time Filtering**: Filter branches by individual bank or view all banks together
- **Key Metrics Dashboard**: Display total branches, market share, rankings, and coverage statistics
- **AzerTurk Bank Focus**: Special highlighting and tracking for AzerTurk Bank branches
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern Tailwind CSS design with smooth interactions

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Leaflet** - Interactive maps
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualizations (ready for future charts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the dashboard directory:
```bash
cd dashboard
```

2. Install dependencies (already done):
```bash
npm install
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The page will auto-reload when you make changes.

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
dashboard/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main dashboard page
├── components/
│   ├── BranchMap.tsx         # Interactive map component
│   ├── BankSelector.tsx      # Bank filter sidebar
│   └── StatsCard.tsx         # Metric display card
├── public/
│   └── branches.json         # Branch data (585 branches)
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Data

The dashboard uses `branches.json` containing all 585 bank branches across Azerbaijan, including:

- **Bank Name** - Name of the banking institution
- **Latitude** - Geographic coordinate
- **Longitude** - Geographic coordinate

### Banks Included

20 banks are represented in the dataset:
- Kapital Bank (177 branches) - #1
- ABB Bank (53 branches) - #2
- Xalq Bank (45 branches) - #3
- And 17 more banks including AzerTurk Bank (17 branches, Rank #11)

## Key Features Explained

### Interactive Map

- **Colored Markers**: Each bank has a distinct color
- **AzerTurk Bank**: Highlighted with larger red square markers
- **Other Banks**: Shown as smaller circular markers
- **Tooltips**: Click any marker to see bank name and coordinates
- **Zoom/Pan**: Fully interactive map controls

### Bank Filter

- Click any bank in the left sidebar to filter the map
- Shows branch count and market share for each bank
- "All Banks" option to view the complete network
- Selected bank details panel appears below the filter

### Metrics Dashboard

Four key metric cards show:
1. **Total Branches** - Overall branch count across all banks
2. **AzerTurk Bank Branches** - Specific count and market rank
3. **Market Share** - AzerTurk Bank's percentage of total branches
4. **Coverage** - Number of banks operating in Azerbaijan

## Future Enhancements

Potential features to add:
- [ ] Regional heatmaps showing branch density
- [ ] Chart visualizations (using Recharts)
- [ ] Branch search functionality
- [ ] Export data options
- [ ] Competitive analysis charts
- [ ] Mobile app version
- [ ] Dark mode support

## Development Notes

- The map component uses dynamic import to avoid SSR issues with Leaflet
- Tailwind CSS is configured for modern styling
- TypeScript ensures type safety throughout the application
- Data is loaded client-side from the public folder

## Performance

- First load optimized with Next.js 16
- Turbopack for fast development rebuilds
- Client-side data fetching for real-time filtering
- Lazy loading for map component

## Support

For issues or questions about this dashboard, please contact the development team.

---

**Last Updated**: December 2025
**Version**: 1.0.0
