import type { ToolDef } from "../types";

export const generatorTools: ToolDef[] = [
  // ---------------------------------------------------------------- tattoo-generator
  {
    slug: "tattoo-generator",
    name: "AI Tattoo Generator",
    blurb: "Describe an idea, pick a style, and get tattoo concepts to take to your artist.",
    category: "generators",
    kind: "ai",
    preset: {
      chips: [
        "A wolf howling at a crescent moon",
        "Lotus flower opening over still water",
        "Compass rose with a small anchor",
        "Snake coiled around a dagger",
        "Mountain range with a rising sun",
        "Minimal hummingbird in flight",
      ],
    },
    metaTitle: "AI Tattoo Generator – Design Your Tattoo Online",
    metaDescription:
      "Describe your idea, choose a style, placement and color, and our AI tattoo generator drafts concepts you can refine and bring to a professional artist.",
    h1: "AI Tattoo Generator: Turn an Idea Into a Design",
    intro: [
      "This AI tattoo generator turns a plain-language description into a tattoo concept you can actually look at. Type what you have in mind, choose a style, a body placement, a size and a color mode, and the generator drafts a design built around those choices instead of a generic stock picture.",
      "It is made for people who can picture a tattoo but cannot draw it, and for anyone who wants something concrete to show an artist. Treat every result as a starting concept: a way to explore composition, subject and style before you book a consultation with a licensed professional.",
    ],
    steps: [
      { title: "Describe the tattoo", body: "Write the subject in a sentence or two, such as a stag with antlers made of branches. Specific nouns beat vague moods, and you can tap an idea chip if you want a starting point." },
      { title: "Choose style, placement and size", body: "Pick a style like fine line, traditional or geometric, then the body area and rough size. Placement shapes the composition, so a wrist piece is drawn narrow and a back piece is drawn tall." },
      { title: "Set black and white or color", body: "Black and white gives the cleanest stencil-like result. Black and grey adds shading, and color mode uses a full ink palette." },
      { title: "Generate, compare, refine", body: "Create a design, then adjust one thing at a time: the wording, the style or the size. Save the versions you like and show them to your artist." },
    ],
    features: [
      { title: "Tattoo-specific prompting", body: "Your choices are translated into instructions written for tattoo art, so linework, contrast and composition read like tattoo flash rather than a painting." },
      { title: "Placement-aware layouts", body: "The generator adapts proportions to the body area you select, which helps you judge whether an idea works as a slim forearm piece or a wide chest design." },
      { title: "14 tattoo styles", body: "From minimalist and fine line to blackwork, Japanese, dotwork and realism, each style comes with its own visual rules built in." },
      { title: "Iterate without starting over", body: "Change one setting at a time to see what actually improves the design, then keep the version that feels right." },
      { title: "Made to be shown to an artist", body: "Designs are concepts and reference material. A good artist will redraw and adapt them to your body and their own technique." },
    ],
    examples: [
      { title: "A first tattoo you cannot put into words", body: "Start with a single subject you love, such as a fern or a paper crane, generate it in a light style, and see whether it still feels right after a few days." },
      { title: "Reference for your consultation", body: "Bring three generated variations to a consultation to show the mood you want, then let the artist propose how to draw it properly." },
      { title: "Comparing styles side by side", body: "Generate the same bear in minimalist, traditional and geometric styles to find the look that matches your taste." },
      { title: "Testing a concept for a specific spot", body: "Generate an idea for your ribs, then again for your forearm, to see how the composition changes with the shape of the area." },
    ],
    tips: [
      "Lead with the subject, then add one or two details. Long lists of elements tend to produce cluttered results.",
      "Say what you want to avoid, such as no shading or no text, when the first attempt is too busy.",
      "Pick the placement before you fall in love with a design, since size and shape change what is possible.",
      "Generate several versions and wait a few days before deciding. Ideas that still excite you later are usually the keepers.",
      "Bring more than one design to your artist. Variations show what you like better than any description does.",
      "Expect your artist to redraw the design. Their edits are what make it work on skin.",
    ],
    info: {
      heading: "What to do with a generated design",
      paragraphs: [
        "A generated image is a reference, not a stencil. Tattoo artists adjust line weight, spacing and detail so the design suits your body, the area and their own way of working. Showing up with a clear idea makes that conversation faster and better.",
        "If you want to explore before generating, the [tattoo idea generator](/tattoo-idea-generator) offers starting themes, and the [placement guide](/tattoo-placement-guide) explains how body area affects what works. For a tighter brief on a single concept, try the [tattoo design generator](/tattoo-design-generator). This is general information, not professional advice; a licensed tattoo artist should make the final call.",
      ],
    },
    faq: [
      { q: "How does the AI tattoo generator work?", a: "You describe a subject, choose a style, placement, size and color mode, and the tool builds a tattoo-focused prompt from those choices. An image model then creates a concept based on it." },
      { q: "Can I get the exact design tattooed as generated?", a: "Treat it as a concept. Artists normally redraw a design so it fits your body, the placement and their technique, and they may simplify details that will not work at the size you want." },
      { q: "Is this different from the homepage generator?", a: "It is the same core technology, presented as a full AI tattoo generator guide. The homepage is a quick free start, while this page explains styles, placement and how to use the results." },
      { q: "Do I need to be able to draw?", a: "No. You only need to describe the idea in words. The generator handles the drawing, and you refine by changing your description or settings." },
      { q: "Which style should I pick if I am unsure?", a: "Fine line and minimalist tend to be forgiving for first ideas, while traditional and blackwork are bold and graphic. Try the same idea in two or three styles and compare." },
      { q: "Does the generator replace a tattoo artist?", a: "No. It helps you explore and communicate an idea. Design, stencil, placement and the tattooing itself belong with a licensed professional." },
    ],
    related: ["tattoo-idea-generator", "tattoo-design-generator", "tattoo-placement-guide", "tattoo-size-calculator"],
    articles: ["custom-tattoo-design-ideas", "first-tattoo-ideas"],
    cta: {
      heading: "Start with one idea",
      body: "Describe the tattoo you keep picturing and see it as a design in a few moments. Save your favorites and bring them to your artist.",
    },
  },

  // ---------------------------------------------------------------- tattoo-idea-generator
  {
    slug: "tattoo-idea-generator",
    name: "Tattoo Idea Generator",
    blurb: "Stuck on what to get? Tap an idea starter and see it as a design.",
    category: "generators",
    kind: "ai",
    preset: {
      size: "medium",
      chips: [
        "A fern unfurling with tiny stars",
        "Owl perched on a crescent moon",
        "Mountains reflected in a lake",
        "Koi fish swimming upstream",
        "Sun and moon face to face",
        "Wildflower bouquet tied with ribbon",
        "Constellation linked by fine lines",
        "Fox curled around a full moon",
        "Wave rolling into a small sun",
        "Open book with a blooming vine",
      ],
    },
    metaTitle: "Tattoo Idea Generator – Find Your Next Tattoo Idea",
    metaDescription:
      "Not sure what to get? Tap an idea starter across nature, animals, symbols and celestial themes, then see it drawn as a tattoo design you can refine.",
    h1: "Tattoo Idea Generator for When You Don't Know What to Get",
    intro: [
      "Plenty of people know they want a tattoo long before they know which one. This tattoo idea generator is built for that stage. Instead of asking you for a finished concept, it hands you starting points across nature, animals, celestial imagery, symbols and florals, then draws the ones you pick.",
      "Tap a starter, change a word or two, and see it as a design in the style you choose. It is a fast way to find out what you are drawn to, and the results give you something concrete to talk through with an artist.",
    ],
    steps: [
      { title: "Browse the idea starters", body: "Scan the chips and notice which ones you react to. A quick yes or no in your gut tells you more than a long list of pros and cons." },
      { title: "Tap one to fill the prompt", body: "The chip drops a ready-made sentence into the prompt box. Edit it freely: swap the animal, add a detail or remove an element." },
      { title: "Pick a style and placement", body: "The same idea feels different as a delicate fine-line piece than as a bold traditional one. Try a couple of styles and a placement you have in mind." },
      { title: "Generate and shortlist", body: "Create the design, keep the ones that stick, and discard the rest. After a few rounds patterns show up in what you choose." },
    ],
    features: [
      { title: "Ten varied starters", body: "Chips span landscapes, animals, celestial motifs, florals and symbols, so you are not stuck in one lane." },
      { title: "Editable, not locked", body: "Every idea is a sentence you can rewrite, which makes it a springboard rather than a template." },
      { title: "See it, not just read it", body: "Words like owl and moon sound fine until you see the composition. Visualizing quickly saves you from ideas that only work on paper." },
      { title: "Style switching", body: "Draw the same concept as minimalist, dotwork or Japanese-inspired and let the look guide the decision." },
    ],
    examples: [
      { title: "Discovering a theme", body: "After generating a fox, a wolf and a stag, you might realize you keep choosing forest animals and can build a small set from there." },
      { title: "Narrowing a shortlist", body: "You have three ideas from friends and Pinterest boards. Generate all three in the same style to compare them fairly." },
      { title: "Finding a personal twist", body: "Start from the fern-and-stars starter and swap the fern for a plant tied to a memory, such as your grandmother's garden." },
      { title: "Getting unstuck on a gift idea", body: "Use starters to design a concept for a partner or friend who has been asking for a tattoo idea suggestion." },
    ],
    tips: [
      "Choose ideas that mean something to you, not only ones that look good. Meaning is what keeps a tattoo feeling right over time.",
      "If two starters appeal, combine them into one sentence and see whether they coexist.",
      "Generate in a simple style first. If the idea works with few lines, it can be developed further later.",
      "Keep a shortlist of three, sleep on it, and check which one you still like.",
      "Search your own life for subjects: places, animals you have known, objects you keep.",
    ],
    info: {
      heading: "How to choose between ideas",
      paragraphs: [
        "A useful test is to imagine the design in five years and ask whether it still feels like you. Subjects tied to your own history or values usually pass that test more often than trending motifs.",
        "For more curated inspiration, the articles on [first tattoo ideas](/blog/first-tattoo-ideas) and [small tattoo ideas](/blog/small-tattoo-ideas) go deeper. When you settle on something, refine it in the [tattoo design generator](/tattoo-design-generator). Generated art is inspiration, and any final design should be worked out with a licensed tattoo artist.",
      ],
    },
    faq: [
      { q: "What if none of the starters fit me?", a: "Use them as models. Replace the subject with something from your life, like a place, a pet or a plant, and keep the sentence structure." },
      { q: "Are the ideas unique?", a: "The starters are common themes, but what you generate depends on your edits, style and settings. Adding a personal detail makes a design distinct." },
      { q: "How many ideas should I try before deciding?", a: "There is no set number. Many people find that after six to ten designs, a few favorites keep coming back." },
      { q: "Can I use this if I want something small?", a: "Yes. Choose the small size option and a simple style like minimalist or fine line so the design stays clear at a few inches." },
      { q: "Do I need an account to see ideas?", a: "Browsing the idea starters is open to everyone. Generating a design uses credits, so check the pricing page for what is included with a free account." },
      { q: "Should I copy a generated idea exactly?", a: "Use it as a reference. Your artist can reshape it to fit your body and their style, and can help you avoid designs that clash with existing work." },
    ],
    related: ["tattoo-generator", "tattoo-design-generator", "couple-tattoo-generator", "zodiac-tattoo-generator"],
    articles: ["first-tattoo-ideas", "small-tattoo-ideas"],
    cta: {
      heading: "Find the idea that clicks",
      body: "Tap a starter, pick a style and see it drawn. A few minutes of exploring is often enough to know what you want.",
    },
  },

  // ---------------------------------------------------------------- tattoo-design-generator
  {
    slug: "tattoo-design-generator",
    name: "Tattoo Design Generator",
    blurb: "Turn a specific concept into a clean, artist-ready tattoo design.",
    category: "generators",
    kind: "ai",
    preset: {
      color: "black-white",
      size: "medium",
      chips: [
        "Koi fish with a lotus, clean bold outline, no shading",
        "Snake and peony, balanced composition, high contrast",
        "Dagger with a rose, symmetrical, crisp linework",
        "Crescent moon with a hand-drawn sun, simple shapes",
        "Bird in flight breaking into small dots, light detail",
      ],
    },
    metaTitle: "Tattoo Design Generator – Clean, Artist-Ready Art",
    metaDescription:
      "Already have a concept? Use the tattoo design generator to turn it into a clean, high-contrast design with clear linework you can hand to your artist.",
    h1: "Tattoo Design Generator for Artist-Ready Concepts",
    intro: [
      "This tattoo design generator is for the moment when you already know what you want and need it to look like a real design. It leans toward clear outlines, strong contrast and a composition that reads at a glance, which is what an artist wants to see in a reference.",
      "Give it a specific concept, be direct about the details you care about, and refine over a few rounds. The goal is a clean piece of reference art, not a final stencil, so you can walk into a consultation with a clear visual brief.",
    ],
    steps: [
      { title: "Write the concept as a design brief", body: "Name the subject, the arrangement and the details that matter, for example a koi fish curving under a lotus, outline only. Include what to leave out." },
      { title: "Keep it black and white first", body: "The default here is black on white, which shows the structure of a design without shading or color hiding weak spots." },
      { title: "Set placement and size", body: "Choose the body area and a size that matches the detail level of your concept. Complex pieces need room to breathe." },
      { title: "Refine one thing at a time", body: "Tighten the outline, simplify the background or change the pose. Small changes between rounds make it clear what improved the result." },
    ],
    features: [
      { title: "Bold, legible structure", body: "The starting settings favor clear line weight and contrast, the qualities that make a design easy for an artist to interpret." },
      { title: "Brief-style prompts", body: "Chips are written like short design briefs with instructions on outline, shading and symmetry, which you can adapt to your own concept." },
      { title: "Placement-aware proportions", body: "Designs adapt to the area you pick, so a slim forearm concept is not just a square image cropped." },
      { title: "Easy to compare", body: "Because you keep style and color fixed while adjusting the concept, side-by-side comparisons stay meaningful." },
    ],
    examples: [
      { title: "A symmetrical chest piece", body: "Describe a winged emblem with mirrored feathers and get a balanced composition to discuss with your artist." },
      { title: "A memorial concept", body: "Turn a specific plant, date or symbol into a simple, respectful design before deciding on placement." },
      { title: "A revision of an older idea", body: "Take a rough sketch idea, describe its structure in words and see a cleaner version to compare with your original." },
      { title: "A reference for a custom commission", body: "Provide clear reference art when contacting an artist who does custom work, so they know your taste before the first sketch." },
    ],
    tips: [
      "Describe the outline first and the details second. Artists design from structure outward.",
      "Ask for no background or a plain background so the tattoo shape stands alone.",
      "Limit yourself to one focal subject and one or two supporting elements.",
      "If small text or tiny details appear, regenerate at a larger size setting and ask your artist what will hold up.",
      "Keep the version you did not pick. Rejected designs still teach you what you like.",
      "Ask your artist to mark up the design directly. Their edits are the real design stage.",
    ],
    info: {
      heading: "From reference art to a finished tattoo",
      paragraphs: [
        "Reference art works best when it shows your intent rather than fixed details. A good artist will keep the idea and rebuild the drawing so the linework suits skin, the placement and the size.",
        "If you are still deciding on the concept itself, start with the [tattoo idea generator](/tattoo-idea-generator). If a design will be lettering-heavy, the [tattoo lettering generator](/tattoo-lettering-generator) previews type styles, and the [stencil maker](/tattoo-stencil-maker) helps prepare a reference to share. This tool offers concepts and general information, and a licensed tattoo artist should finalize any design.",
      ],
    },
    faq: [
      { q: "How is this different from the main AI tattoo generator?", a: "The main page is open-ended. This one is tuned for turning a specific concept into a clean, high-contrast design, with prompts written like design briefs." },
      { q: "Will the result work as a stencil?", a: "It is meant as reference art. A stencil is prepared by the artist, who adjusts line weight and layout for your body and placement." },
      { q: "Why does black and white matter?", a: "Without shading or color, weak composition shows up quickly. It is an honest way to judge whether a design is strong before adding tone." },
      { q: "Can I include text in the design?", a: "You can, but generated lettering is often imperfect. Use the lettering tools to plan type, and let your artist set the final text." },
      { q: "How detailed can my brief be?", a: "A few clear details work best. Extremely long briefs tend to produce crowded designs, so simplify and add detail gradually." },
      { q: "Are the designs ready to tattoo as they are?", a: "No. They are concepts to bring to a licensed artist, who will adapt them for your body and technique." },
    ],
    related: ["tattoo-generator", "tattoo-idea-generator", "tattoo-stencil-maker", "tattoo-lettering-generator"],
    articles: ["custom-tattoo-design-ideas", "tattoo-lettering-styles-explained"],
    cta: {
      heading: "Give your concept a clean design",
      body: "Write the brief, keep it simple and generate a few versions. Bring the best one to your artist as a clear starting point.",
    },
  },

  // ---------------------------------------------------------------- tattoo-name-generator
  {
    slug: "tattoo-name-generator",
    name: "Tattoo Name Generator",
    blurb: "Preview a name in tattoo lettering with symbol, layout and size ideas.",
    category: "generators",
    kind: "name",
    preset: { text: "Ava", fontStyle: "script", placement: "forearm" },
    metaTitle: "Tattoo Name Generator – Name Lettering Concepts",
    metaDescription:
      "Type a name, pick a font, symbol and placement, and get layout concepts with size guidance and a PNG preview to take to your tattoo artist.",
    h1: "Tattoo Name Generator: Lettering Layouts for Any Name",
    intro: [
      "A name is the most personal thing you can put on skin, and small choices in lettering change how it feels. This tattoo name generator takes a name, a font style, an optional symbol and a placement, then builds several layout concepts you can compare right away.",
      "Each concept shows a live lettering preview, a suggested size for the body area and a note on spacing. Everything runs in your browser, so you can experiment as much as you like and download the previews to share with your artist.",
    ],
    steps: [
      { title: "Enter the name", body: "Type it exactly as you want it read, including capitals and any spelling that matters to you. Short and long names are laid out differently." },
      { title: "Choose a font and a symbol", body: "Pick a lettering style, then add a small symbol like a heart, star or infinity mark, or leave it out for a purely typographic look." },
      { title: "Select the placement", body: "Placement changes the recommended size and layout, since a wrist, a rib line and a back have very different room." },
      { title: "Compare the concepts", body: "Review the layout cards, download previews you like, copy the concept notes and, if you want an illustrated version, send one to the AI generator." },
    ],
    features: [
      { title: "Several layouts at once", body: "See the name beside a symbol, stacked, curved, in all caps and in lowercase, so you can judge composition and not just typeface." },
      { title: "Size guidance by placement", body: "Each concept suggests a rough height and width in inches for the area you choose, as a starting point to discuss with your artist." },
      { title: "Copyable concept notes", body: "One tap copies a plain-language description of the layout, handy for messaging an artist or saving in notes." },
      { title: "PNG previews", body: "Download any preview as an image to show at a consultation or share with a friend for a second opinion." },
      { title: "Runs in your browser", body: "Nothing is sent to a server, so the results update instantly as you type." },
    ],
    examples: [
      { title: "A child's name on the forearm", body: "Try a script layout with a small heart and compare it with an all-caps version to see which suits the arm." },
      { title: "A memorial name on the ribs", body: "Use the stacked or narrow layouts to keep a longer name within a slim vertical area." },
      { title: "A pet's name near the ankle", body: "A short, lowercase layout with a small symbol tends to fit the compact area of an ankle." },
      { title: "A partner's name with an infinity mark", body: "See how much width the symbol takes away from the name and whether it is better above than beside." },
    ],
    tips: [
      "Check the spelling with the person or a document before you show the design to an artist.",
      "Blackletter styles read best in title case or lowercase. All capitals can become hard to read.",
      "Longer names often work better on a curve or in a stacked layout than on a single stiff line.",
      "Use the suggested size as a guide, then let your artist confirm what is legible for their technique.",
      "Consider whether you would still like the name's font if you saw it beside other lettering on your body.",
      "Say the name aloud when you review layouts. If a layout makes it hard to read, choose another.",
    ],
    info: {
      heading: "Choosing type for a name",
      paragraphs: [
        "Script and cursive styles add warmth but rely on clear connections between letters. Bolder faces such as traditional slab lettering stay legible at smaller sizes but feel more graphic. The [tattoo font generator](/tattoo-font-generator) lets you compare more styles, and the guide on [best tattoo fonts for names](/blog/best-tattoo-fonts-for-names) explains which suit which names.",
        "Once you have a layout you like, try the [initial tattoo generator](/initial-tattoo-generator) for a shorter alternative, or plan the size with the [tattoo size calculator](/tattoo-size-calculator). Layouts and sizes here are general suggestions, not professional advice. Your tattoo artist knows what will work on your skin.",
      ],
    },
    faq: [
      { q: "Does the tool store the names I type?", a: "No. The layouts are generated in your browser and nothing you type is sent anywhere by this tool." },
      { q: "How are the size recommendations calculated?", a: "They come from a simple guide based on the placement you pick and the length of the name. They are starting points, and your artist will advise on what suits their technique." },
      { q: "Why do some fonts look different in the preview and on a body?", a: "Skin, curves and the artist's technique change how lettering appears. The preview shows shape and layout, not the exact tattooed result." },
      { q: "Can I use special characters or accents?", a: "You can type them, but some display fonts do not include every accent. Check the preview and confirm the final spelling with your artist." },
      { q: "What does Turn this into an AI design do?", a: "It opens the design generator with a prompt based on your name, font and layout so you can see an illustrated version." },
      { q: "Can I add a date or numbers?", a: "Yes, with the companion tools. The date and Roman numeral generators create dates that pair well with a name." },
    ],
    related: ["tattoo-font-generator", "initial-tattoo-generator", "date-tattoo-generator", "cursive-tattoo-generator"],
    articles: ["best-tattoo-fonts-for-names", "how-to-choose-a-tattoo-font"],
    cta: {
      heading: "See the name before you commit",
      body: "Type it in, try a few fonts and layouts, and download the one that feels right to show your artist.",
    },
  },

  // ---------------------------------------------------------------- tattoo-quote-generator
  {
    slug: "tattoo-quote-generator",
    name: "Tattoo Quote Generator",
    blurb: "Browse short phrases and proverbs by theme, mood, length and language.",
    category: "generators",
    kind: "quote",
    preset: { fontStyle: "script" },
    metaTitle: "Tattoo Quote Generator – Short Phrases & Proverbs",
    metaDescription:
      "Browse original phrases, proverbs and mottos by theme, mood and length, in English, Latin, Spanish, French or Italian, then preview them in tattoo fonts.",
    h1: "Tattoo Quote Generator: Short Phrases, Proverbs and Mottos",
    intro: [
      "Choosing words for skin is different from choosing a caption. This tattoo quote generator helps you browse short phrases by theme, mood, length and language, from a curated set of original lines, public-domain proverbs and traditional mottos.",
      "Pick what you want to say, see options in English, Latin, Spanish, French or Italian, and preview any phrase in a tattoo font. It deliberately avoids song lyrics and copyrighted quotes, so what you find is free to use as personal body art.",
    ],
    steps: [
      { title: "Pick a theme and mood", body: "Choose what the words are about, like resilience, love, family or freedom, and the tone you want: calm, bold, romantic, reflective or playful." },
      { title: "Set the length and language", body: "Short phrases of four words or fewer suit small placements. Longer lines suit ribs, forearms and backs. Choose English or a supported language." },
      { title: "Browse and reshuffle", body: "Read the suggestions, tap Show more ideas for a fresh set and save favorites so you can compare them later." },
      { title: "Preview and verify", body: "Preview a phrase in a lettering style, copy the text and have a fluent speaker verify any translation before it goes near a stencil." },
    ],
    features: [
      { title: "Curated, not scraped", body: "Every entry is an original phrase, a public-domain proverb or a traditional motto. No song lyrics and no copyrighted quotes." },
      { title: "Five languages", body: "Each phrase is offered in English, Latin, Spanish, French and Italian, alongside the English meaning for reference." },
      { title: "Length filters that match placement", body: "Short, medium and long options help you match a phrase to the space you actually have." },
      { title: "Font preview and PNG download", body: "See the phrase in a tattoo font, then download the image to show your artist." },
      { title: "Favorites saved in your browser", body: "Save phrases you like and compare them side by side without creating an account." },
    ],
    examples: [
      { title: "A short line for the wrist", body: "Filter to short and calm to find two- or three-word phrases that stay readable in a small area." },
      { title: "A Latin motto for the ribs", body: "Browse resilience and wisdom themes in Latin, then preview a longer motto in a formal script." },
      { title: "A family phrase in Spanish or Italian", body: "Choose the family theme and your family's language, then ask a relative to check the wording." },
      { title: "A playful reminder", body: "Try the playful mood for lighter lines, such as short reminders about joy and freedom." },
    ],
    tips: [
      "Always have a fluent speaker check translations, including accents, word order and gendered forms.",
      "Say the phrase aloud and imagine explaining it to strangers. If that feels comfortable, it is probably a keeper.",
      "Shorter phrases give the letters more room, which usually helps legibility at small sizes.",
      "Test the phrase in two or three fonts before choosing. Style changes tone as much as the words do.",
      "Avoid phrases you found only because they are trending. Choose words you expect to still agree with.",
    ],
    info: {
      heading: "A note on translations and accuracy",
      paragraphs: [
        "The translations here are plain and literal, but languages have regional forms, formal and informal address, and gender agreement that a single line cannot capture. A native or fluent speaker can catch mistakes that software and beginners miss, and a typo is far harder to fix in skin than in a text file.",
        "For lettering choices, the [tattoo lettering generator](/tattoo-lettering-generator) and the guide to [tattoo lettering styles](/blog/tattoo-lettering-styles-explained) can help you decide how the words should look. Then use the [tattoo placement guide](/tattoo-placement-guide) to match length to location. This information is general, and a licensed tattoo artist should confirm the final wording and layout.",
      ],
    },
    faq: [
      { q: "Where do the phrases come from?", a: "They are original short phrases, public-domain proverbs, classical phrases and traditional mottos. Each entry is labeled so you can see which kind it is." },
      { q: "Are the translations guaranteed to be correct?", a: "No. They are careful, literal renderings, but you should have a fluent speaker verify every translation, including spelling, accents and grammar, before tattooing." },
      { q: "Can I use these phrases for a tattoo?", a: "Yes. Proverbs, mottos and original phrases are free to use as personal body art. The tool avoids copyrighted lyrics and quotes on purpose." },
      { q: "How do I choose a good length?", a: "Match it to the space. Two to four words fit small areas, while longer lines need a rib, forearm or back to stay legible." },
      { q: "Why is there no option for my favorite lyric or quote?", a: "Song lyrics and modern quotes are often copyrighted. This tool sticks to safe, timeless sources so you are not guessing about rights." },
      { q: "Are my favorites private?", a: "Favorites are stored in your own browser only. Clearing site data or switching browsers will remove them." },
    ],
    related: ["tattoo-lettering-generator", "tattoo-font-generator", "script-tattoo-generator", "tattoo-name-generator"],
    articles: ["how-to-choose-a-tattoo-font", "tattoo-lettering-styles-explained"],
    cta: {
      heading: "Find words worth keeping",
      body: "Filter by theme and mood, preview your favorite in a tattoo font, and confirm the wording with a fluent speaker before you book.",
    },
  },

  // ---------------------------------------------------------------- couple-tattoo-generator
  {
    slug: "couple-tattoo-generator",
    name: "Couple Tattoo Generator",
    blurb: "Design matching or complementary tattoos for two people.",
    category: "generators",
    kind: "ai",
    preset: {
      size: "small",
      color: "black-white",
      chips: [
        "Two halves of a heart that fit together",
        "Sun and moon, one for each person",
        "Key and lock as a matching pair",
        "Coordinates of the place we met, small and simple",
        "Our initials in a tiny linked design",
        "Two puzzle pieces with a delicate outline",
        "Wave and shoreline that continue across two arms",
        "Two matching constellations connected by a line",
      ],
    },
    metaTitle: "Couple Tattoo Generator – Matching Tattoo Ideas",
    metaDescription:
      "Create matching or complementary tattoo concepts for two people, from split hearts and sun and moon pairs to coordinates and initials, in your chosen style.",
    h1: "Couple Tattoo Generator for Matching and Complementary Designs",
    intro: [
      "A couple tattoo works when two designs feel connected but not identical. This couple tattoo generator is built around that idea, with prompts for pairs that fit together, mirror each other or tell one story across two people.",
      "Start from a matching-pair concept, set a style you both like and see the pair before anyone commits. It suits partners, best friends, siblings, parents and children, and anyone planning matching tattoos who wants to agree on a design first.",
    ],
    steps: [
      { title: "Choose a pair concept", body: "Tap a chip such as sun and moon or key and lock, or describe your own idea. Say clearly that the design is for two people." },
      { title: "Decide on style and size together", body: "Agree on a style, size and body area for both tattoos. Small and simple matching designs are common, and identical placement is optional." },
      { title: "Generate the pair", body: "Create the design and check that each half stands on its own while clearly belonging with the other." },
      { title: "Refine and share", body: "Adjust the details until both people are happy, then bring the pair to an artist so they can draw it for each body." },
    ],
    features: [
      { title: "Prompts built for pairs", body: "Chips describe designs in two parts, so the result is something to split or mirror rather than a single image." },
      { title: "Matching versus complementary", body: "Ask for identical designs, mirrored designs or two different halves that complete each other." },
      { title: "Small-first defaults", body: "The tool starts with a small size and simple linework, which fits how many pairs choose to match." },
      { title: "Style control", body: "Pick fine line, traditional or geometric so both tattoos share a look even if placement differs." },
    ],
    examples: [
      { title: "Partners with split hearts", body: "Each person wears one half, and the halves complete a whole when they stand together." },
      { title: "Best friends with sun and moon", body: "Two contrasting celestial symbols suit friends with different personalities who feel like a set." },
      { title: "Siblings with coordinates", body: "Use the childhood home's location or a meaningful place, kept small and simple." },
      { title: "Parent and child with initials", body: "Interlocking initials in a small design, placed in a spot each person can easily see." },
    ],
    tips: [
      "Talk through what happens if the relationship changes. Choose designs you would still value as symbols of the friendship or the memory on their own.",
      "Agree on placement and size before you agree on the art. Both have to work for both people.",
      "Consider designs that stand alone, so each tattoo still looks intentional without the other one.",
      "Choose simple line work if you plan to get tattooed on the same day, since it keeps time and cost manageable.",
      "Ask your artist about doing both pieces in one sitting or as two separate appointments.",
    ],
    info: {
      heading: "Making a pair that lasts",
      paragraphs: [
        "The strongest matching tattoos rely on a shared idea rather than a single image. Complementary halves, echoing shapes and shared symbols give you room to place the tattoos differently, which matters when two bodies are different.",
        "If your pair involves names or dates, the [date tattoo generator](/date-tattoo-generator) and [coordinates tattoo generator](/coordinates-tattoo-generator) create compact text that fits small matching designs. For more concepts, browse [custom tattoo design ideas](/blog/custom-tattoo-design-ideas). Generated pairs are inspiration, and a licensed tattoo artist should finalize the design for each person.",
      ],
    },
    faq: [
      { q: "Do couple tattoos have to be identical?", a: "No. Many pairs choose complementary designs, mirrored images or two halves of one idea, which gives each person a unique tattoo that still connects." },
      { q: "Can I use this for friends or family?", a: "Yes. The prompts work for partners, friends, siblings and parents with children. Choose a concept that fits the relationship." },
      { q: "What size works best for matching tattoos?", a: "Small designs are popular because they are quick and simple, but size is a personal choice. Your artist can suggest what will read well at the size you want." },
      { q: "Should we get them at the same time?", a: "Some people like doing it together as an experience. Others prefer separate visits. Both can work, and your artist can help you plan." },
      { q: "Can we mix styles?", a: "You can, but matching styles usually make a pair feel like a set. If you mix them, keep line weight and subject matter compatible." },
      { q: "What if we want different placement?", a: "That is common. Choose a design that adapts well, such as a symbol or small scene, and let the artist redraw it for each spot." },
    ],
    related: ["tattoo-generator", "initial-tattoo-generator", "coordinates-tattoo-generator", "tattoo-idea-generator"],
    articles: ["small-tattoo-ideas", "custom-tattoo-design-ideas"],
    cta: {
      heading: "Design the pair together",
      body: "Choose a concept you both like, generate the pair and take it to your artist. Two people, one plan.",
    },
  },
];
