export interface ExpeditionRecord {
  id: string;
  mountain: string;
  elevation: string;
  location: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  image: string;
  story: string;
  stats: {
    duration: string;
    difficulty: string;
    temperature: string;
  };
  year: string;
  isSevenSummit: boolean;
}

export const FALLBACK_EXPEDITIONS: ExpeditionRecord[] = [
  {
    id: 'everest',
    mountain: 'Mount Everest',
    elevation: '29,032 ft',
    location: 'Nepal/Tibet',
    date: 'Spring 2028',
    year: '2028',
    status: 'in-progress',
    image: '/images/sunith-everest-vision.png',
    story:
      'The long objective remains the same, but the route now runs through physiotherapy, gait rebuild, and a careful return to full mountain training before Everest.',
    stats: {
      duration: '60 days',
      difficulty: 'Extreme+',
      temperature: '-60 C death zone',
    },
    isSevenSummit: true,
  },
  {
    id: 'denali',
    mountain: 'Mount Denali',
    elevation: '20,310 ft',
    location: 'Alaska, USA',
    date: 'June 2025',
    year: '2025',
    status: 'completed',
    image: '/images/sunith-ascent-hero.png',
    story:
      'Latest Seven Summits achievement. Technical glacier travel and extreme conditions. Three weeks testing every skill learned so far.',
    stats: {
      duration: '21 days',
      difficulty: 'Extreme',
      temperature: '-40 C summit',
    },
    isSevenSummit: true,
  },
  {
    id: 'elbrus',
    mountain: 'Mount Elbrus',
    elevation: '18,510 ft',
    location: 'Russia, Europe',
    date: 'August 2024',
    year: '2024',
    status: 'completed',
    image: '/images/sunith-home-hero.jpg',
    story:
      'A high-altitude endurance test on the highest mountain in Europe, with cold, wind, and long summit-day demands.',
    stats: {
      duration: '7 days',
      difficulty: 'Winter',
      temperature: '-25 C summit',
    },
    isSevenSummit: true,
  },
  {
    id: 'aconcagua',
    mountain: 'Mount Aconcagua',
    elevation: '22,837 ft',
    location: 'Argentina, South America',
    date: 'December 2024',
    year: '2024',
    status: 'completed',
    image: '/images/sunith-aconcagua.jpg',
    story:
      'Highest peak outside of Asia. High-altitude climbing in extreme conditions and a major step toward the ultimate goal.',
    stats: {
      duration: '18 days',
      difficulty: 'High Altitude',
      temperature: '-30 C summit',
    },
    isSevenSummit: true,
  },
  {
    id: 'spangnak',
    mountain: 'Spangnak',
    elevation: '18,100 ft',
    location: 'Ladakh, India',
    date: 'September 2024',
    year: '2024',
    status: 'completed',
    image: '/images/Spangnak.jpg',
    story:
      'Remote peak in the Ladakh region. Building technical climbing skills and testing gear in harsh mountain conditions.',
    stats: {
      duration: '8 days',
      difficulty: 'Technical',
      temperature: '-20 C summit',
    },
    isSevenSummit: false,
  },
  {
    id: 'mentok-kangri',
    mountain: 'Mentok Kangri I, II, III',
    elevation: '20,300 ft',
    location: 'Ladakh, India',
    date: 'August 2024',
    year: '2024',
    status: 'completed',
    image: '/images/Mentok.jpg',
    story:
      'Triple peak challenge in Ladakh, testing endurance and multi-day high-altitude performance.',
    stats: {
      duration: '12 days',
      difficulty: 'Technical',
      temperature: '-25 C summit',
    },
    isSevenSummit: false,
  },
  {
    id: 'kilimanjaro',
    mountain: 'Mount Kilimanjaro',
    elevation: '19,341 ft',
    location: 'Tanzania, Africa',
    date: 'February 2023',
    year: '2023',
    status: 'completed',
    image: '/stories/kilimanjaro.jpg',
    story:
      'First Seven Summits achievement. Years of preparation in the Himalayas led to this moment on the roof of Africa.',
    stats: {
      duration: '7 days',
      difficulty: 'High Altitude',
      temperature: '-15 C summit',
    },
    isSevenSummit: true,
  },
  {
    id: 'hampta-pass',
    mountain: 'Hampta Pass',
    elevation: '14,100 ft',
    location: 'Himachal Pradesh, India',
    date: 'September 2021',
    year: '2021',
    status: 'completed',
    image: '/images/hampta-pass.jpg',
    story:
      'A dramatic valley-to-valley crossing through rapid elevation changes and diverse mountain ecosystems.',
    stats: {
      duration: '5 days',
      difficulty: 'Intermediate',
      temperature: '0 C pass',
    },
    isSevenSummit: false,
  },
  {
    id: 'sandakphu',
    mountain: 'Sandakphu',
    elevation: '11,930 ft',
    location: 'West Bengal, India',
    date: 'April 2021',
    year: '2021',
    status: 'completed',
    image: '/images/Sandakphu.jpg',
    story:
      'The highest point in West Bengal, with views toward four 8,000-metre peaks and the long-term Everest objective.',
    stats: {
      duration: '4 days',
      difficulty: 'Easy',
      temperature: '5 C high point',
    },
    isSevenSummit: false,
  },
  {
    id: 'brahmatal',
    mountain: 'Brahmatal',
    elevation: '12,250 ft',
    location: 'Uttarakhand, India',
    date: 'January 2020',
    year: '2020',
    status: 'completed',
    image: '/images/Brahmatal.jpg',
    story:
      'Winter trekking experience focused on handling cold and snow conditions before larger objectives.',
    stats: {
      duration: '6 days',
      difficulty: 'Winter',
      temperature: '-15 C high point',
    },
    isSevenSummit: false,
  },
  {
    id: 'rupin-pass',
    mountain: 'Rupin Pass',
    elevation: '15,250 ft',
    location: 'Himachal Pradesh, India',
    date: 'May 2019',
    year: '2019',
    status: 'completed',
    image: '/images/rupin-pass.jpg',
    story:
      'A varied Himalayan crossing that built experience across changing landscapes and weather.',
    stats: {
      duration: '7 days',
      difficulty: 'Intermediate',
      temperature: '-5 C pass',
    },
    isSevenSummit: false,
  },
  {
    id: 'stok-kangri',
    mountain: 'Stok Kangri',
    elevation: '20,187 ft',
    location: 'Ladakh, India',
    date: 'September 2018',
    year: '2018',
    status: 'completed',
    image: '/images/stok-kangri.jpg',
    story:
      'The first journey above 6,000 metres and a major test of high-altitude capability.',
    stats: {
      duration: '8 days',
      difficulty: 'High Altitude',
      temperature: '-20 C summit',
    },
    isSevenSummit: false,
  },
  {
    id: 'everest-base-camp',
    mountain: 'Everest Base Camp',
    elevation: '17,598 ft',
    location: 'Nepal',
    date: 'October 2017',
    year: '2017',
    status: 'completed',
    image: '/images/everest-base-camp.jpg',
    story:
      "The first close encounter with the world's highest mountain and an early step toward the Everest objective.",
    stats: {
      duration: '14 days',
      difficulty: 'Trek',
      temperature: '-15 C base camp',
    },
    isSevenSummit: false,
  },
  {
    id: 'goecha-la',
    mountain: 'Goecha La',
    elevation: '16,207 ft',
    location: 'Sikkim, India',
    date: 'May 2016',
    year: '2016',
    status: 'completed',
    image: '/images/goecha-la.jpg',
    story:
      'A high Himalayan trek beneath Kanchenjunga that deepened the connection with sustained altitude.',
    stats: {
      duration: '8 days',
      difficulty: 'Intermediate',
      temperature: '-8 C pass',
    },
    isSevenSummit: false,
  },
  {
    id: 'roopkund',
    mountain: 'Roopkund',
    elevation: '16,847 ft',
    location: 'Uttarakhand, India',
    date: 'October 2015',
    year: '2015',
    status: 'completed',
    image: '/images/Roopkund.jpg',
    story:
      'Building on the foundation from Sar Pass and testing resilience at greater altitude.',
    stats: {
      duration: '6 days',
      difficulty: 'Intermediate',
      temperature: '-10 C high point',
    },
    isSevenSummit: false,
  },
  {
    id: 'sar-pass',
    mountain: 'Sar Pass Trek',
    elevation: '13,845 ft',
    location: 'Himachal Pradesh, India',
    date: 'May 2014',
    year: '2014',
    status: 'completed',
    image: '/images/sar-pass.jpg',
    story:
      'The spark that started everything: a Himalayan glacier one year after being bedridden with tuberculosis.',
    stats: {
      duration: '5 days',
      difficulty: 'Beginner',
      temperature: '-5 C pass',
    },
    isSevenSummit: false,
  },
];
