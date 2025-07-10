# MiniWorld - Futuristic Baby Products E-commerce

🚀 **Welcome to the future of baby care!** MiniWorld is a cutting-edge e-commerce platform specializing in innovative, smart baby products designed for the next generation of families.

## ✨ Features

### 🎨 Futuristic Design
- **Cyberpunk-inspired UI** with neon colors and holographic effects
- **Animated logo** with rotating glow effects
- **Gradient backgrounds** and cyber-grid patterns
- **Smooth animations** powered by Framer Motion

### 🛍️ E-commerce Functionality
- **Age-based categories** (0-6 months, 6-12 months, 1-3 years, 3-5 years)
- **Product listings** with large thumbnails and detailed information
- **Product details pages** with image galleries and zoom functionality
- **Shopping cart** with add/remove/update quantity functionality
- **Persistent cart** using localStorage

### 📱 Mobile Responsive
- **Mobile-first design** approach
- **Touch-friendly interfaces**
- **Responsive grid layouts**
- **Hamburger menu** for mobile navigation

### 🎯 Smart Features
- **Banner carousels** for each category
- **Featured products** section
- **Related products** suggestions
- **Search functionality** (placeholder)
- **Wishlist functionality** (placeholder)

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: Context API + useReducer
- **Image Gallery**: React Image Gallery
- **Carousel**: Swiper.js
- **Icons**: React Icons (Feather)
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MiniWorld
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
MiniWorld/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Logo.tsx
│   │   ├── products/
│   │   │   └── ProductCard.tsx
│   │   └── cart/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── ProductDetailsPage.tsx
│   │   └── CartPage.tsx
│   ├── context/
│   │   └── CartContext.tsx
│   ├── data/
│   │   ├── categories.ts
│   │   └── products.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Design System

### Color Palette
- **Neon Blue**: Primary brand color (#0ea5e9)
- **Cyber Purple**: Secondary accent (#d946ef)
- **Electric Green**: Success/status color (#22c55e)
- **Dark Slate**: Background colors (#0f172a to #1e293b)

### Typography
- **Primary**: Orbitron (futuristic headings)
- **Secondary**: System fonts (body text)

### Animations
- **Glow effects** on hover states
- **Floating elements** in hero section
- **Smooth transitions** throughout the UI
- **Loading states** and micro-interactions

## 🛒 Product Categories

### 0-6 Months (Newborn Essentials)
- Smart feeding bottles with temperature control
- Sleep monitoring swaddles
- Holographic mobiles with sound

### 6-12 Months (Growing Explorer)
- Movement tracking play mats
- Sensory teething toys with LED feedback
- Interactive development toys

### 1-3 Years (Active Toddler)
- AI-powered learning walkers
- Magnetic building blocks with holograms
- Safety gear with smart features

### 3-5 Years (Young Learner)
- AR learning tablets for kids
- Smart balance bikes with LED systems
- Educational toys with app integration

## 🔧 Customization

### Adding New Products
1. Update `src/data/products.ts`
2. Add product images to your image hosting service
3. Follow the existing product interface structure

### Modifying Colors
1. Update `tailwind.config.js` for new color schemes
2. Modify gradient classes in components
3. Update CSS custom properties if needed

### Adding New Categories
1. Update `src/data/categories.ts`
2. Add corresponding banner images
3. Update the `AgeCategory` type in `src/types/index.ts`

## 🌐 Deployment & GitHub Integration

### 🚀 Quick GitHub Setup
1. **Install Git** (if not already installed)
   ```bash
   # Run the setup script
   setup-github.bat
   ```

2. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: `miniworld-ecommerce`
   - Description: `MiniWorld - Futuristic Baby Products E-commerce Site`
   - Make it **PUBLIC** (for free hosting)

3. **Push your code**
   ```bash
   git remote add origin https://github.com/yourusername/miniworld-ecommerce.git
   git add .
   git commit -m "Initial commit: MiniWorld E-commerce Site"
   git push -u origin main
   ```

### 🌟 Auto-Deploy with Netlify
1. **Connect GitHub to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select your `miniworld-ecommerce` repository

2. **Configure Domain (miniworldpk.com)**
   - Add custom domain in Netlify
   - Update GoDaddy DNS settings
   - Enable HTTPS (automatic)

3. **Environment Variables**
   ```
   VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
   VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   VITE_AWS_REGION=us-east-1
   VITE_S3_BUCKET_NAME=miniworldpk-products-images
   VITE_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
   ```

### 📝 Daily Workflow
```bash
# Make changes to your code
# Save files

# Quick push to GitHub (auto-deploys)
push-to-github.bat
```

### 🔄 Automated Deployment
- **Every push** to `main` branch auto-deploys to miniworldpk.com
- **Preview deployments** for pull requests
- **Rollback capability** through Netlify dashboard

### Build for Production
```bash
npm run build
```

### Deploy to Other Platforms
- **Vercel**: `vercel --prod`
- **AWS S3**: Upload `dist` folder
- **GitHub Pages**: Use `gh-pages` branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- [ ] User authentication and accounts
- [ ] Payment integration (Stripe/PayPal)
- [ ] Product search and filtering
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Progressive Web App (PWA)

## 🙏 Acknowledgments

- **Unsplash** for product images
- **React community** for excellent documentation
- **Tailwind CSS** for the utility-first approach
- **Framer Motion** for smooth animations

---

**Built with ❤️ for the future of baby care** 🚀 