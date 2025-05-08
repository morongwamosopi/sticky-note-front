import { Idea, IdeaColor } from '@/context/IdeaContext';

// Business categories for idea generation
export const BUSINESS_CATEGORIES = [
  'Technology',
  'Health & Wellness',
  'Food & Beverage',
  'Education',
  'E-commerce',
  'Entertainment',
  'Sustainability',
  'Finance',
  'Travel',
  'Fashion'
];

// Business ideas by category
const BUSINESS_IDEAS = {
  Technology: [
    'AI-powered personal shopping assistant',
    'Blockchain solution for supply chain tracking',
    'AR furniture placement app for home décor',
    'Voice-controlled smart home system',
    'Privacy-focused social media platform',
    'Digital nomad workspace finder app',
    'Virtual reality fitness training',
    'Subscription service for tech gadget rentals',
    'IoT device for plant care optimization',
    'Cybersecurity training platform for non-tech users'
  ],
  'Health & Wellness': [
    'On-demand virtual therapy platform',
    'Personalized nutrition planning app',
    'Sleep optimization coaching service',
    'Corporate wellness program provider',
    'Mental health check-in subscription box',
    'Wearable for stress management',
    'Augmented reality yoga instructor',
    'Personalized vitamin subscription service',
    'Meditation app for specific professions',
    'Healthy meal prep delivery for busy families'
  ],
  'Food & Beverage': [
    'Sustainable cocktail mixers subscription',
    'Global spice exploration box',
    'Automated hydroponic kitchen garden',
    'Personalized coffee roasting service',
    'Food waste reduction app connecting restaurants and consumers',
    'Artisanal non-alcoholic beverage bar',
    'Culinary tourism platform focused on local experiences',
    'AI-powered recipe generator based on available ingredients',
    'Allergen-free bakery delivery service',
    'Virtual cooking classes with international chefs'
  ],
  'Education': [
    'Skill exchange platform for professional development',
    'Personalized learning system for neurodiverse students',
    'Interactive history lessons through AR',
    'Mentorship matching platform for STEM fields',
    'Language learning through immersive virtual experiences',
    'Microlearning platform for essential life skills',
    'Peer-to-peer tutoring marketplace',
    'Educational games for financial literacy',
    'Virtual lab simulations for remote science education',
    'Subscription box for hands-on learning projects'
  ],
  'E-commerce': [
    'Virtual try-on technology for online clothing stores',
    'Subscription service for sustainable home products',
    'Peer-to-peer rental platform for luxury items',
    'Direct-to-consumer artisanal food marketplace',
    'Social shopping platform with live video features',
    'Heritage craft preservation marketplace',
    'Customizable gift box service for corporate clients',
    'Second-hand designer fashion authentication service',
    'Ethical and sustainable product rating extension',
    'Local business delivery aggregator'
  ],
  'Entertainment': [
    'Interactive storytelling platform with multiple endings',
    'Subscription service for immersive at-home entertainment',
    'Virtual concert platform with interactive experiences',
    'Indie game creator support network',
    'Pop-up themed dining experiences',
    'Curated local events discovery platform',
    'Virtual reality escape room creator',
    'Collaborative music creation app',
    'On-demand performing arts streaming service',
    'Personalized audiobook narration service'
  ],
  'Sustainability': [
    'Zero-waste grocery delivery service',
    'Sustainable fashion rental subscription',
    'Solar energy sharing platform for neighborhoods',
    'Eco-friendly home renovation consulting',
    'Carbon footprint tracking and offset subscription',
    'Plastic alternative products from agricultural waste',
    'Community-supported regenerative agriculture platform',
    'Repair and upcycling marketplace',
    'Sustainable travel planning service',
    'Circular economy certification for businesses'
  ],
  'Finance': [
    'Financial literacy app using gamification',
    'Micro-investing platform for sustainable ventures',
    'Subscription service for personalized financial coaching',
    'Blockchain-based crowdfunding for local businesses',
    'AI financial advisor for first-time investors',
    'Debt management and counseling service',
    'Collaborative saving circles platform',
    'Financial transparency tools for small businesses',
    'Affordable financial planning for gig workers',
    'International money transfer platform for immigrants'
  ],
  'Travel': [
    'Sustainable tourism certification platform',
    'Local experience curation through resident experts',
    'Work-from-anywhere program with global accommodations',
    'Solo traveler community and safety app',
    'Carbon-neutral travel booking service',
    'Cultural immersion programs for remote workers',
    'Family-friendly adventure planning platform',
    'Last-minute luxury stay marketplace',
    'Accessible travel planning for people with disabilities',
    'Hyper-local food tourism experiences'
  ],
  'Fashion': [
    'Virtual fashion design platform for digital clothing',
    'Clothing rental subscription for growing children',
    'On-demand custom clothing with body scanning',
    'Sustainable fashion material marketplace',
    'Wardrobe digitization and outfit planning app',
    'Fashion upcycling and alteration service',
    'Personal stylist subscription based on lifestyle',
    'Size-inclusive boutique featuring indie designers',
    'Traditional craftsmanship modern fashion label',
    'Gender-neutral clothing subscription box'
  ]
};

// Generate random unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Get random color for sticky note
const getRandomColor = (): IdeaColor => {
  const colors: IdeaColor[] = ['yellow', 'blue', 'green', 'pink'];
  return getRandomItem(colors);
};

// Generate a random business idea
export const generateRandomIdea = (category?: string): Idea => {
  // If no specific category is provided, pick a random one
  const selectedCategory = category || getRandomItem(BUSINESS_CATEGORIES);
  
  // Get ideas for the selected category
  const ideasForCategory = BUSINESS_IDEAS[selectedCategory as keyof typeof BUSINESS_IDEAS];
  
  // Pick a random idea from the category
  const ideaText = getRandomItem(ideasForCategory);
  
  // Create and return the new idea object
  return {
    id: generateId(),
    text: ideaText,
    color: getRandomColor(),
    date: new Date().toISOString(),
    isFavorite: false,
    category: selectedCategory
  };
};