/* =========================================================
   Zeine Moualla · English / Français
   The page is written in English. This file holds the French text and swaps it in place
   (no reload). Each entry maps the exact English text to its French version.
   Vocabulary follows Zeine's French CV (french/french.txt): concepteur computationnel,
   conception paramétrique, géométrie complexe, temps réel, rendus photoréalistes...
   The choice is remembered, and ?lang=fr opens the site in French.
   Loaded before main.js.
   ========================================================= */
(() => {
  const NB = ' ';   // non-breaking space before French ":" and similar

  const FR = {
    // Navigation
    'Work': 'Projets',
    'Concepts': 'Concepts',
    'Interiors': 'Intérieurs',
    'Films': 'Films',
    'About': 'À propos',
    'Let’s talk': 'Parlons-en',

    // Hero
    'Architect · Computational Designer': 'Architecte · Concepteur computationnel',
    'Deconstructing complex geometry.': 'Déconstruire la géométrie complexe.',
    'Bridging avant-garde architectural concepts with interactive digital reality.':
      'Relier les concepts architecturaux d’avant-garde à une réalité numérique interactive.',

    // Manifesto + approach
    'Manifesto': 'Manifeste',
    'Form-finding': 'Trouver la forme',
    'through logic.': 'par la logique.',
    'I specialize in the computational transition from raw, fluid architectural concepts to structurally coherent, high-fidelity digital systems.':
      'Mon métier : transformer des concepts architecturaux bruts et fluides en systèmes numériques précis et cohérents sur le plan structurel.',
    'I collaborate with architects as a co-creator, exploring bold concepts and iterating toward refined design solutions across façades, interiors and furniture.':
      'Je travaille avec les architectes comme co-créateur. J’explore des concepts audacieux et j’affine les solutions par itérations, pour les façades, les intérieurs et le mobilier.',
    'Concept': 'Concept',
    'Exploration': 'Exploration',
    'Iteration': 'Itération',
    'Digital reality': 'Réalité numérique',

    // Museum of Contemporary Art
    'Selected Work': 'Projets choisis',
    'Museum of': 'Musée d’art',
    'Contemporary Art': 'contemporain',
    'A museum conceived as one continuous, fluid form. Explored through parametric systems in Rhino and Grasshopper, and brought to life as a real-time, interactive experience in Unreal Engine.':
      'Un musée pensé comme une seule forme, fluide et continue. Exploré avec des systèmes paramétriques dans Rhino et Grasshopper, puis rendu vivant dans Unreal Engine, comme une expérience interactive en temps réel.',
    'Typology': 'Typologie',
    'Cultural · Museum': 'Culturel · Musée',
    'Role': 'Rôle',
    'Designer & Computational Designer': 'Concepteur & concepteur computationnel',
    'Context': 'Contexte',
    'Academic project': 'Projet académique (diplôme)',
    'Tools': 'Outils',
    '01 · Form': '01 · Forme',
    'One continuous, fluid shell.': 'Une seule coque, fluide et continue.',
    'The envelope emerges as a single surface, form-found parametrically in Rhino and Grasshopper.':
      'L’enveloppe naît d’une surface unique, trouvée par la conception paramétrique dans Rhino et Grasshopper.',
    '02 · Skin': '02 · Peau',
    'A façade that follows the curve.': 'Une façade qui suit la courbe.',
    'Grasshopper and Rhino drive dynamic façades and adaptive systems. Two façade options, every iteration pushing the idea further.':
      'Grasshopper et Rhino pilotent des façades dynamiques et des systèmes adaptatifs. Deux options de façade, et chaque itération pousse l’idée plus loin.',
    '03 · Atrium': '03 · Atrium',
    'Where art meets the sky.': 'Là où l’art rencontre le ciel.',
    'Sleek curves and seamless surfaces, explored through multiple design variations of the same space.':
      'Des courbes épurées et des surfaces continues, explorées à travers plusieurs variantes du même espace.',
    '04 · Surface': '04 · Surface',
    'Sculpted like windblown sand.': 'Sculpté comme le sable par le vent.',
    'Furniture options, each one shown from its closest detail to the full piece.':
      'Des options de mobilier, chacune montrée du plus petit détail à la pièce entière.',
    '05 · Panels': '05 · Panneaux',
    'Light, filtered by geometry.': 'La lumière, filtrée par la géométrie.',
    'Customizable panels in GRC and ultra-high-performance concrete, where computational rigor meets striking visuals.':
      'Des panneaux sur mesure en GRC et en béton fibré à ultra-hautes performances (BFUP), où la rigueur computationnelle rencontre la force visuelle.',
    'In detail.': 'En détail.',
    'Design options of the same spaces, rendered in real time.': 'Des variantes des mêmes espaces, rendues en temps réel.',
    'Atrium · four design options': 'Atrium · quatre variantes',
    'Interior': 'Intérieur',
    'Seating area': 'Espace salon',
    'Panel options': 'Options de panneaux',
    'Atrium': 'Atrium',

    // Real time / VR
    'Built in Unreal Engine': 'Réalisé avec Unreal Engine',
    'Explore it': 'Explorez-le',
    'in real time.': 'en temps réel.',
    'With a Meta Quest headset and VR controllers, step directly into the architectural vision for a fully immersive exploration. Feel the scale, light and spatial dynamics as if you were physically there, and go through design options in real time.':
      'Avec un casque Meta Quest et ses manettes, entrez directement dans le projet pour une exploration totalement immersive. Ressentez l’échelle, la lumière et l’espace comme si vous y étiez, et passez d’une variante à l’autre en temps réel.',
    'First-person, third-person & VR': '1re personne, 3e personne & VR',
    'Immersive walkthroughs of the interior and exterior, ready for virtual reality reviews.':
      'Des visites immersives de l’intérieur et de l’extérieur, prêtes pour des revues en réalité virtuelle.',
    'Switch proposals instantly': 'Changer de proposition en un clic',
    'Blueprint-driven menus swap façade options and exterior and interior paneling with a click, for live side-by-side comparison.':
      'Des menus en Blueprints changent les options de façade et les panneaux extérieurs et intérieurs en un clic, pour comparer côte à côte, en direct.',
    'Change materials live': 'Changer les matériaux en direct',
    'Concrete, GRG, GRC or wood. Material studies on the fly, plus interactive sliding and rotating door systems.':
      'Béton, GRG, GRC ou bois. Des études de matériaux à la volée, avec des portes coulissantes et pivotantes interactives.',

    // Concept work (MDL Singapore)
    'Concept work': 'Recherches conceptuelles',
    'Concept explorations.': 'Explorations conceptuelles.',
    'Mixed use': 'Usage mixte',
    'Computational Designer · Concept exploration · Iteration': 'Concepteur computationnel · Exploration conceptuelle · Itération',
    'Cultural center': 'Centre culturel',

    // Interiors (MDL Singapore)
    'Interior design.': 'Architecture intérieure.',
    '3D design and visualization at MDL Singapore.': 'Conception 3D et visualisation chez MDL Singapore.',
    'Hotel lobby': 'Hall d’hôtel',
    'Multipurpose hall': 'Salle polyvalente',
    'Rooftop restaurant': 'Restaurant sur le toit',
    'Hotel lobby · Multipurpose hall · Rooftop restaurant': 'Hall d’hôtel · Salle polyvalente · Restaurant sur le toit',
    '3D Designer · Concept exploration · Visualization': 'Concepteur 3D · Exploration conceptuelle · Visualisation',
    'Hotel bedroom': 'Chambre d’hôtel',

    // Films
    'Watch the work': 'Voir le travail',
    'in motion.': 'en mouvement.',
    'Zeine Moualla on YouTube': 'Zeine Moualla sur YouTube',
    'Zeine Moualla on YouTube ↗': 'Zeine Moualla sur YouTube ↗',
    'Animations': 'Animations',
    'Cinematic fly-throughs of fluid, parametric interiors, exteriors and landscape.':
      'Des survols cinématiques d’intérieurs, d’extérieurs et de paysages fluides et paramétriques.',
    'Animation': 'Animation',
    'Fluid & Parametric Interiors': 'Intérieurs fluides & paramétriques',
    'Fluid & Parametric Exterior and Landscape': 'Extérieur et paysage fluides & paramétriques',
    'Unreal Engine · VR & interactive': 'Unreal Engine · VR & interactif',
    'Real-time exploration of the same fluid architecture: in virtual reality, first-person and third-person.':
      `La même architecture fluide, explorée en temps réel${NB}: en réalité virtuelle, à la première et à la troisième personne.`,
    'Virtual-reality exploration': 'Exploration en réalité virtuelle',
    'Unreal Engine · Interactive': 'Unreal Engine · Interactif',
    'First-person exploration': 'Exploration à la première personne',
    'Third-person exploration': 'Exploration à la troisième personne',

    // About
    'Architect, computational designer & Unreal Engine developer.': 'Architecte, concepteur computationnel & développeur Unreal Engine.',
    'Based in Bali, collaborating with studios worldwide.': 'Basé à Bali, je collabore avec des agences du monde entier.',
    'Based in': 'Basé à',
    'Bali, Indonesia': 'Bali, Indonésie',
    'Focus': 'Spécialités',
    'Computational design · Complex geometry · Visualization': 'Conception computationnelle · Géométrie complexe · Visualisation',
    'Languages': 'Langues',
    'English · French · Arabic': 'Anglais · Français · Arabe',
    'Works with': 'Collabore avec',
    'Studios in the UK, Singapore & UAE': 'Des agences au Royaume-Uni, à Singapour et aux Émirats',
    'My work spans the entire architectural spectrum, from residential villas to cultural centers and museums, encompassing both elegantly simple contemporary designs and daring, fluid forms.':
      'Mon travail couvre tout le champ de l’architecture, de la villa au centre culturel et au musée : des projets contemporains d’une grande simplicité, comme des formes fluides et audacieuses.',
    'I collaborate with architects to explore bold design concepts and iterate toward refined design solutions. As a Computational Designer specializing in complex geometry and parametric systems (Rhino/Grasshopper) for avant-garde architectural projects, I translate daring concepts into high-fidelity exterior and interior visualizations and animations.':
      'Je travaille avec les architectes pour explorer des concepts audacieux et les affiner jusqu’à la bonne solution. Concepteur computationnel spécialisé en géométrie complexe et en systèmes paramétriques (Rhino/Grasshopper) pour des projets d’avant-garde, je traduis ces concepts en visualisations et animations photoréalistes, en intérieur comme en extérieur.',
    'Experience': 'Expérience',
    '2023 to now': '2023 à aujourd’hui',
    'Private Tutor · Parametric Design & Visualization': 'Formateur particulier · Conception paramétrique & visualisation',
    'Unreal Engine, Rhino, Grasshopper · 30+ students mentored': 'Unreal Engine, Rhino, Grasshopper · plus de 30 étudiants accompagnés',
    'Self-employed · Remote': 'Indépendant · À distance',
    '2020 to 2022': '2020 à 2022',
    '3D Computational Designer · Architectural Visualizer': 'Concepteur computationnel 3D · Visualisateur architectural',
    'Avant-garde international hospitality, mixed-use & commercial projects': 'Projets internationaux d’avant-garde : hôtellerie, usage mixte et commerces',
    'MDL, Mercurio Design Lab · Singapore': 'MDL, Mercurio Design Lab · Singapour',
    '3D Modeler · Freelance': 'Modélisateur 3D · Freelance',
    'VR-ready model of Bee’ah Headquarters by Zaha Hadid Architects': 'Modèle prêt pour la VR du siège de Bee’ah, de Zaha Hadid Architects',
    'Engage Works · London': 'Engage Works · Londres',
    '2016 to 2019': '2016 à 2019',
    'Junior Architect · Architectural Visualizer': 'Architecte junior · Visualisateur architectural',
    'Interiors, façades, landscape, visualization & animation': 'Intérieurs, façades, paysage, visualisation & animation',
    'PCH Décor · Sharjah, UAE': 'PCH Décor · Sharjah, Émirats arabes unis',
    'VR development': 'Développement VR',

    // Contact
    'Let’s shape something': 'Façonnons ensemble',
    'daring together.': 'quelque chose d’audacieux.',
    'Background:': `Arrière-plan${NB}:`,
    'Fluidity': 'Fluidité',
    ', personal artwork': ', œuvre personnelle',
    'Architect · Computational Designer · Bali': 'Architecte · Concepteur computationnel · Bali',
  };

  // Screen-reader labels and image descriptions
  const FR_ATTR = {
    'Zeine Moualla, home': 'Zeine Moualla, accueil',
    'Primary': 'Principal',
    'Language': 'Langue',
    'Zeine Moualla, showreel': 'Zeine Moualla, bande démo',
    'Introduction': 'Introduction',
    'Tools': 'Outils',
    'Manifesto': 'Manifeste',
    'Approach': 'Approche',
    'Process': 'Processus',
    'Museum of Contemporary Art, chapters': 'Musée d’art contemporain, chapitres',
    'Project details': 'Détails du projet',
    'Molecule, conceptual 3D model, iteration 3': 'Molecule, modèle 3D conceptuel, itération 3',
    'Play: Fluid & Parametric Interiors': 'Lire : Intérieurs fluides & paramétriques',
    'Play: Fluid & Parametric Exterior and Landscape': 'Lire : Extérieur et paysage fluides & paramétriques',
    'Play: Virtual-reality exploration in Unreal Engine': 'Lire : exploration en réalité virtuelle dans Unreal Engine',
    'Play: First-person exploration in Unreal Engine': 'Lire : exploration à la première personne dans Unreal Engine',
    'Play: Third-person exploration in Unreal Engine': 'Lire : exploration à la troisième personne dans Unreal Engine',
    'Video player': 'Lecteur vidéo',
    'Close video': 'Fermer la vidéo',
  };

  const MANIFESTO_FR =
    'Faire le lien entre la précision algorithmique et <em>la fluidité libre.</em> ' +
    'Chaque forme fluide est un système émergent, façonné par les courants et les forces invisibles qu’il&nbsp;rencontre.';

  const META = {
    en: { title: document.title, desc: document.querySelector('meta[name="description"]')?.content || '' },
    fr: {
      title: 'Zeine Moualla · Concepteur computationnel',
      desc: 'Zeine Moualla, architecte et concepteur computationnel. Géométrie complexe, systèmes paramétriques et visualisation en temps réel pour une architecture d’avant-garde.',
    },
  };

  /* ---------- machinery ---------- */
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const EN_OF = {};                                   // French → English, for text created while French is showing
  Object.entries(FR).forEach(([en, fr]) => { EN_OF[norm(fr)] = en; });
  const EN_ATTR_OF = {};
  Object.entries(FR_ATTR).forEach(([en, fr]) => { EN_ATTR_OF[fr] = en; });

  const textEn = new WeakMap();                       // text node → its English text
  const attrEn = new WeakMap();                       // element → { attribute: English value }
  const ATTRS = ['alt', 'aria-label', 'title'];
  const manifesto = document.querySelector('[data-words]');
  const manifestoEn = manifesto ? manifesto.innerHTML : '';
  let current = 'en';

  const skip = (el) => !el || el.closest('script, style, [data-words], .lang, [data-no-translate]');

  // keep the spaces around the words, swap only the words
  const swap = (node, text) => {
    const raw = node.textContent;
    const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    if (norm(raw) !== norm(text)) node.textContent = lead + text + trail;
  };

  function translate(lang) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (skip(n.parentElement) || !norm(n.textContent) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      if (!textEn.has(n)) { const t = norm(n.textContent); textEn.set(n, EN_OF[t] || t); }
      const en = textEn.get(n);
      swap(n, lang === 'fr' ? (FR[en] ?? en) : en);
    });

    document.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(',')).forEach((el) => {
      if (!attrEn.has(el)) {
        const o = {};
        ATTRS.forEach((a) => { const v = el.getAttribute(a); if (v) o[a] = EN_ATTR_OF[v] || v; });
        attrEn.set(el, o);
      }
      Object.entries(attrEn.get(el)).forEach(([a, en]) => el.setAttribute(a, lang === 'fr' ? (FR_ATTR[en] ?? en) : en));
    });

    if (manifesto) {
      const html = lang === 'fr' ? MANIFESTO_FR : manifestoEn;
      if (manifesto.zmSetText) manifesto.zmSetText(html);   // already split into words by main.js
      else manifesto.innerHTML = html;
    }

    document.documentElement.lang = lang;
    document.title = META[lang].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', META[lang].desc);
    document.querySelectorAll('.lang [data-lang]').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    current = lang;
  }

  function setLang(lang, { save = true } = {}) {
    if (lang !== 'en' && lang !== 'fr') return;
    translate(lang);
    if (save) { try { localStorage.setItem('zm-lang', lang); } catch (e) { /* private mode */ } }
    // text length changes the page height: let the scroll animations re-measure
    if (window.ScrollTrigger) requestAnimationFrame(() => window.ScrollTrigger.refresh());
  }

  // starting language: ?lang= in the address, else the visitor's last choice, else English
  let start = 'en';
  try { start = localStorage.getItem('zm-lang') || 'en'; } catch (e) { /* ignore */ }
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (fromUrl === 'fr' || fromUrl === 'en') start = fromUrl;

  if (start === 'fr') translate('fr');                   // before main.js builds its animations
  // run once more after main.js, to cover text it creates (clip titles, the doubled tools strip)
  setTimeout(() => translate(current), 0);

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.lang [data-lang]');
    if (b) setLang(b.dataset.lang);
  });
})();
