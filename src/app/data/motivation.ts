
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
  { id: "1", title: "Dream - Motivational Video", embedId: "mgmVOuLgFB0" },
  { id: "2", title: "Unbroken - Motivational Video", embedId: "26U_seo0a1g" },
  { id: "3", title: "Vision - Motivational Video", embedId: "m_I7vLqXkE8" },
  { id: "4", title: "Believe - Motivational Speech", embedId: "vXv2XlO8Qvw" },
  { id: "5", title: "Rise and Grind", embedId: "Ax38x7V9Yvg" },
  { id: "6", title: "Never Give Up", embedId: "hLQl3WQQoQ0" },
  { id: "7", title: "Success Starts Now", embedId: "X0U7tdJ6Qv8" },
  { id: "8", title: "Push Through", embedId: "tAGnKpE4NCI" },
  { id: "9", title: "Stay Focused", embedId: "H14bBuluwB8" },
  { id: "10", title: "Keep Going", embedId: "U2MbpKLJfzo" }
];
