// THE CLIENT'S BUSINESS DETAILS - the single source of truth.
//
// Every page, the header, the footer and the structured data read from here.
// To change a phone number, address or service area, change it in this file
// and nowhere else.

export const business = {
  businessName: 'Client Business Name',
  phone: '(555) 555-5555',
  email: 'hello@clientdomain.com',
  streetAddress: '123 Main St', // set to '' for a service-area business with no public address
  city: 'City',
  region: 'NY',
  postalCode: '00000',
  areaServed: ['Town One', 'Town Two', 'Town Three'],

  // Full URLs for every real profile this business has (Facebook, Instagram,
  // Google Business Profile, Yelp, LinkedIn). Tells Google and AI engines that
  // this site and those profiles are the same business.
  socialProfiles: [] as string[],

  // Path to the logo under /public, e.g. '/logo.png'. Leave empty until the
  // file exists; an empty value simply leaves the logo out of the structured data.
  logoPath: '',
};

// "tel:" link for the phone number above, digits only.
export const telHref = `tel:${business.phone.replace(/[^\d+]/g, '')}`;
