// PRICING - the one place every price and plan lives. Pages and components
// render from this file, so a price is changed here and nowhere else.
// All prices are proposals marked [CONFIRM] in client/brief.md until the owner approves them.

export const money = (n: number) => `$${n.toLocaleString('en-US')}`;

// Listed prices are for check, cash or bank transfer. Credit cards add this percentage.
export const cardFeeRate = 3;

/** Credit card price for an amount in dollars: amount plus the card fee, rounded to the cent. Cents shown only when not zero. */
export const cardPrice = (n: number) => {
  const cents = Math.round(n * (100 + cardFeeRate));
  const dollars = Math.floor(cents / 100);
  const rest = cents % 100;
  return `$${dollars.toLocaleString('en-US')}${rest ? `.${String(rest).padStart(2, '0')}` : ''}`;
};
/** "$1,030 by credit card" or, with a prefix, "from $5,150 by credit card". */
export const cardLine = (n: number, prefix?: string) => `${prefix ? `${prefix.toLowerCase()} ` : ''}${cardPrice(n)} by credit card`;

export const prices = {
  launch: 1000,
  growth: 2500,
  customFrom: 5000,
  extraPage: 150,
  care: 50,
  carePlus: 149,
  careYearly: 500,
  seoLocal: 750,
  seoGrowth: 1500,
  seoMultiFrom: 2500,
  adsSetup: 500,
  adsManagement: 500,
  adsBudgetCap: 3000,
  adsPercent: 15,
  adsBundle: 850,
  adSpendStartLow: 1000,
  adSpendStartHigh: 3000,
};

export interface Row {
  label: string;
  value: string;
}
export interface Plan {
  id: string;
  kicker: string;
  name: string;
  pricePrefix?: string;
  price?: string;
  unit?: string;
  card?: string;
  fees?: { label: string; price: string; unit: string; card: string }[];
  specs: Row[];
  plusLabel?: string;
  items: string[];
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
}

const free = 'Get my free analysis';

export const websitePlans: Plan[] = [
  {
    id: 'launch',
    kicker: 'Website',
    name: 'Launch Website',
    price: money(prices.launch),
    card: cardLine(prices.launch),
    unit: 'one time',
    specs: [
      { label: 'Pages', value: 'up to 5' },
      { label: 'Revisions', value: '2 rounds' },
      { label: 'You own it', value: 'yes' },
    ],
    items: [
      'Up to 5 pages',
      'Custom design made for your business',
      'Mobile-first',
      'Contact form that sends leads to your email',
      'On-page SEO basics and structured data',
      'Google Analytics and Search Console set up',
      'Two rounds of revisions',
      'You own the site',
    ],
    featured: true,
    ctaLabel: free,
    ctaHref: '#contact',
  },
  {
    id: 'growth',
    kicker: 'Website',
    name: 'Growth Website',
    price: money(prices.growth),
    card: cardLine(prices.growth),
    unit: 'one time',
    specs: [
      { label: 'Pages', value: 'up to 12' },
      { label: 'Starter blog posts', value: '3' },
      { label: 'Copywriting', value: 'included' },
    ],
    plusLabel: 'Everything in Launch, plus',
    items: [
      'Copywriting from a short interview',
      'A page for each service and each town you serve',
      'A blog set up with three starter posts',
      'A move from your old site with redirects so you keep your Google rankings',
    ],
    ctaLabel: free,
    ctaHref: '#contact',
  },
  {
    id: 'custom',
    kicker: 'Website',
    name: 'Custom build',
    pricePrefix: 'From',
    price: money(prices.customFrom),
    card: cardLine(prices.customFrom, 'From'),
    unit: 'quoted',
    specs: [],
    items: ['Online booking', 'Customer logins', 'Databases', 'E-commerce or anything else beyond an informational site'],
    ctaLabel: 'Ask for a quote',
    ctaHref: '#contact',
  },
];

export const carePlans: Plan[] = [
  {
    id: 'care',
    kicker: 'Care plan',
    name: 'Care',
    price: money(prices.care),
    card: cardLine(prices.care),
    unit: 'a month',
    specs: [
      { label: 'Edits', value: 'unlimited, within 1 business day' },
      { label: 'Report', value: 'monthly' },
    ],
    items: [
      'Hosting',
      'Security certificate',
      'Every change saved and reversible',
      'Software kept up to date',
      'Unlimited text and photo edits, done within one business day',
      'A monthly report on visitors and Google searches',
    ],
    featured: true,
    ctaLabel: free,
    ctaHref: '#contact',
  },
  {
    id: 'care-plus',
    kicker: 'Care plan',
    name: 'Care Plus',
    price: money(prices.carePlus),
    card: cardLine(prices.carePlus),
    unit: 'a month',
    specs: [
      { label: 'New content', value: '1 page or post a month' },
      { label: 'Review call', value: 'quarterly' },
    ],
    plusLabel: 'Everything in Care, plus',
    items: ['One new page or blog post every month', 'A quarterly review call'],
    ctaLabel: free,
    ctaHref: '#contact',
  },
];

export const seoPlans: Plan[] = [
  {
    id: 'local-seo',
    kicker: 'SEO plan',
    name: 'Local SEO',
    price: money(prices.seoLocal),
    card: cardLine(prices.seoLocal),
    unit: 'a month',
    specs: [
      { label: 'Content', value: '2 pieces a month' },
      { label: 'Report', value: 'monthly' },
    ],
    items: [
      'Google Business Profile optimization and weekly posts',
      'Business listings built, cleaned up and kept consistent',
      'On-page optimization',
      'Two new pieces of content a month',
      'A press release up to once a quarter, when you have news',
      'Monthly report',
    ],
    featured: true,
    ctaLabel: free,
    ctaHref: '#contact',
  },
  {
    id: 'growth-seo',
    kicker: 'SEO plan',
    name: 'Growth SEO',
    price: money(prices.seoGrowth),
    card: cardLine(prices.seoGrowth),
    unit: 'a month',
    specs: [
      { label: 'Content', value: '4 pieces a month' },
      { label: 'Strategy call', value: 'quarterly' },
    ],
    plusLabel: 'Everything in Local SEO, plus',
    items: [
      'Four pieces of content a month',
      'New service and location pages',
      'Link building',
      'Review generation',
      'Tracking of how the business shows up in AI answers (ChatGPT, Google AI Overviews, Perplexity)',
      'Competitor tracking',
      'A quarterly strategy call',
    ],
    ctaLabel: free,
    ctaHref: '#contact',
  },
  {
    id: 'multi-seo',
    kicker: 'SEO plan',
    name: 'Multi-location or highly competitive markets',
    pricePrefix: 'From',
    price: money(prices.seoMultiFrom),
    card: cardLine(prices.seoMultiFrom, 'From'),
    unit: 'a month, quoted after a free audit',
    specs: [],
    items: ['Quoted after a free audit'],
    ctaLabel: 'Ask for a quote',
    ctaHref: '#contact',
  },
];

const adSpecs = (who: string): Row[] => [
  { label: 'Covers ad budgets', value: `up to ${money(prices.adsBudgetCap)} a month` },
  { label: 'Larger budgets', value: `${prices.adsPercent}% of ad spend, never less than ${money(prices.adsManagement)}` },
  { label: 'Ad spend', value: `paid directly to ${who}` },
];
const adFees = [
  { label: 'Setup', price: money(prices.adsSetup), unit: 'one time', card: cardLine(prices.adsSetup) },
  { label: 'Management', price: money(prices.adsManagement), unit: 'a month', card: cardLine(prices.adsManagement) },
];

export const googleAdsPlan: Plan = {
  id: 'google-ads',
  kicker: 'Ads management',
  name: 'Google Ads',
  fees: adFees,
  specs: adSpecs('Google'),
  items: ['Setup covers account structure, conversion and call tracking, and a landing page'],
  featured: true,
  ctaLabel: free,
  ctaHref: '#contact',
};

export const socialAdsPlan: Plan = {
  id: 'social-ads',
  kicker: 'Ads management',
  name: 'Social media ads',
  fees: adFees,
  specs: adSpecs('Meta'),
  items: [
    'Setup covers pixel and conversion tracking, audiences and the first set of ads',
    'New ad creative every month',
    'Facebook and Instagram',
  ],
  ctaLabel: free,
  ctaHref: '#contact',
};

export const bundleLine = { text: 'Google Ads and social ads together:', price: `${money(prices.adsBundle)} a month`, card: cardLine(prices.adsBundle) };

// Short price summaries used by the services list.
export const serviceTiers = {
  webCard: `Launch ${cardPrice(prices.launch)} · Growth ${cardPrice(prices.growth)} · Custom from ${cardPrice(prices.customFrom)} by credit card`,
  seoCard: `Local ${cardPrice(prices.seoLocal)} · Growth ${cardPrice(prices.seoGrowth)} · Multi-location from ${cardPrice(prices.seoMultiFrom)} by credit card`,
  adsCard: `Setup ${cardPrice(prices.adsSetup)} · ${cardPrice(prices.adsManagement)} a month by credit card`,
  web: `Launch ${money(prices.launch)} · Growth ${money(prices.growth)} · Custom from ${money(prices.customFrom)}`,
  seo: `Local ${money(prices.seoLocal)} · Growth ${money(prices.seoGrowth)} · Multi-location from ${money(prices.seoMultiFrom)}`,
  ppc: `Setup ${money(prices.adsSetup)} · ${money(prices.adsManagement)} a month up to ${money(prices.adsBudgetCap)} a month in ad spend`,
  social: `Setup ${money(prices.adsSetup)} · ${money(prices.adsManagement)} a month up to ${money(prices.adsBudgetCap)} a month in ad spend`,
};

/** Card line for ads fees shown as "$500 a month + $500 setup". */
export const adsCardLine = `${cardPrice(prices.adsManagement)} a month + ${cardPrice(prices.adsSetup)} setup by credit card`;
