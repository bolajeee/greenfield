/**
 * Single source of truth for company facts and page copy.
 * Everything here comes from the Greenfield company profile (PDF).
 * Change a phone number or an address once, here, and every page follows.
 */

export const company = {
  name: "Greenfield Golden Resources Ltd",
  shortName: "Greenfield",
  tagline: "Safe. Reliable. Cost effective.",
  email: "greenfieldgoldenresourcesltd@gmail.com",
  phones: [
    { display: "+234 803 704 1918", href: "tel:+2348037041918" },
    { display: "+234 803 332 4141", href: "tel:+2348033324141" },
  ],
  offices: [
    { label: "Head office", city: "Abuja", address: "No 1, Cotonou Crescent, Wuse, Abuja FCT" },
    { label: "Lagos office", city: "Lagos", address: "No 15, McNeil Road, Yaba, Lagos" },
  ],
} as const;

export const navLinks = [
  { href: "/fumigation", label: "Fumigation" },
  { href: "/supplies", label: "Technical supplies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** The services a visitor can ask for. `value` is used in /contact?service=… links. */
export const serviceOptions = [
  { value: "fumigation", label: "Fumigation and pest control" },
  { value: "supplies", label: "Technical supplies" },
  { value: "cleaning", label: "Cleaning and waste management" },
  { value: "tank-services", label: "Calibration and tank services" },
  { value: "tank-construction", label: "Tank construction" },
] as const;

export type ServiceValue = (typeof serviceOptions)[number]["value"];

export const sectors = [
  "Corporate organisations",
  "Schools",
  "Supermarkets",
  "Malls",
  "Public and private offices",
  "Hotels",
  "Hospitals",
  "Private and public estates",
  "Service apartments",
] as const;

export const reasons = [
  {
    title: "Cost savings",
    body: "Lower operational costs through efficient fumigation and bulk supplies.",
  },
  {
    title: "Compliance",
    body: "Zero failed inspections with our services.",
  },
  {
    title: "Convenience",
    body: "One company for both pest control and technical supply needs.",
  },
  {
    title: "Trust",
    body: "A growing base of satisfied clients across industries.",
  },
] as const;

export const equipment = [
  "Generating sets, petrol and diesel",
  "Lawn mowers",
  "Pumping machines",
  "Weeding machines",
  "Filling machines",
  "Outdoor solar lights",
  "Tool boxes",
  "Grinder machines",
  "Safety overalls and jackets",
  "Safety boots and helmets",
] as const;

export const supplyExamples = [
  {
    client: "Service apartments",
    items: ["Full furniture sets", "Home appliances", "Quality furniture", "Air conditioning systems"],
  },
  {
    client: "Hotels",
    items: ["High-class kitchen equipment", "Trolleys", "Quality towels", "Cleaning tools"],
  },
  {
    client: "Schools",
    items: ["White boards", "School furniture", "Technical sets", "Beakers", "Lab equipment"],
  },
] as const;

export const supportingServices = [
  {
    title: "Cleaning and waste management",
    image: null,
  },
  {
    title: "Calibration and tank services",
    image: { src: "/images/tanks-steel.jpg", width: 262, height: 164, alt: "A row of horizontal steel storage tanks on concrete saddles" },
  },
  {
    title: "Tank construction",
    image: { src: "/images/tank-yellow.jpg", width: 259, height: 168, alt: "A newly built yellow storage tank in a fabrication yard" },
  },
] as const;

export const feedback = [
  "They’ve kept our factory pest-free for 3 years, passing every inspection without issues.",
  "We saved ₦2m annually by sourcing our supplies directly through them.",
] as const;

export const clientNames = [
  "Munis Resources Limited",
  "African Circle Pollution Management Limited",
  "IB Sure Energy Limited",
] as const;

export const clients = [
  { name: "Munis Resources Limited", logo: "/images/clients/munis-resources.png" },
  { name: "African Circle Pollution Management Limited", logo: "/images/clients/african-circle.png" },
  { name: "IB Sure Energy Limited", logo: "/images/clients/ib-sure-energy.png" },
] as const;

export const fieldPhotos = [
  { src: "/images/mist-blower-crew.jpg", width: 720, height: 1124, alt: "Three Greenfield technicians in green coveralls carrying backpack mist blowers across a lawn", caption: "Mist blower crew on a grounds treatment" },
  { src: "/images/vehicle-treatment.jpg", width: 675, height: 896, alt: "A technician leaning into a red car to treat the interior", caption: "Treating a vehicle interior" },
  { src: "/images/office-treatment.jpg", width: 538, height: 714, alt: "A technician in a yellow protective suit and respirator spraying inside an office", caption: "Office treatment in full protective gear" },
  { src: "/images/boat-treatment.jpg", width: 405, height: 540, alt: "A technician with a mist blower standing on a boat moored at a jetty", caption: "Treating a boat at the jetty" },
  { src: "/images/cabin-doorway.jpg", width: 405, height: 540, alt: "A technician wearing a respirator and blue gloves stepping out of a cabin with a sprayer", caption: "Cabin treatment with a pressure sprayer" },
  { src: "/images/sprayer-prep.jpg", width: 385, height: 512, alt: "A technician in a white helmet pressurising a steel sprayer on a paved yard", caption: "Pressurising a sprayer before a job" },
] as const;
