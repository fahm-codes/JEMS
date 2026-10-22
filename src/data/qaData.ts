import { QAItem, Badge } from '../types';

export const INITIAL_QA_DATA: QAItem[] = [
  {
    id: 'qa-1',
    q: 'When do you play?',
    a: 'Well, I play in the afternoon.',
    banglaQ: 'তুমি কখন খেলাধুলা করো?',
    banglaA: 'আমি সাধারণত বিকেলে খেলা করি।',
    emoji: '⚽',
    category: 'routine',
    hint: 'Use "in the afternoon" for evening outdoor games!'
  },
  {
    id: 'qa-2',
    q: 'When do you read?',
    a: 'Generally, I read in the morning.',
    banglaQ: 'তুমি কখন পড়াশোনা করো?',
    banglaA: 'সাধারণত, আমি সকালে পড়ি।',
    emoji: '📚',
    category: 'routine',
    hint: 'Morning is the best time for sharp memory!'
  },
  {
    id: 'qa-3',
    q: 'When do you sleep?',
    a: 'Well, I sleep at 10 evening.',
    banglaQ: 'তুমি কখন ঘুমাতে যাও?',
    banglaA: 'আমি রাত ১০টায় ঘুমাই।',
    emoji: '🌙',
    category: 'routine',
    hint: 'Early to bed and early to rise makes you healthy!'
  },
  {
    id: 'qa-4',
    q: 'When do you have lunch?',
    a: 'Generally, I have lunch at 2 pm.',
    banglaQ: 'তুমি কখন দুপুরের খাবার খাও?',
    banglaA: 'সাধারণত, আমি দুপুর ২টায় দুপুরের খাবার খাই।',
    emoji: '🍛',
    category: 'food',
    hint: 'Warm rice, dal, and curry make great lunch!'
  },
  {
    id: 'qa-5',
    q: 'Who is your friend?',
    a: 'Mr. Sami is my friend.',
    banglaQ: 'তোমার বন্ধু কে?',
    banglaA: 'মিস্টার সামি আমার বন্ধু।',
    emoji: '👦',
    category: 'friends',
    hint: 'Friends share toys, books, and smiles!'
  },
  {
    id: 'qa-6',
    q: 'What do you do with your friend?',
    a: 'I play, study and sing with my friend.',
    banglaQ: 'তুমি তোমার বন্ধুর সাথে কী করো?',
    banglaA: 'আমি আমার বন্ধুর সাথে খেলা করি, পড়ি এবং গান গাই।',
    emoji: '🤝',
    category: 'friends',
    hint: 'Study and play together with joy!'
  },
  {
    id: 'qa-7',
    q: 'What are you doing now?',
    a: 'I am reading and playing now.',
    banglaQ: 'তুমি এখন কী করছ?',
    banglaA: 'আমি এখন পড়ছি এবং খেলা করছি।',
    emoji: '✨',
    category: 'routine',
    hint: 'Use "-ing" for actions happening right now!'
  },
  {
    id: 'qa-8',
    q: 'Which subject do you like most?',
    a: 'I like English a lot.',
    banglaQ: 'কোন বিষয়টি তোমার সবচেয়ে বেশি পছন্দ?',
    banglaA: 'আমি ইংরেজি খুব পছন্দ করি।',
    emoji: '⭐',
    category: 'school',
    hint: 'English connects you with the whole world!'
  },
  {
    id: 'qa-9',
    q: 'When do you wake up?',
    a: 'Generally, I wake up at 7 morning.',
    banglaQ: 'তুমি কখন ঘুম থেকে ওঠো?',
    banglaA: 'সাধারণত, আমি সকাল ৭টায় ঘুম থেকে উঠি।',
    emoji: '🌅',
    category: 'routine',
    hint: 'A fresh morning gives lots of energy!'
  },
  {
    id: 'qa-10',
    q: 'When do you go to school?',
    a: 'I go to school at 9 morning.',
    banglaQ: 'তুমি কখন স্কুলে যাও?',
    banglaA: 'আমি সকাল ৯টায় স্কুলে যাই।',
    emoji: '🎒',
    category: 'school',
    hint: 'Always be punctual and ready with your school bag!'
  },
  {
    id: 'qa-11',
    q: 'What is your favorite food?',
    a: 'My favorite food is delicious mango and biryani.',
    banglaQ: 'তোমার প্রিয় খাবার কী?',
    banglaA: 'আমার প্রিয় খাবার সুস্বাদু আম এবং বিরিয়ানি।',
    emoji: '🥭',
    category: 'food',
    hint: 'Ripe Bangladeshi mangoes are sweet and yummy!'
  },
  {
    id: 'qa-12',
    q: 'What is your school name?',
    a: 'My school name is Green Valley Junior School.',
    banglaQ: 'তোমার বিদ্যালয়ের নাম কী?',
    banglaA: 'আমার বিদ্যালয়ের নাম গ্রিন ভ্যালি জুনিয়র স্কুল।',
    emoji: '🏫',
    category: 'school',
    hint: 'Speak your school name with pride!'
  },
  {
    id: 'qa-13',
    q: 'What game do you like to play?',
    a: 'I love to play football and cricket with my cousins.',
    banglaQ: 'তুমি কোন খেলা খেলতে ভালোবাসো?',
    banglaA: 'আমি আমার কাজিনদের সাথে ফুটবল এবং ক্রিকেট খেলতে ভালোবাসি।',
    emoji: '🏏',
    category: 'hobbies',
    hint: 'Cricket and football keep us fit and active!'
  },
  {
    id: 'qa-14',
    q: 'What is your hobby?',
    a: 'Drawing colorful pictures is my favorite hobby.',
    banglaQ: 'তোমার শখ কী?',
    banglaA: 'রঙিন ছবি আঁকা আমার প্রিয় শখ।',
    emoji: '🎨',
    category: 'hobbies',
    hint: 'Colors bring our imagination to life!'
  },
  {
    id: 'qa-15',
    q: 'How do you go to school?',
    a: 'I go to school by yellow school bus with my friends.',
    banglaQ: 'তুমি কীভাবে স্কুলে যাও?',
    banglaA: 'আমি বন্ধুদের সাথে হলুদ স্কুল বাসে স্কুলে যাই।',
    emoji: '🚌',
    category: 'school',
    hint: 'Always wear a seatbelt and smile at the driver!'
  },
  {
    id: 'qa-16',
    q: 'What is our national fruit?',
    a: 'Jackfruit is our national fruit.',
    banglaQ: 'আমাদের জাতীয় ফল কী?',
    banglaA: 'কাঁঠাল আমাদের জাতীয় ফল।',
    emoji: '🍈',
    category: 'general',
    hint: 'It is big, green, and full of sweet bulbs!'
  }
];

export const BADGES_LIST: Badge[] = [
  {
    id: 'first-step',
    title: 'Junior Explorer 🌟',
    description: 'Practiced your first Q&A card!',
    emoji: '🌟',
    requiredStars: 1
  },
  {
    id: 'voice-star',
    title: 'Golden Voice 🎙️',
    description: 'Listened and repeated 5 times!',
    emoji: '🎙️',
    requiredStars: 5
  },
  {
    id: 'quiz-champ',
    title: 'Quiz Champion 🏆',
    description: 'Answered 10 quiz questions correctly!',
    emoji: '🏆',
    requiredStars: 10
  },
  {
    id: 'streak-master',
    title: 'Super Streak ⚡',
    description: 'Reached a streak of 5 correct in a row!',
    emoji: '⚡',
    requiredStars: 15
  },
  {
    id: 'sentence-builder',
    title: 'Word Wizard 🪄',
    description: 'Built 3 complete sentences correctly!',
    emoji: '🪄',
    requiredStars: 20
  },
  {
    id: 'english-hero',
    title: 'English Hero 🦸‍♂️',
    description: 'Achieved 30 stars in the Masterbook!',
    emoji: '🦸‍♂️',
    requiredStars: 30
  }
];
