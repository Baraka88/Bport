
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
  { id: "1", title: "Motivational Video 1", embedId: "mp_cb3-wqd0" },
  { id: "2", title: "Motivational Video 2", embedId: "ZXsQAXx_ao0" },
  { id: "3", title: "Motivational Video 3", embedId: "wnHW6o8WMas" },
  { id: "4", title: "Motivational Video 4", embedId: "2Lz0VOltZKA" },
  { id: "5", title: "Motivational Video 5", embedId: "26U_seo0a1g" },
  { id: "6", title: "Motivational Video 6", embedId: "UNQhuFL6CWg" },
  { id: "7", title: "Motivational Video 7", embedId: "4pLUleLdwY4" },
  { id: "8", title: "Motivational Video 8", embedId: "mgmVOuLgFB0" },
  { id: "9", title: "Motivational Video 9", embedId: "3sK3wJAxGfs" },
  { id: "10", title: "Motivational Video 10", embedId: "1ZYbU82GVz4" },
  { id: "11", title: "Motivational Video 11", embedId: "sm1v1Eo8H0g" },
  { id: "12", title: "Motivational Video 12", embedId: "oHg5SJYRHA0" }
];
