export const LESSONS = [
  {
    id: 'markets-101',
    title: 'What is a market?',
    blurb: 'Tickers, bid/ask, and how a trade actually happens.',
    unlocks: null,
    questions: [
      {
        q: "A stock's \"ticker\" is:",
        options: ['Its price history chart', 'A short symbol that identifies it, like NOVA', 'The exchange it trades on', 'A type of order'],
        correct: 1,
        explain: 'A ticker is just the shorthand ID for a security — like a username for a company\'s stock.',
      },
      {
        q: 'The "bid" is:',
        options: ['The highest price a buyer will currently pay', 'The lowest price a seller will accept', 'The last traded price', 'The opening price of the day'],
        correct: 0,
        explain: 'Bid = what buyers are offering. Ask = what sellers want. The gap between them is the spread.',
      },
      {
        q: "If a stock's bid is $9.98 and ask is $10.02, the spread is:",
        options: ['$10.00', '$0.02', '$0.04', '$19.96'],
        correct: 2,
        explain: 'Spread = ask − bid = $10.02 − $9.98 = $0.04.',
      },
    ],
  },
  {
    id: 'market-orders',
    title: 'Market orders',
    blurb: 'The fastest way to buy or sell — and its hidden cost.',
    unlocks: 'market',
    questions: [
      {
        q: 'A market order will:',
        options: ['Only fill at a price you set', 'Fill immediately at the best available price', 'Wait until the market closes', 'Guarantee the lowest possible price'],
        correct: 1,
        explain: 'Market orders prioritize speed over price — you get filled now, at whatever the current price is.',
      },
      {
        q: 'The main risk of a market order on a volatile stock is:',
        options: ['It might not execute at all', 'You could pay more (or receive less) than the last quoted price', 'It costs extra in fees', "It can't be used for selling"],
        correct: 1,
        explain: 'This is called slippage — the price can move between when you click and when it fills.',
      },
      {
        q: "You'd most likely use a market order when:",
        options: ['You want a guaranteed exact price', "You want to exit a position immediately, price be damned", 'The market is closed', "You're placing a very large order in a thin stock"],
        correct: 1,
        explain: 'Market orders are for certainty of execution, not certainty of price.',
      },
    ],
  },
  {
    id: 'limit-orders',
    title: 'Limit orders',
    blurb: 'Name your price — and unlock it in the simulator.',
    unlocks: 'limit',
    questions: [
      {
        q: 'A limit order to BUY at $50 will only fill:',
        options: ['At exactly $50 or higher', 'At $50 or lower', 'Whenever the market opens', 'Only after a market order fails'],
        correct: 1,
        explain: 'A buy limit caps how much you\'ll pay — it fills at your price or better (lower).',
      },
      {
        q: 'The trade-off of a limit order is:',
        options: ['Higher fees', "It might never fill if the price doesn't reach your limit", "You can't cancel it", 'It only works on crypto'],
        correct: 1,
        explain: 'You control price, but you give up the guarantee of execution.',
      },
      {
        q: 'A sell limit order at $120 will fill:',
        options: ['At $120 or higher', 'At $120 or lower', 'Immediately, at market price', 'Only at market close'],
        correct: 0,
        explain: "A sell limit protects your downside — you won't sell for less than your set price.",
      },
    ],
  },
  {
    id: 'stop-loss',
    title: 'Stop-loss orders',
    blurb: 'The single most important habit in trading.',
    unlocks: 'stop',
    questions: [
      {
        q: 'A stop-loss order exists to:',
        options: ['Guarantee a profit', 'Automatically sell if a position falls too far, limiting your loss', 'Buy more shares when a price drops', 'Avoid paying taxes'],
        correct: 1,
        explain: "A stop-loss is insurance against yourself — it sells automatically so you don't have to decide in a panic.",
      },
      {
        q: 'You bought at $100 and set a stop-loss at $90. If the price drops to $90, what happens?',
        options: ["Nothing, it's just a warning", 'A sell order is triggered near $90', "You're forced to buy more", 'The stock is automatically shorted'],
        correct: 1,
        explain: 'Once the stop price is hit, it typically converts into a market order to sell.',
      },
      {
        q: 'The main reason traders skip stop-losses is:',
        options: ["They're too expensive", 'Overconfidence and hoping a losing position will recover', 'They only work on Fridays', "Brokers don't allow them"],
        correct: 1,
        explain: "The behavioral trap is real: 'it'll bounce back' is how small losses become account-ending ones.",
      },
    ],
  },
  {
    id: 'diversification',
    title: 'Diversification & risk',
    blurb: 'Why one big bet is a bad idea, even a winning one.',
    unlocks: null,
    questions: [
      {
        q: 'Putting 100% of your money into one stock means:',
        options: ["You'll definitely make more money", "Your entire outcome depends on one company's fate", 'You avoid all fees', "It's mathematically identical to diversifying"],
        correct: 1,
        explain: 'Concentration can boost returns, but a single bad surprise can wipe out everything.',
      },
      {
        q: 'Diversification mainly helps by:',
        options: ['Guaranteeing profits', 'Reducing the impact of any single position going wrong', 'Increasing your average return', 'Eliminating the need for research'],
        correct: 1,
        explain: "It's a risk-management tool, not a return-boosting one.",
      },
      {
        q: 'A risk-adjusted leaderboard rewards traders who:',
        options: ['Took the biggest single gamble', 'Made steady returns without huge, reckless swings', 'Traded the most times', 'Only held cash'],
        correct: 1,
        explain: 'Rewarding raw return alone would just crown whoever got lucky with leverage.',
      },
    ],
  },
]