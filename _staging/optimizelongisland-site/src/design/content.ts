// Shared copy used on several pages: services, FAQ answers, testimonials, the
// four build steps and the contact form fields. Prices come from pricing.ts.
import { money, prices, serviceTiers, cardLine, adsCardLine, cardPrice } from './pricing';
import type { ExtraField } from '../core/components/LeadForm.astro';

export const services = [
  {
    number: '01',
    name: 'Web design',
    description: 'Custom websites, designed and built with AI and reviewed by a person, at a fixed public price.',
    pricePrefix: 'From',
    price: money(prices.launch),
    card: cardLine(prices.launch, 'From'),
    unit: 'one time',
    href: '/services/long-island-web-design-company/',
    tiers: serviceTiers.web,
    tiersCard: serviceTiers.webCard,
  },
  {
    number: '02',
    name: 'SEO',
    description: 'Local search optimization, including Google Maps and AI search visibility.',
    pricePrefix: 'From',
    price: money(prices.seoLocal),
    card: cardLine(prices.seoLocal, 'From'),
    unit: 'a month',
    href: '/services/seo/',
    tiers: serviceTiers.seo,
    tiersCard: serviceTiers.seoCard,
  },
  {
    number: '03',
    name: 'Google Ads',
    description: 'Google Ads management with conversion and call tracking.',
    price: money(prices.adsManagement),
    card: adsCardLine,
    unit: `a month + ${money(prices.adsSetup)} setup`,
    href: '/services/ppc/',
    tiers: serviceTiers.ppc,
    tiersCard: serviceTiers.adsCard,
  },
  {
    number: '04',
    name: 'Social media ads',
    description: 'Facebook and Instagram ads management, with new ad creative every month.',
    price: money(prices.adsManagement),
    card: adsCardLine,
    unit: `a month + ${money(prices.adsSetup)} setup`,
    href: '/services/social-media/',
    tiers: serviceTiers.social,
    tiersCard: serviceTiers.adsCard,
  },
];

// Every answer starts with the direct answer and runs 40 to 70 words.
const withCard = (n: number, unit = '') => `${money(n)}${unit} (${cardPrice(n)}${unit} by credit card)`;
export const faq = {
  pay: {
    question: 'How can I pay?',
    answer: 'By check, cash, bank transfer or card, billed through Square. Monthly plans are paid automatically by bank transfer or card. Listed prices are for check, cash or bank transfer; credit cards add a 3% card fee, and the credit card price is shown next to every price.',
  },
  cost: {
    question: `How can a custom website cost ${money(prices.launch)}?`,
    answer: `AI does most of the design and build work that used to take a team weeks, so the labor cost is far lower. A person directs it and checks every page before it goes live. A Launch Website is ${withCard(prices.launch)}. You pay for the result, not the hours.`,
  },
  template: {
    question: 'Is it a template?',
    answer: 'No. Each site is designed for your business from its own content, colors and reference sites you like. Claude, an AI model made by Anthropic, designs and builds it on Astro, and a person checks every page before it goes live. It is custom work, not a template.',
  },
  time: {
    question: 'How long does it take?',
    answer: 'Typically within 7 business days of receiving your content. That means your questionnaire answers, your logo and your photos. A person reviews every page before it goes live, and nothing launches until it has been checked. Sending your material promptly is the quickest way to get live.',
  },
  own: {
    question: 'Do I own my website?',
    answer: 'Yes. The site, the content and the domain are yours. If you leave, you take everything with you, so there is no lock-in. Every change to your site is saved and can be rolled back. Hosting runs on a care plan, which is required if you host with us.',
  },
  care: {
    question: `What does the ${money(prices.care)} a month cover?`,
    answer: `The Care plan is ${withCard(prices.care, ' a month')}. It covers hosting, a security certificate, every change saved and reversible, software kept up to date, unlimited text and photo edits done within one business day, and a monthly report on visitors and Google searches.`,
  },
  wordpress: {
    question: 'Can you move my WordPress site?',
    answer: `Yes, with the Growth Website, ${withCard(prices.growth)}. It includes a move from your old site with redirects, so existing Google rankings carry over. It also includes copywriting from a short interview, a page for each service and each town you serve, and a blog with three starter posts.`,
  },
  content: {
    question: 'Do you write the content?',
    answer: 'It depends on the package. Launch uses your own answers and materials: a short questionnaire, your logo and your photos. Growth includes copywriting from a short interview. Copywriting from scratch is not included in Launch, so if you want us to write your pages, choose the Growth Website.',
  },
  changes: {
    question: 'What if I need changes later?',
    answer: `Text and photo edits are unlimited on a care plan and done within one business day. A new page is ${withCard(prices.extraPage)}, or one new page or blog post every month is included with Care Plus, ${withCard(prices.carePlus, ' a month')}.`,
  },
  ai: {
    question: 'Will AI search (ChatGPT, Google AI Overviews) find my site?',
    answer: 'Sites are built with the structured data and clear question-and-answer content that Google AI Overviews, ChatGPT and other assistants read. No one can promise a business will be named in an AI answer. Ongoing AI visibility work is part of the SEO plans, and tracking of AI answers is part of Growth SEO.',
  },
  adspend: {
    question: 'How much should I spend on ads?',
    answer: `There is no fixed answer. Most local businesses start between ${money(prices.adSpendStartLow)} and ${money(prices.adSpendStartHigh)} a month in ad spend, paid directly to Google or Meta. That is separate from our management fee, and we discuss the right amount for your business in the free consultation.`,
  },
};

export const testimonials = {
  solar: {
    quote: 'Optimize Long Island totally transformed our SEO on Google. We were receiving nearly no internet traffic and leads coming from a previous agency. Now our phones and forms are constantly coming in and best of all everything they do is tracked and transparent.',
    name: 'Owner',
    company: 'Solar Solutions',
  },
  tent: {
    quote: "These guys have taken our business to another level. We tried another company prior, and there's absolutely no comparison with the knowledge, professionalism and the accessibility that they've provided for us. More than worth every dime we spend on their service.",
    name: 'Owner',
    company: 'A&R Party Tent Rentals',
  },
  bono: {
    quote: "Optimize Long Island showed me what was lacking in my business and the direction we needed to go to get TRUE results. What a change in my business. I can't thank them enough.",
    name: 'Stephen Bono, Owner',
    company: 'Above All',
  },
};

export const buildSteps = [
  { title: 'Questionnaire', text: 'You answer a short questionnaire and send your logo and photos.', more: 'A shared folder of photos is fine.' },
  { title: 'AI design and build', text: 'Claude designs and builds your site from your content, colors and reference sites you like.', more: 'It is custom, not a template.' },
  { title: 'Human review', text: 'A person checks every page before it goes live.', more: 'Nothing launches until it has been reviewed.' },
  { title: 'Launch', text: 'Typically live within 7 business days of receiving your content.', more: 'Hosting is on a care plan, and you own the site.' },
];

export const leadFields: ExtraField[] = [
  {
    name: 'service',
    label: 'What do you need?',
    type: 'select',
    required: true,
    options: ['Web Design', 'SEO', 'Google Ads', 'Social Media Ads', 'Not sure yet'],
  },
  { name: 'website', label: 'Your current website, if you have one' },
];
export const leadButton = 'Get my free analysis';

export const nav = [
  { label: 'Web Design', href: '/services/long-island-web-design-company/' },
  { label: 'SEO', href: '/services/seo/' },
  { label: 'AI Search', href: '/services/ai-search-visibility/' },
  { label: 'Google Ads', href: '/services/ppc/' },
  { label: 'Social Ads', href: '/services/social-media/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'About', href: '/about/' },
];

export const launchSheetRows = [
  { label: 'Pages', value: 'up to 5' },
  { label: 'Design', value: 'custom, made for your business' },
  { label: 'Built with', value: 'Claude and Astro' },
  { label: 'Every change', value: 'saved on GitHub' },
  { label: 'Hosting', value: 'Vercel global network' },
  { label: 'Typical time to live', value: '7 business days' },
  { label: 'You own it', value: 'site, content, domain' },
];
