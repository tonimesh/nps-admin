export const mockStores = [
  { id: 'store1', name: 'KFC - Downtown', location: 'New York, NY', brandId: 'kfc' },
  { id: 'store2', name: 'Pizza Hut - Westside', location: 'Los Angeles, CA', brandId: 'pizza_hut' },
  { id: 'store3', name: 'KFC - Airport', location: 'Miami, FL', brandId: 'kfc' },
  { id: 'store4', name: 'Pizza Hut - Eastside', location: 'Chicago, IL', brandId: 'pizza_hut' },
  { id: 'store5', name: 'Taco Bell - Downtown', location: 'Dallas, TX', brandId: 'taco_bell' },
];

export const mockBrands = [
  { 
    id: 'kfc', 
    name: 'KFC', 
    logo: '🍗', 
    color: '#E31E24',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    description: 'Kentucky Fried Chicken',
    website: 'www.kfc.com',
    associated: true
  },
  { 
    id: 'pizza_hut', 
    name: 'Pizza Hut', 
    logo: '🍕', 
    color: '#0066B3',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    description: 'Pizza Hut - Make it great',
    website: 'www.pizzahut.com',
    associated: true
  },
  { 
    id: 'taco_bell', 
    name: 'Taco Bell', 
    logo: '🌮', 
    color: '#702082',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    description: 'Live más',
    website: 'www.tacobell.com',
    associated: false
  },
  { 
    id: 'burger_king', 
    name: 'Burger King', 
    logo: '👑', 
    color: '#D63E1A',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    description: 'Have it your way',
    website: 'www.bk.com',
    associated: false
  },
];

export const mockNPSData = [
  { month: 'Jan', score: 42, responses: 156, promoters: 85, passives: 45, detractors: 26 },
  { month: 'Feb', score: 45, responses: 189, promoters: 102, passives: 52, detractors: 35 },
  { month: 'Mar', score: 48, responses: 210, promoters: 118, passives: 58, detractors: 34 },
  { month: 'Apr', score: 52, responses: 234, promoters: 135, passives: 62, detractors: 37 },
  { month: 'May', score: 55, responses: 267, promoters: 158, passives: 68, detractors: 41 },
  { month: 'Jun', score: 58, responses: 289, promoters: 172, passives: 75, detractors: 42 },
];

export let mockSurveys = [
  {
    id: 'survey1',
    name: 'Customer Experience Survey',
    brandId: 'kfc',
    brandName: 'KFC',
    status: 'active',
    createdAt: '2024-01-15',
    responses: 234,
    npsScore: 52,
    header: 'We value your feedback!',
    headerSubtext: 'Help us serve you better every day.',
    footer: 'Your feedback is private • Better experience • Exclusive offers • We value your privacy',
    questions: [
      { id: 'q1', text: 'How was the food?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'], required: true },
      { id: 'q2', text: 'How was the service?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good'], required: true },
      { id: 'q3', text: 'How was the ambience?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'], required: true },
      { id: 'q4', text: 'How likely are you to recommend us?', type: 'nps', required: true },
      { id: 'q5', text: 'Any suggestions or additional comments?', type: 'text', required: false },
    ],
  },
  {
    id: 'survey2',
    name: 'Product Quality Survey',
    brandId: 'pizza_hut',
    brandName: 'Pizza Hut',
    status: 'paused',
    createdAt: '2024-02-01',
    responses: 89,
    npsScore: 45,
    header: 'Help us improve our products',
    headerSubtext: 'Your opinion matters',
    footer: 'Thank you for your valuable feedback!',
    questions: [
      { id: 'q1', text: 'How satisfied are you with our product quality?', type: 'rating', options: ['Very Bad', 'Bad', 'Average', 'Good', 'Excellent'], required: true },
      { id: 'q2', text: 'Any suggestions for improvement?', type: 'text', required: false },
    ],
  },
];