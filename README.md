# 🎨 CodePrince Portfolio

> A modern, full-featured portfolio platform with CMS capabilities, built for developers who want complete control over their online presence.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-7.4-646cff?logo=vite)](https://vitejs.dev/)

## ✨ What Makes This Different

This isn't just another portfolio template. It's a **full-stack content management system** disguised as a portfolio, giving you:

- **Admin Dashboard** - Manage everything without touching code
- **Dynamic OG Images** - Auto-generated social media previews via Supabase Edge Functions
- **Blog System** - Full markdown support with syntax highlighting and SEO optimization
- **Contact Management** - EmailJS integration with auto-replies and message tracking
- **Project Showcase** - Filterable, searchable project gallery with detailed modals
- **Resume Builder** - Manage work experience, skills, and education dynamically
- **Real-time Updates** - Changes reflect instantly via Supabase real-time subscriptions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm))
- Supabase account ([sign up free](https://supabase.com))
- EmailJS account ([sign up free](https://www.emailjs.com))

### Installation

```bash
# Clone the repository
git clone github.com/codeprince/portfolio-website
cd portfolio-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up Supabase configuration
cp supabase/config.toml.example supabase/config.toml
# Edit config.toml with your project ID

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Optional: Additional EmailJS account for manual replies
VITE_EMAILJS_MANUAL_SERVICE_ID=your_manual_service_id
VITE_EMAILJS_MANUAL_TEMPLATE_ID=your_manual_template_id
VITE_EMAILJS_MANUAL_PUBLIC_KEY=your_manual_public_key

# Site Configuration
VITE_SITE_NAME=CodePrince
VITE_SITE_URL=https://codeprince.qzz.io
VITE_TWITTER_HANDLE=@codeprince
```

## 🏗️ Architecture

### Tech Stack

**Frontend**

- React 18 with TypeScript
- Vite for blazing-fast builds
- TailwindCSS + shadcn/ui for beautiful components
- Framer Motion for smooth animations
- React Query for server state management

**Backend**

- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates

**Email**

- EmailJS for client-side email delivery
- Custom templates with HTML support
- Rate limiting and sanitization

### Project Structure

```
portfolio-website/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin dashboard components
│   │   ├── blog/           # Blog system
│   │   ├── contact/        # Contact form & management
│   │   ├── projects/       # Project showcase
│   │   ├── skills/         # Skills display
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services (EmailJS, Blog)
│   ├── config/             # Configuration files
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── supabase/
│   ├── migrations/         # Database migrations
│   └── functions/          # Edge Functions (OG images)
├── docs/                   # Project documentation
└── public/                 # Static assets
```

## 🎯 Key Features

### 1. Admin Dashboard (`/admin`)

Comprehensive CMS for managing all content:

- **Profile Management** - Hero section, about, social links
- **Blog Posts** - Create, edit, publish with markdown editor
- **Projects** - Add projects with images, tags, and links
- **Skills** - Organize skills by categories
- **Work Experience** - Timeline of professional experience
- **Messages** - View and reply to contact form submissions
- **Settings** - Configure OG images, footer, contact info

### 2. Dynamic OG Images

Supabase Edge Function generates social media preview images:

```typescript
// Automatically generated at runtime
https://YOUR_PROJECT_ID.supabase.co/functions/v1/og-image?title=CodePrince&subtitle=Developer
```

Features:

- Custom title, subtitle, and colors
- Brand logo integration
- Multiple layout options
- Cached for performance

### 3. Blog System

Full-featured blogging platform:

- Markdown editor with live preview
- Syntax highlighting for code blocks
- SEO optimization (meta tags, slugs, sitemaps)
- Draft/Published status
- Tag-based filtering
- Reading time estimation
- Related posts suggestions

### 4. Contact System

Professional contact management:

- Form validation with Zod
- Spam protection with rate limiting
- Auto-reply emails to visitors
- Admin notification emails
- Message dashboard with reply functionality
- HTML email templates

### 5. Project Showcase

Interactive project gallery:

- Filterable by technology/category
- Search functionality
- Detailed modal views
- Image galleries
- Live demo and GitHub links
- "View More" pagination

## 📦 Database Schema

### Core Tables

- `profiles` - User profile data (hero, about, social links)
- `blog_posts` - Blog content with SEO metadata
- `projects` - Project portfolio items
- `skills` - Skills organized by categories
- `work_experiences` - Professional timeline
- `messages` - Contact form submissions
- `og_image_settings` - Dynamic OG image configuration
- `footer_settings` - Footer customization

See [`supabase/migrations/`](./supabase/migrations/) for complete schema.

## 🔐 Security

- **Row Level Security (RLS)** - All tables protected with policies
- **Authentication** - Supabase Auth with email/password
- **Input Sanitization** - DOMPurify for user-generated content
- **Rate Limiting** - EmailJS requests throttled
- **Environment Variables** - Secrets never committed to git
- **CORS Protection** - Supabase Edge Functions configured properly

## 🚢 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy!

### Supabase Edge Functions

```bash
# Deploy OG image function
npx supabase functions deploy og-image
```

## 📚 Documentation

Detailed guides available in [`docs/`](./docs/):

- [EmailJS Setup Guide](./EMAILJS_QUICKSTART.md)
- [OG Image System](./docs/OG_IMAGE_SYSTEM_GUIDE.md)
- [Blog Implementation](./docs/BLOG_COMPLETE_SUMMARY.md)
- [Contact System](./docs/CONTACT_REFACTORING_COMPLETE.md)
- [Messages Management](./docs/MESSAGES_COMPLETE.md)

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Database Migrations

```bash
# Link to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_ID

# Apply migrations
npx supabase db push

# Generate TypeScript types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: '#00D4FF',    // Neural network blue
  secondary: '#FF00E5',  // Accent pink
  // ... more colors
}
```

### Components

All components use shadcn/ui and can be customized via `components.json`.

## 🤝 Contributing

This is a personal portfolio project, but feel free to fork and adapt it for your own use!

## 📄 License

MIT License - feel free to use this for your own portfolio.

## 🙏 Acknowledgments

Built with:

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Supabase](https://supabase.com/) - Backend infrastructure
- [EmailJS](https://www.emailjs.com/) - Email delivery
- [Lucide Icons](https://lucide.dev/) - Icon system
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

**Made with ❤️ by CodePrince**

[Live Demo](https://codeprince.qzz.io) • [Report Bug](https://github.com/KPrince-coder/portfolio-website/issues) • [Request Feature](https://github.com/KPrince-coder/portfolio-website/issues)
