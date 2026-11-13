// PRICING - the one place every price and plan lives. Pages and components
// render from this file, so a price is changed here and nowhere else.
// All prices are proposals marked [CONFIRM] in client/brief.md until the owner approves them.

export const money = (n: number) => `$${n.toLocaleString('en-US')}`;

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
  fees?: { label: string; price: string; unit: string }[];
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
    unit: 'a month',
    specs: [
      { label: 'Content', value: '2 pieces a month' },
      { label: 'Report', value: 'monthly' },
    ],
    items: [
      'Google Business Profile optimization and weekly posts',
      'Business listings cleaned up and kept consistent',
      'On-page optimization',
      'Two new pieces of content a month',
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
    unit: 'a month, quoted after a free audit',
    specs: [],
    items: ['Quoted after a free audit'],
    ctaLabel: 'Ask for a quote',
    ctaHref: '#contact',
  },
];

const adSpecs = (who: string): Row[] => [
  { label: 'Covers ad budgets', value: `up to ${money(prices.adsBudgetCap)} a month` },
  { label: 'Above that', value: `${prices.adsPercent}% of ad spend` },
  { label: 'Ad spend', value: `paid directly to ${who}` },
];
const adFees = [
  { label: 'Setup', price: money(prices.adsSetup), unit: 'one time' },
  { label: 'Management', price: money(prices.adsManagement), unit: 'a month' },
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

export const bundleLine = { text: 'Google Ads and social ads together:', price: `${money(prices.adsBundle)} a month` };

// Short price summaries used by the services list.
export const serviceTiers = {
  web: `Launch ${money(prices.launch)} · Growth ${money(prices.growth)} · Custom from ${money(prices.customFrom)}`,
  seo: `Local ${money(prices.seoLocal)} · Growth ${money(prices.seoGrowth)} · Multi-location from ${money(prices.seoMultiFrom)}`,
  ppc: `Setup ${money(prices.adsSetup)} · ${money(prices.adsManagement)} a month up to ${money(prices.adsBudgetCap)} ad budget`,
  social: `Setup ${money(prices.adsSetup)} · ${money(prices.adsManagement)} a month up to ${money(prices.adsBudgetCap)} ad budget`,
};
