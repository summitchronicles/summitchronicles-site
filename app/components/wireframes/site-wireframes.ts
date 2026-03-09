export type WireframeMetric = {
  label: string;
  value: string;
  note?: string;
};

export type WireframeItem = {
  kicker?: string;
  title: string;
  body: string;
  meta?: string;
};

export type WireframeTimelineItem = {
  label: string;
  title: string;
  body: string;
};

export type WireframeSection =
  | {
      type: 'narrative';
      eyebrow: string;
      title: string;
      body: string;
      metrics?: WireframeMetric[];
      sideNotes?: string[];
    }
  | {
      type: 'grid';
      eyebrow: string;
      title: string;
      body: string;
      columns?: 2 | 3;
      items: WireframeItem[];
    }
  | {
      type: 'list';
      eyebrow: string;
      title: string;
      body: string;
      items: WireframeItem[];
    }
  | {
      type: 'timeline';
      eyebrow: string;
      title: string;
      body: string;
      items: WireframeTimelineItem[];
    }
  | {
      type: 'legal';
      eyebrow: string;
      title: string;
      body: string;
      items: Array<{
        title: string;
        body: string;
      }>;
    }
  | {
      type: 'cta';
      title: string;
      body: string;
      primaryLabel: string;
      secondaryLabel?: string;
    };

export type WireframePageDefinition = {
  slug: string;
  name: string;
  category:
    | 'Core Journey'
    | 'Editorial'
    | 'Community'
    | 'Partnerships'
    | 'Live Systems'
    | 'Legal';
  actualRoute: string;
  description: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    metrics: WireframeMetric[];
  };
  sections: WireframeSection[];
};

export const siteWireframes: WireframePageDefinition[] = [
  {
    slug: 'home',
    name: 'Home',
    category: 'Core Journey',
    actualRoute: '/',
    description: 'Cinematic landing page that frames the expedition, current chapter, and support path.',
    hero: {
      eyebrow: 'Summit Chronicles',
      title: 'The Journey To The Summit',
      description:
        'A quieter homepage that opens with purpose, then moves directly into the current expedition chapter, the training evidence, and the most recent field reports.',
      image: '/images/sunith-home-hero.jpg',
      metrics: [
        { label: 'Current Chapter', value: 'Everest Preparation' },
        { label: 'Latest Signal', value: 'Weekly Field Report' },
        { label: 'Support Path', value: 'Fuel The Journey' },
      ],
    },
    sections: [
      {
        type: 'narrative',
        eyebrow: 'Opening Logic',
        title: 'Start With The Mission, Not The Menu',
        body:
          'The homepage should open like a keynote slide: one image, one line of current focus, one title, one sentence. Everything below should feel earned, not immediately exposed.',
        sideNotes: [
          'No card grid above the fold',
          'One primary action only',
          'Training and stories appear as proof, not clutter',
        ],
      },
      {
        type: 'grid',
        eyebrow: 'Core Modules',
        title: 'Three Quiet Surface Areas',
        body:
          'The homepage becomes a calm sequence of current mission, training evidence, and narrative proof.',
        columns: 3,
        items: [
          {
            kicker: 'Current Chapter',
            title: 'What is happening now',
            body: 'One current block explaining where the expedition sits this week and why it matters.',
          },
          {
            kicker: 'Training Evidence',
            title: 'Live physical preparation',
            body: 'One distilled line of real training telemetry linked to the deeper training page.',
          },
          {
            kicker: 'Field Stories',
            title: 'Narrative proof of the work',
            body: 'One featured story or visual transmission that gives the mission emotional weight.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'Support Should Feel Like Participation, Not Donation UI',
        body:
          'The homepage should close with one elegant invitation to join the mission, with just enough clarity to establish trust.',
        primaryLabel: 'Fuel the Journey',
        secondaryLabel: 'Open support wireframe',
      },
    ],
  },
  {
    slug: 'about',
    name: 'About',
    category: 'Core Journey',
    actualRoute: '/about',
    description: 'Personal philosophy page with biography, values, and credibility.',
    hero: {
      eyebrow: 'About',
      title: 'A Life Organized Around Difficult Things',
      description:
        'This page should present the person behind the climb with restraint: biography, values, and the discipline that makes the larger mission credible.',
      image: '/images/sunith-summit-hero.png',
      metrics: [
        { label: 'Role', value: 'Mountaineer & Builder' },
        { label: 'Method', value: 'Systematic Preparation' },
        { label: 'Output', value: 'Public Documentation' },
      ],
    },
    sections: [
      {
        type: 'narrative',
        eyebrow: 'Positioning',
        title: 'The Page Should Answer Why This Journey Is Serious',
        body:
          'This is not a résumé and not a motivational essay. It is the page that connects professional discipline, physical ambition, and the reason this expedition deserves attention.',
        metrics: [
          { label: 'Biography', value: 'Condensed' },
          { label: 'Voice', value: 'Calm & exact' },
          { label: 'Proof', value: 'Visible commitments' },
        ],
      },
      {
        type: 'timeline',
        eyebrow: 'Narrative Spine',
        title: 'Personal Arc',
        body: 'The biography should be expressed as a small number of meaningful chapters.',
        items: [
          {
            label: 'Origin',
            title: 'What formed the appetite for difficulty',
            body: 'Early mountain experiences, discipline, and the first serious encounters with challenge.',
          },
          {
            label: 'Work',
            title: 'How systems thinking entered the story',
            body: 'Professional work and structured thinking become the lens for approaching the climb.',
          },
          {
            label: 'Summit',
            title: 'Why Everest is now the organizing mission',
            body: 'A clear articulation of why this journey matters beyond the summit photograph.',
          },
        ],
      },
      {
        type: 'grid',
        eyebrow: 'Values',
        title: 'Three Principles Worth Highlighting',
        body: 'The page should end with principles, not praise.',
        columns: 3,
        items: [
          {
            title: 'Preparation over spectacle',
            body: 'The work matters more than the appearance of the work.',
          },
          {
            title: 'Transparency over myth',
            body: 'Training, setbacks, cost, and uncertainty should all be visible.',
          },
          {
            title: 'Discipline over mood',
            body: 'A mountain objective demands consistency that survives emotion.',
          },
        ],
      },
    ],
  },
  {
    slug: 'my-story',
    name: 'My Story',
    category: 'Core Journey',
    actualRoute: '/my-story',
    description: 'Long-form narrative page focused on personal transformation and motivation.',
    hero: {
      eyebrow: 'My Story',
      title: 'The Human Story Behind The Expedition',
      description:
        'This page should feel more intimate than About: less positioning, more memory, more tension, and more reason to care about the climb as a life chapter.',
      image: '/images/sunith-visionary-planning.png',
      metrics: [
        { label: 'Mode', value: 'Long-form narrative' },
        { label: 'Emphasis', value: 'Transformation' },
        { label: 'Tone', value: 'Reflective, not sentimental' },
      ],
    },
    sections: [
      {
        type: 'list',
        eyebrow: 'Story Chapters',
        title: 'Three Movements, Not Endless Scroll',
        body:
          'The page should unfold as three authored chapters with strong image breaks and a disciplined amount of copy.',
        items: [
          {
            kicker: 'Chapter I',
            title: 'Before the mountain became the frame',
            body: 'What life looked like before the expedition became the central organizing mission.',
          },
          {
            kicker: 'Chapter II',
            title: 'What changed',
            body: 'The turning point, the decision, or the accumulation of factors that created a new direction.',
          },
          {
            kicker: 'Chapter III',
            title: 'What the climb means now',
            body: 'Why the expedition is now tied to identity, discipline, and responsibility.',
          },
        ],
      },
      {
        type: 'grid',
        eyebrow: 'Texture',
        title: 'What Makes This Page Distinct',
        body: 'This page can afford slightly more softness, but still within the same quiet system.',
        columns: 3,
        items: [
          {
            title: 'Portrait-led',
            body: 'Use personal imagery and less telemetry than the training surface.',
          },
          {
            title: 'Selective quotes',
            body: 'Use one or two meaningful lines, not a wall of italic pull quotes.',
          },
          {
            title: 'Earned emotion',
            body: 'Let restraint make the emotional moments land harder.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'End On Invitation, Not Explanation',
        body: 'The final move should invite the reader deeper into the journey, stories, or support path.',
        primaryLabel: 'Read the field stories',
        secondaryLabel: 'Follow the journey',
      },
    ],
  },
  {
    slug: 'journey',
    name: 'Journey',
    category: 'Core Journey',
    actualRoute: '/journey',
    description: 'Master journey page for expedition timeline, milestones, and current phase.',
    hero: {
      eyebrow: 'The Journey',
      title: 'A Long Expedition, Clearly Mapped',
      description:
        'This page should be the strategic overview: where the mission began, where it is now, and how each phase leads toward the summit attempt.',
      image: '/images/sunith-everest-vision.png',
      metrics: [
        { label: 'Current Phase', value: 'Build & Recover' },
        { label: 'North Star', value: 'Everest' },
        { label: 'Format', value: 'Narrative roadmap' },
      ],
    },
    sections: [
      {
        type: 'timeline',
        eyebrow: 'Roadmap',
        title: 'The Mission Should Read Like A Sequence',
        body: 'The journey page becomes the master sequence for the full expedition arc.',
        items: [
          {
            label: 'Foundation',
            title: 'Establish the training base',
            body: 'Conditioning, recovery, movement quality, and systems for sustainable load.',
          },
          {
            label: 'Preparation',
            title: 'Build expedition specificity',
            body: 'More altitude-oriented work, more technical detail, and clearer expedition shaping.',
          },
          {
            label: 'Execution',
            title: 'Convert preparation into summit readiness',
            body: 'Decision-making, logistics, support, and the final preparation window.',
          },
        ],
      },
      {
        type: 'grid',
        eyebrow: 'Current State',
        title: 'The Most Important Snapshot',
        body: 'The page should privilege the present, not bury it in history.',
        columns: 3,
        items: [
          {
            title: 'Training',
            body: 'What the body is doing now and what the current block is solving for.',
          },
          {
            title: 'Expeditions',
            body: 'What climb or milestone is next in the ladder toward the main objective.',
          },
          {
            title: 'Support',
            body: 'What resources or partnerships are required to keep the mission moving.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Journey Page Should Route People Intelligently',
        body: 'From here, the reader should naturally choose Training, Expeditions, Stories, or Support.',
        primaryLabel: 'Open expeditions wireframe',
        secondaryLabel: 'Open training wireframe',
      },
    ],
  },
  {
    slug: 'expeditions',
    name: 'Expeditions',
    category: 'Core Journey',
    actualRoute: '/expeditions',
    description: 'Expedition archive and future ladder toward the summit objective.',
    hero: {
      eyebrow: 'Expeditions',
      title: 'The Mountain Ledger',
      description:
        'This page should feel like an archive of objectives: completed climbs, preparation climbs, and the route upward in seriousness.',
      image: '/images/sunith-aconcagua.jpg',
      metrics: [
        { label: 'Scope', value: 'Completed + Planned' },
        { label: 'Focus', value: 'Learning progression' },
        { label: 'Anchor', value: 'Everest ladder' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Structure',
        title: 'A More Museum-Like Presentation',
        body:
          'Each expedition should feel like an artifact: mountain, altitude, objective, lesson, and visual memory.',
        columns: 3,
        items: [
          {
            title: 'Completed climbs',
            body: 'Show what has already been done and what it contributed technically or mentally.',
          },
          {
            title: 'Preparation climbs',
            body: 'Frame intermediary objectives as steps in a deliberate ladder, not random adventures.',
          },
          {
            title: 'Flagship target',
            body: 'Give Everest the gravity of the final destination without overwhelming every other climb.',
          },
        ],
      },
      {
        type: 'timeline',
        eyebrow: 'Ordering',
        title: 'Sort By Meaning, Not Just Date',
        body: 'The timeline should reveal how capability is being built over time.',
        items: [
          {
            label: 'Skill',
            title: 'Technical exposure',
            body: 'Climbs that teach movement, cold management, altitude, or expedition discipline.',
          },
          {
            label: 'Load',
            title: 'Increasing seriousness',
            body: 'Objectives become progressively more consequential in effort and complexity.',
          },
          {
            label: 'Goal',
            title: 'Summit convergence',
            body: 'Each expedition points forward to the eventual Everest attempt.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'Every Expedition Should Link Back To The Larger Journey',
        body: 'Readers should be able to jump from a climb to the broader journey, the training block, or the story archive.',
        primaryLabel: 'Read the journey wireframe',
        secondaryLabel: 'Read story wireframes',
      },
    ],
  },
  {
    slug: 'training',
    name: 'Training',
    category: 'Core Journey',
    actualRoute: '/training',
    description: 'Live training page and weekly mission log surface.',
    hero: {
      eyebrow: 'Training',
      title: 'Live Work, Reduced To Signal',
      description:
        'This wireframe keeps the same philosophy as the live prototype: one weekly report, one session ledger, and one long view of the load.',
      image: '/images/sunith-grit-training.png',
      metrics: [
        { label: 'Primary Source', value: 'Intervals.icu' },
        { label: 'Centerpiece', value: 'Mission log' },
        { label: 'Mode', value: 'Live data' },
      ],
    },
    sections: [
      {
        type: 'narrative',
        eyebrow: 'Prototype Status',
        title: 'This Page Already Has A Dedicated Live Prototype',
        body:
          'The training wireframe is already being developed as a more advanced live route. The broader site system should inherit its restraint, spacing, and sequencing.',
        sideNotes: [
          'Hero: one image, one title, one metric line',
          'Centerpiece: selected week only',
          'No dashboard clutter',
        ],
      },
      {
        type: 'grid',
        eyebrow: 'System Rules',
        title: 'Training Should Inform The Rest Of The Site',
        body: 'This page sets the tone for how data-heavy pages should feel.',
        columns: 3,
        items: [
          {
            title: 'One focal point per viewport',
            body: 'The selected week carries the emotional and informational center.',
          },
          {
            title: 'Telemetry is supporting evidence',
            body: 'Metrics exist to support the narrative, not overwhelm it.',
          },
          {
            title: 'Precision over ornament',
            body: 'The typography and spacing do the heavy lifting.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'Use The Live Prototype As The Benchmark',
        body: 'The final production training page should remain the most resolved expression of the system.',
        primaryLabel: 'Open live training wireframe',
        secondaryLabel: 'Apply this system site-wide',
      },
    ],
  },
  {
    slug: 'stories',
    name: 'Stories',
    category: 'Editorial',
    actualRoute: '/blog',
    description: 'Editorial archive for field reports, essays, and expedition stories.',
    hero: {
      eyebrow: 'Stories',
      title: 'Field Reports, Not Content Cards',
      description:
        'The stories index should feel like a magazine front, not a grid of interchangeable blog tiles.',
      image: '/stories/everest-prep.jpeg',
      metrics: [
        { label: 'Format', value: 'Editorial index' },
        { label: 'Primary Unit', value: 'Featured story' },
        { label: 'Tone', value: 'Quietly premium' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Index Logic',
        title: 'One Featured Story, Then The Archive',
        body: 'The lead story should dominate. The rest should feel secondary but still carefully ordered.',
        columns: 3,
        items: [
          {
            title: 'Featured essay',
            body: 'Large image, strong headline, short deck, and one reason to read now.',
          },
          {
            title: 'Secondary stories',
            body: 'A restrained editorial shelf of the next few reads.',
          },
          {
            title: 'Archive access',
            body: 'Categories and filters should be present but almost invisible.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Reading Paths',
        title: 'Readers Should Be Able To Browse By Intention',
        body: 'The archive can quietly support different ways of entering the story world.',
        items: [
          {
            kicker: 'Preparation',
            title: 'Training and systems',
            body: 'Entries focused on physical preparation, structure, and discipline.',
          },
          {
            kicker: 'Mountain',
            title: 'Expedition and route stories',
            body: 'Entries focused on climbs, weather, risk, and the realities of the objective.',
          },
          {
            kicker: 'Reflection',
            title: 'Personal and psychological writing',
            body: 'Entries that reveal doubt, meaning, and the inner architecture of the mission.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Stories Page Should Make Reading Feel Valuable Again',
        body: 'The archive should reward slow reading, not mimic social feed behavior.',
        primaryLabel: 'Open story-detail wireframe',
        secondaryLabel: 'Open insights wireframe',
      },
    ],
  },
  {
    slug: 'story-detail',
    name: 'Story Detail',
    category: 'Editorial',
    actualRoute: '/blog/[slug]',
    description: 'Template for individual blog posts and long-form essays.',
    hero: {
      eyebrow: 'Story Detail',
      title: 'An Article Page With Breathing Room',
      description:
        'The story detail page should feel like a beautiful reading environment first, and a content page second.',
      image: '/stories/data-training.jpg',
      metrics: [
        { label: 'Priority', value: 'Readability' },
        { label: 'Support', value: 'Quiet metadata' },
        { label: 'Exit Path', value: 'Related stories' },
      ],
    },
    sections: [
      {
        type: 'narrative',
        eyebrow: 'Article Surface',
        title: 'The Headline Needs Space To Mean Something',
        body:
          'Give the title, deck, location, and date their own room. The reader should feel invited into an authored experience, not a compressed CMS template.',
        sideNotes: [
          'Large title block',
          'One strong image',
          'Minimal metadata chrome',
        ],
      },
      {
        type: 'grid',
        eyebrow: 'Reading Enhancements',
        title: 'Only Add What Helps Reading',
        body: 'The article page can carry a few supporting devices, but each one must earn its place.',
        columns: 3,
        items: [
          {
            title: 'Pull quote',
            body: 'One meaningful interruption that adds rhythm to long-form reading.',
          },
          {
            title: 'Field details',
            body: 'Location, elevation, or expedition context surfaced lightly.',
          },
          {
            title: 'Related reading',
            body: 'A small exit path at the end, never interrupting the body.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Reader Should Leave Wanting The Next Story',
        body: 'The end state is not “article completed.” It is deeper trust in the journey and a desire to continue.',
        primaryLabel: 'Back to stories',
        secondaryLabel: 'Read the newsletter wireframe',
      },
    ],
  },
  {
    slug: 'insights',
    name: 'Insights',
    category: 'Editorial',
    actualRoute: '/insights',
    description: 'Analytical page for essays, takeaways, and higher-order interpretations.',
    hero: {
      eyebrow: 'Insights',
      title: 'Interpretation, Not Mere Update',
      description:
        'The insights page should be where observations become ideas: lessons from training, mountains, risk, recovery, and decision-making.',
      image: '/images/sherpa_buddhism_hero_1769137872295.png',
      metrics: [
        { label: 'Mode', value: 'Analysis' },
        { label: 'Cadence', value: 'Selective' },
        { label: 'Intent', value: 'Depth over frequency' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Content Shape',
        title: 'Feature Fewer, Better Essays',
        body: 'This page should prefer fewer strong essays rather than a feed of thin takes.',
        columns: 3,
        items: [
          {
            title: 'Training lessons',
            body: 'What the data and discipline are teaching in public.',
          },
          {
            title: 'Mental models',
            body: 'Ideas about effort, risk, patience, and execution under pressure.',
          },
          {
            title: 'Expedition analysis',
            body: 'How climbs, logistics, and preparation are being understood as a system.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Editorial Rhythm',
        title: 'How The Page Should Flow',
        body: 'One featured essay, one category strip, and a compact archive beneath it is enough.',
        items: [
          {
            title: 'Featured essay with depth',
            body: 'Open with the single strongest idea on the page.',
          },
          {
            title: 'Category shelf',
            body: 'Show the main analytical lenses without turning them into pills everywhere.',
          },
          {
            title: 'Archive list',
            body: 'A clean descending list of past essays with short explanatory decks.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Page Should Reward Thoughtfulness',
        body: 'Insights should become one of the strongest trust-building pages on the site.',
        primaryLabel: 'Read the stories wireframe',
        secondaryLabel: 'Open newsletter wireframe',
      },
    ],
  },
  {
    slug: 'newsletter',
    name: 'Newsletter',
    category: 'Editorial',
    actualRoute: '/newsletter',
    description: 'Subscription page and archive for ongoing updates.',
    hero: {
      eyebrow: 'Newsletter',
      title: 'A Newsletter Worth Inviting Into The Inbox',
      description:
        'This page should make the newsletter feel measured, premium, and useful. Less growth copy, more signal about what arrives and why.',
      image: '/images/mani_stones_1769137905030.png',
      metrics: [
        { label: 'Promise', value: 'Signal over noise' },
        { label: 'Cadence', value: 'Intentional' },
        { label: 'Content', value: 'Updates + ideas' },
      ],
    },
    sections: [
      {
        type: 'narrative',
        eyebrow: 'Subscription Logic',
        title: 'The Ask Should Feel Earned',
        body:
          'Lead with the editorial promise, then show one or two archive examples. Make the subscription form feel like the final decision, not the entire page.',
        metrics: [
          { label: 'Input Count', value: 'Minimal' },
          { label: 'Proof', value: 'Archive excerpts' },
          { label: 'Tone', value: 'Quiet confidence' },
        ],
      },
      {
        type: 'grid',
        eyebrow: 'What Subscribers Receive',
        title: 'Three Reasons To Subscribe',
        body: 'State the cadence and the value with discipline.',
        columns: 3,
        items: [
          {
            title: 'Current chapter updates',
            body: 'Short, exact notes on where the expedition stands right now.',
          },
          {
            title: 'Training and preparation thinking',
            body: 'Selected lessons from the work, not every datapoint.',
          },
          {
            title: 'Stories worth reading',
            body: 'A guided path to the most meaningful essays and field reports.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Newsletter Page Should Feel Like Editorial Trust',
        body: 'Make the subscription feel like a deliberate choice to stay close to the mission.',
        primaryLabel: 'Join the newsletter',
        secondaryLabel: 'Browse the archive',
      },
    ],
  },
  {
    slug: 'connect',
    name: 'Connect',
    category: 'Community',
    actualRoute: '/connect',
    description: 'Contact page for outreach, collaboration, and communication channels.',
    hero: {
      eyebrow: 'Connect',
      title: 'One Quiet Place To Reach Out',
      description:
        'The connect page should feel like a well-composed contact desk: channels, expectations, and the right reasons to make contact.',
      image: '/images/logo-wallpaper-8k.png',
      metrics: [
        { label: 'Purpose', value: 'Direct communication' },
        { label: 'Inputs', value: 'Minimal' },
        { label: 'Trust', value: 'Response expectations' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Channels',
        title: 'Every Path Needs A Distinct Purpose',
        body: 'Do not present every channel as interchangeable.',
        columns: 3,
        items: [
          {
            title: 'Media and partnerships',
            body: 'For sponsorships, interviews, media requests, and serious collaborations.',
          },
          {
            title: 'Community and speaking',
            body: 'For events, discussions, public conversations, and thoughtful outreach.',
          },
          {
            title: 'General contact',
            body: 'For readers, supporters, and direct personal questions.',
          },
        ],
      },
      {
        type: 'narrative',
        eyebrow: 'UX Rule',
        title: 'Contact Forms Should Not Feel Administrative',
        body:
          'Reduce fields, make expectations explicit, and keep the interface from looking like a support desk from generic SaaS software.',
        sideNotes: [
          'Channel selection first',
          'One elegant form surface',
          'Expected response window visible',
        ],
      },
      {
        type: 'cta',
        title: 'One Form, Three Intentions',
        body: 'The page should help people make better contact decisions before they type.',
        primaryLabel: 'Start a conversation',
        secondaryLabel: 'Open media kit wireframe',
      },
    ],
  },
  {
    slug: 'speaking',
    name: 'Speaking',
    category: 'Community',
    actualRoute: '/speaking',
    description: 'Speaking and appearances page for talks, panels, and events.',
    hero: {
      eyebrow: 'Speaking',
      title: 'Ideas Shaped By Real Preparation',
      description:
        'The speaking page should sell substance and perspective, not just availability. It should feel premium, exact, and credible.',
      image: '/images/sunith-ascent-hero.png',
      metrics: [
        { label: 'Formats', value: 'Talks, panels, firesides' },
        { label: 'Themes', value: 'Preparation, risk, resilience' },
        { label: 'Action', value: 'Invite with clarity' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Topics',
        title: 'A Smaller, Stronger Topic Set',
        body: 'Three or four talk themes are enough if they are sharply framed.',
        columns: 3,
        items: [
          {
            title: 'Preparation as identity',
            body: 'How long-term goals change the way a life is structured.',
          },
          {
            title: 'Risk without mythology',
            body: 'How to think clearly about ambition, uncertainty, and consequences.',
          },
          {
            title: 'Resilience through systems',
            body: 'Why disciplined systems matter more than intensity alone.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Booking UX',
        title: 'Make Event Selection Frictionless',
        body: 'The page should make it easy for organizers to know fit, format, and next step.',
        items: [
          {
            title: 'Event formats',
            body: 'Keynote, fireside, panel, workshop, or private team session.',
          },
          {
            title: 'Audience fit',
            body: 'Leadership, students, adventure communities, or high-performance teams.',
          },
          {
            title: 'Inquiry path',
            body: 'A clean, purpose-built request form with response expectations.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Page Should Convey Taste As Much As Capability',
        body: 'Speaking should feel like a considered offering, not a generic booking page.',
        primaryLabel: 'Request a speaking inquiry',
        secondaryLabel: 'Open partnerships wireframe',
      },
    ],
  },
  {
    slug: 'partnerships',
    name: 'Partnerships',
    category: 'Partnerships',
    actualRoute: '/partnerships',
    description: 'Brand partnership page for fit, audience, and collaboration model.',
    hero: {
      eyebrow: 'Partnerships',
      title: 'A Brand Partnership Surface With Taste',
      description:
        'The partnerships page should make fit obvious: audience, creative value, strategic relevance, and the level of care in how partner work will be represented.',
      image: '/images/sunith-partnerships-hero.jpg',
      metrics: [
        { label: 'Audience', value: 'Adventure + high intent' },
        { label: 'Value', value: 'Credibility + story' },
        { label: 'Mode', value: 'Selective collaboration' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Brand Fit',
        title: 'Make Alignment Legible In Seconds',
        body: 'This page should help a serious brand understand relevance almost immediately.',
        columns: 3,
        items: [
          {
            title: 'Authentic mission',
            body: 'The expedition is real, the effort is visible, and the documentation is ongoing.',
          },
          {
            title: 'Premium storytelling',
            body: 'The page should signal careful aesthetics and editorial value, not just audience size.',
          },
          {
            title: 'Distinct positioning',
            body: 'This is preparation, endurance, and narrative depth, not generic influencer placement.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Offer Structure',
        title: 'How Partnerships Should Be Framed',
        body: 'Less “packages,” more carefully structured collaboration types.',
        items: [
          {
            kicker: 'Support',
            title: 'Equipment and expedition support',
            body: 'Brands that improve capability, safety, recovery, or execution.',
          },
          {
            kicker: 'Story',
            title: 'Editorial and content collaboration',
            body: 'Brands that want premium storytelling around preparation and purpose.',
          },
          {
            kicker: 'Presence',
            title: 'Events, experiences, and appearances',
            body: 'Brands that want the mission represented in person or in conversation.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'This Page Should Feel Selective',
        body: 'The right brand should feel invited. The wrong brand should self-select out.',
        primaryLabel: 'Start a partnership conversation',
        secondaryLabel: 'Open media kit wireframe',
      },
    ],
  },
  {
    slug: 'sponsorship',
    name: 'Sponsorship',
    category: 'Partnerships',
    actualRoute: '/sponsorship',
    description: 'Sponsorship page focused on contribution models and partnership tiers.',
    hero: {
      eyebrow: 'Sponsorship',
      title: 'Support Framed As Strategic Enablement',
      description:
        'The sponsorship page should explain what support unlocks, how it is recognized, and why the mission is a worthy vehicle for partnership.',
      image: '/images/sunith-support-hero-landscape.png',
      metrics: [
        { label: 'Focus', value: 'Enablement' },
        { label: 'Recognition', value: 'Intentional' },
        { label: 'Trust', value: 'Transparent use' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Funding Logic',
        title: 'Map Support To Real Expedition Needs',
        body: 'Support becomes tangible when it is tied to preparation, logistics, safety, and documentation.',
        columns: 3,
        items: [
          {
            title: 'Training and recovery',
            body: 'Support that directly improves physical readiness and resilience.',
          },
          {
            title: 'Expedition logistics',
            body: 'Travel, altitude preparation, gear, permits, and specialist support.',
          },
          {
            title: 'Documentation',
            body: 'Storytelling, visual production, and public communication around the mission.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Recognition',
        title: 'Acknowledgement Should Stay Premium',
        body: 'Recognition should be visible, elegant, and limited in quantity.',
        items: [
          {
            title: 'Primary mission partners',
            body: 'A small number of deeply integrated supporters with premium visibility.',
          },
          {
            title: 'Supporting partners',
            body: 'Smaller but clearly defined roles tied to specific mission needs.',
          },
          {
            title: 'Legacy archive',
            body: 'Partnership recognition that remains visible in the journey archive over time.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'Make Sponsorship Feel Serious',
        body: 'The right sponsor should leave this page understanding both the ambition and the care behind the mission.',
        primaryLabel: 'Review partnership options',
        secondaryLabel: 'Open support wireframe',
      },
    ],
  },
  {
    slug: 'media-kit',
    name: 'Media Kit',
    category: 'Partnerships',
    actualRoute: '/media-kit',
    description: 'Media kit and press page for assets, facts, and press angles.',
    hero: {
      eyebrow: 'Media Kit',
      title: 'Everything The Press Needs, Elegantly Packed',
      description:
        'This page should compress the mission into a clean press-ready format: bio, facts, approved imagery, and story angles.',
      image: '/images/sunith-ascent-hero.png',
      metrics: [
        { label: 'Primary Use', value: 'Press & media' },
        { label: 'Outputs', value: 'Facts + assets' },
        { label: 'Tone', value: 'Exact and concise' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Contents',
        title: 'The Kit Should Feel Self-Contained',
        body: 'One page should contain enough context for a journalist or partner to work quickly.',
        columns: 3,
        items: [
          {
            title: 'Short and long bios',
            body: 'Two approved biography lengths with consistent positioning.',
          },
          {
            title: 'Mission facts',
            body: 'Current objective, expedition framing, and relevant background details.',
          },
          {
            title: 'Visual assets',
            body: 'A small, premium selection of downloadable imagery and logos.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Press Angles',
        title: 'What Makes The Story Useful To Media',
        body: 'Help the press find the angle quickly rather than making them infer it.',
        items: [
          {
            title: 'Long-form preparation story',
            body: 'The slow work behind a serious expedition objective.',
          },
          {
            title: 'Human performance lens',
            body: 'Training, resilience, recovery, and preparation under pressure.',
          },
          {
            title: 'Purpose and documentation',
            body: 'Public storytelling as a deliberate part of the mission.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'This Page Should Feel Like A Press Folder Reimagined',
        body: 'Fast, useful, premium, and almost frictionless.',
        primaryLabel: 'Download media assets',
        secondaryLabel: 'Open connect wireframe',
      },
    ],
  },
  {
    slug: 'support',
    name: 'Support',
    category: 'Partnerships',
    actualRoute: '/support',
    description: 'Support and transparency page for funding, costs, and ways to contribute.',
    hero: {
      eyebrow: 'Support',
      title: 'Transparency Before Request',
      description:
        'The support page should lead with honesty: what the expedition costs, what support enables, and why contribution matters.',
      image: '/images/sunith-support-hero.png',
      metrics: [
        { label: 'Priority', value: 'Transparency' },
        { label: 'Ask', value: 'Clear but tasteful' },
        { label: 'Trust Device', value: 'Cost visibility' },
      ],
    },
    sections: [
      {
        type: 'narrative',
        eyebrow: 'Trust',
        title: 'Explain The Economics Before The Ask',
        body:
          'This page should build confidence through clear explanation of costs, constraints, and exactly what forms of support help.',
        metrics: [
          { label: 'Cost Lens', value: 'Visible' },
          { label: 'Contribution Paths', value: 'Few but clear' },
          { label: 'Tone', value: 'Honest, never pleading' },
        ],
      },
      {
        type: 'grid',
        eyebrow: 'Contribution Paths',
        title: 'Keep The Options Limited And Understandable',
        body: 'Support should feel legible immediately.',
        columns: 3,
        items: [
          {
            title: 'Direct contribution',
            body: 'A clean path for individuals who want to back the mission.',
          },
          {
            title: 'Specific cost sponsorship',
            body: 'Support tied to gear, training, travel, or expedition categories.',
          },
          {
            title: 'Strategic partnership',
            body: 'A more serious route for brands or high-conviction supporters.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Support Page Should Feel Grounded',
        body: 'The ideal response is confidence: this mission is ambitious, thoughtful, and worth backing.',
        primaryLabel: 'Support the journey',
        secondaryLabel: 'Open sponsorship wireframe',
      },
    ],
  },
  {
    slug: 'realtime',
    name: 'Realtime',
    category: 'Live Systems',
    actualRoute: '/realtime',
    description: 'Live systems page for telemetry, AI interpretation, and current status.',
    hero: {
      eyebrow: 'Realtime',
      title: 'A Live Surface That Still Feels Calm',
      description:
        'Realtime should not look like a monitoring dashboard. It should feel like a controlled instrument panel with one clear hierarchy.',
      image: '/images/sunith-grit-training.png',
      metrics: [
        { label: 'Nature', value: 'Live surface' },
        { label: 'Priority', value: 'Current status' },
        { label: 'Constraint', value: 'No monitoring clutter' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Display Rules',
        title: 'Live Data Needs Strong Reduction',
        body: 'Without restraint, this page will become noise.',
        columns: 3,
        items: [
          {
            title: 'One top-level status',
            body: 'A single current-state headline must dominate the page.',
          },
          {
            title: 'Grouped signals',
            body: 'Training, wellness, and interpretation should live in separate calm bands.',
          },
          {
            title: 'Context over raw metrics',
            body: 'Always state what a signal means, not just the number itself.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Page Flow',
        title: 'Three Layers Are Enough',
        body: 'The page can resolve into status, short-term trend, and AI interpretation.',
        items: [
          {
            title: 'Current status',
            body: 'What is happening now and whether the feed is trustworthy.',
          },
          {
            title: 'Recent pattern',
            body: 'A short view of load, recovery, and any notable shifts.',
          },
          {
            title: 'Interpretation',
            body: 'What the system believes deserves attention next.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'Realtime Should Be Legible In Seconds',
        body: 'This page succeeds when a visitor understands the current state almost instantly.',
        primaryLabel: 'Open training wireframe',
        secondaryLabel: 'Open AI search wireframe',
      },
    ],
  },
  {
    slug: 'ai-search',
    name: 'AI Search',
    category: 'Live Systems',
    actualRoute: '/ai-search',
    description: 'AI-assisted query surface for site knowledge and expedition context.',
    hero: {
      eyebrow: 'AI Search',
      title: 'A Search Experience That Feels Trustworthy',
      description:
        'This page should feel more like a premium research console than a chatbot. Search, answer, and citation need a clear hierarchy.',
      image: '/images/climber_perspective_1769137922664.png',
      metrics: [
        { label: 'Input', value: 'Question first' },
        { label: 'Output', value: 'Answered with sources' },
        { label: 'Design Goal', value: 'Trust over novelty' },
      ],
    },
    sections: [
      {
        type: 'grid',
        eyebrow: 'Interface',
        title: 'The Page Should Open With One Search Surface',
        body: 'Keep the top interaction singular and confident.',
        columns: 3,
        items: [
          {
            title: 'One central prompt',
            body: 'A large, beautifully spaced question field without extra controls competing for attention.',
          },
          {
            title: 'Suggested questions',
            body: 'A few high-quality entry points that clarify the product’s scope.',
          },
          {
            title: 'Source expectation',
            body: 'Signal clearly that answers are grounded in expedition content and data.',
          },
        ],
      },
      {
        type: 'list',
        eyebrow: 'Answer Design',
        title: 'Responses Need A Premium Reading Rhythm',
        body: 'A good answer page feels like a brief, not a chat dump.',
        items: [
          {
            title: 'Short direct answer',
            body: 'Open with the best distilled response.',
          },
          {
            title: 'Supporting evidence',
            body: 'A second layer that explains the reasoning or the supporting data.',
          },
          {
            title: 'Citations and next links',
            body: 'A final layer that opens the underlying source material.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'Search Should Feel Calmly Intelligent',
        body: 'The design should lower anxiety, not amplify it.',
        primaryLabel: 'Ask a question',
        secondaryLabel: 'Open stories wireframe',
      },
    ],
  },
  {
    slug: 'privacy',
    name: 'Privacy',
    category: 'Legal',
    actualRoute: '/privacy',
    description: 'Minimal legal layout for privacy disclosures.',
    hero: {
      eyebrow: 'Privacy',
      title: 'Legal Pages Can Still Feel Considered',
      description:
        'Privacy should read like a calm document: clear sections, plain language framing, and no design noise.',
      image: '/images/logo-transparent.png',
      metrics: [
        { label: 'Mode', value: 'Document' },
        { label: 'Priority', value: 'Clarity' },
        { label: 'Tone', value: 'Direct' },
      ],
    },
    sections: [
      {
        type: 'legal',
        eyebrow: 'Document Structure',
        title: 'A Simple, Readable Legal Layout',
        body: 'Legal pages should use typography and spacing, not interface tricks.',
        items: [
          {
            title: 'What is collected',
            body: 'A straightforward explanation of information collected through the site or connected tools.',
          },
          {
            title: 'How it is used',
            body: 'A plain-language summary of the operational reasons data is processed.',
          },
          {
            title: 'Rights and contact',
            body: 'How a visitor can ask questions, request changes, or understand their choices.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'The Document Should Feel Trustworthy',
        body: 'Even legal reading becomes better when the interface is calm and exact.',
        primaryLabel: 'Open terms wireframe',
        secondaryLabel: 'Open connect wireframe',
      },
    ],
  },
  {
    slug: 'terms',
    name: 'Terms',
    category: 'Legal',
    actualRoute: '/terms',
    description: 'Minimal legal layout for terms, conditions, and use expectations.',
    hero: {
      eyebrow: 'Terms',
      title: 'Conditions Of Use, Reduced To Clarity',
      description:
        'Terms should feel like a well-composed reference page with almost no visual drama and excellent reading rhythm.',
      image: '/images/logo-v2.png',
      metrics: [
        { label: 'Mode', value: 'Reference document' },
        { label: 'Priority', value: 'Readability' },
        { label: 'Design Rule', value: 'No ornament' },
      ],
    },
    sections: [
      {
        type: 'legal',
        eyebrow: 'Document Structure',
        title: 'Keep The Hierarchy Obvious',
        body: 'The terms page needs only disciplined typographic structure and good spacing.',
        items: [
          {
            title: 'Use of the site',
            body: 'What the site is for, what expectations apply, and how content is meant to be consumed.',
          },
          {
            title: 'Ownership and rights',
            body: 'How content, media, and brand materials may or may not be reused.',
          },
          {
            title: 'Limits and liability',
            body: 'Where the site’s responsibility ends and what disclaimers are relevant.',
          },
        ],
      },
      {
        type: 'cta',
        title: 'Legal Does Not Need To Feel Neglected',
        body: 'The same system can make even utilitarian reading feel clean and intentional.',
        primaryLabel: 'Back to wireframe gallery',
        secondaryLabel: 'Open privacy wireframe',
      },
    ],
  },
];

export const siteWireframesBySlug = Object.fromEntries(
  siteWireframes.map((page) => [page.slug, page])
) as Record<string, WireframePageDefinition>;

export const siteWireframeCategories = [
  'Core Journey',
  'Editorial',
  'Community',
  'Partnerships',
  'Live Systems',
  'Legal',
] as const;
