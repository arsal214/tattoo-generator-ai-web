import type { ToolDef } from "../types";

export const styleTools: ToolDef[] = [
  // ---------------------------------------------------------------- minimalist
  {
    slug: "minimalist-tattoo-generator",
    name: "Minimalist Tattoo Generator",
    blurb: "Simple, single-line designs with plenty of breathing room.",
    category: "styles",
    kind: "ai",
    preset: {
      style: "minimalist",
      color: "black-white",
      size: "small",
      chips: [
        "A single continuous line forming a mountain range",
        "Tiny crescent moon with three dots",
        "One-line outline of a cat curled asleep",
        "Simple wave made of two curved lines",
        "A small sprig of olive leaves",
        "Open circle with a small dot beside it",
        "Line drawing of a paper airplane",
      ],
    },
    metaTitle: "Minimalist Tattoo Generator – Simple Line Designs",
    metaDescription:
      "Generate minimalist tattoo designs with clean single lines, small shapes and lots of negative space, then bring your favorite concept to a tattoo artist.",
    h1: "Minimalist Tattoo Generator for Clean, Simple Designs",
    intro: [
      "Minimalist tattoos say more with less. The style relies on a few deliberate lines, small shapes and open skin around them, so the design feels calm and easy to read. This minimalist tattoo generator is tuned for that restraint, drawing single-line and low-detail concepts rather than busy scenes.",
      "It is a good match for first tattoos, small placements and anyone who prefers subtle art. Describe one simple subject, keep the details to a minimum and see how much a few strokes can hold.",
    ],
    steps: [
      { title: "Pick one simple subject", body: "Minimalism works best with a single idea, such as a mountain, a moon or a small animal. The fewer elements, the stronger the result." },
      { title: "Choose a small, quiet placement", body: "Wrists, ankles, behind the ear, collarbone and the sides of the fingers suit delicate work. Confirm the size with your artist." },
      { title: "Keep it black and white", body: "Minimalist designs are usually a single ink color. Start there, and add shading or color only if you feel the design needs it." },
      { title: "Simplify further", body: "If the first result has more going on than you like, ask for fewer lines, no background and no shading, then regenerate." },
    ],
    features: [
      { title: "Style rules built in", body: "The generator asks for thin, clean linework, few elements and generous negative space, which are the marks of a true minimalist tattoo." },
      { title: "Small-first defaults", body: "Settings start at a small size and black ink, matching how most minimalist tattoos are worn." },
      { title: "Idea chips for line art", body: "Starters like single-line mountains and tiny moons show what the style does best and give you something to edit." },
      { title: "Easy to compare with fine line", body: "Try the same subject in the neighboring fine-line style to see how much detail you actually want." },
    ],
    examples: [
      { title: "A one-line animal", body: "A cat, a bird or a fox drawn in a single continuous stroke suits a wrist or shoulder blade." },
      { title: "A tiny celestial mark", body: "A moon with a few dots or a small sun sits well behind the ear or along a collarbone." },
      { title: "A geometric shape with meaning", body: "A circle, triangle or simple line pattern can stand for a place, a person or a phase of life." },
      { title: "A single botanical stem", body: "One leaf, one branch or one flower stem in a thin line is a classic, quiet choice." },
    ],
    tips: [
      "Ask yourself whether each line is doing a job. If not, take it out.",
      "Very small, thin designs can soften and spread as tattoos settle over the years, so ask your artist how much size and spacing your design needs.",
      "Give shapes room. Lines placed too close together are more likely to merge and lose their clarity.",
      "Consider a slightly bigger size than you first imagine. Small changes in scale often make a design easier to read.",
      "Choose an artist who does clean linework, and look at their healed work if they share it.",
    ],
    info: {
      heading: "What defines the minimalist style",
      paragraphs: [
        "Minimalist tattooing is defined by economy: a limited number of lines, mostly a single weight, little or no shading and a lot of empty space. The emptiness is part of the design, and the tattoo reads as much through what is left out as through what is drawn.",
        "Because there is so little detail, the quality of each line matters. Ask a prospective artist about their linework, how they handle curves and how they would size your idea. Neighboring styles worth comparing are the [fine line tattoo generator](/fine-line-tattoo-generator) and the [geometric tattoo generator](/geometric-tattoo-generator). For subjects and placement, see the guide to [minimalist tattoo ideas](/blog/minimalist-tattoo-ideas). This is general information, not professional advice; a licensed tattoo artist can tell you what works for your skin and placement.",
      ],
    },
    faq: [
      { q: "What makes a tattoo minimalist?", a: "Minimalist tattoos use few elements, simple lines, mostly one line weight and plenty of empty space around the design. Detail and shading are kept to a minimum." },
      { q: "Are minimalist tattoos good for a first tattoo?", a: "Many people choose them because they are small and subtle, but it depends on your goals. Talk to your artist about size, placement and what suits your lifestyle." },
      { q: "Can very small minimalist tattoos lose detail over time?", a: "Tattoos naturally change as the years pass, and very fine or tiny lines can look softer. Your artist can advise how large and how spaced-out your design should be to stay clear." },
      { q: "How is minimalist different from fine line?", a: "Minimalist is about using very few elements and lots of space. Fine line is about delicate, thin strokes and can include more detail. The two overlap often." },
      { q: "Can I add color to a minimalist design?", a: "You can, usually as a single accent such as one red dot or a soft wash. Keep it restrained so the design still feels minimal." },
      { q: "Will the generated design be tattooed exactly as shown?", a: "It is a concept. An artist will redraw it and may adjust line weight and spacing so it works for your body and the size you choose." },
    ],
    related: ["fine-line-tattoo-generator", "geometric-tattoo-generator", "tattoo-size-calculator", "tattoo-placement-guide"],
    articles: ["minimalist-tattoo-ideas", "small-tattoo-ideas"],
    cta: {
      heading: "See how little it takes",
      body: "Start with one subject and one line of thought. Generate, trim and bring the simplest version to your artist.",
    },
  },

  // ---------------------------------------------------------------- fine line
  {
    slug: "fine-line-tattoo-generator",
    name: "Fine Line Tattoo Generator",
    blurb: "Delicate, thin-stroke designs with subtle detail.",
    category: "styles",
    kind: "ai",
    preset: {
      style: "fine-line",
      color: "black-white",
      size: "small",
      chips: [
        "Wildflower bouquet with fine, delicate stems",
        "Botanical illustration of a fern and moth",
        "Delicate hummingbird with a small blossom",
        "Fine-line portrait outline of a woman with flowers in her hair",
        "Small lunar phases along a thin arc",
        "Tiny script initials with a sprig of lavender",
        "Fine-line snake winding around a stem",
      ],
    },
    metaTitle: "Fine Line Tattoo Generator – Delicate Designs",
    metaDescription:
      "Design fine line tattoos with delicate single-needle strokes and subtle detail. Get concepts for florals, animals and scripts, ready to discuss with an artist.",
    h1: "Fine Line Tattoo Generator for Delicate, Detailed Art",
    intro: [
      "Fine line tattoos are drawn with very thin, precise strokes, often with a single needle. The result feels closer to a pen drawing than a bold graphic, with room for detail like the veins of a leaf or the feathers of a bird. This fine line tattoo generator draws concepts in that light, elegant manner.",
      "It suits botanicals, animals, small portraits and delicate script, especially in small to medium placements. Use it to explore how much detail you want, then talk through practical limits with an artist who specializes in fine work.",
    ],
    steps: [
      { title: "Choose a detailed but light subject", body: "Florals, insects, birds and delicate lettering shine in fine line because the thin strokes capture subtle shapes." },
      { title: "Set size and placement", body: "Fine line looks lovely on the forearm, ribs, inner arm and ankle. Give detailed pieces enough size to keep the lines apart." },
      { title: "Generate with restraint", body: "Ask for delicate, uniform strokes and little or no shading. Too many elements will crowd the design." },
      { title: "Review for readability", body: "Look for lines that nearly touch or details so small they might blur. Regenerate with fewer details or a larger size." },
    ],
    features: [
      { title: "Thin, uniform linework", body: "The prompt engine asks for delicate single-needle strokes and even line weight, which is what defines the style." },
      { title: "Botanical and portrait strengths", body: "Chips lean toward subjects fine line handles well, such as plants, insects and gentle outlines of figures." },
      { title: "Detail control", body: "Simple language changes such as fewer petals or no background let you find the right amount of detail." },
      { title: "Comparison with other styles", body: "Switch to minimalist for less detail or to blackwork for more contrast and see which suits the subject." },
    ],
    examples: [
      { title: "A bouquet on the forearm", body: "A wildflower stem in a long, slim composition follows the length of the arm." },
      { title: "A moth or butterfly on the shoulder", body: "Wings with thin veining show off the style's detail without needing heavy shading." },
      { title: "A script line on the ribs", body: "A short delicate phrase in a thin, flowing hand suits the long ribcage area." },
      { title: "A small portrait outline", body: "A simple face or figure with flowers, kept clear and uncluttered, works at a modest size." },
    ],
    tips: [
      "Give fine detail room. Elements packed too closely can run together, so ask your artist about spacing at your chosen size.",
      "Skin, placement and the artist's technique all influence how fine lines settle over time. Look at healed work, not only fresh photos.",
      "Choose an artist who specializes in fine line. It is a skill of its own, and results depend heavily on their hand.",
      "Plan on a little more size for very detailed pieces rather than shrinking them to the smallest possible scale.",
      "Ask whether your design would benefit from a touch of shading or a bolder outline in places.",
      "Avoid overly tiny text. Short words in a simple script are easier to keep readable.",
    ],
    info: {
      heading: "What to know about fine line work",
      paragraphs: [
        "Fine line usually means small needle groupings and light, controlled strokes, often in black or grey. Because the lines are so thin, the style depends on clean technique and enough spacing between elements. It tends to look softer and more illustrative than bold traditional work.",
        "How well thin lines hold their sharpness over the years varies by person, placement and artist, so it is worth asking to see healed examples before committing. If you want a simpler take on delicate art, try the [minimalist tattoo generator](/minimalist-tattoo-generator). For script lettering in this spirit, the [script tattoo generator](/script-tattoo-generator) previews elegant type. Sizing help is in the [tattoo size calculator](/tattoo-size-calculator). This is general information, not professional advice; ask a licensed tattoo artist about aging, touch-ups and care for your specific piece.",
      ],
    },
    faq: [
      { q: "What is a fine line tattoo?", a: "It is a tattoo drawn with thin, precise strokes, often using a small needle configuration. It usually has delicate detail and little heavy shading." },
      { q: "Is fine line the same as minimalist?", a: "Not exactly. Fine line describes how the lines are drawn, while minimalist describes how few elements there are. A design can be both, or one without the other." },
      { q: "Will my fine line tattoo stay crisp?", a: "That depends on skin, placement, the artist's technique and how the tattoo is looked after. Ask your artist to show healed examples and explain how they approach size and spacing." },
      { q: "What size should a detailed fine line piece be?", a: "Bigger than you might first assume. Give detail room to breathe, and let your artist recommend a size that keeps elements distinct." },
      { q: "Can fine line work be done in color?", a: "Yes, usually in soft, light tones. Many artists keep it to black or grey for clarity, so discuss it with yours." },
      { q: "Can I use a generated design as is?", a: "Treat it as a concept. The artist will adjust line weight, spacing and detail to fit your body and their method." },
    ],
    related: ["minimalist-tattoo-generator", "script-tattoo-generator", "tattoo-size-calculator", "tattoo-placement-visualizer"],
    articles: ["small-tattoo-ideas", "tattoo-ideas-for-women"],
    cta: {
      heading: "Draw it delicately",
      body: "Pick a subject with fine detail, generate a few versions and bring the clearest one to a fine line specialist.",
    },
  },

  // ---------------------------------------------------------------- tribal
  {
    slug: "tribal-tattoo-generator",
    name: "Tribal Tattoo Generator",
    blurb: "Bold black patterns with flowing curves and sharp points.",
    category: "styles",
    kind: "ai",
    preset: {
      style: "tribal",
      color: "black-white",
      size: "medium",
      chips: [
        "Bold black armband of interlocking curves",
        "Symmetrical tribal sun with sharp rays",
        "Flowing tribal wolf head in solid black",
        "Tribal-style wings spreading across the shoulder blades",
        "Curving bands wrapping a calf, pointed tips",
        "Tribal spiral with tapered ends",
      ],
    },
    metaTitle: "Tribal Tattoo Generator – Bold Black Patterns",
    metaDescription:
      "Generate tribal-style tattoo concepts with solid black shapes, sharp curves and flowing patterns for arms, shoulders and legs, plus notes on cultural respect.",
    h1: "Tribal Tattoo Generator for Bold Black Pattern Work",
    intro: [
      "Tribal-style tattoos are recognizable by heavy black shapes, tapered points and curved bands that flow with the body. This tribal tattoo generator creates original designs in that graphic manner, using the visual language of thick black fills and interlocking curves.",
      "It is best for armbands, shoulders, calves and other places where a bold, flowing pattern can follow muscle and bone. The designs it draws are new patterns in a modern style, not copies of any specific cultural artwork.",
    ],
    steps: [
      { title: "Choose a shape or subject", body: "Decide whether you want a pure pattern like a band or spiral, or an animal or sun rendered in tribal-style black shapes." },
      { title: "Match it to the body", body: "Tribal work flows best on limbs and curved areas. Pick a placement so the pattern can wrap or taper naturally." },
      { title: "Generate in black and white", body: "Solid black on white shows the silhouette clearly. Color is unusual in this style, so keep to a single ink." },
      { title: "Check balance and flow", body: "Look at whether the shapes feel balanced and whether the flow follows the body. Regenerate with more or less symmetry as needed." },
    ],
    features: [
      { title: "Heavy fills and clean edges", body: "Solid black areas and crisp, tapered edges define the look, and the generator asks for both." },
      { title: "Flow-aware compositions", body: "Prompts favor bands, curves and spirals that can wrap around arms, calves and shoulders." },
      { title: "Original patterns", body: "Every result is a new design in a general style, drawn without copying particular cultural motifs." },
      { title: "Simple to adapt", body: "Change the subject, the symmetry or the thickness of the shapes to find a pattern that suits you." },
    ],
    examples: [
      { title: "An armband", body: "A continuous band of interlocking curves wraps the upper arm and is a common starting point for tribal-style work." },
      { title: "A shoulder piece", body: "Curving shapes sweep over the shoulder and extend onto the chest or back, following the muscle lines." },
      { title: "A calf wrap", body: "Tapered bands climb the calf in a spiral, using the shape of the leg as part of the design." },
      { title: "A symmetrical back motif", body: "Mirrored wings or a central emblem sit between the shoulder blades and use the spine as the axis." },
    ],
    tips: [
      "Learn the difference between tribal-style black patterns and traditional cultural tattoos. Many Indigenous designs carry meaning tied to family, lineage and community.",
      "If you are drawn to a specific culture's tattooing, seek an artist from that tradition rather than a generic imitation.",
      "Keep the design bold. Thick fills and clear negative shapes hold the style together.",
      "Plan the placement around the body's flow. A pattern that follows the muscle looks more intentional.",
      "Think about scale. Solid black areas are large commitments, and large pieces take time to complete.",
    ],
    info: {
      heading: "Understanding tribal-style tattoos respectfully",
      paragraphs: [
        "The bold black patterns often called tribal became popular in Western tattooing as a general graphic style. Separate from that, many communities, including Polynesian, Maori and Native American cultures, have tattoo traditions with specific meanings connected to identity, ancestry and rank. Those designs are not decorative templates.",
        "This generator produces original, style-based patterns and does not recreate any culture's sacred or personal designs. If your interest is in a particular tradition, look for an artist connected to it and talk about what is appropriate for you. For related bold looks, compare with the [gothic tattoo generator](/gothic-tattoo-generator) or the [geometric tattoo generator](/geometric-tattoo-generator), and use the [tattoo placement guide](/tattoo-placement-guide) to plan where a flowing pattern will sit. This is general information, not professional advice; a licensed tattoo artist can advise on design and placement.",
      ],
    },
    faq: [
      { q: "What is a tribal-style tattoo?", a: "It is a graphic style made of bold black shapes, sharp points and curved, flowing patterns. Here it means original patterns in that look, not designs taken from a specific culture." },
      { q: "Does this copy Maori, Polynesian or Native designs?", a: "No. The generator creates original tribal-style patterns. Traditional tattoos from those cultures carry meaning and should be discussed with artists from those traditions." },
      { q: "Where do tribal designs work best?", a: "Bands and flowing patterns fit arms, shoulders, calves and backs, where the shapes can follow the body's curves." },
      { q: "Can tribal tattoos be done in color?", a: "It is uncommon. The style relies on solid black contrast, and most artists keep it to a single ink." },
      { q: "How do I keep a tribal design from feeling dated?", a: "Focus on clean composition, good flow with the body and simpler shapes. Working with an artist who does custom black work helps a lot." },
      { q: "Will an artist tattoo the generated design exactly?", a: "It is a starting concept. An artist will usually redraw it so the shapes fit your body and placement." },
    ],
    related: ["geometric-tattoo-generator", "gothic-tattoo-generator", "tattoo-placement-guide", "tattoo-stencil-maker"],
    articles: ["tattoo-ideas-for-men", "best-tattoo-placement-ideas"],
    cta: {
      heading: "Design a bold pattern",
      body: "Choose a placement, generate a few black patterns and bring the one that flows best to your artist.",
    },
  },

  // ---------------------------------------------------------------- geometric
  {
    slug: "geometric-tattoo-generator",
    name: "Geometric Tattoo Generator",
    blurb: "Precise shapes, symmetry and crisp lines built from geometry.",
    category: "styles",
    kind: "ai",
    preset: {
      style: "geometric",
      color: "black-white",
      size: "medium",
      chips: [
        "Geometric wolf built from triangles and straight lines",
        "Mandala with layered circles and symmetrical petals",
        "Sacred geometry flower of life inside a hexagon",
        "Geometric deer with antlers made of intersecting lines",
        "Concentric circles with a crescent moon",
        "Cube outline with an impossible-shape twist",
        "Polygonal mountain range with a sun circle",
      ],
    },
    metaTitle: "Geometric Tattoo Generator – Symmetry & Shapes",
    metaDescription:
      "Create geometric tattoo designs from triangles, circles and sacred-geometry patterns with crisp lines and balanced symmetry, ready to review with an artist.",
    h1: "Geometric Tattoo Generator for Precise, Symmetrical Designs",
    intro: [
      "Geometric tattoos build images from lines, circles, triangles and repeating patterns. They can be as simple as a set of concentric rings or as intricate as a mandala or a polygonal animal. This geometric tattoo generator draws concepts that lean on symmetry, precise angles and clean shapes.",
      "The style rewards planning, since a slightly off angle is easy to spot. Use the generator to explore compositions and proportions, then talk to an artist who does careful linework about how to execute it on your body.",
    ],
    steps: [
      { title: "Choose a base idea", body: "Pick a subject to break into shapes, like a wolf or a mountain, or a pure pattern like a mandala or sacred-geometry flower." },
      { title: "Decide on symmetry", body: "Mirror symmetry suits chests, backs and spines. Radial designs work well as round pieces on shoulders and thighs." },
      { title: "Generate and check the geometry", body: "Look at whether lines meet cleanly and proportions feel balanced. Ask for simpler shapes if it looks crowded." },
      { title: "Refine detail and scale", body: "Tighten or loosen the pattern, add dotwork if you like, and choose a size that gives fine lines room." },
    ],
    features: [
      { title: "Shape-first prompting", body: "The generator asks for crisp straight lines, circles and balanced symmetry so results feel deliberate." },
      { title: "Animals and mandalas", body: "Chips include geometric animals and pure patterns, two of the most common directions in the style." },
      { title: "Placement-aware symmetry", body: "Compositions can be centered and mirrored for chest and back, or radial for round areas." },
      { title: "Room for dotwork and shading", body: "Ask for stippled shading or fine dots alongside lines for extra depth." },
    ],
    examples: [
      { title: "A geometric animal", body: "A fox or stag rendered from triangles and thin lines suits an upper arm or thigh." },
      { title: "A mandala on the shoulder", body: "Layered circular patterns fit the rounded shape of a shoulder or the top of a thigh." },
      { title: "A sacred-geometry chest emblem", body: "A symmetrical design centered on the sternum uses the body's natural axis." },
      { title: "A minimal shape set", body: "A few overlapping circles or a simple polygon on the forearm is a quiet take on the style." },
    ],
    tips: [
      "Symmetry looks best when placed on a body's natural centerline. Talk to your artist about placement and alignment.",
      "Long straight lines and perfect circles are hard to tattoo, and curved skin adds challenge. Choose an artist experienced in precise work.",
      "Complexity multiplies quickly. Start with fewer layers and add only where it improves the design.",
      "Ask your artist how they would handle alignment across curved areas, and whether a stencil will be used.",
      "Consider the meaning behind shapes. Circles, triangles and spirals carry different ideas for different people.",
    ],
    info: {
      heading: "What defines geometric tattooing",
      paragraphs: [
        "Geometric tattoos rely on mathematical shapes and structure. Some designs echo sacred geometry, others use modern polygonal shading, and many combine lines with dotwork. The common thread is precision: lines are straight where they should be, and repeated elements match.",
        "Because a body is not a flat page, geometric work is a test of planning. An artist may adjust the design so that lines feel straight on the curved surface. To explore nearby looks, try the [minimalist tattoo generator](/minimalist-tattoo-generator) for a simpler approach or the [tribal tattoo generator](/tribal-tattoo-generator) for bold black shapes, and use the [tattoo size calculator](/tattoo-size-calculator) to think through scale. This is general information, not professional advice; a licensed tattoo artist can advise on what works for your body.",
      ],
    },
    faq: [
      { q: "What is a geometric tattoo?", a: "It is a tattoo made from geometric elements like lines, circles, triangles and repeating patterns, often symmetrical and often with dotwork." },
      { q: "Are geometric tattoos hard to get right?", a: "They can be, since small errors in angles or symmetry are noticeable. Work with an artist who specializes in clean, precise linework." },
      { q: "Where do geometric tattoos look best?", a: "Symmetrical designs suit the chest, back and sternum. Radial designs suit shoulders and thighs. Slim patterns suit forearms and calves." },
      { q: "Can geometric designs be colored?", a: "Yes, but most are black or grey. A small pop of color can work if it fits the pattern, so discuss options with your artist." },
      { q: "Do I need to know sacred geometry?", a: "No. You can pick shapes for how they look. If you care about traditional meanings, research them and talk to your artist." },
      { q: "Will the generator produce mathematically perfect shapes?", a: "It draws convincing geometric concepts, but AI images are not exact. Your artist will refine angles and proportions for the final stencil." },
    ],
    related: ["minimalist-tattoo-generator", "tribal-tattoo-generator", "tattoo-size-calculator", "tattoo-stencil-maker"],
    articles: ["tattoo-ideas-for-men", "shoulder-tattoo-ideas"],
    cta: {
      heading: "Build it from shapes",
      body: "Choose a base idea and a symmetry, generate a few compositions and take the cleanest one to a precise linework artist.",
    },
  },

  // ---------------------------------------------------------------- traditional
  {
    slug: "traditional-tattoo-generator",
    name: "Traditional Tattoo Generator",
    blurb: "Bold outlines, solid fills and a classic limited palette.",
    category: "styles",
    kind: "ai",
    preset: {
      style: "traditional",
      color: "color",
      size: "medium",
      chips: [
        "Rose with thorny stem and a banner reading MOM",
        "Swallow in flight with a small red heart",
        "Dagger through a heart with a ribbon",
        "Panther head with bared teeth",
        "Anchor wrapped in rope with a small star",
        "Ship in full sail on rolling waves",
        "Eagle with spread wings and a banner",
      ],
    },
    metaTitle: "Traditional Tattoo Generator – Bold Flash Designs",
    metaDescription:
      "Design American traditional tattoo concepts with thick black outlines, solid fills and a classic limited palette: roses, swallows, daggers, anchors and more.",
    h1: "Traditional Tattoo Generator for Classic Flash Designs",
    intro: [
      "Traditional tattoos, often called American traditional or old school, are built on thick black outlines, solid color fills and a small, bold palette. Roses, swallows, daggers, anchors and panthers are staples, drawn simply so they read from across a room. This traditional tattoo generator draws concepts in that flash-sheet tradition.",
      "The style is a good pick for people who like clear, confident imagery. Describe a classic subject, keep the composition simple and see how it looks with bold lines and a limited palette before you talk to a traditional specialist.",
    ],
    steps: [
      { title: "Choose a classic subject", body: "Roses, swallows, hearts, daggers, eagles, ships and skulls are traditional standards. Pick one and let the style do the work." },
      { title: "Pick your palette", body: "Color mode uses the traditional set of red, yellow, green and black, with occasional blue. Black and grey is also possible for a stark look." },
      { title: "Set size and placement", body: "Traditional designs are usually medium to large and need enough room for bold outlines. Upper arms, calves, thighs and chests suit them." },
      { title: "Generate and simplify", body: "Ask for thick outlines, solid fills and minimal shading. Remove extra decoration if the design feels cluttered." },
    ],
    features: [
      { title: "Bold outline engine", body: "The prompt asks for thick black lines and solid fills, which are the structural marks of the style." },
      { title: "Limited palette", body: "Color results stay within a classic range rather than drifting into soft gradients or unusual shades." },
      { title: "Flash-sheet subjects", body: "Chips focus on time-tested imagery and let you modify a subject rather than starting from nothing." },
      { title: "Banner and lettering ideas", body: "Ribbons and banners are a traditional device. Add a short word, then plan the exact lettering with your artist." },
    ],
    examples: [
      { title: "A rose on the upper arm", body: "A bold red rose with green leaves is one of the most recognizable traditional images." },
      { title: "A swallow pair on the chest", body: "Two swallows in flight suit the chest or collarbone area and read clearly at a distance." },
      { title: "A dagger and heart on the forearm", body: "A vertical composition follows the arm and reads with strong contrast." },
      { title: "A ship on the thigh", body: "A sailing ship on waves makes use of the larger canvas of a thigh." },
    ],
    tips: [
      "Traditional tattoos rely on simplicity. If a design has many small details, consider removing some.",
      "Lettering on banners should be short. Long words shrink quickly and lose clarity.",
      "Bold outlines and solid fills are designed for clarity, but all tattoos change over time. Ask your artist about their experience with healed traditional work.",
      "Look at a flash sheet or portfolio from traditional artists to get a sense of the standard imagery and layout.",
      "Choose a size big enough for outlines to stay thick and gaps between elements to stay open.",
    ],
    info: {
      heading: "What makes a tattoo traditional",
      paragraphs: [
        "American traditional developed from sailor and carnival tattooing, with artists refining simple, durable designs that could be tattooed quickly and read at a glance. The vocabulary is compact: heavy black outlines, flat color, minimal shading and symbols with a shared meaning, such as swallows, anchors and hearts.",
        "Neo-traditional keeps the structure but adds more color range and variation in line weight, and you can explore that direction in the [tattoo generator](/tattoo-generator). For lettering that matches the style, look at the [old English tattoo generator](/old-english-tattoo-generator) or the bold styles in the [tattoo font generator](/tattoo-font-generator). This is general information, not professional advice; a licensed tattoo artist can guide you on design, aging and upkeep.",
      ],
    },
    faq: [
      { q: "What is a traditional tattoo?", a: "Also called American traditional or old school, it uses thick black outlines, solid fills and a limited color palette with classic imagery like roses, swallows and anchors." },
      { q: "Which colors are used?", a: "Usually red, yellow, green and black, often with some blue or brown. The limited palette is part of the style." },
      { q: "How is traditional different from neo-traditional?", a: "Neo-traditional keeps bold outlines but adds a wider color range, varied line weight and more ornament. Traditional stays simpler and flatter." },
      { q: "Do traditional tattoos hold up well?", a: "The style is designed for clarity, with bold lines and solid color, but all tattoos change over time. Your artist can describe how their work looks after healing and years of wear." },
      { q: "Can I add my own text or a name?", a: "Yes, on a banner or ribbon. Keep the wording short and have your artist plan the lettering so it stays legible." },
      { q: "Can I use the generated design directly?", a: "Treat it as a concept. An artist will redraw it with proper line weight and layout for your body." },
    ],
    related: ["old-english-tattoo-generator", "gothic-tattoo-generator", "tattoo-generator", "tattoo-placement-guide"],
    articles: ["tattoo-ideas-for-men", "tattoo-lettering-styles-explained"],
    cta: {
      heading: "Bring back the classics",
      body: "Choose a flash subject, set the palette and generate a few options. Take your favorite to a traditional artist.",
    },
  },
];
