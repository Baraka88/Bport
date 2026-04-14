
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
  { id: "1", title: "How Bad Do You Want It?", embedId: "2Lz0VOltZKA" },
  { id: "2", title: "Dream", embedId: "3sK3wJAxGfs" },
  { id: "3", title: "You Owe You", embedId: "ggCbJxyblg4" },
  { id: "4", title: "Rise and Shine", embedId: "4pLUleLdwY4" },
  { id: "5", title: "The Mindset of a Champion", embedId: "UNQhuFL6CWg" },
  { id: "6", title: "Motivation for Success", embedId: "26U_seo0a1g" },
  { id: "7", title: "Believe in Yourself", embedId: "mgmVOuLgFB0" },
  { id: "8", title: "Why Leaders Eat Last", embedId: "wnHW6o8WMas" },
  { id: "9", title: "Make Your Bed", embedId: "sm1v1Eo8H0g" },
  { id: "10", title: "Never Give Up", embedId: "1ZYbU82GVz4" }
];
