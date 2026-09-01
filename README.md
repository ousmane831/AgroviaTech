# AgroviaTech - Agricultural Management Platform

A modern, production-ready agricultural management platform built with React, TypeScript, and shadcn/ui. AgroviaTech helps farmers optimize their operations through IoT integration, AI-powered predictions, and real-time monitoring.

## 🚀 Features

### For Farmers
- **Dashboard**: Real-time overview of agricultural operations
- **Parcel Management**: Track and manage multiple farming plots
- **Harvest Tracking**: Monitor yields and production data
- **AI Predictions**: Get intelligent forecasts for crop yields
- **Alerts System**: Real-time notifications for irrigation, diseases, and weather
- **Statistics**: Comprehensive analytics and reporting

### For Visitors
- **Public Dashboard**: Agricultural market prices and trends
- **News Section**: Latest agricultural innovations and updates
- **Learning Resources**: Guides and tutorials for best practices
- **Interactive Map**: Agricultural zones and environmental conditions
- **AI Demo**: Experience AI-powered agricultural assistance

### For Administrators
- **User Management**: Manage farmers and visitors
- **System Monitoring**: Track platform health and performance
- **Request Handling**: Process farmer registration requests

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd AgroviaTech

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build & Deployment

### Local Build

```bash
# Type checking
npm run type-check

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## 🎨 Design System

AgroviaTech uses a custom design system built on Tailwind CSS, matching the official presentation:

- **Primary Color**: Dark Green (#2d562b) - Main brand color from presentation
- **Secondary Color**: Lighter Green (#4e7d4c) - Supporting green tone
- **Accent Color**: Golden-Yellow (#d4a32b) - Highlight and accent color
- **Typography**: Inter font family
- **Components**: Glass morphism effects, smooth animations, responsive design
- **Theme**: Professional agricultural aesthetic with modern UI patterns

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── ui/            # shadcn/ui components
│   └── forms/         # Form components
├── pages/             # Page components
│   ├── admin/        # Admin pages
│   ├── visiteur/     # Visitor pages
│   └── *.tsx         # Main application pages
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── data/             # Mock data for development
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_APP_TITLE=AgroviaTech
VITE_APP_URL=http://localhost:3000
```

### Vite Configuration

The project uses Vite with optimized build settings:
- Code splitting for better performance
- Tree shaking to reduce bundle size
- Terser minification
- Manual chunk splitting for vendor libraries

## 🌱 Key Features Implementation

### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile devices
- Touch-friendly interface
- Optimized layouts for all screen sizes

### Performance
- Lazy loading for routes
- Code splitting by component
- Optimized images and assets
- Efficient state management with React Query

### Accessibility
- Semantic HTML
- Keyboard navigation support
- Screen reader compatible
- High contrast ratios

### Security
- Input validation with Zod
- XSS protection
- Secure headers configured
- Environment variable management

## 📊 Current Status

### Completed ✅
- Modern design system implementation
- Responsive mobile experience
- Production build configuration
- Deployment setup (Vercel/Netlify)
- Performance optimization
- Animation system
- All core features implemented

### Future Enhancements 🚧
- Real backend integration
- Advanced AI features
- Mobile app development
- Offline support
- Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review the code documentation

## 🌟 Acknowledgments

Built with modern web technologies and best practices for agricultural management.
