export const mockStores = [
  { id: 'store1', name: 'KFC', location: 'Downtown', brand: 'KFC' },
  { id: 'store2', name: 'Pizza Hut', location: 'Westside Mall', brand: 'Pizza Hut' },
  { id: 'store3', name: 'KFC', location: 'Airport', brand: 'KFC' },
  { id: 'store4', name: 'Pizza Hut', location: 'Eastside Plaza', brand: 'Pizza Hut' },
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
    storeId: 'store1',
    storeName: 'KFC - Downtown',
    brand: 'KFC',
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
      { id: 'q4', text: 'How likely are you to recommend us to a friend or family?', type: 'nps', required: true },
      { id: 'q5', text: 'Any suggestions or additional comments?', type: 'text', required: false },
    ],
  },
];