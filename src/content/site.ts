/**
 * All page copy lives here. Edit, commit, push: the site redeploys.
 * Anything marked TODO is still waiting on Fel (see README → "Before launch").
 */

export interface Link {
  label: string;
  href: string;
}

export interface CaseStudy {
  title: string;
  problem: string;
  decision: string;
  result: string;
}

export interface Project {
  name: string;
  /** Optional short qualifier shown next to the name, e.g. "in progress". */
  tag?: string;
  description: string;
  stack: string;
  demo?: string | undefined;
  /** Leave undefined until the repo is tidied and public. */
  code?: string | undefined;
}

export interface Site {
  name: string;
  role: string;
  url: string;
  description: string;
  email: string;
  /** null hides the link everywhere until it's ready. */
  links: {
    github: string;
    linkedin: string | null;
    cv: string | null;
  };
  hero: string;
  work: {
    company: string;
    product: string;
    dates: string;
    intro: string;
    /** Public pages about the product and the company. */
    links: Link[];
    caseStudies: CaseStudy[];
    alsoAt: string[];
  };
  magdry: {
    title: string;
    body: string;
    link: Link;
  };
  projects: Project[];
  ai: string[];
  about: string[];
  contact: {
    /** Web3Forms access key. It's public by design: it only lets the form send to Fel's inbox. null shows email only. */
    web3formsKey: string | null;
  };
}

export const site: Site = {
  name: 'Fel Cardini',
  role: 'Software engineer.',
  url: 'https://cardini.dev',
  description:
    'Fel Cardini, software engineer (Node, React, TypeScript, MongoDB). Three years on the team building TRACE, the carbon measurement platform behind thousands of events. London.',
  email: 'hi@cardini.dev',
  links: {
    github: 'https://github.com/felcard',
    linkedin: null, // TODO: Fel's LinkedIn URL
    cv: null, // CV is offered on request (see the contact section). To link a PDF instead: put it in /public and set the path here.
  },

  hero: "For the last three years I've been part of the team building and fixing TRACE, the carbon measurement platform behind thousands of events. Node, MongoDB, React, and I design what I build.",

  work: {
    company: 'isla',
    product: 'TRACE',
    dates: 'Oct 2023 – present',
    intro:
      // Public facts only; no client names, screenshots or usage numbers.
      "TRACE lets event organisers measure, reduce and report their events' Scope 1–3 emissions, using carbon data aligned with the GHG Protocol. I'm part of the engineering team that builds and runs it, working closely with our senior lead.",
    links: [
      { label: 'About TRACE', href: 'https://traceyour.events/' },
      { label: 'About isla', href: 'https://weareisla.co.uk/' },
    ],
    caseStudies: [
      {
        title: 'Cut infrastructure costs by retiring Redis',
        problem:
          'Edit-locking (which stops two users overwriting the same data) depended on a separate Redis instance we were paying for.',
        decision:
          'Re-implemented locking in MongoDB, which we already ran: a lock document marks a table as being edited, and a TTL index expires it automatically so a lock can never get stuck.',
        result: 'Removed the Redis dependency and its monthly cost, with no change for users.',
      },
      {
        title: 'Shipped a feature a year before its backend existed',
        problem:
          'A dashboard module needed company-wide data that required a long backend refactor.',
        decision:
          'Built an interim, frontend-only solution with the aggregation logic in the client, so users got the feature straight away.',
        result: 'It ran bug-free for ~12 months until the backend refactor landed.',
      },
      {
        title: "Built a public API for a client's own dashboard",
        problem:
          'A client wanted to enter data in TRACE but see the results in their own custom dashboard.',
        decision:
          'Designed a token-based auth system and request middleware, and exposed the data through a public API.',
        result: "TRACE data now feeds the client's dashboard directly.",
      },
    ],
    alsoAt: [
      'Took over a codebase built by outsourced agencies: refactored, fixed bugs and consolidated duplicated logic across the platform.',
      'Replaced Product Fruits, a paid onboarding tool, with an in-house guided-tour system built on a React tour library, cutting another subscription.',
      'Designed and built an internal stats site in Retool for senior staff, pulling live data from our database.',
      'Set up PostHog for product analytics and monitoring.',
      'Stepped in as the product’s designer during the phases we had no designer: user flows, UI and assets in Figma.',
    ],
  },

  magdry: {
    title: 'MAGDRY: a product I designed, built and run',
    body: 'A patent-pending magnetic gym towel, sold on Amazon UK. I built the brand site in plain HTML and vanilla JavaScript, no framework, with AI assistance (video hero, conversion-focused layout, deep-linked Amazon checkout), and I run the business side: listings, advertising and product development.',
    link: { label: 'Visit magdry.co.uk', href: 'https://magdry.co.uk' },
  },

  projects: [
    {
      name: 'Braincloud',
      description:
        'Live word-cloud app for presentations: the audience submits words anonymously and the most popular grow in real time. Host can control the session and manage the word cloud in real time.',
      stack: 'WebSockets · React',
      demo: 'https://braincloud.netlify.app/',
      code: 'https://github.com/felcard/braincloud',
    },
    {
      name: 'Charla',
      description:
        'Private chat rooms in seconds: no sign-up, nothing stored, conversations disappear when the browser closes. While they chat, people can play a custom tic-tac-toe I built, with every move synced live between players over WebSockets.',
      stack: 'WebSockets · React',
      demo: 'https://powerchat.netlify.app/',
      code: 'https://github.com/felcard/charla',
    },
  ],

  ai: [
    'Most of my code now starts with an AI draft. I write roughly 20% by hand; the rest of my time goes into specifying the problem, reviewing what comes back, and testing it. I treat AI-written code like any other pull request: nothing gets merged until it’s been reviewed.',
    'The mistakes I catch are rarely syntax. More often it’s a confident fix built on a wrong assumption, because the model hasn’t seen enough of the codebase, or logic that’s more complicated than the problem needs, with names that don’t say what things do. So I control what context it gets, ask for the simplest version first, and rewrite and rename before anything merges.',
  ],

  about: [
    'Building for the web has been the constant in everything I’ve done. For four years I ran my own pizzeria business, and alongside the operations I designed, built and maintained its website and ran its marketing. That’s where I got hooked on building things, so I trained formally through Northcoders and made software my full-time job.',
    'I like the problems other people avoid, especially hunting down a bug until it’s actually fixed. Bilingual English / Spanish. Based in London.',
  ],

  contact: {
    web3formsKey: 'e22b0879-ae78-4071-afb2-c6aa12458ed7', // public by design: it only sends to Fel's inbox
  },
};
