const PROJECTS = [
  {
    "id": "ecommerce-pro",
    "title": "ShopVibe - Modern Full-Stack E-Commerce Store",
    "tagline": "Complete online shopping platform with cart, checkout, payments, and admin panel.",
    "category": "Full Stack",
    "badge": "Bestseller",
    "price": 999,
    "original_price": 2499,
    "rating": 4.9,
    "downloads": 842,
    "tech_stack": [
      "React",
      "Node.js",
      "Express",
      "Tailwind CSS",
      "Stripe/UPI"
    ],
    "description": "A high-performance e-commerce platform built for high conversions. Includes customer product browsing, category filters, wishlist, cart management, simulated checkout, and an intuitive Admin Inventory Dashboard.",
    "features": [
      "Responsive Modern Storefront with Dark/Light mode",
      "Real-time Cart & Checkout with discount coupon engine",
      "Admin Dashboard: Manage products, orders, and sales charts",
      "Mock Razorpay & Stripe integration ready for production keys",
      "SEO-optimized and mobile-first responsive layout"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract ZIP file",
        "cmd": "Unzip the downloaded shopvibe.zip to your desired folder."
      },
      {
        "step": 2,
        "title": "Install Dependencies",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Configure Environment",
        "cmd": "cp .env.example .env"
      },
      {
        "step": 4,
        "title": "Start Development Server",
        "cmd": "npm run dev"
      }
    ],
    "files": {
      "README.md": "# ShopVibe E-Commerce Platform\n\n## Quick Start:\n1. Open terminal in this folder\n2. Run `npm install`\n3. Run `npm run dev`\n4. Visit `http://localhost:3000`\n\nEnjoy building with ShopVibe!",
      "run.bat": "@echo off\necho Starting ShopVibe Store...\ncall npm run dev\npause",
      "package.json": "{\n  \"name\": \"shopvibe-store\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"lucide-react\": \"^0.300.0\"\n  }\n}",
      "index.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head><meta charset=\"UTF-8\"><title>ShopVibe Store</title><script src=\"https://cdn.tailwindcss.com\"></script></head>\n<body class=\"bg-gray-50 text-gray-900\">\n  <header class=\"p-4 bg-indigo-600 text-white flex justify-between items-center\"><h1 class=\"text-2xl font-bold\">ShopVibe Store</h1><button class=\"bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold\">Cart (0)</button></header>\n  <main class=\"max-w-6xl mx-auto p-8\"><h2 class=\"text-3xl font-extrabold mb-6\">Featured Products</h2><div class=\"grid grid-cols-1 md:grid-cols-3 gap-6\"><div class=\"bg-white p-4 rounded-xl shadow-md border\"><div class=\"h-48 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-500 font-bold\">Product Preview</div><h3 class=\"mt-4 font-bold text-lg\">Wireless Headphones</h3><p class=\"text-indigo-600 font-bold text-xl mt-1\">\u20b91,999</p><button class=\"mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700\">Add to Cart</button></div></div></main>\n</body></html>"
    }
  },
  {
    "id": "hospital-crm",
    "title": "MediCare - Hospital & Clinic Management ERP",
    "tagline": "Patient records, doctor appointment scheduling, pharmacy bills, and OPD queue manager.",
    "category": "Python / AI",
    "badge": "Popular",
    "price": 1299,
    "original_price": 3199,
    "rating": 4.8,
    "downloads": 612,
    "tech_stack": [
      "Python",
      "Django",
      "SQLite/PostgreSQL",
      "Bootstrap 5"
    ],
    "description": "Comprehensive healthcare ERP covering OPD patient registrations, automated token generation, doctor schedule management, pharmacy stock management, and medical bill generation with PDF export.",
    "features": [
      "Doctor Appointment Booking & Token Queue Display",
      "Electronic Health Records (EHR) & Prescription Generator",
      "Pharmacy Inventory & Expiry Alert System",
      "Printable Invoices and Medical Summaries in PDF",
      "Role-Based Access (Admin, Doctor, Receptionist, Patient)"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract ZIP file",
        "cmd": "Unzip medicare-erp.zip into your workspace."
      },
      {
        "step": 2,
        "title": "Create Virtual Environment",
        "cmd": "python -m venv venv && venv\\Scripts\\activate"
      },
      {
        "step": 3,
        "title": "Install Requirements",
        "cmd": "pip install -r requirements.txt"
      },
      {
        "step": 4,
        "title": "Run Migrations & Server",
        "cmd": "python manage.py migrate && python manage.py runserver"
      }
    ],
    "files": {
      "README.md": "# MediCare Hospital Management ERP\n\n## Quick Start:\n1. `pip install -r requirements.txt`\n2. `python app.py`\n3. Open `http://localhost:5000`",
      "requirements.txt": "Flask==3.0.0\nsqlite3\nJinja2==3.1.2",
      "app.py": "from flask import Flask, render_template_string\napp = Flask(__name__)\n@app.route('/')\ndef home():\n    return '<h1>MediCare ERP Running Successfully!</h1><p>Visit admin portal to manage appointments.</p>'\nif __name__ == '__main__':\n    app.run(debug=True, port=5000)"
    }
  },
  {
    "id": "ai-saas-studio",
    "title": "NeuroCopy - AI Content & Image Generation SaaS",
    "tagline": "Full turnkey AI SaaS platform with subscription billing, API rate limiting, and prompt studio.",
    "category": "SaaS",
    "badge": "Hot",
    "price": 1499,
    "original_price": 3999,
    "rating": 5.0,
    "downloads": 930,
    "tech_stack": [
      "Next.js 14",
      "Tailwind CSS",
      "Gemini API",
      "Stripe Billing"
    ],
    "description": "Turnkey generative AI SaaS platform capable of generating marketing copy, social media posts, code snippets, and midjourney-style image prompts. Built-in credit system and subscription tiers.",
    "features": [
      "Google Gemini & OpenAI multi-provider backend switcher",
      "Credit-based usage meter and monthly recurring subscriptions",
      "Beautiful Markdown rich text editor with 1-click copy & export",
      "User Authentication & Payment webhook listener",
      "Dark Cyberpunk and Minimalist theme toggle"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract files",
        "cmd": "Unzip neurocopy-saas.zip."
      },
      {
        "step": 2,
        "title": "Install packages",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Set API Key",
        "cmd": "Add GEMINI_API_KEY in .env.local"
      },
      {
        "step": 4,
        "title": "Start SaaS",
        "cmd": "npm run dev"
      }
    ],
    "files": {
      "README.md": "# NeuroCopy AI SaaS\n\nAdd your GEMINI_API_KEY to `.env` and run `npm run dev`.\nVisit `http://localhost:3000` to launch the AI workspace.",
      "package.json": "{\n  \"name\": \"neurocopy-ai\",\n  \"version\": \"1.0.0\",\n  \"scripts\": { \"dev\": \"next dev\" }\n}"
    }
  },
  {
    "id": "chat-webrtc",
    "title": "StreamPulse - Real-time Video Meeting & Team Chat",
    "tagline": "Zoom & Slack alternative with peer-to-peer HD video, screen sharing, and group messaging.",
    "category": "Web App",
    "badge": "Top Rated",
    "price": 1199,
    "original_price": 2899,
    "rating": 4.9,
    "downloads": 480,
    "tech_stack": [
      "WebRTC",
      "Socket.io",
      "Node.js",
      "React",
      "Tailwind"
    ],
    "description": "Low-latency real-time video conferencing and instant team chat software. Features encrypted room codes, screen sharing, interactive whiteboard, raise hand, and multi-channel chat.",
    "features": [
      "P2P WebRTC audio and video mesh with adaptive bitrate",
      "Instant Room Creation with shareable invite links",
      "Live screen sharing and collaborative drawing whiteboard",
      "Group and 1-on-1 direct messaging with file attachments",
      "No third-party paid server needed - 100% self-hosted"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip project",
        "cmd": "Extract streampulse.zip."
      },
      {
        "step": 2,
        "title": "Install Node deps",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Start Socket & Web Server",
        "cmd": "node server.js"
      }
    ],
    "files": {
      "README.md": "# StreamPulse WebRTC Video & Chat\n\nRun `node server.js` and open `http://localhost:3000` in multiple tabs to test peer video call!"
    }
  },
  {
    "id": "lms-portal",
    "title": "EduMaster - Online Course & LMS Learning Portal",
    "tagline": "Udemy-style platform for video courses, quizzes, student certificates, and instructor payouts.",
    "category": "Full Stack",
    "badge": "Trending",
    "price": 899,
    "original_price": 2199,
    "rating": 4.7,
    "downloads": 710,
    "tech_stack": [
      "React",
      "Express.js",
      "MongoDB",
      "Video.js"
    ],
    "description": "A complete Learning Management System (LMS) allowing creators to publish video courses, create chapter quizzes, track student completion percentages, and issue automated completion certificates.",
    "features": [
      "Video Player with speed control, resume playback, and notes",
      "Quiz engine with instant grading and pass/fail certificates",
      "Instructor Dashboard with course revenue analytics",
      "Student progress tracking and downloadable PDF certificate generator",
      "Course reviews, star ratings, and discussion forum"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip",
        "cmd": "Extract edumaster.zip."
      },
      {
        "step": 2,
        "title": "Install",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Run Server",
        "cmd": "npm start"
      }
    ],
    "files": {
      "README.md": "# EduMaster LMS Portal\n\nRun `npm install && npm start` to begin teaching online."
    }
  },
  {
    "id": "crypto-tracker",
    "title": "CoinMatrix - Crypto Portfolio & Live Trading Bot Dashboard",
    "tagline": "Real-time cryptocurrency ticker, candlestick charts, portfolio P&L, and alert bots.",
    "category": "Web App",
    "badge": "Popular",
    "price": 799,
    "original_price": 1999,
    "rating": 4.8,
    "downloads": 540,
    "tech_stack": [
      "React",
      "Chart.js / TradingView",
      "CoinGecko API",
      "Tailwind CSS"
    ],
    "description": "Interactive crypto dashboard displaying live prices for 5,000+ coins, technical indicators (RSI, MACD), profit & loss portfolio calculations, and customizable price threshold alerts.",
    "features": [
      "Live TradingView Candlestick Chart integration",
      "Portfolio tracking with historical buy/sell performance",
      "Gas price tracker, Fear & Greed index widgets",
      "Simulated paper trading terminal for practicing strategies",
      "Responsive layout tailored for mobile & desktop"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract ZIP",
        "cmd": "Unzip coinmatrix.zip."
      },
      {
        "step": 2,
        "title": "Install Dependencies",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Launch Dashboard",
        "cmd": "npm run dev"
      }
    ],
    "files": {
      "README.md": "# CoinMatrix Crypto Dashboard\n\nRun `npm install && npm run dev` to see live crypto tickers."
    }
  },
  {
    "id": "restaurant-pos",
    "title": "BistroFlow - Restaurant POS & Online Food Ordering",
    "tagline": "Table QR code menu, kitchen order display (KOD), billing, and delivery rider tracker.",
    "category": "Full Stack",
    "badge": "High Demand",
    "price": 1099,
    "original_price": 2799,
    "rating": 4.9,
    "downloads": 670,
    "tech_stack": [
      "React",
      "Node.js",
      "Express",
      "Tailwind CSS",
      "WebSockets"
    ],
    "description": "End-to-end food service system designed for cafes and cloud kitchens. Customers scan QR codes on tables to order; orders immediately ding on the Kitchen Order Display (KOD) screen.",
    "features": [
      "Digital Menu with add-ons, toppings, and spice levels",
      "Kitchen Order Display (KOD) with real-time audio notifications",
      "Instant thermal receipt generation and split-bill calculation",
      "Delivery management with simulated GPS rider tracking",
      "Daily sales report with best-selling dish insights"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract files",
        "cmd": "Unzip bistroflow.zip."
      },
      {
        "step": 2,
        "title": "Install dependencies",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Run Server",
        "cmd": "npm run start"
      }
    ],
    "files": {
      "README.md": "# BistroFlow Restaurant POS\n\nStart order processing with `npm install && npm run start`."
    }
  },
  {
    "id": "python-web-scraper",
    "title": "LeadPulse - Automated Web Scraper & Business Lead Miner",
    "tagline": "Extract B2B emails, phone numbers, and company profiles into clean Excel/CSV spreadsheets.",
    "category": "Python / AI",
    "badge": "Utility",
    "price": 699,
    "original_price": 1799,
    "rating": 4.8,
    "downloads": 890,
    "tech_stack": [
      "Python",
      "Selenium",
      "BeautifulSoup4",
      "Pandas",
      "Streamlit GUI"
    ],
    "description": "Smart automated crawler and data scraper with a user-friendly Streamlit web interface. Scrapes Google Maps, LinkedIn public directories, and business listings while avoiding anti-bot captchas.",
    "features": [
      "Point-and-click Streamlit GUI (no coding required to operate)",
      "Automatic email and phone number regex extraction from websites",
      "Proxy rotation and humanized scrolling delays to bypass blocks",
      "1-click export to CSV, JSON, and styled Excel sheets",
      "Built-in duplicate lead cleaner and domain validator"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip leadpulse.zip",
        "cmd": "Extract into your Python projects folder."
      },
      {
        "step": 2,
        "title": "Install requirements",
        "cmd": "pip install -r requirements.txt"
      },
      {
        "step": 3,
        "title": "Launch Streamlit UI",
        "cmd": "streamlit run app.py"
      }
    ],
    "files": {
      "README.md": "# LeadPulse B2B Lead Scraper\n\nRun `pip install -r requirements.txt` followed by `streamlit run app.py`.",
      "requirements.txt": "streamlit\nbeautifulsoup4\nrequests\npandas\nopenpyxl",
      "app.py": "import streamlit as st\nst.title('LeadPulse Scraper')\nst.write('Enter website URL to mine B2B contacts.')"
    }
  },
  {
    "id": "cloud-drive",
    "title": "SkyVault - Private Cloud Storage & File Sharing Platform",
    "tagline": "Google Drive alternative with fast multi-part uploads, encrypted links, and folder permissions.",
    "category": "Cloud",
    "badge": "Pro",
    "price": 1199,
    "original_price": 2999,
    "rating": 4.9,
    "downloads": 430,
    "tech_stack": [
      "React",
      "Node.js",
      "Express",
      "AWS S3 / Local Storage",
      "Tailwind"
    ],
    "description": "Self-hosted cloud storage system with drag-and-drop file uploads, image/video previews, password-protected download links, and user quota management.",
    "features": [
      "Chunked & resumable large file uploads (up to 10GB)",
      "In-browser preview for PDFs, images, audio, and MP4 videos",
      "Expiring and password-protected public share links",
      "Trash bin with 30-day restore and version history",
      "Supports local disk storage or Amazon S3 / Cloudflare R2"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip project",
        "cmd": "Extract skyvault.zip."
      },
      {
        "step": 2,
        "title": "Install dependencies",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Launch app",
        "cmd": "npm run start"
      }
    ],
    "files": {
      "README.md": "# SkyVault Cloud Drive\n\nRun `npm install && npm run start` to start your personal cloud drive."
    }
  },
  {
    "id": "real-estate-portal",
    "title": "HomeSphere - Real Estate & Property Marketplace Portal",
    "tagline": "Zillow-style portal with interactive map search, virtual tours, and agent inquiry forms.",
    "category": "Full Stack",
    "badge": "Featured",
    "price": 1099,
    "original_price": 2699,
    "rating": 4.7,
    "downloads": 390,
    "tech_stack": [
      "React",
      "Leaflet Maps",
      "Express",
      "Tailwind CSS"
    ],
    "description": "Feature-packed real estate listing engine. Users can search properties on an interactive map, filter by price/BHK/amenities, view 360 photo tours, and book property walkthroughs directly.",
    "features": [
      "Leaflet OpenStreetMap integration with pin clustering",
      "Advanced property filter (Buy, Rent, Commercial, Budget, BHK)",
      "Direct WhatsApp / Call agent inquiry integration",
      "EMI and mortgage calculator widget",
      "Agent profile page with active listings"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip",
        "cmd": "Extract homesphere.zip."
      },
      {
        "step": 2,
        "title": "Install",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Run Server",
        "cmd": "npm run dev"
      }
    ],
    "files": {
      "README.md": "# HomeSphere Real Estate Portal\n\nRun `npm install && npm run dev` to launch the property portal."
    }
  },
  {
    "id": "bug-tracker-kanban",
    "title": "TaskForge - Agile Project Tracker & Sprint Kanban Board",
    "tagline": "Jira & Trello alternative with drag-and-drop Kanban, sprint burndown charts, and issue tracking.",
    "category": "Web App",
    "badge": "Popular",
    "price": 899,
    "original_price": 2299,
    "rating": 4.8,
    "downloads": 560,
    "tech_stack": [
      "React",
      "React-Beautiful-DND",
      "Node.js",
      "Express",
      "Tailwind"
    ],
    "description": "Collaborative project management tool built for agile engineering teams. Drag and drop tasks between Backlog, In Progress, Review, and Done with instantaneous state sync.",
    "features": [
      "Fluid drag-and-drop Kanban columns and cards",
      "Sprint planning board with velocity and burndown charts",
      "Markdown task descriptions with attachments and subtasks",
      "User mentions (@teammate) and activity audit logs",
      "Export project summary reports to PDF & JSON"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract ZIP",
        "cmd": "Unzip taskforge.zip."
      },
      {
        "step": 2,
        "title": "Install packages",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Start frontend & backend",
        "cmd": "npm start"
      }
    ],
    "files": {
      "README.md": "# TaskForge Agile Kanban\n\nRun `npm install && npm start` to open the Kanban board."
    }
  },
  {
    "id": "gym-membership",
    "title": "FitMatrix - Gym & Fitness Center Management System",
    "tagline": "Member subscriptions, biometric check-in log, trainer bookings, and diet plan generator.",
    "category": "Full Stack",
    "badge": "Utility",
    "price": 799,
    "original_price": 1899,
    "rating": 4.7,
    "downloads": 410,
    "tech_stack": [
      "React",
      "Node.js",
      "Tailwind CSS",
      "SQLite"
    ],
    "description": "Turnkey gym management application for fitness studios and personal trainers. Handles recurring membership renewals, automated payment reminder SMS/WhatsApp, and locker assignments.",
    "features": [
      "Member profile with expiry status badges (Active, Expired, Due Soon)",
      "Daily check-in / attendance counter with barcode/QR scanner support",
      "Custom diet chart and workout routine builder",
      "Financial cashflow and membership renewal forecasts",
      "Trainer slot scheduling and personal training session manager"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip project",
        "cmd": "Extract fitmatrix.zip."
      },
      {
        "step": 2,
        "title": "Install modules",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Start App",
        "cmd": "npm start"
      }
    ],
    "files": {
      "README.md": "# FitMatrix Gym Manager\n\nRun `npm install && npm start` to start the gym portal."
    }
  },
  {
    "id": "dev-portfolio-blog",
    "title": "DevCraft - High-Converting Developer Portfolio & MDX Blog",
    "tagline": "Sleek portfolio with 3D project showcase, tech stack pills, MDX technical blog, and contact form.",
    "category": "Web App",
    "badge": "Top Pick",
    "price": 499,
    "original_price": 1499,
    "rating": 4.9,
    "downloads": 1280,
    "tech_stack": [
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Contentlayer MDX"
    ],
    "description": "Showcase your work and land high-paying clients or jobs. Includes smooth animations, dynamic project filter, resume viewer, interactive GitHub stats card, and dark/light modes.",
    "features": [
      "Framer Motion smooth scroll and floating card animations",
      "MDX technical blog engine with syntax highlighted code blocks",
      "Working contact form with Web3Forms / EmailJS integration",
      "Lighthouse 100/100 performance, accessibility, and SEO score",
      "1-click deploy to Vercel or Netlify"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip",
        "cmd": "Extract devcraft.zip."
      },
      {
        "step": 2,
        "title": "Install packages",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Run Dev Server",
        "cmd": "npm run dev"
      }
    ],
    "files": {
      "README.md": "# DevCraft Portfolio\n\nRun `npm install && npm run dev` to customize your portfolio."
    }
  },
  {
    "id": "inventory-billing-erp",
    "title": "VyaparPro - GST Billing & Inventory Management ERP",
    "tagline": "Tally/Vyapar alternative for small businesses with barcode billing, GST invoices, and stock alerts.",
    "category": "Python / AI",
    "badge": "High Demand",
    "price": 1199,
    "original_price": 2899,
    "rating": 4.9,
    "downloads": 760,
    "tech_stack": [
      "Python",
      "Flask",
      "SQLite",
      "Bootstrap 5",
      "Chart.js"
    ],
    "description": "Complete Indian billing software with CGST/SGST/IGST tax calculation, thermal and A4 PDF bill printing, low stock alerts, supplier ledger records, and customer balance tracking.",
    "features": [
      "Fast Barcode Scanner billing mode for superfast checkout",
      "GST compliant Tax Invoice (A4 and 3-inch thermal printer formats)",
      "Automated Low Stock warnings and Purchase Order generation",
      "Credit / Udhar ledger with WhatsApp payment reminder links",
      "Profit & Loss and Balance Sheet quarterly reports"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Unzip archive",
        "cmd": "Extract vyaparpro.zip."
      },
      {
        "step": 2,
        "title": "Install Python dependencies",
        "cmd": "pip install -r requirements.txt"
      },
      {
        "step": 3,
        "title": "Start ERP",
        "cmd": "python app.py"
      }
    ],
    "files": {
      "README.md": "# VyaparPro GST Billing ERP\n\nRun `pip install -r requirements.txt` then `python app.py`.\nOpen `http://localhost:5000` to start billing."
    }
  },
  {
    "id": "multi-vendor-market",
    "title": "MarketNest - Multi-Vendor Marketplace (Amazon/Etsy Clone)",
    "tagline": "Vendors register, upload products, manage their store; admin collects automatic commissions.",
    "category": "Full Stack",
    "badge": "Enterprise",
    "price": 1699,
    "original_price": 4499,
    "rating": 4.9,
    "downloads": 520,
    "tech_stack": [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL/MongoDB",
      "Tailwind"
    ],
    "description": "Sophisticated multi-seller e-commerce ecosystem. Each seller gets an independent vendor dashboard to manage listings, track earnings, and request payouts. Admin sets platform commission fee.",
    "features": [
      "Dedicated Vendor Portal with sales analytics and order fulfillment",
      "Super Admin command center with commission rules and seller approvals",
      "Customer multi-vendor unified cart with split shipments",
      "Payout request system with automated ledger calculations",
      "Customer review & seller reputation score system"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract files",
        "cmd": "Unzip marketnest.zip."
      },
      {
        "step": 2,
        "title": "Install dependencies",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Launch Platform",
        "cmd": "npm run start"
      }
    ],
    "files": {
      "README.md": "# MarketNest Multi-Vendor Marketplace\n\nRun `npm install && npm run start` to boot up marketplace."
    }
  },
  {
    "id": "iot-smart-dashboard",
    "title": "HomePulse - IoT Smart Home & Industrial Sensor Telemetry",
    "tagline": "Connect ESP32 / Arduino / Raspberry Pi sensors with live gauges, relays, and automation rules.",
    "category": "Cloud",
    "badge": "Innovative",
    "price": 899,
    "original_price": 2399,
    "rating": 4.8,
    "downloads": 310,
    "tech_stack": [
      "React",
      "MQTT",
      "WebSockets",
      "Node.js",
      "Chart.js"
    ],
    "description": "Real-time IoT telemetry and device control hub. Monitor temperature, humidity, power consumption, and control relays or smart lights with sub-second latency.",
    "features": [
      "MQTT broker bridge with live WebSockets telemetry streaming",
      "Interactive toggle switches, sliders, and color pickers for smart devices",
      "Historical sensor data graphing with zoom and date ranges",
      "Custom automation rules (e.g., 'If Temp > 32\u00b0C, turn AC relay ON')",
      "Includes ready-to-flash Arduino C++ / ESP32 sample firmware"
    ],
    "setup_steps": [
      {
        "step": 1,
        "title": "Extract archive",
        "cmd": "Unzip homepulse.zip."
      },
      {
        "step": 2,
        "title": "Install dependencies",
        "cmd": "npm install"
      },
      {
        "step": 3,
        "title": "Run Server",
        "cmd": "node server.js"
      }
    ],
    "files": {
      "README.md": "# HomePulse IoT Dashboard\n\nRun `npm install && node server.js` to see real-time IoT feeds."
    }
  }
];
