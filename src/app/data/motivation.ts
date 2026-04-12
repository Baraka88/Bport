
export interface MotivationQuote {
  text: string;
  author: string;
}

export interface MotivationVideo {
  id: string;
  title: string;
  embedId: string;
}

export const MOTIVATIONAL_QUOTES: MotivationQuote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" }
];

export const MOTIVATIONAL_VIDEOS: MotivationVideo[] = [
  { id: "1", title: "Build Your Dreams", embedId: "F16ZS6rM29s" },
  { id: "2", title: "Stay Motivated", embedId: "ey9xv4Kd0kU" },
  { id: "3", title: "Push Forward", embedId: "D24Oo0B5AN8" },
  { id: "4", title: "Focus on Growth", embedId: "yA68tXdJClA" },
  { id: "5", title: "Make It Happen", embedId: "G6a3qQeRbgY" }
];
