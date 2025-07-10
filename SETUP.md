# MiniWorld Setup Guide

## Prerequisites Installation

Since npm is not currently available on your system, you'll need to install Node.js first.

### 1. Install Node.js

#### For Windows:
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer (.msi file)
4. Follow the installation wizard
5. **Important**: Make sure to check "Add to PATH" during installation

#### For macOS:
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

#### For Linux (Ubuntu/Debian):
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

### 2. Verify Installation

Open a new terminal/command prompt and run:
```bash
node --version
npm --version
```

You should see version numbers for both commands.

## Project Setup

### 1. Navigate to Project Directory
```bash
cd MiniWorld
```

### 2. Install Dependencies
```bash
npm install
```

This will install all the required packages:
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Swiper for carousels
- React Image Gallery
- And more...

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
The application will be available at:
```
http://localhost:3000
```

## Available Scripts

```bash
npm run dev      # Start development server (with hot reload)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run code linting
```

## Troubleshooting

### Common Issues:

#### 1. "npm not recognized" error
- Make sure Node.js is properly installed
- Restart your terminal/command prompt
- Check if Node.js is in your PATH environment variable

#### 2. Port 3000 already in use
```bash
# The server will automatically try port 3001, 3002, etc.
# Or you can specify a different port:
npm run dev -- --port 3001
```

#### 3. Permission errors (macOS/Linux)
```bash
# If you get permission errors, you might need to fix npm permissions:
sudo chown -R $(whoami) ~/.npm
```

#### 4. Dependencies installation fails
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### 1. Hot Reload
The development server includes hot reload, so changes to your code will automatically refresh the browser.

### 2. TypeScript
This project uses TypeScript. If you see type errors, make sure all dependencies are installed and your IDE supports TypeScript.

### 3. Tailwind CSS
Styles are written using Tailwind CSS utility classes. The custom color scheme is defined in `tailwind.config.js`.

### 4. Component Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components (routes)
├── context/       # React Context (state management)
├── data/          # Mock data for products and categories
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Next Steps

Once the project is running:

1. **Explore the Features**:
   - Browse different age categories
   - Add products to cart
   - Test the responsive design on mobile

2. **Customize the Content**:
   - Update product data in `src/data/products.ts`
   - Modify categories in `src/data/categories.ts`
   - Change colors in `tailwind.config.js`

3. **Deploy the Project**:
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or your preferred hosting service

## Need Help?

If you encounter any issues:

1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify Node.js and npm versions are up to date
4. Refer to the main README.md for detailed project information

Happy coding! 🚀 