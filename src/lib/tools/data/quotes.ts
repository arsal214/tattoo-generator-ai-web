// Curated tattoo phrase dataset. Only ORIGINAL short phrases, public-domain proverbs, classical phrases,
// public-domain scripture and well-known mottos. No song lyrics or copyrighted quotes.
// Translations are plain, literal renderings. Always have a fluent speaker verify before tattooing.

export type QuoteLang = "en" | "la" | "es" | "fr" | "it";
export type QuoteSource = "original" | "proverb" | "motto" | "phrase" | "scripture";
export type QuoteTheme = "strength" | "resilience" | "love" | "family" | "freedom" | "gratitude" | "faith" | "adventure" | "hope" | "wisdom" | "peace";
export type QuoteMood = "calm" | "bold" | "romantic" | "reflective" | "playful";

export interface QuoteEntry {
  id: string;
  theme: QuoteTheme;
  mood: QuoteMood;
  source: QuoteSource;
  text: Record<QuoteLang, string>;
}

export const QUOTE_LANGS: { value: QuoteLang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "la", label: "Latin" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "it", label: "Italian" },
];

export const QUOTE_THEMES: QuoteTheme[] = ["strength", "resilience", "love", "family", "freedom", "gratitude", "faith", "adventure", "hope", "wisdom", "peace"];
export const QUOTE_MOODS: QuoteMood[] = ["calm", "bold", "romantic", "reflective", "playful"];

export const SOURCE_LABEL: Record<QuoteSource, string> = {
  original: "Original phrase",
  proverb: "Proverb",
  motto: "Motto",
  phrase: "Classical phrase",
  scripture: "Public-domain scripture",
};

export const wordCount = (s: string) => s.trim().split(/\s+/).length;
export type QuoteLength = "short" | "medium" | "long";
export const lengthOf = (q: QuoteEntry): QuoteLength => {
  const n = wordCount(q.text.en);
  return n <= 4 ? "short" : n <= 7 ? "medium" : "long";
};

type Row = [en: string, theme: QuoteTheme, mood: QuoteMood, source: QuoteSource, la: string, es: string, fr: string, it: string];

const ROWS: Row[] = [
  // strength
  ["Fortune favors the bold", "strength", "bold", "proverb", "Fortes fortuna adiuvat", "La fortuna favorece a los audaces", "La fortune sourit aux audacieux", "La fortuna aiuta gli audaci"],
  ["Stronger every day", "strength", "bold", "original", "Cotidie fortior", "Más fuerte cada día", "Plus fort chaque jour", "Più forte ogni giorno"],
  ["Strength in stillness", "strength", "calm", "original", "Fortitudo in quiete", "Fuerza en la calma", "La force dans le calme", "Forza nella calma"],
  ["Where there is a will, there is a way", "strength", "bold", "proverb", "Ubi voluntas, ibi via", "Querer es poder", "Vouloir, c'est pouvoir", "Volere è potere"],
  ["Mind over matter", "strength", "bold", "proverb", "Mens supra materiam", "La mente sobre la materia", "L'esprit sur la matière", "La mente sulla materia"],
  ["Gentle but strong", "strength", "calm", "motto", "Mitis sed fortis", "Suave pero fuerte", "Doux mais fort", "Dolce ma forte"],
  ["Fear less, live more", "strength", "bold", "original", "Minus time, magis vive", "Teme menos, vive más", "Crains moins, vis plus", "Temi meno, vivi di più"],
  ["Be bold", "strength", "bold", "original", "Audax esto", "Sé audaz", "Sois audacieux", "Sii audace"],
  ["Strong heart", "strength", "reflective", "original", "Cor forte", "Corazón fuerte", "Cœur fort", "Cuore forte"],
  ["Work conquers all", "strength", "bold", "motto", "Labor omnia vincit", "El trabajo lo vence todo", "Le travail vient à bout de tout", "Il lavoro vince ogni cosa"],
  // resilience
  ["Through hardships to the stars", "resilience", "bold", "motto", "Per aspera ad astra", "A través de las dificultades, hasta las estrellas", "À travers les épreuves, jusqu'aux étoiles", "Attraverso le difficoltà, fino alle stelle"],
  ["This too shall pass", "resilience", "calm", "proverb", "Hoc quoque transibit", "Esto también pasará", "Cela aussi passera", "Anche questo passerà"],
  ["Fall seven times, stand up eight", "resilience", "bold", "proverb", "Septies cade, octies surge", "Cae siete veces, levántate ocho", "Tombe sept fois, relève-toi huit", "Cadi sette volte, rialzati otto"],
  ["Rise again", "resilience", "bold", "original", "Resurge", "Vuelve a levantarte", "Relève-toi", "Rialzati"],
  ["After darkness, light", "resilience", "calm", "motto", "Post tenebras lux", "Tras las tinieblas, la luz", "Après les ténèbres, la lumière", "Dopo le tenebre, la luce"],
  ["Whoever endures, wins", "resilience", "bold", "proverb", "Vincit qui patitur", "Vence quien resiste", "Celui qui endure triomphe", "Vince chi sopporta"],
  ["Never despair", "resilience", "bold", "phrase", "Nil desperandum", "No desesperes nunca", "Ne désespère jamais", "Non disperare mai"],
  ["Keep going", "resilience", "calm", "original", "Perge", "Sigue adelante", "Poursuis ta route", "Vai avanti"],
  ["Love of fate", "resilience", "reflective", "phrase", "Amor fati", "Amor al destino", "Amour du destin", "Amore del destino"],
  ["Tossed by the waves, but never sunk", "resilience", "bold", "motto", "Fluctuat nec mergitur", "Agitado por las olas, pero nunca hundido", "Battu par les flots, mais jamais englouti", "Sballottato dalle onde, ma mai affondato"],
  // love
  ["Love conquers all", "love", "romantic", "phrase", "Amor vincit omnia", "El amor todo lo vence", "L'amour triomphe de tout", "L'amore vince tutto"],
  ["Love is love", "love", "calm", "original", "Amor est amor", "El amor es amor", "L'amour, c'est l'amour", "L'amore è amore"],
  ["My heart is yours", "love", "romantic", "original", "Cor meum tuum est", "Mi corazón es tuyo", "Mon cœur est à toi", "Il mio cuore è tuo"],
  ["Always and forever", "love", "romantic", "original", "Semper et in aeternum", "Siempre y para siempre", "Toujours et à jamais", "Sempre e per sempre"],
  ["You are my home", "love", "romantic", "original", "Tu es domus mea", "Eres mi hogar", "Tu es mon foyer", "Sei la mia casa"],
  ["Two hearts, one story", "love", "romantic", "original", "Duo corda, una fabula", "Dos corazones, una historia", "Deux cœurs, une histoire", "Due cuori, una storia"],
  ["Love lights the way", "love", "calm", "original", "Amor viam illuminat", "El amor ilumina el camino", "L'amour éclaire le chemin", "L'amore illumina il cammino"],
  ["Love and light", "love", "calm", "original", "Amor et lux", "Amor y luz", "Amour et lumière", "Amore e luce"],
  ["Love is stronger than fear", "love", "bold", "original", "Amor fortior est quam timor", "El amor es más fuerte que el miedo", "L'amour est plus fort que la peur", "L'amore è più forte della paura"],
  ["With all my heart", "love", "romantic", "phrase", "Toto corde", "Con todo mi corazón", "De tout mon cœur", "Con tutto il cuore"],
  ["Sun and moon", "love", "romantic", "original", "Sol et luna", "Sol y luna", "Soleil et lune", "Sole e luna"],
  ["Under the same sky", "love", "romantic", "original", "Sub eodem caelo", "Bajo el mismo cielo", "Sous le même ciel", "Sotto lo stesso cielo"],
  ["Live, laugh, love", "love", "playful", "original", "Vive, ride, ama", "Vive, ríe, ama", "Vis, ris, aime", "Vivi, ridi, ama"],
  // family
  ["Family above all", "family", "bold", "original", "Familia ante omnia", "La familia por encima de todo", "La famille avant tout", "La famiglia prima di tutto"],
  ["Home is where the heart is", "family", "calm", "proverb", "Ubi cor, ibi domus", "El hogar está donde está el corazón", "Le foyer est là où est le cœur", "Casa è dove sta il cuore"],
  ["Family is everything", "family", "calm", "original", "Familia omnia est", "La familia lo es todo", "La famille, c'est tout", "La famiglia è tutto"],
  ["Our roots run deep", "family", "reflective", "original", "Radices nostrae altae sunt", "Nuestras raíces son profundas", "Nos racines sont profondes", "Le nostre radici sono profonde"],
  ["A mother's love", "family", "romantic", "original", "Amor matris", "Amor de madre", "Amour de mère", "Amore di madre"],
  ["Family forever", "family", "reflective", "original", "Familia in aeternum", "Familia para siempre", "Famille pour toujours", "Famiglia per sempre"],
  ["Together we are strong", "family", "bold", "original", "Simul fortes sumus", "Juntos somos fuertes", "Ensemble, nous sommes forts", "Insieme siamo forti"],
  ["Strong roots, strong branches", "family", "reflective", "original", "Radices firmae, rami firmi", "Raíces fuertes, ramas fuertes", "Racines fortes, branches fortes", "Radici forti, rami forti"],
  // freedom
  ["Free spirit", "freedom", "bold", "original", "Animus liber", "Espíritu libre", "Esprit libre", "Spirito libero"],
  ["Wild and free", "freedom", "bold", "original", "Ferus et liber", "Salvaje y libre", "Sauvage et libre", "Selvaggio e libero"],
  ["Live free", "freedom", "bold", "original", "Liber vive", "Vive libre", "Vis libre", "Vivi libero"],
  ["Free as a bird", "freedom", "playful", "proverb", "Liber ut avis", "Libre como un pájaro", "Libre comme un oiseau", "Libero come un uccello"],
  ["Fly high", "freedom", "playful", "original", "Alte vola", "Vuela alto", "Vole haut", "Vola alto"],
  ["She flies with her own wings", "freedom", "reflective", "motto", "Alis volat propriis", "Vuela con sus propias alas", "Elle vole de ses propres ailes", "Vola con le proprie ali"],
  ["Spread your wings", "freedom", "bold", "original", "Alas expande", "Extiende tus alas", "Déploie tes ailes", "Spiega le ali"],
  ["Stay wild", "freedom", "playful", "original", "Ferus mane", "Sigue siendo salvaje", "Reste sauvage", "Resta selvaggio"],
  // gratitude
  ["Grateful heart", "gratitude", "calm", "original", "Cor gratum", "Corazón agradecido", "Cœur reconnaissant", "Cuore grato"],
  ["Give thanks", "gratitude", "calm", "phrase", "Gratias age", "Da las gracias", "Rends grâce", "Rendi grazie"],
  ["Every day is a gift", "gratitude", "reflective", "original", "Omnis dies donum est", "Cada día es un regalo", "Chaque jour est un cadeau", "Ogni giorno è un dono"],
  ["Here and now", "peace", "calm", "phrase", "Hic et nunc", "Aquí y ahora", "Ici et maintenant", "Qui e ora"],
  ["Grace", "gratitude", "calm", "phrase", "Gratia", "Gracia", "Grâce", "Grazia"],
  ["Joy", "gratitude", "playful", "phrase", "Gaudium", "Alegría", "Joie", "Gioia"],
  ["Simple life, full heart", "gratitude", "calm", "original", "Vita simplex, cor plenum", "Vida sencilla, corazón lleno", "Vie simple, cœur plein", "Vita semplice, cuore pieno"],
  ["Happy soul", "gratitude", "playful", "original", "Anima laeta", "Alma feliz", "Âme joyeuse", "Anima felice"],
  // faith
  ["Faith over fear", "faith", "bold", "original", "Fides supra metum", "Fe por encima del miedo", "La foi plutôt que la peur", "Fede al di sopra della paura"],
  ["Have faith", "faith", "calm", "original", "Fidem habe", "Ten fe", "Aie la foi", "Abbi fede"],
  ["Glory to God alone", "faith", "reflective", "motto", "Soli Deo gloria", "Gloria solo a Dios", "Gloire à Dieu seul", "Gloria a Dio solo"],
  ["God is love", "faith", "calm", "scripture", "Deus caritas est", "Dios es amor", "Dieu est amour", "Dio è amore"],
  ["Peace be with you", "peace", "calm", "scripture", "Pax tecum", "La paz sea contigo", "Que la paix soit avec toi", "La pace sia con te"],
  ["Pray and work", "faith", "calm", "motto", "Ora et labora", "Reza y trabaja", "Prie et travaille", "Prega e lavora"],
  ["We walk by faith, not by sight", "faith", "reflective", "scripture", "Per fidem ambulamus, non per speciem", "Por fe andamos, no por vista", "Car nous marchons par la foi et non par la vue", "Poiché camminiamo per fede e non per visione"],
  // adventure
  ["Seize the day", "adventure", "bold", "phrase", "Carpe diem", "Aprovecha el día", "Saisis le jour", "Cogli l'attimo"],
  ["I came, I saw, I conquered", "adventure", "bold", "phrase", "Veni, vidi, vici", "Vine, vi, vencí", "Je suis venu, j'ai vu, j'ai vaincu", "Venni, vidi, vinsi"],
  ["Explore", "adventure", "bold", "original", "Explora", "Explora", "Explore", "Esplora"],
  ["Follow the stars", "adventure", "calm", "original", "Sidera sequere", "Sigue las estrellas", "Suis les étoiles", "Segui le stelle"],
  ["To the stars", "adventure", "reflective", "motto", "Ad astra", "Hacia las estrellas", "Vers les étoiles", "Verso le stelle"],
  ["Find your own path", "adventure", "reflective", "original", "Viam tuam inveni", "Encuentra tu propio camino", "Trouve ton propre chemin", "Trova la tua strada"],
  ["Either I find a way or make one", "adventure", "bold", "phrase", "Aut viam inveniam aut faciam", "O encontraré un camino o lo haré", "Je trouverai un chemin ou j'en ferai un", "O troverò una strada o ne farò una"],
  ["Life is a journey", "adventure", "reflective", "original", "Vita iter est", "La vida es un viaje", "La vie est un voyage", "La vita è un viaggio"],
  ["Chase the sun", "adventure", "playful", "original", "Solem sequere", "Persigue el sol", "Poursuis le soleil", "Insegui il sole"],
  ["Small steps, big journeys", "adventure", "calm", "original", "Parvi gradus, magna itinera", "Pequeños pasos, grandes viajes", "Petits pas, grands voyages", "Piccoli passi, grandi viaggi"],
  ["Dream big", "adventure", "playful", "original", "Magna somnia", "Sueña en grande", "Rêve en grand", "Sogna in grande"],
  ["Seize the night", "adventure", "playful", "phrase", "Carpe noctem", "Aprovecha la noche", "Saisis la nuit", "Cogli la notte"],
  // hope
  ["Hope", "hope", "calm", "phrase", "Spes", "Esperanza", "Espoir", "Speranza"],
  ["While I breathe, I hope", "hope", "reflective", "motto", "Dum spiro, spero", "Mientras respiro, espero", "Tant que je respire, j'espère", "Finché respiro, spero"],
  ["Where there is life, there is hope", "hope", "calm", "proverb", "Dum vita est, spes est", "Mientras hay vida, hay esperanza", "Tant qu'il y a de la vie, il y a de l'espoir", "Finché c'è vita, c'è speranza"],
  ["Better days are coming", "hope", "calm", "original", "Meliores dies veniunt", "Vienen días mejores", "De meilleurs jours arrivent", "Arrivano giorni migliori"],
  ["Bloom", "hope", "playful", "original", "Flore", "Florece", "Fleuris", "Fiorisci"],
  ["After clouds, the sun", "hope", "calm", "motto", "Post nubila, Phoebus", "Tras las nubes, el sol", "Après les nuages, le soleil", "Dopo le nuvole, il sole"],
  ["Begin again", "hope", "calm", "original", "Iterum incipe", "Empieza de nuevo", "Recommence", "Ricomincia"],
  // wisdom
  ["Know yourself", "wisdom", "reflective", "phrase", "Nosce te ipsum", "Conócete a ti mismo", "Connais-toi toi-même", "Conosci te stesso"],
  ["Dare to know", "wisdom", "bold", "phrase", "Sapere aude", "Atrévete a saber", "Ose savoir", "Osa sapere"],
  ["Remember you will die", "wisdom", "reflective", "phrase", "Memento mori", "Recuerda que morirás", "Souviens-toi que tu mourras", "Ricordati che devi morire"],
  ["Time flies", "wisdom", "reflective", "phrase", "Tempus fugit", "El tiempo vuela", "Le temps file", "Il tempo vola"],
  ["Art is long, life is short", "wisdom", "reflective", "phrase", "Ars longa, vita brevis", "El arte es largo, la vida es corta", "L'art est long, la vie est courte", "L'arte è lunga, la vita è breve"],
  ["I think, therefore I am", "wisdom", "reflective", "phrase", "Cogito, ergo sum", "Pienso, luego existo", "Je pense, donc je suis", "Penso, dunque sono"],
  ["Hasten slowly", "peace", "calm", "phrase", "Festina lente", "Apresúrate despacio", "Hâte-toi lentement", "Affrettati lentamente"],
  ["A sound mind in a sound body", "wisdom", "calm", "phrase", "Mens sana in corpore sano", "Mente sana en cuerpo sano", "Un esprit sain dans un corps sain", "Mente sana in corpo sano"],
  ["Better late than never", "wisdom", "playful", "proverb", "Potius sero quam numquam", "Más vale tarde que nunca", "Mieux vaut tard que jamais", "Meglio tardi che mai"],
  ["Deeds, not words", "wisdom", "bold", "motto", "Acta, non verba", "Hechos, no palabras", "Des actes, pas des mots", "Fatti, non parole"],
  ["Truth", "wisdom", "calm", "phrase", "Veritas", "Verdad", "Vérité", "Verità"],
  // peace
  ["Breathe", "peace", "calm", "original", "Respira", "Respira", "Respire", "Respira"],
];

export const QUOTES: QuoteEntry[] = ROWS.map(([en, theme, mood, source, la, es, fr, it], i) => ({
  id: `q${i + 1}`,
  theme,
  mood,
  source,
  text: { en, la, es, fr, it },
}));
