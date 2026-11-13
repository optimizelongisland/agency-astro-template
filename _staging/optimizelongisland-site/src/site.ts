// THE CLIENT'S BUSINESS DETAILS - the single source of truth.
//
// Every page, the header, the footer and the structured data read from here.
// To change a phone number, address or service area, change it in this file
// and nowhere else.

export const business = {
  businessName: 'Optimize Long Island',
  phone: '(631) 517-0607',
  email: 'info@optimizelongisland.com',
  streetAddress: '', // no street address is published
  city: 'West Islip',
  region: 'NY',
  postalCode: '11795',
  areaServed: ['Long Island', 'Suffolk County', 'Nassau County', 'New York'],

  // Full URLs for every real profile this business has (Facebook, Instagram,
  // Google Business Profile, Yelp, LinkedIn). Tells Google and AI engines that
  // this site and those profiles are the same business.
  socialProfiles: [
    'https://www.facebook.com/OptimizeLongIsland',
    'https://www.instagram.com/optimizeli/',
    'https://www.google.com/maps?cid=10648169101424038505',
  ] as string[],

  // Path to the logo under /public, e.g. '/logo.png'. Leave empty until the
  // file exists; an empty value simply leaves the logo out of the structured data.
  logoPath: '',
};

// "tel:" link for the phone number above, digits only.
export const telHref = `tel:${business.phone.replace(/[^\d+]/g, '')}`;
