import React, { useState, useEffect } from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import PlaceholderPage from "./PlaceholderPage";
import { 
  Zap, 
  Battery, 
  Gauge, 
  DollarSign, 
  Globe, 
  MapPin, 
  Star, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  Menu, 
  X, 
  Shield, 
  Award, 
  Building, 
  TrendingUp, 
  Clock, 
  Mail, 
  Phone, 
  Map, 
  Settings, 
  ArrowUpRight, 
  FileText,
  User,
  AlertCircle
} from "lucide-react";

// --- Types & Interfaces ---
interface BikeModel {
  id: string;
  name: string;
  tagline: string;
  type: string;
  basePrice: number;
  topSpeed: number; // km/h
  range: number; // km
  chargeTime: number; // minutes (0-80%)
  motorPower: string; // kW
  acceleration: string; // 0-60 km/h
  colors: { name: string; hex: string; highlightHex: string; bgClass: string }[];
  description: string;
  features: string[];
}

interface Testimonial {
  author: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
  date: string;
}

export default function App() {
  // --- Routing States & Logic ---
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string, tabName?: "models" | "about" | "b2b" | "reviews") => {
    e.preventDefault();
    if (tabName) setActiveTab(tabName);
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
      setCurrentPath("/");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- States ---
  const [activeTab, setActiveTab] = useState<"models" | "about" | "b2b" | "reviews">("models");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Hero Image Slider State
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Calculator States (Impact Tracker)
  const [dailyCommute, setDailyCommute] = useState(40); // km
  const [fuelPrice, setFuelPrice] = useState(1.85); // $ per liter
  const [iceEfficiency, setIceEfficiency] = useState(30); // km per liter
  const [calculatedSavings, setCalculatedSavings] = useState({ monthlyFuel: 0, annualCo2: 0, paybackMonths: 0 });

  // Timeline State
  const [activeMilestone, setActiveMilestone] = useState(0);

  // Bike Customization State
  const [selectedBikeId, setSelectedBikeId] = useState("s-alpha");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  // B2B Interactive Map State
  const [selectedRegion, setSelectedRegion] = useState<string>("central");

  // B2B Form Submission State
  const [b2bFormData, setB2bFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    region: "central",
    showroomSize: "medium",
    estimatedOrder: "15",
    message: ""
  });
  const [b2bSubmitted, setB2bSubmitted] = useState(false);
  const [b2bSubmitting, setB2bSubmitting] = useState(false);
  const [b2bReference, setB2bReference] = useState("");

  // Test Ride Modal State
  const [isTestRideModalOpen, setIsTestRideModalOpen] = useState(false);
  const [testRideBike, setTestRideBike] = useState("s-alpha");
  const [testRideDate, setTestRideDate] = useState("");
  const [testRideTime, setTestRideTime] = useState("morning");
  const [testRideSubmitted, setTestRideSubmitted] = useState(false);

  // Reviews Toggle State
  const [reviewCategory, setReviewCategory] = useState<"riders" | "dealers">("riders");
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // --- Static Data ---
  const bikeModels: BikeModel[] = [
    {
      id: "r-commuter",
      name: "REBON R-1 COMMUTER",
      tagline: "The Ultimate Urban Workhorse",
      type: "Urban Commuter",
      basePrice: 3499,
      topSpeed: 85,
      range: 120,
      chargeTime: 45,
      motorPower: "4.5 kW",
      acceleration: "4.1s",
      colors: [
        { name: "Matte Slate Gray", hex: "#1f2937", highlightHex: "#06b6d4", bgClass: "bg-slate-800" },
        { name: "Stealth Titanium", hex: "#4b5563", highlightHex: "#10b981", bgClass: "bg-gray-600" },
        { name: "Arctic White", hex: "#f3f4f6", highlightHex: "#ef4444", bgClass: "bg-white" }
      ],
      description: "Engineered specifically for the modern professional. Seamlessly navigate congested streets with zero emissions, ultra-low operating costs, and intelligent smartphone integration.",
      features: [
        "Detachable Lithium-Ion Battery Pack (Easy indoor charging)",
        "Integrated LED Matrix Smart Display with GPS HUD Navigation",
        "Regenerative Braking KERS (recovers 12% energy)",
        "Under-seat locked storage for full-size helmet"
      ]
    },
    {
      id: "s-alpha",
      name: "REBON S-ALPHA SPORTS",
      tagline: "Track-Bred Performance. Zero Emissions.",
      type: "High-Performance Naked",
      basePrice: 5999,
      topSpeed: 135,
      range: 160,
      chargeTime: 30,
      motorPower: "11.0 kW",
      acceleration: "2.4s",
      colors: [
        { name: "Raw Carbon Black", hex: "#111827", highlightHex: "#00f5ff", bgClass: "bg-gray-950" },
        { name: "Vibrant Cyan-Flux", hex: "#06b6d4", highlightHex: "#ffffff", bgClass: "bg-cyan-500" },
        { name: "Copper Forge", hex: "#b45309", highlightHex: "#00f5ff", bgClass: "bg-amber-700" }
      ],
      description: "Unleash instant torque. Built around an ultra-lightweight carbon-hybrid frame with a high-voltage powertrain, the S-Alpha delivers blistering performance inspired by premier supercharged racing.",
      features: [
        "High-voltage Liquid-Cooled Motor (Continuous peak power)",
        "Racing-grade Adjustable Mono-shock Rear Suspension",
        "Dual Brembo-style Combined Braking System (CBS) with Cornering ABS",
        "Dynamic Performance Telemetry App & Track Mode"
      ]
    },
    {
      id: "x-over",
      name: "REBON X-OVER EXPLORER",
      tagline: "Beyond Limits. Built for All Terrains.",
      type: "Dual-Sport Adventure",
      basePrice: 4899,
      topSpeed: 105,
      range: 210,
      chargeTime: 60,
      motorPower: "7.5 kW",
      acceleration: "3.2s",
      colors: [
        { name: "Stealth Khaki", hex: "#4338ca", highlightHex: "#f59e0b", bgClass: "bg-stone-700" },
        { name: "Forge Copper", hex: "#b45309", highlightHex: "#ffffff", bgClass: "bg-amber-800" },
        { name: "Deep Matte Gray", hex: "#1f2937", highlightHex: "#ef4444", bgClass: "bg-slate-800" }
      ],
      description: "Equipped for long-distance cruising and rough pathways. Features a dual-battery compartment, reinforced aluminum skid plate, and knobby dual-sport tires to take you wherever the road disappears.",
      features: [
        "Dual Hot-Swappable Batteries (Simultaneous discharge system)",
        "Reinforced Heavy-duty Steel Trellis Frame",
        "Off-road Mud-Sling Fenders and Crash Protection Rails",
        "All-Weather IP67 Rated Waterproof Electronics"
      ]
    }
  ];

  const accessoryOptions = [
    { id: "cargo-rack", name: "Premium Smart Panniers & Rear Cargo Rack", price: 299 },
    { id: "fast-charger", name: "Ultra-Fast Supercharger (0-80% in 15 mins)", price: 349 },
    { id: "comfort-seat", name: "Ergonomic Premium Memory Foam Touring Seat", price: 189 },
    { id: "carbon-screen", name: "Wind-tunnel Tested Matte Carbon Windshield", price: 159 }
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Engineering Genesis",
      desc: "Founded in Munich with a core mission to bring premium BMW-inspired build quality to dual-wheel EVs. Patented our high-torque Liquid-Cooled Hub Motor system.",
      tech: "Chassis simulation & 3D printed prototype chassis.",
      status: "Completed"
    },
    {
      year: "2024",
      title: "Thermal Management Breakthrough",
      desc: "Successfully launched the first intelligent dynamic liquid cooling system for EV motorcycle batteries. Extended battery health and reliability by 45%.",
      tech: "Direct-contact phase change materials (PCM) modules.",
      status: "Completed"
    },
    {
      year: "2025",
      title: "First Production & Infrastructure Hub",
      desc: "Began deliveries of the R-1 Commuter. Established our pilot network of 15 proprietary solar-powered swappable-battery charging hubs.",
      tech: "IoT tracking telemetry cloud platform integration.",
      status: "Completed"
    },
    {
      year: "2026",
      title: "Global Showroom Expansion",
      desc: "Scaling manufacturing capabilities up to 50,000 units annually. Establishing certified dealerships across Europe, North America, and B2B partnerships.",
      tech: "Full vehicle system remote diagnostic firmware updates.",
      status: "Active Deployment"
    }
  ];

  const regionsData: Record<string, { name: string; dealers: number; demand: string; status: string; details: string }> = {
    north: { name: "North Division Hub", dealers: 12, demand: "Critical / High", status: "Allocating Partners", details: "Active hubs in Hamburg & Berlin. Seeking exclusive dealer representatives for Baltic and northern maritime territories." },
    west: { name: "West Performance Division", dealers: 18, demand: "Exceptional", status: "Limited Openings", details: "Showrooms active in Munich, Frankfurt & Cologne. High volume fleet demand for municipal and delivery sectors." },
    east: { name: "Eastern Gateway Hub", dealers: 8, demand: "Steady Grow", status: "Accepting Applications", details: "Initial expansion phase in Vienna, Prague, and Budapest. Exclusive shipping concessions available for premium retail stores." },
    south: { name: "Alpine & Med Territory", dealers: 14, demand: "High", status: "Interviewing Candidates", details: "Active networks in Milan and Zurich. Focus on lightweight sports units for eco-conscious mountainous communities." },
    central: { name: "Central Corporate Headquarters", dealers: 25, demand: "Maximum Cap", status: "Strategic Partners Only", details: "Our primary engineering and final assembly plant in Frankfurt. Direct technical support hub, centralized spare parts facility, and B2B partner training center." }
  };

  const testimonials: Testimonial[] = [
    {
      author: "Dominik Richter",
      role: "Certified Showroom Owner",
      location: "Frankfurt, Germany",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "Partnering with Rebon Motor Company has transformed our business. The product quality is incredible—B2B distribution is prompt, and our customers are absolutely blown away by the S-Alpha's instant acceleration. The dealer portal ERP integration is brilliant.",
      date: "May 2026"
    },
    {
      author: "Elena Vasilescu",
      role: "Daily Commuter",
      location: "Vienna, Austria",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "My daily commute used to cost me over €180 a month in petrol. Since switching to the Rebon R-1, my expenses are virtually zero. I charge it at my desk at work. The bike feels exceptionally sturdy and reliable, even in torrential rain.",
      date: "June 2026"
    },
    {
      author: "Marcus Vance",
      role: "Fleet Logistics Director",
      location: "Munich, Germany",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      quote: "We acquired 12 X-Over Adventure units for our regional carbon-neutral monitoring project. The double battery range is exceptional. Zero mechanical maintenance required in over 15,000 collective kilometers. A solid business investment.",
      date: "April 2026"
    }
  ];

  const featuredInLogos = [
    { name: "Wired", text: "WIRED", quote: "\"Rebon EV is the premium sportbike the electrical vehicle industry has been waiting for.\"" },
    { name: "MotoTrend", text: "MOTO TREND", quote: "\"Stunning design, exceptional battery thermal control, and a BMW Motorrad soul.\"" },
    { name: "EV Weekly", text: "EV WEEKLY", quote: "\"An engineering masterpiece. The instant torque of the S-Alpha is mind-blowing.\"" },
    { name: "TechCrunch", text: "TECHCRUNCH", quote: "\"Disrupting the B2B dealership model with cutting edge cloud logistics.\"" }
  ];

  // --- Effects & Logic ---
  // Save Calculator Engine
  useEffect(() => {
    // Assuming a regular vehicle uses: Daily Commute * 250 working days per year
    // Liter of fuel saves: (Daily Commute / ICE efficiency) * Fuel Price
    const dailySavedFuelExpense = (dailyCommute / iceEfficiency) * fuelPrice;
    const monthlyFuelSavings = Math.round(dailySavedFuelExpense * 22); // average 22 commutes per month
    
    // CO2 calculations: Petrol car average releases ~2.3 kg of CO2 per liter burned
    const litersBurnedPerYear = (dailyCommute * 250) / iceEfficiency;
    const annualCo2Saved = Math.round(litersBurnedPerYear * 2.3);

    // Dynamic Payback Timeline (Rebon Bike cost vs saving)
    const activeBike = bikeModels.find(b => b.id === selectedBikeId) || bikeModels[0];
    const totalSelectedPrice = activeBike.basePrice + selectedAccessories.reduce((acc, currentId) => {
      const item = accessoryOptions.find(a => a.id === currentId);
      return acc + (item ? item.price : 0);
    }, 0);

    const paybackMonths = monthlyFuelSavings > 0 ? Math.ceil(totalSelectedPrice / monthlyFuelSavings) : 99;

    setCalculatedSavings({
      monthlyFuel: monthlyFuelSavings,
      annualCo2: annualCo2Saved,
      paybackMonths: paybackMonths
    });
  }, [dailyCommute, fuelPrice, iceEfficiency, selectedBikeId, selectedAccessories]);

  // Hero loop effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % bikeModels.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeBikeData = bikeModels.find(b => b.id === selectedBikeId) || bikeModels[0];

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const currentTotalPrice = activeBikeData.basePrice + selectedAccessories.reduce((acc, currentId) => {
    const item = accessoryOptions.find(a => a.id === currentId);
    return acc + (item ? item.price : 0);
  }, 0);

  // Form Submissions
  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bFormData.companyName || !b2bFormData.email || !b2bFormData.phone) return;
    setB2bSubmitting(true);
    
    setTimeout(() => {
      setB2bSubmitting(false);
      setB2bSubmitted(true);
      const randRef = `REBON-B2B-${Math.floor(100000 + Math.random() * 900000)}`;
      setB2bReference(randRef);
    }, 1500);
  };

  const handleTestRideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setB2bSubmitting(true);
    
    setTimeout(() => {
      setB2bSubmitting(false);
      setTestRideSubmitted(true);
    }, 1200);
  };

  const openTestRideModal = (bikeId: string) => {
    setTestRideBike(bikeId);
    setTestRideSubmitted(false);
    setIsTestRideModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-gray-100 font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* ----------------- STICKY NAVIGATION BAR ----------------- */}
      <nav id="navbar" className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#090b0e]/90 backdrop-blur-md border-b border-gray-800/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo("/")}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f5ff] to-[#0072ff] flex items-center justify-center shadow-lg shadow-[#00f5ff]/20">
                <Zap className="w-6 h-6 text-black stroke-[2.5]" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-widest text-white">REBON</span>
                <span className="text-[#00f5ff] text-[10px] block tracking-widest font-semibold uppercase -mt-1">Motor Company</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#models" 
                onClick={(e) => handleAnchorClick(e, "models", "models")}
                className={`font-display text-sm uppercase tracking-wider transition-colors hover:text-[#00f5ff] ${activeTab === "models" && currentPath === "/" ? "text-[#00f5ff] font-medium" : "text-gray-400"}`}
              >
                Models
              </a>
              <a 
                href="#about" 
                onClick={(e) => handleAnchorClick(e, "about", "about")}
                className={`font-display text-sm uppercase tracking-wider transition-colors hover:text-[#00f5ff] ${activeTab === "about" && currentPath === "/" ? "text-[#00f5ff] font-medium" : "text-gray-400"}`}
              >
                Mission & Impact
              </a>
              <a 
                href="#dealers" 
                onClick={(e) => handleAnchorClick(e, "dealers", "b2b")}
                className={`font-display text-sm uppercase tracking-wider transition-colors hover:text-[#00f5ff] ${activeTab === "b2b" && currentPath === "/" ? "text-[#00f5ff] font-medium" : "text-gray-400"}`}
              >
                Become a Partner
              </a>
              <a 
                href="#reviews" 
                onClick={(e) => handleAnchorClick(e, "reviews", "reviews")}
                className={`font-display text-sm uppercase tracking-wider transition-colors hover:text-[#00f5ff] ${activeTab === "reviews" && currentPath === "/" ? "text-[#00f5ff] font-medium" : "text-gray-400"}`}
              >
                Testimonials
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                id="btn-nav-find-dealer"
                onClick={() => {
                  const el = document.getElementById("dealers");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 text-xs font-semibold tracking-wider uppercase border border-gray-700 rounded-md hover:bg-gray-900 transition-colors cursor-pointer"
              >
                Find a Dealer
              </button>
              <button 
                id="btn-nav-test-ride"
                onClick={() => openTestRideModal(selectedBikeId)}
                className="px-5 py-2 text-xs font-semibold tracking-wider uppercase bg-[#00f5ff] text-black rounded-md hover:bg-cyan-300 hover:shadow-lg hover:shadow-[#00f5ff]/20 transition-all cursor-pointer font-bold"
              >
                Book Test Ride
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-gray-400 hover:text-white p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0e12] border-b border-gray-800 px-4 pt-2 pb-6 space-y-3">
            <a 
              href="#models" 
              onClick={(e) => { setMobileMenuOpen(false); handleAnchorClick(e, "models", "models"); }}
              className="block px-3 py-2 rounded-md text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-900"
            >
              Models
            </a>
            <a 
              href="#about" 
              onClick={(e) => { setMobileMenuOpen(false); handleAnchorClick(e, "about", "about"); }}
              className="block px-3 py-2 rounded-md text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-900"
            >
              Mission & Impact
            </a>
            <a 
              href="#dealers" 
              onClick={(e) => { setMobileMenuOpen(false); handleAnchorClick(e, "dealers", "b2b"); }}
              className="block px-3 py-2 rounded-md text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-900"
            >
              Dealership Portal (B2B)
            </a>
            <a 
              href="#reviews" 
              onClick={(e) => { setMobileMenuOpen(false); handleAnchorClick(e, "reviews", "reviews"); }}
              className="block px-3 py-2 rounded-md text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-900"
            >
              Testimonials
            </a>
            <div className="pt-4 grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById("dealers");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 text-center text-xs font-semibold uppercase border border-gray-700 rounded-md text-gray-300 hover:bg-gray-900"
              >
                Dealers
              </button>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  openTestRideModal(selectedBikeId);
                }}
                className="w-full py-2.5 text-center text-xs font-semibold uppercase bg-[#00f5ff] text-black rounded-md font-bold"
              >
                Test Ride
              </button>
            </div>
          </div>
        )}
      </nav>

      {currentPath === "/privacy-policy" ? (
        <PrivacyPolicy navigateTo={navigateTo} />
      ) : currentPath === "/terms" ? (
        <PlaceholderPage title="Terms & Conditions" navigateTo={navigateTo} />
      ) : currentPath === "/cookie-policy" ? (
        <PlaceholderPage title="Cookie Policy" navigateTo={navigateTo} />
      ) : currentPath === "/data-deletion" ? (
        <PlaceholderPage title="Data Deletion" navigateTo={navigateTo} />
      ) : (
        <>
          {/* ----------------- 1. HERO SECTION (BMW MOTORRAD STYLE) ----------------- */}
          <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-[#090b0e] via-[#0f1217] to-[#090b0e]">
            {/* Dynamic Glowing Hexagon Background Pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="hexagons" width="50" height="43.3" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                    <path d="M25 0 L50 14.4 L50 43.3 L25 57.7 L0 43.3 L0 14.4 Z" fill="none" stroke="#2a3241" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexagons)" />
              </svg>
            </div>

            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[#0072ff] opacity-10 blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[#00f5ff] opacity-10 blur-[120px] pointer-events-none"></div>

            {/* Hero Slides Container */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Text Column */}
              <div className="lg:col-span-6 space-y-8 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-900/80 border border-gray-800 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-ping"></span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#00f5ff]">NEXT-GEN ELECTRIC POWER</span>
                </div>

                <div className="space-y-4">
                  <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] uppercase tracking-tight">
                    The Future of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00f5ff] to-[#0072ff]">
                      Two-Wheeled
                    </span> <br />
                    Performance.
                  </h1>
                  <p className="text-gray-400 text-lg max-w-lg font-light leading-relaxed">
                    Rebon Motor Company brings high-fidelity electrical engineering, racetrack precision, and zero-carbon daily utility together. Built for serious commuters and B2B dealers alike.
                  </p>
                </div>

                {/* Dual CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    id="btn-hero-explore"
                    onClick={() => {
                      setSelectedBikeId("s-alpha");
                      const el = document.getElementById("models");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-8 py-4 bg-[#00f5ff] text-black font-bold tracking-widest uppercase rounded-md text-sm hover:bg-cyan-300 hover:shadow-lg hover:shadow-[#00f5ff]/30 transition-all text-center cursor-pointer"
                  >
                    Explore Models
                  </button>
                  <button 
                    id="btn-hero-testride"
                    onClick={() => openTestRideModal(selectedBikeId)}
                    className="px-8 py-4 border border-gray-700 text-white font-semibold tracking-widest uppercase rounded-md text-sm hover:bg-gray-900 hover:border-white transition-all text-center cursor-pointer"
                  >
                    Book a Test Ride
                  </button>
                </div>

                {/* Bullet Metrics Ribbon */}
                <div className="pt-6 grid grid-cols-3 gap-6 border-t border-gray-800/80">
                  <div>
                    <p className="text-[#00f5ff] text-2xl font-bold font-mono">135 km/h</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Top Velocity</p>
                  </div>
                  <div>
                    <p className="text-[#00f5ff] text-2xl font-bold font-mono">210 km</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Max Range</p>
                  </div>
                  <div>
                    <p className="text-[#00f5ff] text-2xl font-bold font-mono">30 mins</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Super Charge</p>
                  </div>
                </div>
              </div>

              {/* Right Visual Carousel Column */}
              <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
                {/* Main Interactive Bike Render frame */}
                <div className="w-full relative aspect-square max-w-[480px] bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
                  
                  {/* Radial glow background aligned with custom color */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.08)_0%,transparent_70%)] pointer-events-none"></div>
                  
                  {/* Top Banner overlay */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 font-mono">MODEL SHOWROOM</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                      FLAGSHIP
                    </span>
                  </div>

                  {/* Dynamic SVG Vehicle Artwork */}
                  <div className="relative w-full h-[220px] flex items-center justify-center py-4">
                    <svg className="w-full h-full max-h-[200px] transition-all duration-500" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Road Shadow */}
                      <ellipse cx="200" cy="180" rx="140" ry="8" fill="rgba(0,0,0,0.4)" />
                      <ellipse cx="200" cy="180" rx="90" ry="4" fill="rgba(6,182,212,0.15)" />
                      
                      {/* Front Wheel */}
                      <circle cx="80" cy="140" r="38" stroke="#1f2937" strokeWidth="8" />
                      <circle cx="80" cy="140" r="30" stroke="#374151" strokeWidth="2" />
                      <circle cx="80" cy="140" r="38" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="12, 10" className="animate-spin" style={{ animationDuration: '6s' }} />
                      {/* Brake Caliper */}
                      <path d="M98 120 L104 135" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />

                      {/* Rear Wheel (with integrated hub motor) */}
                      <circle cx="320" cy="140" r="38" stroke="#111827" strokeWidth="12" />
                      <circle cx="320" cy="140" r="28" fill="#1f2937" stroke="#374151" strokeWidth="3" />
                      <circle cx="320" cy="140" r="22" fill="#00" />
                      {/* Hub Motor Glowing Core */}
                      <circle cx="320" cy="140" r="14" fill="none" stroke="#00f5ff" strokeWidth="2" className="animate-pulse" />
                      <circle cx="320" cy="140" r="38" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="8, 12" className="animate-spin" style={{ animationDuration: '4s' }} />

                      {/* High-Tech Trellis Frame & Carbon Fairing */}
                      <path d="M110 140 L180 140 L210 90 L140 90 Z" fill="#111317" stroke="#2a2f3a" strokeWidth="3" />
                      <path d="M180 140 L280 140 L310 95 L220 95 Z" fill="#181c24" stroke="#2a2f3a" strokeWidth="3" />
                      
                      {/* Carbon Tank Shell and Seat lines */}
                      <path d="M130 90 C150 50, 210 50, 240 85 C240 85, 275 80, 290 100 L270 115 L220 90 Z" fill="#111827" stroke="#00f5ff" strokeWidth="2.5" />
                      <path d="M245 85 L285 105 L260 110 Z" fill="#11" stroke="#374151" strokeWidth="1" />
                      
                      {/* Golden Swingarm */}
                      <path d="M320 140 L220 120 L210 140 Z" fill="none" stroke="#b45309" strokeWidth="5.5" strokeLinecap="round" />
                      
                      {/* Monoshock suspension absorber */}
                      <path d="M218 122 L245 92" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                      
                      {/* Main Powertrain Liquid-Cooled Battery Box */}
                      <rect x="155" y="102" width="75" height="42" rx="4" fill="#0c0e12" stroke="#374151" strokeWidth="2" />
                      {/* Neon coolant lines */}
                      <path d="M165 110 L220 110" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                      <path d="M165 120 L220 120" stroke="#0072ff" strokeWidth="2" strokeLinecap="round" />
                      <path d="M165 130 L220 130" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />

                      {/* Steering Head & Clip-on Handlebars */}
                      <path d="M110 140 L135 75" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
                      <path d="M125 80 L145 80" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
                      {/* Futuristic LED Headlight pod */}
                      <path d="M128 75 C122 75, 115 85, 110 95 L125 95 Z" fill="#222" stroke="#374151" strokeWidth="1.5" />
                      <path d="M110 90 L104 90" stroke="#00f5ff" strokeWidth="3" strokeLinecap="round" />
                      
                      {/* Laser Speed Streamers (futuristic detailing) */}
                      <line x1="50" y1="60" x2="10" y2="60" stroke="#00f5ff" strokeWidth="1" strokeDasharray="5,10" opacity="0.6" />
                      <line x1="30" y1="100" x2="1" y2="100" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="10,20" opacity="0.4" />
                    </svg>
                  </div>

                  {/* Bottom spec ticker */}
                  <div className="z-10 bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800/80">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">REBON S-ALPHA</h3>
                        <p className="text-xs text-[#00f5ff] font-semibold">Flagship Naked Sport</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Starting at</p>
                        <p className="text-lg font-mono font-bold text-white">€5,999</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick-switch Dots for Hero */}
                <div className="flex items-center space-x-2 mt-6 z-10">
                  {bikeModels.map((bike, index) => (
                    <button
                      key={bike.id}
                      onClick={() => {
                        setSelectedBikeId(bike.id);
                        setSelectedColorIndex(0);
                        setSelectedAccessories([]);
                        const el = document.getElementById("models");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        selectedBikeId === bike.id 
                          ? "bg-[#00f5ff] w-8 shadow-[0_0_10px_rgba(0,245,255,0.5)]" 
                          : "bg-gray-700 hover:bg-gray-500"
                      }`}
                      aria-label={`Select ${bike.name}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ----------------- 2. ABOUT US & MISSION (VLEKTRA STYLE) ----------------- */}
          <section id="about" className="py-24 bg-[#0c0f13] border-t border-b border-gray-900 relative">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-[#00f5ff] text-xs font-semibold uppercase tracking-widest block mb-3">MISSION & DISRUPTION</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  Solving the commuted expense dilemma.
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#00f5ff] to-[#0072ff] mx-auto mt-4"></div>
                <p className="text-gray-400 mt-6 font-light text-lg">
                  Rising fossil-fuel tariffs, high-frequency internal combustion maintenance, and ecological degradation are roadblocks to modern society. Rebon is rewriting the two-wheeled commute paradigm.
                </p>
              </div>

              {/* Interactive Calculator and Story Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
                
                {/* Story & Value Propositions */}
                <div className="lg:col-span-6 space-y-8">
                  <h3 className="font-display font-bold text-2xl text-white uppercase tracking-tight border-l-4 border-[#00f5ff] pl-4">
                    Designed to Perform. Engineered to Save.
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-[#00f5ff] shrink-0">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base">Zero Mechanical Overhead</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Our hub motor design completely eliminates traditional chains, belts, oil filters, spark plugs, and gearboxes. Maintain absolutely nothing but tire pressure.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-[#00f5ff] shrink-0">
                        <Battery className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base">German-engineered Smart Batteries</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Our dynamic phase-change cooling ensures pristine operations even at 45°C ambient temperatures. Backed by an industry-leading 5-year replacement warranty.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-[#00f5ff] shrink-0">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base">92% Average Fuel Savings</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          An electric charge costs only a microscopic fraction of equivalent fossil fuel. Charge to full capacity at any standard household outlet in less than an hour.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Calculator Block */}
                <div className="lg:col-span-6 bg-gradient-to-b from-gray-900 to-gray-950 p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-xl relative">
                  <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-mono">
                    Live Calculator
                  </div>

                  <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight mb-2">
                    REBON Savings Estimator
                  </h3>
                  <p className="text-xs text-gray-400 mb-8">
                    Calculate your direct annual financial and carbon offset savings by switching to Rebon electric motorcycles.
                  </p>

                  {/* Slider 1: Daily Commute */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300 font-medium">Daily Commute Distance</span>
                      <span className="text-[#00f5ff] font-mono font-bold text-base">{dailyCommute} km</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="150" 
                      value={dailyCommute}
                      onChange={(e) => setDailyCommute(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00f5ff]"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>5 km</span>
                      <span>75 km</span>
                      <span>150 km</span>
                    </div>
                  </div>

                  {/* Slider 2: Current Fuel Price */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300 font-medium">Current Petrol Price</span>
                      <span className="text-[#00f5ff] font-mono font-bold text-base">€{fuelPrice.toFixed(2)} / L</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.00" 
                      max="3.50" 
                      step="0.05"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00f5ff]"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>€1.00</span>
                      <span>€2.25</span>
                      <span>€3.50</span>
                    </div>
                  </div>

                  {/* Slider 3: Comparison Vehicle Efficiency */}
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300 font-medium">ICE Vehicle Fuel Efficiency</span>
                      <span className="text-[#00f5ff] font-mono font-bold text-base">{iceEfficiency} km / L</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="50" 
                      value={iceEfficiency}
                      onChange={(e) => setIceEfficiency(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00f5ff]"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>10 km/L (SUV)</span>
                      <span>30 km/L (Bike)</span>
                      <span>50 km/L (Eco)</span>
                    </div>
                  </div>

                  {/* Results Blocks */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800/80">
                    <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800/60 text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Monthly Saved Cash</p>
                      <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">€{calculatedSavings.monthlyFuel}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Based on 22 commutes</p>
                    </div>

                    <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800/60 text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Annual CO2 Saved</p>
                      <p className="text-2xl font-bold font-mono text-blue-400 mt-1">{calculatedSavings.annualCo2} kg</p>
                      <p className="text-[10px] text-gray-400 mt-1">Equivalent to 45 trees</p>
                    </div>
                  </div>

                  {/* ROI block */}
                  <div className="mt-4 bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/20 text-center flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-white">Full Cost Payback</h4>
                      <p className="text-xs text-gray-400">Time to fully offset the base price of current bike model with petrol savings</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-bold font-mono text-[#00f5ff]">{calculatedSavings.paybackMonths} Months</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* ----------------- ENGINEERING TIMELINE GRID ----------------- */}
              <div className="mt-20">
                <h3 className="font-display font-bold text-xl text-white uppercase text-center tracking-widest mb-12">
                  ENGINEERING ROADMAP & MILESTONES
                </h3>
                
                {/* Timeline Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                  {milestones.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMilestone(idx)}
                      className={`p-4 rounded-lg border text-center transition-all duration-300 cursor-pointer ${
                        activeMilestone === idx
                          ? "bg-gray-900 border-[#00f5ff] shadow-[0_0_15px_rgba(0,245,255,0.15)] text-white"
                          : "bg-gray-950/50 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <span className="block text-2xl font-bold font-mono text-[#00f5ff]">{m.year}</span>
                      <span className="text-xs uppercase tracking-wider font-semibold block truncate mt-1">{m.title}</span>
                    </button>
                  ))}
                </div>

                {/* Milestone Description Box */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 bg-[#00f5ff]/10 text-[#00f5ff] text-[10px] font-bold rounded border border-[#00f5ff]/20 uppercase">
                        {milestones[activeMilestone].status}
                      </span>
                      <h4 className="text-lg font-bold text-white uppercase">{milestones[activeMilestone].title}</h4>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {milestones[activeMilestone].desc}
                    </p>
                    <div className="pt-2 border-t border-gray-800 flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Key Engineering Tech:</span>
                      <span className="text-xs font-mono text-gray-300">{milestones[activeMilestone].tech}</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex justify-center md:justify-end">
                    <div className="w-24 h-24 rounded-full bg-gray-950/80 border-2 border-gray-800 flex flex-col items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[#00f5ff]/5 group-hover:bg-[#00f5ff]/10 transition-colors"></div>
                      <Award className="w-8 h-8 text-[#00f5ff] mb-1" />
                      <span className="text-[10px] font-bold font-mono tracking-wider text-gray-400 uppercase">REBON</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* ----------------- 3. PRODUCT SHOWCASE & CUSTOMIZER ----------------- */}
          <section id="models" className="py-24 bg-[#090b0e] relative">
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0072ff]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#00f5ff] text-xs font-semibold uppercase tracking-widest block mb-3">HIGH-FIDELITY PRODUCT LINEUP</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  Select Your Riding Machine
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#00f5ff] to-[#0072ff] mx-auto mt-4"></div>
                <p className="text-gray-400 mt-6 font-light">
                  Choose your vehicle format. Every Rebon machine is forged with industrial aerospace carbon-alloy and contains direct cloud telemetry syncing with your smartphone app.
                </p>
              </div>

              {/* Model Selection Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {bikeModels.map((bike) => (
                  <button
                    key={bike.id}
                    onClick={() => {
                      setSelectedBikeId(bike.id);
                      setSelectedColorIndex(0);
                      setSelectedAccessories([]);
                    }}
                    className={`px-6 py-3.5 rounded-lg border font-display text-sm uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
                      selectedBikeId === bike.id
                        ? "bg-[#00f5ff] border-[#00f5ff] text-black shadow-[0_0_20px_rgba(0,245,255,0.25)]"
                        : "bg-gray-950/80 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                    }`}
                  >
                    {bike.name}
                  </button>
                ))}
              </div>

              {/* Two-Column Interactive Customize Experience */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-gray-950/40 border border-gray-900 rounded-3xl p-6 sm:p-10 relative">
                
                {/* Column 1: Interactive SVG and Specifications */}
                <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
                  
                  {/* Custom SVG Drawing mapped to selected color and accessories */}
                  <div className="relative w-full aspect-video max-h-[360px] bg-[#0c0e12]/90 border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-inner overflow-hidden group">
                    
                    {/* Visual Accent Glow according to color highlight */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-500"
                      style={{ backgroundColor: `${activeBikeData.colors[selectedColorIndex].hex}22` }}
                    ></div>

                    {/* Badge info */}
                    <div className="flex justify-between items-center z-10">
                      <span className="text-xs font-mono font-semibold tracking-wider text-gray-400">ENGINEERING DESIGN CONSOLE</span>
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">3D ACTIVE LAYER</span>
                      </div>
                    </div>

                    {/* The Custom Dynamic SVG Representation */}
                    <div className="relative w-full h-[200px] flex items-center justify-center">
                      <svg className="w-full h-full max-h-[180px] transition-all duration-500" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Shadow */}
                        <ellipse cx="200" cy="180" rx="140" ry="8" fill="rgba(0,0,0,0.5)" />
                        
                        {/* Rear Hub Motor Wheel */}
                        <circle cx="320" cy="140" r="38" stroke="#111827" strokeWidth="12" />
                        <circle cx="320" cy="140" r="28" fill="#1f2937" stroke="#374151" strokeWidth="3" />
                        <circle cx="320" cy="140" r="22" fill="#00" />
                        {/* Neon Spin Effect mapped to dynamic colors */}
                        <circle 
                          cx="320" 
                          cy="140" 
                          r="38" 
                          stroke={activeBikeData.colors[selectedColorIndex].highlightHex} 
                          strokeWidth="1.5" 
                          strokeDasharray="8, 12" 
                          className="animate-spin" 
                          style={{ animationDuration: '4s' }} 
                        />

                        {/* Front Wheel */}
                        <circle cx="80" cy="140" r="38" stroke="#1f2937" strokeWidth="8" />
                        <circle cx="80" cy="140" r="30" stroke="#374151" strokeWidth="2" />
                        <circle 
                          cx="80" 
                          cy="140" 
                          r="38" 
                          stroke={activeBikeData.colors[selectedColorIndex].highlightHex} 
                          strokeWidth="1.5" 
                          strokeDasharray="12, 10" 
                          className="animate-spin" 
                          style={{ animationDuration: '6s' }} 
                        />

                        {/* Main Frame structure */}
                        <path d="M110 140 L180 140 L210 90 L140 90 Z" fill="#111317" stroke="#2a2f3a" strokeWidth="3" />
                        <path d="M180 140 L280 140 L310 95 L220 95 Z" fill="#181c24" stroke="#2a2f3a" strokeWidth="3" />

                        {/* Golden or Copper swingarm */}
                        <path d="M320 140 L220 120 L210 140 Z" fill="none" stroke={activeBikeData.id === "x-over" ? "#b45309" : "#4b5563"} strokeWidth="5.5" strokeLinecap="round" />

                        {/* Dynamic Tank Cover with selected color HEX */}
                        <path 
                          d="M130 90 C150 50, 210 50, 240 85 C240 85, 275 80, 290 100 L270 115 L220 90 Z" 
                          fill={activeBikeData.colors[selectedColorIndex].hex} 
                          stroke={activeBikeData.colors[selectedColorIndex].highlightHex} 
                          strokeWidth="2.5" 
                          className="transition-all duration-300"
                        />
                        
                        {/* Seat assembly */}
                        <path d="M245 85 L285 105 L260 110 Z" fill="#111" stroke="#374151" strokeWidth="1" />

                        {/* Shock absorber spring */}
                        <path d="M218 122 L245 92" stroke={activeBikeData.colors[selectedColorIndex].highlightHex} strokeWidth="3.5" strokeLinecap="round" />

                        {/* Battery Power pack unit */}
                        <rect x="155" y="102" width="75" height="42" rx="4" fill="#090b0e" stroke="#374151" strokeWidth="2" />
                        {/* Flowing power lines inside battery pack */}
                        <line x1="165" y1="114" x2="220" y2="114" stroke={activeBikeData.colors[selectedColorIndex].highlightHex} strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                        <line x1="165" y1="124" x2="220" y2="124" stroke="#0072ff" strokeWidth="2" strokeLinecap="round" />
                        <line x1="165" y1="134" x2="220" y2="134" stroke={activeBikeData.colors[selectedColorIndex].highlightHex} strokeWidth="2" strokeLinecap="round" className="animate-pulse" />

                        {/* Steering Columns */}
                        <path d="M110 140 L135 75" stroke="#374151" strokeWidth="6" strokeLinecap="round" />
                        <path d="M125 80 L145 80" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />

                        {/* LED Headlamp pod */}
                        <path d="M128 75 C122 75, 115 85, 110 95 L125 95 Z" fill="#222" stroke="#374151" strokeWidth="1.5" />
                        <path d="M110 90 L103 90" stroke={activeBikeData.colors[selectedColorIndex].highlightHex} strokeWidth="3" strokeLinecap="round" />

                        {/* OPTIONAL ACCESSORIES OVERLAY LAYERS */}
                        {selectedAccessories.includes("cargo-rack") && (
                          /* Cargo Rack SVG */
                          <g id="rack-overlay">
                            <path d="M280 102 L340 102 L330 115 L290 115 Z" fill="#111" stroke="#4b5563" strokeWidth="2" />
                            <path d="M315 102 L315 130" stroke="#4b5563" strokeWidth="2.5" />
                            <path d="M330 102 L320 135" stroke="#4b5563" strokeWidth="2" />
                            {/* Red cargo box */}
                            <rect x="290" y="85" width="45" height="17" rx="2" fill="#1e293b" stroke="#00f5ff" strokeWidth="1" />
                          </g>
                        )}

                        {selectedAccessories.includes("carbon-screen") && (
                          /* Carbon Screen Overlay */
                          <g id="screen-overlay">
                            <path d="M128 75 L118 45 L135 60 Z" fill="#1e293b" stroke="#00f5ff" strokeWidth="1.5" />
                            <line x1="124" y1="65" x2="119" y2="52" stroke="#4b5563" strokeWidth="1" />
                          </g>
                        )}

                        {selectedAccessories.includes("comfort-seat") && (
                          /* Comfort Seat Overlay (Thicker seat padding) */
                          <path d="M242 82 C255 77, 275 77, 292 98 L285 106 L242 85 Z" fill="#272a30" stroke="#eab308" strokeWidth="1.5" />
                        )}

                        {selectedAccessories.includes("fast-charger") && (
                          /* Charging Port Indicator */
                          <g id="charger-indicator">
                            <circle cx="140" cy="95" r="5" fill="#10b981" />
                            <path d="M138 95 L142 95 L140 98 Z" fill="white" />
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* Controls overlay description */}
                    <div className="flex justify-between items-center text-xs text-gray-500 z-10 border-t border-gray-900 pt-4">
                      <span>Current: <strong className="text-white">{activeBikeData.colors[selectedColorIndex].name}</strong></span>
                      <span>Interactive Live View</span>
                    </div>
                  </div>

                  {/* Physical Specifications Metric Bars */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-900 text-center">
                      <div className="flex items-center justify-center space-x-1.5 text-gray-500 mb-1">
                        <Gauge className="w-4 h-4 text-[#00f5ff]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Top Velocity</span>
                      </div>
                      <p className="text-xl font-bold font-mono text-white">{activeBikeData.topSpeed} km/h</p>
                    </div>

                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-900 text-center">
                      <div className="flex items-center justify-center space-x-1.5 text-gray-500 mb-1">
                        <Battery className="w-4 h-4 text-[#00f5ff]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Max Range</span>
                      </div>
                      <p className="text-xl font-bold font-mono text-white">{activeBikeData.range} km</p>
                    </div>

                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-900 text-center">
                      <div className="flex items-center justify-center space-x-1.5 text-gray-500 mb-1">
                        <Clock className="w-4 h-4 text-[#00f5ff]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Fast Charge</span>
                      </div>
                      <p className="text-xl font-bold font-mono text-white">{activeBikeData.chargeTime} mins</p>
                    </div>

                    <div className="bg-gray-950 p-4 rounded-xl border border-gray-900 text-center">
                      <div className="flex items-center justify-center space-x-1.5 text-gray-500 mb-1">
                        <Zap className="w-4 h-4 text-[#00f5ff]" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">0-60 acceleration</span>
                      </div>
                      <p className="text-xl font-bold font-mono text-white">{activeBikeData.acceleration}</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Selection / Configuration Controls */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/20">
                      {activeBikeData.type}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-white uppercase mt-2">{activeBikeData.name}</h3>
                    <p className="text-gray-400 text-sm italic mt-1">{activeBikeData.tagline}</p>
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">{activeBikeData.description}</p>
                  </div>

                  {/* Step A: Color Selector */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 font-mono block">1. SELECT CHASSIS COLOR</span>
                    <div className="flex space-x-3">
                      {activeBikeData.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColorIndex(index)}
                          className={`w-10 h-10 rounded-full cursor-pointer relative flex items-center justify-center transition-all duration-300 ${color.bgClass} border-2 ${
                            selectedColorIndex === index 
                              ? "border-[#00f5ff] scale-110 shadow-[0_0_12px_rgba(0,245,255,0.4)]" 
                              : "border-gray-800 hover:border-gray-500"
                          }`}
                          title={color.name}
                        >
                          {selectedColorIndex === index && (
                            <div className="w-3 h-3 rounded-full bg-[#00f5ff] animate-ping absolute"></div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 italic">Color selected: {activeBikeData.colors[selectedColorIndex].name}</p>
                  </div>

                  {/* Step B: Premium Upgrades & Accessories */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 font-mono block">2. UPGRADE ACCESSORIES</span>
                    <div className="space-y-2.5">
                      {accessoryOptions.map((option) => {
                        const isSelected = selectedAccessories.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => toggleAccessory(option.id)}
                            className={`w-full p-3 rounded-lg border text-left flex items-center justify-between text-xs transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-[#00f5ff]/5 border-[#00f5ff] text-white"
                                : "bg-gray-950/60 border-gray-900 text-gray-400 hover:border-gray-800 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isSelected ? "bg-[#00f5ff] border-[#00f5ff] text-black" : "border-gray-700"
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span>{option.name}</span>
                            </div>
                            <span className="font-mono font-bold text-[#00f5ff]">+{option.price} €</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step C: Dynamic Invoice Total & CTAs */}
                  <div className="pt-6 border-t border-gray-900 space-y-4">
                    <div className="flex justify-between items-center bg-gray-950 p-4 rounded-xl border border-gray-900">
                      <div>
                        <p className="text-xs text-gray-400">Configured Est. Price</p>
                        <p className="text-3xl font-mono font-bold text-white">€{currentTotalPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase">VAT Included</p>
                        <p className="text-xs text-emerald-400 font-semibold font-mono">B2B discount avail.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        id="btn-product-booking"
                        onClick={() => openTestRideModal(activeBikeData.id)}
                        className="w-full py-3.5 bg-[#00f5ff] text-black font-bold tracking-wider uppercase rounded-md text-xs hover:bg-cyan-300 hover:shadow-md transition-all text-center cursor-pointer"
                      >
                        Book Test Ride
                      </button>
                      <button 
                        id="btn-product-apply-b2b"
                        onClick={() => {
                          const el = document.getElementById("dealers");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full py-3.5 border border-gray-700 text-gray-300 font-semibold tracking-wider uppercase rounded-md text-xs hover:bg-gray-900 hover:border-white transition-all text-center cursor-pointer"
                      >
                        B2B Application
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* ----------------- 4. DEALERSHIP & DISTRIBUTION HUB (B2B) ----------------- */}
          <section id="dealers" className="py-24 bg-[#0c0f13] border-t border-b border-gray-900 relative">
            <div className="absolute top-0 right-10 w-96 h-96 bg-[#00f5ff]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#00f5ff] text-xs font-semibold uppercase tracking-widest block mb-3">GLOBAL B2B EXPANSION</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  Join the EV Revolution. Partner with Us.
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#00f5ff] to-[#0072ff] mx-auto mt-4"></div>
                <p className="text-gray-400 mt-6 font-light">
                  Become a certified Rebon showroom partner. We offer direct technical integrations, full-stack spare part shipping contracts, marketing support, and our cloud-integrated retail CRM system.
                </p>
              </div>

              {/* Split Screen Map and Inquiry Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                
                {/* Left Side: Interactive SVG Region Map */}
                <div className="lg:col-span-6 bg-gradient-to-b from-gray-900 to-gray-950 p-6 sm:p-8 rounded-2xl border border-gray-800 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight mb-2">
                      Showroom Territories
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                      Select a regional sector on our virtual map grid to inspect current dealership concentration and market demand indices.
                    </p>
                  </div>

                  {/* Interactive Vector Grid representing a stylized regional map */}
                  <div className="relative w-full aspect-square max-w-[400px] mx-auto bg-black/40 border border-gray-800 rounded-xl p-4 flex items-center justify-center">
                    
                    {/* Simplified Styled Hub Selection Graphic Map */}
                    <svg className="w-full h-full max-h-[280px]" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Grid background dots */}
                      <defs>
                        <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="#2d3748" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-dots)" />

                      {/* Dynamic Territory Paths clickable to select region */}
                      {/* Central Region (Frankfurt Assembly) */}
                      <polygon 
                        points="100,100 200,100 200,200 100,200" 
                        fill={selectedRegion === "central" ? "rgba(0, 245, 255, 0.15)" : "rgba(31, 41, 55, 0.3)"} 
                        stroke={selectedRegion === "central" ? "#00f5ff" : "#4b5563"} 
                        strokeWidth="2.5"
                        className="cursor-pointer hover:fill-[#00f5ff]/10 transition-colors"
                        onClick={() => { setSelectedRegion("central"); setB2bFormData(p => ({ ...p, region: "central" })); }}
                      />
                      <text x="130" y="155" fill="white" className="text-[10px] font-mono select-none pointer-events-none font-bold">CENTRAL</text>

                      {/* North Region */}
                      <polygon 
                        points="80,20 220,20 200,100 100,100" 
                        fill={selectedRegion === "north" ? "rgba(0, 245, 255, 0.15)" : "rgba(31, 41, 55, 0.3)"} 
                        stroke={selectedRegion === "north" ? "#00f5ff" : "#4b5563"} 
                        strokeWidth="2.5"
                        className="cursor-pointer hover:fill-[#00f5ff]/10 transition-colors"
                        onClick={() => { setSelectedRegion("north"); setB2bFormData(p => ({ ...p, region: "north" })); }}
                      />
                      <text x="135" y="60" fill="white" className="text-[10px] font-mono select-none pointer-events-none font-bold">NORTH</text>

                      {/* West Region */}
                      <polygon 
                        points="20,80 100,100 100,200 20,220" 
                        fill={selectedRegion === "west" ? "rgba(0, 245, 255, 0.15)" : "rgba(31, 41, 55, 0.3)"} 
                        stroke={selectedRegion === "west" ? "#00f5ff" : "#4b5563"} 
                        strokeWidth="2.5"
                        className="cursor-pointer hover:fill-[#00f5ff]/10 transition-colors"
                        onClick={() => { setSelectedRegion("west"); setB2bFormData(p => ({ ...p, region: "west" })); }}
                      />
                      <text x="45" y="155" fill="white" className="text-[10px] font-mono select-none pointer-events-none font-bold">WEST</text>

                      {/* East Region */}
                      <polygon 
                        points="200,100 280,80 280,220 200,200" 
                        fill={selectedRegion === "east" ? "rgba(0, 245, 255, 0.15)" : "rgba(31, 41, 55, 0.3)"} 
                        stroke={selectedRegion === "east" ? "#00f5ff" : "#4b5563"} 
                        strokeWidth="2.5"
                        className="cursor-pointer hover:fill-[#00f5ff]/10 transition-colors"
                        onClick={() => { setSelectedRegion("east"); setB2bFormData(p => ({ ...p, region: "east" })); }}
                      />
                      <text x="230" y="155" fill="white" className="text-[10px] font-mono select-none pointer-events-none font-bold">EAST</text>

                      {/* South Region */}
                      <polygon 
                        points="100,200 200,200 220,280 80,280" 
                        fill={selectedRegion === "south" ? "rgba(0, 245, 255, 0.15)" : "rgba(31, 41, 55, 0.3)"} 
                        stroke={selectedRegion === "south" ? "#00f5ff" : "#4b5563"} 
                        strokeWidth="2.5"
                        className="cursor-pointer hover:fill-[#00f5ff]/10 transition-colors"
                        onClick={() => { setSelectedRegion("south"); setB2bFormData(p => ({ ...p, region: "south" })); }}
                      />
                      <text x="135" y="245" fill="white" className="text-[10px] font-mono select-none pointer-events-none font-bold">SOUTH</text>

                      {/* Stylized Active Pins */}
                      <circle cx="150" cy="130" r="4" fill="#00f5ff" className="animate-ping" />
                      <circle cx="150" cy="130" r="2" fill="#00f5ff" />
                      
                      <circle cx="140" cy="70" r="3" fill="#00f5ff" />
                      <circle cx="230" cy="130" r="3" fill="#00f5ff" />
                      <circle cx="70" cy="130" r="3" fill="#00f5ff" />
                      <circle cx="150" cy="225" r="3" fill="#00f5ff" />
                    </svg>

                  </div>

                  {/* Mapped Region Technical Details */}
                  <div className="mt-6 bg-black/60 p-4 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-900 mb-2">
                      <span className="text-sm font-bold text-white uppercase">{regionsData[selectedRegion].name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-900/40 text-[#00f5ff] border border-cyan-500/20">
                        {regionsData[selectedRegion].status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      {regionsData[selectedRegion].details}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500 block uppercase text-[10px]">Showrooms Active:</span>
                        <strong className="text-white text-sm">{regionsData[selectedRegion].dealers} Centers</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase text-[10px]">Current Market Demand:</span>
                        <strong className="text-[#00f5ff] text-sm">{regionsData[selectedRegion].demand}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: inquiry submission Form */}
                <div className="lg:col-span-6 bg-gradient-to-b from-gray-900 to-gray-950 p-6 sm:p-8 rounded-2xl border border-gray-800 flex flex-col justify-between shadow-xl">
                  
                  {!b2bSubmitted ? (
                    <form onSubmit={handleB2bSubmit} className="space-y-4">
                      <div className="border-b border-gray-800 pb-4 mb-4">
                        <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
                          Partner Inquiry Portal
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Certified dealerships receive direct factory-pricing, localized Google Maps dealership promotion, and certified technical training program inclusion.
                        </p>
                      </div>

                      {/* Company Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Company / Dealership Name</label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Frankfurt Moto Union GmbH" 
                            value={b2bFormData.companyName}
                            onChange={(e) => setB2bFormData(p => ({ ...p, companyName: e.target.value }))}
                            className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all"
                          />
                        </div>
                      </div>

                      {/* Contact Person */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Representative Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Klaus Weber" 
                              value={b2bFormData.contactName}
                              onChange={(e) => setB2bFormData(p => ({ ...p, contactName: e.target.value }))}
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Business Email</label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                            <input 
                              type="email" 
                              required
                              placeholder="partner@motounion.de" 
                              value={b2bFormData.email}
                              onChange={(e) => setB2bFormData(p => ({ ...p, email: e.target.value }))}
                              className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Showroom size & region selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Target Territory</label>
                          <select
                            value={b2bFormData.region}
                            onChange={(e) => {
                              setB2bFormData(p => ({ ...p, region: e.target.value }));
                              setSelectedRegion(e.target.value);
                            }}
                            className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 px-3.5 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all appearance-none"
                          >
                            <option value="central" className="bg-[#090b0e]">Central Division</option>
                            <option value="north" className="bg-[#090b0e]">North Division</option>
                            <option value="west" className="bg-[#090b0e]">West Division</option>
                            <option value="east" className="bg-[#090b0e]">East Division</option>
                            <option value="south" className="bg-[#090b0e]">South Division</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Est. Showroom Floor Space</label>
                          <select
                            value={b2bFormData.showroomSize}
                            onChange={(e) => setB2bFormData(p => ({ ...p, showroomSize: e.target.value }))}
                            className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 px-3.5 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all"
                          >
                            <option value="small" className="bg-[#090b0e]">Under 100 sqm</option>
                            <option value="medium" className="bg-[#090b0e]">100 - 300 sqm (Standard)</option>
                            <option value="large" className="bg-[#090b0e]">300+ sqm (Flagship Center)</option>
                          </select>
                        </div>
                      </div>

                      {/* Estimated Initial Stock Order */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Expected First Batch Volume</label>
                        <select
                          value={b2bFormData.estimatedOrder}
                          onChange={(e) => setB2bFormData(p => ({ ...p, estimatedOrder: e.target.value }))}
                          className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 px-3.5 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all"
                        >
                          <option value="5" className="bg-[#090b0e]">5 - 10 vehicles (Pilot dealership)</option>
                          <option value="15" className="bg-[#090b0e]">10 - 25 vehicles (Standard allocation)</option>
                          <option value="50" className="bg-[#090b0e]">25+ vehicles (Regional distributor level)</option>
                        </select>
                      </div>

                      {/* Message box */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Partnership Proposal Pitch</label>
                        <textarea 
                          rows={3}
                          placeholder="Detail current brands you carry and local infrastructure capability..."
                          value={b2bFormData.message}
                          onChange={(e) => setB2bFormData(p => ({ ...p, message: e.target.value }))}
                          className="w-full bg-black/40 border border-gray-800 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all resize-none"
                        />
                      </div>

                      {/* Phone contact */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Representative Phone Number</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                          <input 
                            type="text" 
                            required
                            placeholder="+49 152 459 294" 
                            value={b2bFormData.phone}
                            onChange={(e) => setB2bFormData(p => ({ ...p, phone: e.target.value }))}
                            className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00f5ff] transition-all"
                          />
                        </div>
                      </div>

                      {/* Submit button */}
                      <button
                        id="btn-b2b-submit"
                        type="submit"
                        disabled={b2bSubmitting}
                        className="w-full py-4 bg-[#00f5ff] text-black font-bold tracking-widest uppercase rounded-lg text-xs hover:bg-cyan-300 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        {b2bSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            <span>PROCESSING PROPOSAL...</span>
                          </>
                        ) : (
                          <>
                            <span>APPLY FOR FRANCHISE DEALERSHIP</span>
                            <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Success screen */
                    <div className="text-center py-12 space-y-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                        <Check className="w-8 h-8 stroke-[2.5]" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-display font-bold text-white uppercase">Application Registered Successfully</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                          Thank you for choosing Rebon Motor Company, <strong className="text-white">{b2bFormData.companyName}</strong>. Our corporate distributor liaison representative will review your proposal details within 24 business hours.
                        </p>
                      </div>

                      <div className="bg-gray-950 p-4 rounded-xl border border-gray-900 max-w-sm mx-auto">
                        <span className="text-[10px] text-gray-500 uppercase font-mono tracking-widest block">Reference Code</span>
                        <strong className="text-lg font-mono text-[#00f5ff] block mt-1">{b2bReference}</strong>
                        <div className="mt-3 text-left text-[11px] text-gray-500 border-t border-gray-900 pt-3 space-y-1">
                          <p><strong>Territory:</strong> {b2bFormData.region.toUpperCase()} division</p>
                          <p><strong>Proposed initial batch:</strong> {b2bFormData.estimatedOrder} units</p>
                          <p><strong>Contact representative:</strong> {b2bFormData.contactName}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setB2bSubmitted(false);
                          setB2bFormData({
                            companyName: "",
                            contactName: "",
                            email: "",
                            phone: "",
                            region: "central",
                            showroomSize: "medium",
                            estimatedOrder: "15",
                            message: ""
                          });
                        }}
                        className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase border border-gray-700 text-gray-300 rounded-md hover:bg-gray-900 transition-colors"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </section>

          {/* ----------------- 5. SOCIAL PROOF & TRUST (REVIEWS SLIDER) ----------------- */}
          <section id="reviews" className="py-24 bg-[#090b0e] relative overflow-hidden">
            {/* Background visual graphics representing digital telemetry lines */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#00f5ff] text-xs font-semibold uppercase tracking-widest block mb-3">TRUST & DEPLOYMENTS</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight">
                  Acknowledge Real Riding Experience
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#00f5ff] to-[#0072ff] mx-auto mt-4"></div>
              </div>

              {/* Dual Review Category Switcher */}
              <div className="flex justify-center mb-12">
                <div className="bg-gray-950 p-1 rounded-xl border border-gray-800 flex">
                  <button
                    onClick={() => { setReviewCategory("riders"); setActiveReviewIndex(0); }}
                    className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                      reviewCategory === "riders"
                        ? "bg-[#00f5ff] text-black font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Category A: Riders
                  </button>
                  <button
                    onClick={() => { setReviewCategory("dealers"); setActiveReviewIndex(0); }}
                    className={`px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                      reviewCategory === "dealers"
                        ? "bg-[#00f5ff] text-black font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Category B: Dealers
                  </button>
                </div>
              </div>

              {/* Testimonial Active Display Card */}
              <div className="max-w-4xl mx-auto relative">
                <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 sm:p-12 shadow-2xl relative">
                  {/* Quote Mark Accent */}
                  <span className="absolute top-6 left-8 text-7xl font-serif text-[#00f5ff]/10 select-none">“</span>

                  <div className="space-y-6 relative z-10">
                    {/* Stars */}
                    <div className="flex space-x-1">
                      {Array.from({ length: testimonials[activeReviewIndex].rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg sm:text-xl text-white font-light italic leading-relaxed">
                      {testimonials[activeReviewIndex].quote}
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center space-x-4 pt-6 border-t border-gray-800">
                      <img 
                        src={testimonials[activeReviewIndex].avatar} 
                        alt={testimonials[activeReviewIndex].author}
                        className="w-12 h-12 rounded-full border border-[#00f5ff] object-cover" 
                      />
                      <div>
                        <h4 className="text-white font-bold">{testimonials[activeReviewIndex].author}</h4>
                        <p className="text-xs text-gray-400">{testimonials[activeReviewIndex].role} &bull; <strong className="text-[#00f5ff]">{testimonials[activeReviewIndex].location}</strong></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slider Switch Toggles */}
                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveReviewIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        activeReviewIndex === i ? "bg-[#00f5ff] w-6" : "bg-gray-700 hover:bg-gray-500"
                      }`}
                      aria-label={`Show testimonial ${i+1}`}
                    />
                  ))}
                </div>
              </div>

              {/* ----------------- "FEATURED IN" PRESS BAR ----------------- */}
              <div className="mt-24 border-t border-gray-900 pt-16">
                <p className="text-center text-[10px] font-mono tracking-widest text-gray-500 uppercase mb-8">GLOBAL PRESS & ACCLAIM</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto items-center">
                  {featuredInLogos.map((logo, idx) => (
                    <div key={idx} className="bg-gray-950/40 p-4 rounded-xl border border-gray-900 text-center relative group overflow-hidden cursor-help">
                      <span className="font-display font-extrabold text-lg sm:text-xl text-gray-500 group-hover:text-white transition-colors duration-300 tracking-wider">
                        {logo.text}
                      </span>
                      
                      {/* Tooltip quote */}
                      <div className="absolute inset-0 bg-[#090b0e] p-2 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-all duration-300 border border-cyan-500/30 rounded-xl">
                        <p className="text-[10px] italic text-gray-300 leading-tight">
                          {logo.quote}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        </>
      )}

      {/* ----------------- 6. COMPREHENSIVE FOOTER ----------------- */}
      <footer className="bg-[#06080b] border-t border-gray-900 pt-16 pb-8 text-sm text-gray-400 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-gray-900">
          
          {/* Col 1: Brand pitch and contacts */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f5ff] to-[#0072ff] flex items-center justify-center">
                <Zap className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-widest uppercase">REBON EV</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Rebon Motor Company represents high-performance electric motor engineering, carbon-neutral production pipelines, and automated cloud dealerships. Bahawalpur Headquarters.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-gray-500">
                <MapPin className="w-4 h-4 text-[#00f5ff]" />
                <span>Army Market, Near Punjab Bank, Airport Road, Bahawalpur, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Phone className="w-4 h-4 text-[#00f5ff]" />
                <span>0323-6659451</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Mail className="w-4 h-4 text-[#00f5ff]" />
                <span>support@rebonmotorcompany.com.pk</span>
              </div>
            </div>
          </div>

          {/* Col 2: Models Links */}
          <div className="md:col-span-2 space-y-4 text-xs">
            <h4 className="text-white uppercase font-bold tracking-widest font-display text-xs border-b border-gray-900 pb-2">Models</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => { setSelectedBikeId("r-commuter"); const el = document.getElementById("models"); el?.scrollIntoView({ behavior: "smooth" }); }}
                  className="hover:text-[#00f5ff] transition-colors cursor-pointer"
                >
                  REBON R-1 COMMUTER
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedBikeId("s-alpha"); const el = document.getElementById("models"); el?.scrollIntoView({ behavior: "smooth" }); }}
                  className="hover:text-[#00f5ff] transition-colors cursor-pointer"
                >
                  REBON S-ALPHA SPORTS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedBikeId("x-over"); const el = document.getElementById("models"); el?.scrollIntoView({ behavior: "smooth" }); }}
                  className="hover:text-[#00f5ff] transition-colors cursor-pointer"
                >
                  REBON X-OVER EXPLORER
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: B2B Dealer Network Links */}
          <div className="md:col-span-2 space-y-4 text-xs">
            <h4 className="text-white uppercase font-bold tracking-widest font-display text-xs border-b border-gray-900 pb-2">Partnership</h4>
            <ul className="space-y-2">
              <li>
                <a href="#dealers" className="hover:text-[#00f5ff] transition-colors">
                  Dealer Portal ERP Login
                </a>
              </li>
              <li>
                <a href="#dealers" className="hover:text-[#00f5ff] transition-colors">
                  Franchise Application Form
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#00f5ff] transition-colors">
                  Corporate Carbon Audits
                </a>
              </li>
              <li>
                <a href="#dealers" className="hover:text-[#00f5ff] transition-colors">
                  Territory Distribution Map
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Box */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white uppercase font-bold tracking-widest font-display text-xs border-b border-gray-900 pb-2">Newsletter</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Register to receive priority model launch bulletins, technician training updates, and franchise openings.
            </p>

            {!newsletterSubscribed ? (
              <form 
                onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setNewsletterSubscribed(true); }}
                className="flex items-stretch bg-gray-950 border border-gray-800 rounded-lg overflow-hidden p-1"
              >
                <input 
                  type="email" 
                  required
                  placeholder="enter business email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-transparent border-0 py-2 px-3 text-xs text-white focus:outline-none focus:ring-0 grow"
                />
                <button 
                  id="btn-newsletter-subscribe"
                  type="submit"
                  className="px-4 py-2 bg-[#00f5ff] text-black text-xs font-bold uppercase rounded hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
            ) : (
              <div className="bg-emerald-500/10 text-emerald-400 text-xs p-3 rounded-lg border border-emerald-500/20 flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Email successfully added to corporate bulletin.</span>
              </div>
            )}
          </div>

        </div>

        {/* Legal copy */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 space-y-4 sm:space-y-0">
          <div>
            <p>&copy; 2026 Rebon Motor Company. All rights reserved. Bahawalpur, Pakistan.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-end">
            <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigateTo("/privacy-policy"); }} className={`hover:text-[#00f5ff] transition-colors ${currentPath === "/privacy-policy" ? "text-[#00f5ff]" : ""}`}>Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo("/terms"); }} className={`hover:text-[#00f5ff] transition-colors ${currentPath === "/terms" ? "text-[#00f5ff]" : ""}`}>Terms & Conditions</a>
            <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); navigateTo("/cookie-policy"); }} className={`hover:text-[#00f5ff] transition-colors ${currentPath === "/cookie-policy" ? "text-[#00f5ff]" : ""}`}>Cookie Policy</a>
            <a href="/data-deletion" onClick={(e) => { e.preventDefault(); navigateTo("/data-deletion"); }} className={`hover:text-[#00f5ff] transition-colors ${currentPath === "/data-deletion" ? "text-[#00f5ff]" : ""}`}>Data Deletion</a>
          </div>
        </div>
      </footer>


      {/* ----------------- INTERACTIVE BOOKING MODAL (TEST RIDE) ----------------- */}
      {isTestRideModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            
            {/* Close */}
            <button 
              onClick={() => setIsTestRideModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!testRideSubmitted ? (
              <form onSubmit={handleTestRideSubmit} className="space-y-4">
                <div className="border-b border-gray-800 pb-4">
                  <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">
                    Book a Certified Test Ride
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Book your 45-minute premium performance test run. Requirements: Valid A2/A motorcycle license. Helmets provided.
                  </p>
                </div>

                {/* Bike selection */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Target Machine</label>
                  <select
                    value={testRideBike}
                    onChange={(e) => setTestRideBike(e.target.value)}
                    className="w-full bg-black/40 border border-gray-800 rounded-lg py-3 px-3 text-sm text-white focus:outline-none focus:border-[#00f5ff]"
                  >
                    {bikeModels.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#090b0e]">{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Date Selection</label>
                    <input 
                      type="date" 
                      required
                      value={testRideDate}
                      onChange={(e) => setTestRideDate(e.target.value)}
                      className="w-full bg-black/40 border border-gray-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#00f5ff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Preferred Slot</label>
                    <select
                      value={testRideTime}
                      onChange={(e) => setTestRideTime(e.target.value)}
                      className="w-full bg-black/40 border border-gray-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none"
                    >
                      <option value="morning">Morning (09:00 - 12:00)</option>
                      <option value="afternoon">Afternoon (13:00 - 16:00)</option>
                      <option value="evening">Twilight Run (17:00 - 19:00)</option>
                    </select>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Christian Mayer" 
                    className="w-full bg-black/40 border border-gray-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#00f5ff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="christian@gmail.com" 
                      className="w-full bg-black/40 border border-gray-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#00f5ff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Contact Phone</label>
                    <input 
                      type="text" 
                      required
                      placeholder="+49 157 889 334" 
                      className="w-full bg-black/40 border border-gray-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#00f5ff]"
                    />
                  </div>
                </div>

                {/* Driver License consent */}
                <div className="flex items-start space-x-2.5 pt-2">
                  <input 
                    type="checkbox" 
                    required 
                    id="license-check" 
                    className="mt-0.5 accent-[#00f5ff]"
                  />
                  <label htmlFor="license-check" className="text-[11px] text-gray-400 leading-tight">
                    I confirm that I possess a valid EU class A/A2 motorcycle driver's license and agree to wear full protective gear during the session.
                  </label>
                </div>

                {/* Submit */}
                <button
                  id="btn-test-ride-submit"
                  type="submit"
                  className="w-full py-3.5 bg-[#00f5ff] text-black font-bold tracking-widest uppercase rounded-lg text-xs hover:bg-cyan-300 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>CONFIRM TEST RIDE SLOT</span>
                </button>
              </form>
            ) : (
              /* Booking Success */
              <div className="text-center py-6 space-y-6">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-display font-bold text-white uppercase">Test Ride Scheduled!</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Your request for the <strong className="text-white">{(bikeModels.find(b => b.id === testRideBike))?.name}</strong> has been registered.
                  </p>
                </div>

                <div className="bg-gray-950 p-4 rounded-xl border border-gray-900 text-left text-xs space-y-2 max-w-xs mx-auto">
                  <p className="text-gray-400"><strong>Hub Location:</strong> Assembly plant II Test Track, Frankfurt</p>
                  <p className="text-gray-400"><strong>Date Scheduled:</strong> {testRideDate}</p>
                  <p className="text-gray-400"><strong>Slot Allocation:</strong> {testRideTime === "morning" ? "09:00 - 12:00" : testRideTime === "afternoon" ? "13:00 - 16:00" : "17:00 - 19:00"}</p>
                  <p className="text-gray-500 text-[10px] leading-tight pt-2 border-t border-gray-900">Please arrive 15 minutes early with your license and safety footwear.</p>
                </div>

                <button
                  onClick={() => setIsTestRideModalOpen(false)}
                  className="w-full py-3 border border-gray-800 text-gray-400 hover:text-white font-semibold rounded-lg text-xs hover:bg-gray-900 transition-colors"
                >
                  Close Window
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
