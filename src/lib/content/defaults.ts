/** Default copy for every admin-editable page. The admin panel stores overrides in the PageContent collection. */
export const CONTENT_DEFAULTS = {
  site: {
    footerBlurb: "Explore tattoo ideas, lettering and placement before you sit down with a professional artist. Designs are concepts and inspiration, not a substitute for a consultation.",
    copyright: "TattooGenerator.com. All rights reserved.",
  },
  home: {
    metaTitle: "Free Tattoo Generator – Create Tattoo Designs Online",
    metaDescription: "Create tattoo ideas online with a free tattoo generator. Explore lettering, names, symbols and design styles to plan your next tattoo.",
    badge: "20 free credits when you sign up",
    heroTitle: "Free Tattoo Generator – Create Tattoo Designs Online",
    heroBody: "Turn your ideas into unique tattoo designs with AI. Describe your idea, choose a style, and generate tattoo concepts you can save, customize, and download.",
    primaryCta: "Generate Your Tattoo",
    secondaryCta: "Explore Tattoo Ideas",
    howEyebrow: "How it works",
    howTitle: "From rough idea to tattoo-ready concept",
    howBody: "A tattoo design has to work on skin, not just on a screen. The generator is tuned for clean composition, strong linework and a clear silhouette.",
    steps: [
      { title: "Describe your idea", body: "Write it the way you'd tell a friend — \"a small fine-line moth on the wrist\" is plenty. No prompt-writing skills needed." },
      { title: "Pick style, placement and size", body: "Choose from 14 tattoo styles and 13 body areas. We shape the design to suit both the look and the spot." },
      { title: "Generate and refine", body: "Get a clean, tattoo-ready concept in seconds. Try another style, tweak the prompt, or generate again." },
      { title: "Save, download, take it to your artist", body: "Keep favorites in your account and download the artwork as reference for a professional consultation." },
    ],
    stylesEyebrow: "Tattoo styles",
    stylesTitle: "14 styles, each with its own rules",
    stylesBody: "Style changes everything: line weight, shading, how much detail survives at small sizes. Pick the look, and the generator handles the rest.",
    toolsEyebrow: "More than a generator",
    toolsTitle: "Everything for planning a tattoo",
    toolsBody: "Lettering, names, dates, symbols, sizing and placement — the details that decide whether a tattoo works long after the excitement of choosing it.",
    pricingEyebrow: "Pricing",
    pricingTitle: "Start free. Pay only if you need more.",
    pricingBody: "1 credit = 1 AI tattoo generation. The lettering, symbol and planning tools never use credits.",
    blogEyebrow: "From the blog",
    blogTitle: "Guides and ideas",
    faqTitle: "Tattoo generator questions",
    faq: [
      { q: "What is a tattoo generator?", a: "A tattoo generator is an online tool that turns a written idea into tattoo design concepts. Ours uses AI to create tattoo-style artwork based on your description, chosen style, placement, size and color." },
      { q: "Is the tattoo generator free?", a: "You can start for free. Every new account gets 20 credits with no payment details, and each generation uses 1 credit. If you need more, the Creator and Pro plans add more credits." },
      { q: "Can I generate custom tattoo ideas?", a: "Yes. Describe anything from a single symbol to a detailed scene. The generator produces original artwork for your description rather than picking from a catalog of stock designs." },
      { q: "Can I choose a tattoo style?", a: "Yes. There are 14 styles, including minimalist, fine line, traditional, neo traditional, blackwork, geometric, tribal, gothic, watercolor, realism, Japanese, old school, sketch and dotwork." },
      { q: "Can I download my tattoo design?", a: "Yes. Every design is saved to your account, and you can download the image from the result screen or from My Designs." },
      { q: "Can I use the design as inspiration for a tattoo artist?", a: "That's exactly what it's for. Treat generated designs as concepts and reference material, then work with a professional tattoo artist who can adapt the idea to your body, skin and their own style." },
    ],
    ctaHeading: "Your next tattoo starts with an idea",
    ctaBody: "Claim 20 free credits and see your concept on screen before you ever book a consultation.",
    ctaPrimary: "Get 20 free credits",
    ctaSecondary: "Try the font generator",
  },
  pricing: {
    metaTitle: "Tattoo Generator Pricing – Free Credits & Plans",
    metaDescription: "Start with 20 free credits. Need more? Creator is $9 for 80 AI tattoo generations and Pro is $50 for 500. 1 credit equals 1 generation.",
    heroTitle: "Simple credit pricing for tattoo designs",
    heroBody: "Start free with 20 credits. **1 credit = 1 AI tattoo generation.** Add more when you need them — no subscriptions to cancel, no surprises.",
    note: "Prices in USD. Credits are added to your account once payment is confirmed.",
    faqTitle: "Questions about credits and plans",
    faq: [
      { q: "What is a credit?", a: "One credit pays for one AI tattoo generation. Every account starts with 20 free credits, and you can add more with the Creator or Pro plan." },
      { q: "Is anything unlimited?", a: "No. Each plan includes a fixed number of credits, and each generation uses one. The font, lettering, symbol, size and placement tools are free to use and don't use credits." },
      { q: "What happens if a generation fails?", a: "If an image can't be generated, your credit is refunded automatically and you'll see a message explaining what happened." },
      { q: "Do I need a card to start?", a: "No. Your 20 free credits are added at signup with no payment details. You only pay if you choose a paid plan." },
      { q: "How are payments handled?", a: "Checkout is handled by our payment processor, so your card details never touch our servers. Credits are added after the payment is confirmed." },
      { q: "Can I download and keep my designs?", a: "Yes. Every design you generate is saved to your account, and you can download the image at any time. Treat designs as inspiration to bring to a professional tattoo artist." },
    ],
    ctaHeading: "Try it before you decide",
    ctaBody: "Create an account, claim your 20 free credits and generate your first tattoo design in under a minute.",
    ctaPrimary: "Get 20 free credits",
    ctaSecondary: "See the generator",
  },
  about: {
    metaTitle: "About TattooGenerator.com | Tattoo Design Tools",
    metaDescription: "TattooGenerator.com helps you explore tattoo concepts, lettering and placement ideas online before you sit down with a professional tattoo artist.",
    heading: "About TattooGenerator.com",
    intro: "We build free and low-cost tools that help you figure out what you want tattooed, where it should go and how it might look, so the conversation with your tattoo artist starts from a real idea instead of a blank page.",
    body: `## Concepts first, artist always

A tattoo is permanent, and getting it right takes a skilled human. Everything you generate here is meant as inspiration: a concept, a reference, a starting sketch. It is not a finished, tattoo-ready design and it is not a substitute for a consultation.

A professional artist knows how a design will sit on skin, how it will age, what linework and shading will hold up, and what suits your body. Bring your concepts to them, expect changes, and let them have the final say on the drawing.

## What we build

- **AI tattoo generator.** Describe an idea, choose a style, placement and color mode, and get concept images. Start with the [tattoo generator](/tattoo-generator), or narrow it down with the [minimalist](/minimalist-tattoo-generator), [fine line](/fine-line-tattoo-generator) and [traditional](/traditional-tattoo-generator) style pages.
- **Lettering and font tools.** Preview names, words and quotes in tattoo-style scripts using the [tattoo font generator](/tattoo-font-generator), then compare [gothic](/gothic-tattoo-generator) and [Old English](/old-english-tattoo-generator) looks.
- **Symbols and details.** Roman numerals, dates, initials, coordinates and zodiac ideas, all formatted for tattoo use.
- **Planning tools.** Estimate proportions with the [size calculator](/tattoo-size-calculator), browse the [placement guide](/tattoo-placement-guide), and try ideas on a body outline with the [placement visualizer](/tattoo-placement-visualizer).

## How credits work

The lettering, symbol and planning tools are free to use. AI generation runs on credits. When you create an account you get 20 free credits, and one credit equals one generation. If you need more, you can buy credit packs on the [pricing page](/pricing). The Terms of Service cover the details, including what happens when a generation fails.

## How we think about quality

AI image models are good at atmosphere and composition and less reliable at fine detail, exact text and anatomy. We shape prompts and options around tattoo conventions, such as bold outlines, clear negative space and placement-aware framing, and we would rather tell you a result is a concept than oversell it.

We keep the site focused on tattoos: design, lettering, symbols, styles and planning. If a tool is not useful for someone planning a tattoo, it does not belong here. Our [blog](/blog) covers the same topics in more depth.

## Who it is for

TattooGenerator.com is intended for adults planning their own tattoos, whether that is a first small piece or the next addition to a collection. Tattoos are age-restricted in most of the United States, and our service is not for anyone under 18.

## Get in touch

Questions, bug reports or partnership ideas? Use the [contact form](/contact) or email [hello@tattoogenerator.com](mailto:hello@tattoogenerator.com).`,
  },
  contact: {
    metaTitle: "Contact TattooGenerator.com | Support and Feedback",
    metaDescription: "Contact the TattooGenerator.com team about billing, bugs, copyright concerns, partnerships or general questions. We reply to every message by email.",
    heading: "Contact us",
    intro: "Have a question, a bug to report or a billing issue? Send us a message and we will reply by email.",
    body: `## Other ways to reach us

You can also email [hello@tattoogenerator.com](mailto:hello@tattoogenerator.com). For privacy requests such as access or deletion of your data, pick General as the subject and say what you need. See the [privacy policy](/privacy-policy) for details.

For copyright or content concerns, choose Content/Copyright and include a link to the page or design in question. Looking for how credits work first? Check the [pricing page](/pricing).

We cannot give tattoo consultations, medical advice or aftercare guidance. For those, talk to a licensed tattoo artist or a healthcare professional.`,
  },
};

export type ContentKey = keyof typeof CONTENT_DEFAULTS;
export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS) as ContentKey[];
