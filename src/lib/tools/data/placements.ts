// Shared placement data for the planning tools (guide, visualizer, size calculator).
// General planning information only. Sizes are approximate and bodies vary; a professional tattoo artist
// is the right person to advise on what suits your body, skin and design.

export type BodyView = "front" | "back";

/** Position on the shared body figure (viewBox 0 0 200 500, body height = 500). Coordinates are for the
 *  figure's left side; paired areas are mirrored to the other side (x -> 200 - x, rot -> -rot). */
export interface FigureAnchor {
  x: number;
  y: number;
  /** Clockwise rotation in degrees that follows the limb's slant. */
  rot?: number;
  /** Half-width / half-height of the clickable region in figure units. */
  hw: number;
  hh: number;
}

export interface PlacementInfo {
  /** Matches PLACEMENTS[].value in src/lib/config/generation.ts. */
  id: string;
  label: string;
  /** Typical design-friendly area in inches (visible width x height). Approximate; bodies vary. */
  areaIn: { w: number; h: number };
  summary: string;
  shapes: string;
  styles: string;
  visibility: string;
  movement: string;
  sun: string;
  detail: string;
  questions: string[];
  /** Which views show this area on the figure. */
  views: BodyView[];
  anchor: FigureAnchor;
  /** Mirrored on the other side of the figure (arms, legs, ribs). */
  paired: boolean;
  /** False when the region overlaps others and is chosen with chips only. */
  clickable?: boolean;
}

export const PLACEMENT_NOTE =
  "Sizes are approximate design areas, not rules. Bodies vary, and your artist will judge what fits yours.";

export const PLACEMENT_INFO: PlacementInfo[] = [
  {
    id: "forearm",
    label: "Forearm",
    areaIn: { w: 3, h: 7 },
    summary: "A long, fairly flat canvas that is easy to see and easy to show off.",
    shapes: "Tall, narrow compositions that follow the length of the arm: daggers, stems and florals, vertical lettering, animals in profile, stacked motifs.",
    styles: "Works with nearly any style. Fine line and script suit slim designs, while traditional, blackwork and Japanese-inspired pieces take bold outlines well.",
    visibility: "Uncovered by short sleeves and rolled sleeves, covered by long sleeves. Inner and outer forearm can differ in how often they show, depending on how you hold your arm.",
    movement: "The forearm rotates and flexes when you turn your palm or grip things, so a design can look different from different angles. Vertical layouts keep their shape well.",
    sun: "Often uncovered in warm weather, so it tends to see more daylight than areas hidden by clothing. Worth mentioning when you talk through color and line choices.",
    detail: "Good room for detail along the length, but the width is limited. Very fine lines and small text need enough size to stay readable.",
    questions: [
      "Should the design sit on the inner, outer or wrap around the arm?",
      "How long can it run before it feels crowded at my arm size?",
      "Will the design read well when my wrist turns?",
      "How would this piece connect if I add to it later?",
    ],
    views: ["front", "back"],
    anchor: { x: 25, y: 208, rot: 8, hw: 11, hh: 27 },
    paired: true,
  },
  {
    id: "upper-arm",
    label: "Upper Arm",
    areaIn: { w: 4, h: 8 },
    summary: "A rounded, sturdy area that is simple to cover or reveal with sleeve length.",
    shapes: "Oval or rounded compositions, medallions, portraits, animals, florals and anything that reads well inside a soft frame.",
    styles: "Realism, traditional, neo-traditional and illustrative styles all have space here, and it is a common starting point for sleeves.",
    visibility: "Hidden by most sleeves and easy to show in a tank top or short sleeves, which many people like for flexible visibility.",
    movement: "The area changes shape when you flex or lift your arm, so ask how the design will look relaxed versus flexed.",
    sun: "Exposure depends on your wardrobe: sleeveless tops show it, most tees cover part of it.",
    detail: "Generous area for detailed pieces, though the curve can make wide designs look narrower from the side.",
    questions: [
      "Will the piece be seen from the front, the outer side, or both?",
      "How will it look when my arm is flexed?",
      "Can we plan it so it could grow into a sleeve later?",
    ],
    views: ["front", "back"],
    anchor: { x: 38, y: 136, rot: 11, hw: 13, hh: 30 },
    paired: true,
  },
  {
    id: "wrist",
    label: "Wrist",
    areaIn: { w: 2.5, h: 1.5 },
    summary: "A small, narrow band of skin, popular for delicate and personal designs.",
    shapes: "Thin bands, short words, dates, small symbols and tiny florals that wrap or sit on the top of the wrist.",
    styles: "Minimalist, fine line and script are common choices. Small bold icons also work.",
    visibility: "Easy to show and hard to hide completely, though watches, bracelets and cuffs can cover it. Consider workplace or dress-code expectations.",
    movement: "Wrists bend and twist all day, which can change how a horizontal band or a line of text appears. Ask how the design will look when you turn your hand.",
    sun: "Frequently visible outdoors in most seasons. Something to mention when planning line weight and contrast.",
    detail: "Very limited space. Tiny text and thin, closely spaced lines can be harder to keep legible at this size, so simple shapes are the safer choice.",
    questions: [
      "Which orientation will read best when I look down at it?",
      "How small is too small for this lettering or motif?",
      "Should the design stay on top of the wrist or wrap around?",
    ],
    views: ["front", "back"],
    anchor: { x: 21, y: 248, rot: 8, hw: 11, hh: 8 },
    paired: true,
  },
  {
    id: "shoulder",
    label: "Shoulder",
    areaIn: { w: 5, h: 5 },
    summary: "A rounded cap of skin that suits compact, contained designs and sleeve starters.",
    shapes: "Round or shield-like compositions, florals, mandalas, animals, and designs that flow down onto the upper arm or across to the chest or back.",
    styles: "Traditional, Japanese-inspired, geometric, blackwork and illustrative styles suit the curved shape.",
    visibility: "Covered by most shirts and easy to reveal in sleeveless tops. Many people choose it for that flexibility.",
    movement: "The shoulder rotates and rolls, so designs near the joint can shift in appearance as you move. Artists often plan around the natural curve.",
    sun: "Exposure depends on clothing: sleeveless or strappy tops will show it.",
    detail: "Solid room for medium-sized detail, though the curve means the design should be planned for the body, not a flat page.",
    questions: [
      "How should the design follow the curve of my shoulder?",
      "Should it stay on the cap or extend onto my chest, back or arm?",
      "How will it look when my arm is raised?",
    ],
    views: ["front", "back"],
    anchor: { x: 50, y: 92, rot: 0, hw: 15, hh: 14 },
    paired: true,
  },
  {
    id: "chest",
    label: "Chest",
    areaIn: { w: 10, h: 8 },
    summary: "A broad, symmetrical area that suits centered or mirrored compositions.",
    shapes: "Wide, symmetrical designs: wings, banners, emblems, ornamental pieces, centered lettering, or paired pieces across each side.",
    styles: "Traditional, neo-traditional, blackwork, ornamental and lettering styles are all commonly used here.",
    visibility: "Mostly covered by normal clothing, with the top edge sometimes visible at the collar. Easy to keep private or show.",
    movement: "The chest moves with breathing and posture and changes shape with muscle or weight changes over time, so symmetrical layouts are worth reviewing with your artist.",
    sun: "Usually covered in daily wear, though open collars or swimwear reveal it.",
    detail: "Plenty of space for detail and a fairly broad canvas for larger pieces.",
    questions: [
      "Should the design be centered, or sit on one side?",
      "How high should it sit relative to my collar?",
      "How will it look with different necklines?",
    ],
    views: ["front"],
    anchor: { x: 100, y: 122, rot: 0, hw: 26, hh: 28 },
    paired: false,
  },
  {
    id: "back",
    label: "Back",
    areaIn: { w: 14, h: 18 },
    summary: "The largest, flattest canvas on the body, well suited to big single pieces.",
    shapes: "Large, tall or symmetrical compositions: wings, landscapes, portraits, dragons, ornamental spines, or layered scenes with plenty of breathing room.",
    styles: "Any style, but especially those that benefit from scale: Japanese-inspired, realism, blackwork, traditional and illustrative.",
    visibility: "Rarely seen by you and easy to keep covered, so it is the placement people often choose for privacy or a major project.",
    movement: "Broad and relatively stable, though shoulder blades shift with arm movement. Ask how the design will look when you lift your arms.",
    sun: "Typically covered by clothing; open-back styles and swimwear expose it.",
    detail: "Room for fine detail across a large area. Large designs often take multiple sessions, so plan the stages.",
    questions: [
      "Should the piece be planned as one large composition or in stages?",
      "How should the design relate to my spine and shoulder blades?",
      "How many sessions should I expect for this scale?",
    ],
    views: ["back"],
    anchor: { x: 100, y: 145, rot: 0, hw: 28, hh: 62 },
    paired: false,
  },
  {
    id: "rib",
    label: "Rib",
    areaIn: { w: 4, h: 9 },
    summary: "A long, narrow strip along the side of the torso, often chosen for vertical designs.",
    shapes: "Tall, slim compositions: stems, lettering in a vertical line, feathers, daggers, or a flowing design that follows the side of the body.",
    styles: "Fine line, script, botanical and illustrative styles are frequent choices, along with bolder designs sized to the strip.",
    visibility: "Usually private, visible mainly in swimwear or when you lift your arms.",
    movement: "The side of the torso stretches and compresses as you breathe, bend and twist, so vertical layouts with some flexibility tend to move naturally.",
    sun: "Typically covered by clothing.",
    detail: "Enough length for a detailed design, but width is limited. Some people describe bonier or thinner-skinned areas as more uncomfortable; experiences vary, so ask your artist.",
    questions: [
      "How will my breathing and posture affect the design?",
      "How high or low on the ribcage should it sit?",
      "How should I plan for a longer session in this area?",
    ],
    views: ["front", "back"],
    anchor: { x: 68, y: 178, rot: 0, hw: 8, hh: 24 },
    paired: true,
  },
  {
    id: "neck",
    label: "Neck",
    areaIn: { w: 3, h: 3 },
    summary: "A compact, highly visible area, commonly chosen for small centered or side designs.",
    shapes: "Small centered motifs, side-neck florals, short words, symbols, or a vertical piece running down the back of the neck.",
    styles: "Minimalist, script, fine line and bold traditional icons are typical.",
    visibility: "Hard to cover completely with everyday clothing, so consider dress codes and workplace expectations before committing.",
    movement: "The neck bends, turns and tilts constantly, and clothing collars or hair can overlap the design. Ask how it will look when you turn your head.",
    sun: "Often exposed, especially at the sides and front.",
    detail: "Small canvas; keep designs simple and check legibility with your artist. Some people describe thinner-skinned areas as more uncomfortable, but experiences vary.",
    questions: [
      "Which side or position will suit my hair and clothing habits?",
      "How does this placement fit with my dress-code needs?",
      "Will the design be visible when I move my head?",
    ],
    views: ["front", "back"],
    anchor: { x: 100, y: 68, rot: 0, hw: 13, hh: 11 },
    paired: false,
  },
  {
    id: "thigh",
    label: "Thigh",
    areaIn: { w: 7, h: 10 },
    summary: "A roomy, rounded canvas that suits large and detailed pieces.",
    shapes: "Large ovals, portraits, floral compositions, animals, and designs that wrap slightly around the leg.",
    styles: "Realism, traditional, neo-traditional, illustrative and Japanese-inspired designs suit the scale.",
    visibility: "Covered by most clothing except shorts and swimwear, so it can be easily private or shown.",
    movement: "The thigh changes shape when you sit, walk or bend, so ask your artist how the design will look in different positions.",
    sun: "Mostly covered; shorts and swimwear expose it.",
    detail: "Plenty of room for detail. Outer thigh, front and inner thigh can differ in size and how they show, so ask about the best surface for your design.",
    questions: [
      "Front, outer or inner thigh: which suits this design?",
      "How will the design look when I sit or bend my knee?",
      "Could this be extended toward the knee or hip later?",
    ],
    views: ["front", "back"],
    anchor: { x: 81, y: 308, rot: 2, hw: 20, hh: 42 },
    paired: true,
  },
  {
    id: "leg",
    label: "Leg",
    areaIn: { w: 4, h: 16 },
    summary: "A long vertical canvas from thigh to ankle for tall or flowing compositions.",
    shapes: "Tall designs such as vines, tall architectural motifs, botanical stems, or a long piece running the length of the leg.",
    styles: "Any style that stretches well: botanical fine line, traditional, blackwork, or illustrative.",
    visibility: "Easy to cover with pants and reveal in shorts or skirts, depending on how far the design extends.",
    movement: "The leg bends at the knee and moves with walking, so long designs may need planning around the joint.",
    sun: "Exposure varies with how much of the leg you show.",
    detail: "Length suits flowing, detailed pieces. Bony areas near the knee and shin can be trickier to work with, so ask your artist about design placement.",
    questions: [
      "Should this design run the full length or stop before the knee?",
      "How will it look when my leg is bent?",
      "Could it be planned in sections?",
    ],
    views: ["front", "back"],
    anchor: { x: 79, y: 380, rot: 1, hw: 15, hh: 60 },
    paired: true,
    clickable: false,
  },
  {
    id: "calf",
    label: "Calf",
    areaIn: { w: 4.5, h: 8 },
    summary: "A rounded, muscular area on the back of the lower leg that suits tall, tapered designs.",
    shapes: "Vertical compositions with a slight taper: florals, animals, lettering, scenes and designs that follow the lower leg shape.",
    styles: "Traditional, realism, illustrative, geometric and botanical styles fit well.",
    visibility: "Covered by long pants and shown by shorts, skirts or swimwear.",
    movement: "The calf changes shape when you flex or point your foot, so ask how the design will look in motion.",
    sun: "Exposure depends on what you wear; shorts and skirts show it.",
    detail: "Good room for detail. The back of the calf is a comparatively wide surface, though design width narrows near the ankle.",
    questions: [
      "Should the piece sit on the back, outer or inner calf?",
      "How will the taper toward my ankle affect the design?",
      "How does it look when I flex or stand on tiptoe?",
    ],
    views: ["front", "back"],
    anchor: { x: 77, y: 410, rot: 1, hw: 15, hh: 32 },
    paired: true,
  },
  {
    id: "ankle",
    label: "Ankle",
    areaIn: { w: 2.5, h: 3 },
    summary: "A small, slim area good for delicate bands and tiny symbols.",
    shapes: "Small symbols, short words, thin bands or anklet-style wraps, and small florals or icons.",
    styles: "Minimalist, fine line and script are typical.",
    visibility: "Easy to show with cropped pants, skirts and low socks, and easy to cover with long pants.",
    movement: "The ankle flexes and shoes or socks can rub against the area, so ask about design choices that suit your footwear habits.",
    sun: "Exposure varies with footwear and clothing.",
    detail: "Small space; keep detail modest. Some people describe bonier areas as more uncomfortable, but experiences vary; the artist is the right person to advise.",
    questions: [
      "Which side of the ankle suits this design?",
      "How will shoes and socks interact with the placement?",
      "Is the design simple enough for the space?",
    ],
    views: ["front", "back"],
    anchor: { x: 75, y: 464, rot: 0, hw: 13, hh: 10 },
    paired: true,
  },
];

export const getPlacement = (id: string) => PLACEMENT_INFO.find((p) => p.id === id);

/** Resolves an anchor to concrete figure coordinates for one side. */
export function anchorFor(p: PlacementInfo, side: "left" | "right") {
  const a = p.anchor;
  if (!p.paired || side === "left") return { x: a.x, y: a.y, rot: a.rot ?? 0 };
  return { x: 200 - a.x, y: a.y, rot: -(a.rot ?? 0) };
}
