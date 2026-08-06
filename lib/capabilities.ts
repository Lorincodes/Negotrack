import type { Locale } from "./i18n";

/**
 * Capability pages.
 *
 * These describe what NegoTrack is being built to do. The product is
 * pre-launch, so every page is written in that register: what it covers, what
 * it is for, and what you will see — never "our customers find" or a figure
 * presented as operational. The homepage already labels its product previews as
 * demonstration data and these pages must not quietly contradict that.
 *
 * Intent is deliberately split from the guides. A guide answers the visitor's
 * problem ("why isn't my business showing on Google Maps"); a capability page
 * answers what the product does about it. Pointing both at the same query would
 * have them competing with each other for one position, so each capability
 * links to its guide instead.
 */

export type Capability = {
  slug: string;
  locale: Locale;
  /** Matches the label used in the homepage capability grid. */
  name: string;
  title: string;
  description: string;
  lead: string;
  /** What the capability covers, as concrete checks rather than adjectives. */
  covers: string[];
  why: string[];
  /** Slug of the guide that answers the underlying question. */
  relatedGuide?: string;
  faq: { q: string; a: string }[];
};

export const capabilities: Capability[] = [
  // ── English ───────────────────────────────────────────────────────────────
  {
    slug: "business-health-score",
    locale: "en-GB",
    name: "Business Health Score",
    title: "Business Health Score",
    description:
      "One number covering website, search visibility, reviews and local presence — and the ordered list of what to fix to move it.",
    lead:
      "The Business Health Score condenses everything NegoTrack monitors into a single figure, then shows exactly which checks are pulling it down. It exists so you can tell whether things are improving without reading four separate reports.",
    covers: [
      "Website health, speed and mobile usability",
      "Search visibility and indexing",
      "Reviews and response rate",
      "Local presence and map visibility",
      "Competitor position in your area",
    ],
    why: [
      "Most small businesses do not lack data — they lack a way to compare Tuesday to last month. Rankings live in one tool, reviews in another, page speed in a third, and none of them agree on what matters.",
      "A single score is only useful if you can open it up. Every point is traceable to a specific check, so the score is a way in to the detail rather than a substitute for it.",
    ],
    faq: [
      {
        q: "How is the score calculated?",
        a: "It combines the areas NegoTrack monitors — website health, search visibility, reviews, local presence and competitor position — weighted towards the things that most affect whether a local customer finds you and chooses you. Every score opens into the individual checks behind it.",
      },
      {
        q: "Is the score available yet?",
        a: "NegoTrack is in development and the private beta has not opened. The scores shown on this site are clearly labelled demonstration data, not a live assessment of any business.",
      },
    ],
  },
  {
    slug: "website-audit",
    locale: "en-GB",
    name: "Website Audit",
    title: "Website Audit",
    description:
      "Speed, mobile usability, structure and conversion issues checked together and explained in plain language, not developer jargon.",
    lead:
      "The website audit checks the things that decide whether a visitor stays: how fast the page loads on a phone, whether it is readable one-handed, whether it says what you do, and whether contacting you is easy. Findings are written so you can act on them or hand them to a developer.",
    covers: [
      "Load time on mobile connections, not just broadband",
      "Mobile layout, tap targets and readable text",
      "Whether the page states what you do and where",
      "Contact routes: tappable phone, working forms",
      "Indexing — whether search engines can see the site at all",
    ],
    why: [
      "Website reports are usually written for the person who built the site, not the person who paid for it. A list of render-blocking resources tells an owner nothing about whether they are losing customers.",
      "Every finding is phrased as the problem and the consequence, so you can decide what is worth fixing and what is noise.",
    ],
    relatedGuide: "is-my-website-losing-customers",
    faq: [
      {
        q: "Do I need technical knowledge to use it?",
        a: "No. Findings are written in plain language with the consequence stated, so you can judge what matters. Where a fix genuinely needs a developer, the finding is phrased so you can forward it directly.",
      },
      {
        q: "Does it change anything on my website?",
        a: "No. An audit reads your site and reports what it finds. It never modifies anything.",
      },
    ],
  },
  {
    slug: "seo-tracking",
    locale: "en-GB",
    name: "SEO Tracking",
    title: "SEO Tracking",
    description:
      "Track the search terms that actually bring local customers, and see which pages are indexed, missing or competing with each other.",
    lead:
      "SEO tracking follows the search terms that bring you work — not vanity keywords — and shows whether your pages are indexed, whether positions are moving, and where you have no page covering a service you offer.",
    covers: [
      "Positions for the local terms your customers search",
      "Which pages are indexed and which are missing",
      "Services with no page covering them",
      "Movement over time, not a single snapshot",
    ],
    why: [
      "Ranking tools are built for agencies managing hundreds of keywords. A plumber needs to know about a dozen terms and whether the boiler-repair page exists at all.",
      "Position on its own is not an outcome. What matters is whether the terms that bring paying work are covered, and whether they are getting better or worse.",
    ],
    faq: [
      {
        q: "How many search terms can I track?",
        a: "The focus is on the terms that bring local enquiries rather than tracking as many as possible. A small local business is usually well served by a couple of dozen genuinely relevant terms.",
      },
      {
        q: "Is this the same as an SEO agency?",
        a: "No. NegoTrack tells you what is happening and what to prioritise. It does not do the work for you, and it will not pretend a monitoring tool replaces someone writing pages and earning links.",
      },
    ],
  },
  {
    slug: "review-monitoring",
    locale: "en-GB",
    name: "Review Monitoring",
    title: "Review Monitoring",
    description:
      "See new reviews, what they keep mentioning, which ones you have not answered, and how your rating compares locally.",
    lead:
      "Review monitoring collects your reviews in one place, surfaces the ones still waiting for a reply, and shows what customers repeatedly mention — the themes that tell you what is actually working and what is not.",
    covers: [
      "New reviews as they arrive",
      "Reviews still awaiting a response",
      "Recurring themes across what customers write",
      "Rating and volume compared with nearby competitors",
      "Response rate over time",
    ],
    why: [
      "Reviews are the most-read thing about most local businesses, and the least systematically managed. An unanswered one-star review sits there for years.",
      "The themes matter more than the average. Twelve people mentioning how long you took to call back is a business problem, not a reputation problem.",
    ],
    relatedGuide: "how-to-ask-for-google-reviews",
    faq: [
      {
        q: "Can NegoTrack reply to reviews for me?",
        a: "No. Replies are yours to write. Monitoring shows you which reviews need one and what they are about; an automated reply from a tool reads exactly like an automated reply from a tool.",
      },
      {
        q: "Can it remove bad reviews?",
        a: "No, and neither can anyone else. Reviews can only be removed by the platform when they breach its policies. Any service claiming otherwise is selling you something that does not work.",
      },
    ],
  },
  {
    slug: "local-visibility",
    locale: "en-GB",
    name: "Local Visibility",
    title: "Local Visibility",
    description:
      "Check whether your business appears in local search and maps, whether your profile is complete, and what is holding it back.",
    lead:
      "Local visibility monitoring checks whether people searching for your service in your area actually find you — profile completeness, category, opening hours, duplicates and map presence — and flags the specific thing that is limiting you.",
    covers: [
      "Whether your profile is verified and complete",
      "Primary category, the single biggest lever on local ranking",
      "Duplicate listings splitting your signals",
      "Opening hours and business details consistency",
      "Map presence for the services you offer",
    ],
    why: [
      "For most local businesses the map listing brings more enquiries than the website does, especially in the first year. It is also the thing owners are least often told to check.",
      "The problems are usually mundane and fixable — an unverified profile, a duplicate nobody noticed, a category that describes the wrong trade — but invisible unless something is looking for them.",
    ],
    relatedGuide: "why-isnt-my-business-showing-on-google-maps",
    faq: [
      {
        q: "Can NegoTrack guarantee I rank first in the map pack?",
        a: "No, and nobody can. Local ranking depends heavily on where the person searching is standing. What monitoring can do is find the fixable problems that keep you out of contention.",
      },
      {
        q: "Does this work if I travel to customers?",
        a: "Yes. Businesses that serve customers at their location have different rules — the address is hidden and a service area is set instead — and the checks account for that rather than flagging it as a fault.",
      },
    ],
  },
  {
    slug: "performance-monitoring",
    locale: "en-GB",
    name: "Performance Monitoring",
    title: "Performance Monitoring",
    description:
      "Track how fast your site loads on real mobile connections over time, and get told when something makes it slower.",
    lead:
      "Performance monitoring measures load time the way customers experience it — on a phone, on mobile data — and tracks it over time, so a change that makes the site slower shows up as a change rather than a mystery.",
    covers: [
      "Load time on mobile connections",
      "How long until the page is actually readable",
      "What is making a page slow, in order of impact",
      "Changes over time, so regressions are visible",
    ],
    why: [
      "Speed is measured once, at launch, and then never again on most small business sites. A plugin update or an uncompressed image added months later quietly costs visitors, and nobody connects the two.",
      "A single score out of a hundred is not much use on its own. Knowing that the homepage got 1.4 seconds slower the week the new gallery went up is.",
    ],
    relatedGuide: "is-my-website-losing-customers",
    faq: [
      {
        q: "How fast should my site be?",
        a: "On mobile data, aim for something readable within two to three seconds. Past four or five, drop-off rises sharply. The absolute number matters less than the direction it is moving.",
      },
      {
        q: "Will this tell me how to fix it?",
        a: "It reports what is causing the delay in order of impact, phrased so you can forward it to whoever maintains the site. It does not change your website.",
      },
    ],
  },
  {
    slug: "competitor-analysis",
    locale: "en-GB",
    name: "Competitor Analysis",
    title: "Competitor Analysis",
    description:
      "See how nearby competitors compare on visibility, reviews and website health, and what changed recently.",
    lead:
      "Competitor analysis tracks a handful of businesses competing for the same local customers, and shows where you stand on visibility, reviews and website health — plus what moved recently and in which direction.",
    covers: [
      "Local position compared with tracked competitors",
      "Review volume and rating side by side",
      "Website health and speed comparison",
      "Recent changes: new pages, review activity, position moves",
    ],
    why: [
      "Whether your rating is good is the wrong question. Whether it is good compared to the three businesses a customer is choosing between is the right one.",
      "Comparison is also the fastest way to see what is worth doing. A competitor gaining six reviews in a week tells you more about your local market than any general advice will.",
    ],
    faq: [
      {
        q: "How many competitors can I track?",
        a: "A small number of genuinely comparable local businesses is more useful than a long list. The aim is the handful a customer would actually be choosing between.",
      },
      {
        q: "Where does competitor data come from?",
        a: "Publicly visible information — the same things any customer could look at. NegoTrack does not access anything private about another business.",
      },
    ],
  },
  {
    slug: "content-analysis",
    locale: "en-GB",
    name: "Content Analysis",
    title: "Content Analysis",
    description:
      "Check whether your pages say what you do, where you do it, and give a visitor a reason to get in touch.",
    lead:
      "Content analysis looks at whether your pages actually communicate: whether a stranger learns what you do and where within seconds, whether each service has a page, and whether there is a clear reason and route to contact you.",
    covers: [
      "Whether the first screen states what you do and where",
      "Services with no page covering them",
      "Pages with no clear next step for the visitor",
      "Duplicate or near-identical pages competing with each other",
      "Missing or unclear page titles and headings",
    ],
    why: [
      "Most small business websites are not badly designed so much as unclear. The visitor cannot tell within a few seconds whether they are in the right place, so they leave and try the next result.",
      "Clarity problems are cheap to fix and rarely diagnosed, because everyone who works on the site already knows what the business does.",
    ],
    relatedGuide: "is-my-website-losing-customers",
    faq: [
      {
        q: "Does this write content for me?",
        a: "No. It identifies where pages are unclear, missing or duplicated. What to say about your own business is yours to decide.",
      },
      {
        q: "What counts as a missing page?",
        a: "A service you offer that no page on your site covers. If people search for it and you have nothing for them to land on, there is nothing to rank and nothing to read.",
      },
    ],
  },

  // ── Español ───────────────────────────────────────────────────────────────
  {
    slug: "puntuacion-salud-negocio",
    locale: "es-ES",
    name: "Puntuación de salud",
    title: "Puntuación de salud del negocio",
    description:
      "Una sola cifra que reúne web, visibilidad, reseñas y presencia local, con la lista ordenada de qué arreglar para subirla.",
    lead:
      "La puntuación de salud resume en un número todo lo que NegoTrack vigila y muestra qué comprobaciones la están bajando. Existe para que puedas saber si vas mejorando sin leer cuatro informes distintos.",
    covers: [
      "Estado de la web, velocidad y usabilidad móvil",
      "Visibilidad en buscadores e indexación",
      "Reseñas y tasa de respuesta",
      "Presencia local y visibilidad en el mapa",
      "Posición frente a la competencia de tu zona",
    ],
    why: [
      "A la mayoría de las pymes no les faltan datos: les falta poder comparar el martes con el mes pasado. Las posiciones están en una herramienta, las reseñas en otra y la velocidad en una tercera, y ninguna se pone de acuerdo en qué importa.",
      "Una cifra única solo sirve si se puede abrir. Cada punto es rastreable hasta una comprobación concreta, así que la puntuación es una puerta de entrada al detalle, no un sustituto.",
    ],
    faq: [
      {
        q: "¿Cómo se calcula la puntuación?",
        a: "Combina las áreas que NegoTrack vigila —estado de la web, visibilidad, reseñas, presencia local y posición competitiva— dando más peso a lo que más influye en que un cliente cercano te encuentre y te elija. Cada puntuación se abre en las comprobaciones que hay detrás.",
      },
      {
        q: "¿Ya está disponible?",
        a: "NegoTrack está en desarrollo y la beta privada no se ha abierto. Las puntuaciones que aparecen en esta web son datos de demostración claramente etiquetados, no una evaluación real de ningún negocio.",
      },
    ],
  },
  {
    slug: "auditoria-web",
    locale: "es-ES",
    name: "Auditoría web",
    title: "Auditoría web",
    description:
      "Velocidad, usabilidad móvil, estructura y oportunidades de conversión revisadas juntas y explicadas sin tecnicismos.",
    lead:
      "La auditoría web revisa lo que decide si una visita se queda: cuánto tarda en cargar en el móvil, si se lee con una mano, si dice a qué te dedicas y si contactar contigo es fácil. Los hallazgos están escritos para que puedas actuar o pasárselos a tu desarrollador.",
    covers: [
      "Tiempo de carga con datos móviles, no solo con fibra",
      "Diseño móvil, tamaño de los botones y texto legible",
      "Si la página dice qué haces y en qué zona",
      "Vías de contacto: teléfono pulsable, formularios que funcionan",
      "Indexación: si los buscadores llegan siquiera a ver la web",
    ],
    why: [
      "Los informes web se escriben para quien construyó la web, no para quien la pagó. Una lista de recursos que bloquean el renderizado no le dice a un autónomo si está perdiendo clientes.",
      "Cada hallazgo se expresa como el problema y su consecuencia, para que puedas decidir qué merece la pena arreglar y qué es ruido.",
    ],
    relatedGuide: "web-kit-digital-que-revisar",
    faq: [
      {
        q: "¿Necesito conocimientos técnicos?",
        a: "No. Los hallazgos están en lenguaje claro y con la consecuencia explicada, para que puedas valorar qué importa. Cuando un arreglo necesita de verdad un desarrollador, está redactado para que se lo puedas reenviar tal cual.",
      },
      {
        q: "¿Modifica algo de mi web?",
        a: "No. Una auditoría lee tu web e informa de lo que encuentra. Nunca cambia nada.",
      },
    ],
  },
  {
    slug: "visibilidad-local",
    locale: "es-ES",
    name: "Visibilidad local",
    title: "Visibilidad local",
    description:
      "Comprueba si tu negocio aparece en las búsquedas locales y en el mapa, si tu ficha está completa y qué la está frenando.",
    lead:
      "El seguimiento de visibilidad local comprueba si quien busca tu servicio en tu zona te encuentra de verdad —ficha verificada, categoría, horario, duplicados y presencia en el mapa— y señala qué es lo concreto que te está limitando.",
    covers: [
      "Si tu ficha está verificada y completa",
      "La categoría principal, la mayor palanca del posicionamiento local",
      "Fichas duplicadas que dividen tus señales",
      "Coherencia del horario y los datos del negocio",
      "Presencia en el mapa para los servicios que ofreces",
    ],
    why: [
      "Para la mayoría de los negocios locales la ficha trae más clientes que la web, sobre todo el primer año. Y es justo lo que menos se revisa.",
      "Los problemas suelen ser mundanos y arreglables —una ficha sin verificar, un duplicado que nadie vio, una categoría que describe otro oficio— pero invisibles si nadie los busca.",
    ],
    relatedGuide: "por-que-mi-negocio-no-aparece-en-google-maps",
    faq: [
      {
        q: "¿Puede NegoTrack garantizar que salga el primero en el mapa?",
        a: "No, y nadie puede. El posicionamiento local depende mucho de dónde está la persona que busca. Lo que sí puede hacer el seguimiento es encontrar los problemas arreglables que te dejan fuera de la competición.",
      },
      {
        q: "¿Sirve si voy yo a casa del cliente?",
        a: "Sí. Los negocios que atienden a domicilio tienen reglas distintas —se oculta la dirección y se define un área de servicio— y las comprobaciones lo tienen en cuenta en lugar de marcarlo como un fallo.",
      },
    ],
  },
  {
    slug: "seguimiento-resenas",
    locale: "es-ES",
    name: "Seguimiento de reseñas",
    title: "Seguimiento de reseñas",
    description:
      "Reseñas nuevas, temas que se repiten, cuáles siguen sin respuesta y cómo está tu valoración frente a la competencia.",
    lead:
      "El seguimiento de reseñas reúne tus reseñas en un sitio, saca a la superficie las que siguen esperando respuesta y muestra lo que los clientes mencionan una y otra vez: los temas que dicen qué está funcionando de verdad y qué no.",
    covers: [
      "Reseñas nuevas según van llegando",
      "Reseñas pendientes de respuesta",
      "Temas recurrentes en lo que escriben los clientes",
      "Valoración y volumen frente a competidores cercanos",
      "Tasa de respuesta a lo largo del tiempo",
    ],
    why: [
      "Las reseñas son lo más leído de casi cualquier negocio local y lo menos gestionado de forma sistemática. Una reseña de una estrella sin responder se queda ahí durante años.",
      "Los temas importan más que la media. Doce personas mencionando lo que tardaste en devolver la llamada es un problema de negocio, no de reputación.",
    ],
    relatedGuide: "como-pedir-resenas-en-google",
    faq: [
      {
        q: "¿NegoTrack responde a las reseñas por mí?",
        a: "No. Las respuestas las escribes tú. El seguimiento te muestra cuáles necesitan una y de qué van; una respuesta automática de una herramienta se nota exactamente como lo que es.",
      },
      {
        q: "¿Puede eliminar reseñas malas?",
        a: "No, y nadie puede. Una reseña solo la retira la plataforma cuando incumple sus normas. Cualquier servicio que prometa lo contrario te está vendiendo algo que no funciona.",
      },
    ],
  },
];

export function capabilitiesForLocale(locale: Locale): Capability[] {
  return capabilities.filter((capability) => capability.locale === locale);
}

export function findCapability(locale: Locale, slug: string): Capability | undefined {
  return capabilities.find((c) => c.locale === locale && c.slug === slug);
}
