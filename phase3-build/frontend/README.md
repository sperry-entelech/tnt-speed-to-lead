# TNT Speed-to-Lead Dashboard

A comprehensive React dashboard for TNT Transportation's corporate lead management system, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🏆 TNT Branding
- Black/Red color scheme
- "Driven by Service, Defined by Excellence" messaging
- Professional corporate identity

### 📊 Manager Dashboard
- Real-time lead notifications
- Corporate prospect scoring (0-100)
- Revenue pipeline visualization
- Response time analytics (<5-minute target)
- Competitive analysis panel

### 🚨 Dispatcher Interface
- Lead-to-booking conversion tracking
- Communication history timeline
- Vehicle assignment capabilities
- High-priority lead alerts

### 🔔 Real-time Notifications
- High-value prospect alerts ($1,000+ bookings)
- Urgent response notifications
- System alerts and updates
- Role-based notification filtering

### 🔐 Authentication & Permissions
- Role-based access control (admin, manager, dispatcher)
- Secure login system
- Permission-based feature access
- User session management

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Demo Credentials

```
Admin Access:
- Email: admin@tnt-transport.com
- Password: admin123

Manager Access:
- Email: manager@tnt-transport.com
- Password: manager123

Dispatcher Access:
- Email: dispatcher@tnt-transport.com
- Password: dispatcher123
```

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to http://localhost:3000

4. **Login**
   Use any of the demo credentials above

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── TNTBrandHeader.tsx
│   ├── LeadNotificationCenter.tsx
│   ├── ProspectScoringWidget.tsx
│   ├── RevenuePipelineChart.tsx
│   ├── ResponseTimeAnalytics.tsx
│   ├── CompetitiveAnalysisPanel.tsx
│   ├── HighPriorityLeads.tsx
│   ├── ConversionFunnel.tsx
│   ├── CommunicationHistory.tsx
│   ├── AuthenticationSystem.tsx
│   └── TNTDashboard.tsx   # Main dashboard layout
├── lib/                  # Utilities
│   ├── utils.ts         # Helper functions
│   └── sample-data.ts   # Demo data
├── types/               # TypeScript definitions
│   └── index.ts        # Type definitions
└── globals.css         # Global styles
```

## Key Components

### 1. TNTBrandHeader
- Company branding and mission statement
- User authentication status
- Notification center access
- Role-based user menu

### 2. LeadNotificationCenter
- Real-time alert system
- Priority-based notification sorting
- Action-required notifications
- Mark as read functionality

### 3. ProspectScoringWidget
- Lead scoring algorithm (0-100)
- Score distribution visualization
- Top prospects ranking
- Scoring factors breakdown

### 4. RevenuePipelineChart
- Monthly revenue tracking
- Target achievement visualization
- Conversion rate analysis
- Interactive chart types

### 5. ResponseTimeAnalytics
- Response time tracking
- <5-minute target monitoring
- Performance benchmarking
- Improvement recommendations

### 6. CompetitiveAnalysisPanel
- Industry certifications showcase
- Competitive advantages
- Market positioning
- TNT excellence highlights

### 7. HighPriorityLeads
- Urgent prospect management
- Lead scoring and prioritization
- Quick action buttons
- Sorting and filtering

### 8. ConversionFunnel
- Lead progression visualization
- Stage-to-stage conversion rates
- Bottleneck identification
- Pipeline optimization

### 9. CommunicationHistory
- Timeline of all interactions
- Communication type tracking
- Success rate monitoring
- Lead-specific history

### 10. AuthenticationSystem
- Secure login interface
- Role-based permissions
- Session management
- Demo account access

## TNT Competitive Advantages

The dashboard highlights TNT Transportation's key differentiators:

- **15+ Years Experience**: Proven track record in luxury transportation
- **National Limousine Association Member**: Industry certification and standards
- **Trust Analytica Top 10**: Independent recognition for excellence
- **AI-Powered Response**: <5-minute lead response times
- **24/7 Support**: Round-the-clock customer availability
- **Fleet Diversity**: Comprehensive vehicle options

## Mobile Responsiveness

The dashboard is fully responsive with:
- Mobile-first design approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Collapsible navigation
- Responsive data tables

## Performance Features

- Server-side rendering with Next.js
- Optimized bundle sizes
- Lazy loading for large datasets
- Efficient state management
- Smooth animations and transitions

## Customization

The dashboard is built with customization in mind:
- Configurable color themes
- Modular component architecture
- Easy data source integration
- Extensible authentication system
- Flexible permission structure

## License

This project is proprietary to TNT Transportation and built for internal use.

## Support

For questions or support, contact the TNT Transportation development team.