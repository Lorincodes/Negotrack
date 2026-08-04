export const locales = ["en-GB", "es-ES"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const en = {
  localeName: "English",
  languageSwitch: "Español",
  navigation: {
    product: "Product",
    solutions: "Solutions",
    how: "How it works",
    pricing: "Pricing",
    resources: "Resources",
    join: "Join the waitlist",
    menu: "Open navigation",
    close: "Close navigation",
  },
  hero: {
    eyebrow: "AI-powered business intelligence for small businesses",
    lineOne: "Know exactly what’s holding your",
    emphasis: "business back.",
    body: "NegoTrack brings your website, visibility, reviews and competitors together, then turns the data into clear actions your business can actually use.",
    primary: "Join the waitlist",
    secondary: "See how it works",
    note: "Launching first in the United Kingdom and Spain.",
    points: ["Understand what matters", "Know what to improve first", "Track whether it is working"],
  },
  preview: "Product preview",
  demo: "Demonstration data · May 2026",
  dashboard: {
    overview: "Business overview",
    greeting: "Good morning",
    health: "Business health",
    good: "Good",
    seo: "SEO",
    performance: "Performance",
    reviews: "Reviews",
    competitor: "Competitor position",
    ahead: "Ahead of 62%",
    trend: "Health over time",
    top: "Top recommendation",
    recommendation: "Make your main service and location clearer",
    recent: "Recent insights",
    insightOne: "Mobile speed improved",
    insightTwo: "Two new review opportunities",
  },
  trust: [
    "Built for UK and Spanish businesses",
    "English and Spanish support",
    "Designed for small-business owners",
    "Private beta coming soon",
    "No obligation to subscribe",
  ],
  workflow: {
    title: "How NegoTrack turns scattered business signals into clear actions.",
    body: "One connected view replaces disconnected tools and technical reports.",
    steps: [
      { title: "We collect signals", body: "Website, SEO, reviews, competitors and local visibility." },
      { title: "AI understands", body: "NegoTrack identifies the signals that matter most." },
      { title: "We prioritise", body: "Recommendations are ordered by expected impact and difficulty." },
      { title: "You improve", body: "Take action and track whether the business is moving forward." },
    ],
  },
  scan: {
    title: "See how scattered signals become a clear plan.",
    body: "Try the product flow with a sample website. This preview is simulated and does not crawl or analyse the address you enter.",
    placeholder: "https://yourbusiness.co.uk",
    action: "Scan website",
    scanning: "Building your preview",
    reset: "Try another website",
    invalid: "Enter a valid website address, such as https://yourbusiness.co.uk.",
    stages: [
      "Checking website health",
      "Reviewing SEO foundations",
      "Analysing mobile usability",
      "Identifying trust signals",
      "Comparing competitors",
      "Creating your action plan",
    ],
    metrics: [
      ["Business health", "86"],
      ["Website performance", "82"],
      ["Mobile usability", "89"],
      ["Trust signals", "Strong"],
      ["Conversion opportunities", "High"],
    ],
    top: "Top recommendation",
    recommendation: "Make your core service and location clearer on the homepage.",
  },
  health: {
    title: "Your business health at a glance.",
    body: "A single view of what is working, what needs attention, and what changed.",
    score: "Business Health Score",
    breakdown: "Score breakdown",
    trend: "Progress trend",
    yours: "Your business",
    average: "Industry average",
    trending: "Up 6 points this month",
    metrics: [
      ["Performance", "92"],
      ["SEO", "78"],
      ["Reviews", "4.6"],
      ["Local visibility", "72"],
      ["Competitors", "62"],
    ],
  },
  monitored: {
    title: "We monitor what moves the needle.",
    body: "Choose a signal to see how NegoTrack turns it into something useful.",
    items: [
      { key: "website", label: "Website", title: "Clarity before complexity", body: "See speed, structure and conversion issues together, explained in plain language.", metric: "82 performance" },
      { key: "seo", label: "SEO", title: "Strong foundations first", body: "Understand the technical and content changes most likely to improve discoverability.", metric: "78 foundation score" },
      { key: "reviews", label: "Reviews", title: "Reputation in context", body: "Track ratings, response patterns and opportunities without losing the customer story.", metric: "4.6 average rating" },
      { key: "competitors", label: "Competitors", title: "Know what changed", body: "See meaningful movements across visibility, reviews and digital momentum.", metric: "Ahead of 62%" },
      { key: "performance", label: "Performance", title: "Fast where it matters", body: "Monitor real usability signals and prioritise fixes that affect customers.", metric: "92 performance" },
      { key: "actions", label: "AI actions", title: "One next best action", body: "Move from findings to prioritised work based on likely impact and effort.", metric: "3 actions ready" },
      { key: "local", label: "Local visibility", title: "Be easier to find nearby", body: "Bring local-search signals and business-profile completeness into one view.", metric: "72 visibility" },
    ],
  },
  features: {
    title: "Powerful features. Clear results.",
    body: "Explore the product around the questions you already have about your business.",
    tabs: ["All", "Website", "SEO", "Reviews", "Competitors", "Reports"],
    items: [
      { title: "Website analysis", category: "Website", body: "Analyse speed, technical health, content clarity and conversion opportunities." },
      { title: "Business Health Score", category: "Reports", body: "One clear score covering the most important digital signals." },
      { title: "Competitor tracking", category: "Competitors", body: "See how competitors are improving and where opportunities exist." },
      { title: "AI recommendations", category: "Website", body: "Receive clear priorities based on business impact." },
      { title: "Review monitoring", category: "Reviews", body: "Track ratings, response patterns and customer sentiment." },
      { title: "Weekly briefing", category: "Reports", body: "Get a simple summary of what changed and what to do next." },
      { title: "Progress tracking", category: "Reports", body: "See whether completed actions are improving performance." },
      { title: "Local visibility", category: "SEO", body: "Understand how your business appears in local search." },
    ],
  },
  story: {
    title: "Everything your business needs to keep moving.",
    body: "From the next best action to the bigger market picture, every view is designed for a decision.",
    recommendation: {
      title: "AI recommendations that deliver impact.",
      body: "See why an action matters, how difficult it is, and what to do next—before you spend time on it.",
      sortImpact: "Prioritise impact",
      sortEffort: "Prioritise ease",
      items: [
        { title: "Clarify your main service and location", impact: "High impact", effort: "Easy", detail: "Help visitors understand your offer before they leave.", action: "Update homepage introduction" },
        { title: "Improve mobile hero loading", impact: "High impact", effort: "Medium", detail: "Reduce the delay before your key message becomes usable.", action: "Optimise the hero asset" },
        { title: "Respond to recent reviews", impact: "Medium impact", effort: "Easy", detail: "Show prospective customers that feedback is heard.", action: "Reply to three reviews" },
      ],
    },
    competitors: {
      title: "Stay ahead of your competition.",
      body: "Spot meaningful movement across visibility, reviews and momentum without living in spreadsheets.",
      headers: ["Business", "Health", "Reviews", "Visibility", "Movement"],
      rows: [
        ["Your business", "86", "128", "78", "+4"],
        ["Market peer A", "74", "141", "68", "+1"],
        ["Market peer B", "68", "96", "71", "−2"],
      ],
    },
    report: {
      title: "Reports you will actually use.",
      body: "A calm weekly briefing explains what changed, why it matters, and where to focus next.",
      date: "Weekly briefing · 28 July 2026",
      items: ["Business Health increased by 4 points", "Website speed improved", "One competitor gained reviews", "Three actions recommended"],
    },
  },
  comparison: {
    title: "From technical finding to useful decision.",
    body: "Move the divider to compare a traditional audit with NegoTrack’s plain-language explanation.",
    traditional: "Traditional audit",
    negotrack: "NegoTrack explanation",
    findings: ["Missing H1", "Phone number not clickable", "Missing opening hours", "Insufficient trust signals"],
    explanation: "Your homepage does not clearly explain your main service or location. Visitors may leave before understanding what you offer.",
    action: "Suggested action: rewrite the first screen around your service, location and strongest proof.",
    label: "Comparison position",
  },
  businessTypes: {
    title: "Built around the way your business works.",
    body: "Preview how priorities adapt by business type. These examples illustrate the planned product experience.",
    items: [
      { label: "Trades and home services", company: "North & Co Heating", score: "84", priority: "Make emergency coverage areas clearer", detail: "Local visibility · call conversion · service-area clarity" },
      { label: "Professional services", company: "Riverside Legal", score: "79", priority: "Strengthen expertise and trust proof", detail: "Service clarity · credentials · enquiry journey" },
      { label: "Healthcare and clinics", company: "Clínica Centro", score: "88", priority: "Clarify appointment availability", detail: "Local discovery · trust · mobile booking" },
      { label: "Hospitality", company: "Harbour Table", score: "81", priority: "Surface opening hours and booking", detail: "Reviews · maps · booking conversion" },
      { label: "Retail and automotive", company: "Taller Norte", score: "76", priority: "Improve local service-page coverage", detail: "Inventory or services · local search · reviews" },
      { label: "Agencies", company: "Studio Common", score: "90", priority: "Create a client-ready weekly summary", detail: "Portfolio clarity · reporting · lead quality" },
    ],
  },
  markets: {
    title: "Built for businesses in the UK and Spain.",
    body: "Two launch markets, each with its own language and local-search context.",
    uk: ["English recommendations", "UK local-search context", "Competitor comparisons", "Google Business insights"],
    es: ["Recomendaciones en español", "Visibilidad local", "Comparación de competidores", "Perfil de Empresa en Google"],
  },
  capabilities: {
    title: "All the capabilities. One platform.",
    coming: "Coming soon",
    items: ["Business Health Score", "Website Audit", "SEO Tracking", "Competitor Analysis", "Review Monitoring", "Local Visibility", "Performance Monitoring", "Content Analysis", "AI Recommendations", "Automated Reports", "Progress Tracking", "Agency Reports"],
  },
  cta: {
    title: "Be the first to grow smarter with NegoTrack.",
    body: "Join the waitlist and be among the first businesses invited to early access.",
    benefits: ["Free to join", "No obligation", "Occasional product updates only"],
  },
  form: {
    title: "Join the private-beta waitlist",
    body: "Tell us where you are and how you would like to hear from us.",
    email: "Work email",
    emailPlaceholder: "you@business.co.uk",
    name: "First name",
    business: "Business name",
    website: "Website URL",
    country: "Country",
    language: "Preferred language",
    type: "Business type",
    challenge: "Biggest digital-growth challenge",
    privacy: "I agree that NegoTrack may store these details to manage my waitlist registration.",
    marketing: "Send me occasional product updates. (Optional)",
    submit: "Join the waitlist",
    submitting: "Joining…",
    optional: "Add optional business details",
    success: "You’re on the NegoTrack waiting list. We’ll keep you updated.",
    duplicate: "You are already on the NegoTrack waiting list. We’ll keep you updated.",
    error: "We couldn’t save your registration. Please check the form and try again.",
    privacyError: "Please agree to the privacy notice to join the waitlist.",
    emailError: "Enter a valid email address.",
    countries: [["GB", "United Kingdom"], ["ES", "España"]],
  },
  footer: {
    summary: "AI-powered business intelligence for small businesses in the UK and Spain.",
    product: "Product",
    solutions: "Solutions",
    resources: "Resources",
    company: "Company",
    stay: "Stay updated",
    stayBody: "Get product updates and early-access invitations.",
    email: "Your email",
    links: {
      overview: "Overview", features: "Features", how: "How it works", early: "Early access",
      small: "Small businesses", agencies: "Agencies", local: "Local businesses", uk: "UK", spain: "Spain",
      blog: "Blog", guides: "Guides", help: "Help centre", status: "Status",
      about: "About", contact: "Contact", privacy: "Privacy", terms: "Terms",
    },
    rights: "© 2026 NegoTrack. All rights reserved.",
  },
} as const;

type Localized<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Localized<U>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

const es: Localized<typeof en> = {
  localeName: "Español",
  languageSwitch: "English",
  navigation: { product: "Producto", solutions: "Soluciones", how: "Cómo funciona", pricing: "Precios", resources: "Recursos", join: "Únete a la lista", menu: "Abrir navegación", close: "Cerrar navegación" },
  hero: {
    eyebrow: "Inteligencia de negocio con IA para pequeñas empresas",
    lineOne: "Descubre exactamente qué está frenando",
    emphasis: "tu negocio.",
    body: "NegoTrack reúne tu web, visibilidad, reseñas y competidores, y convierte esos datos en acciones claras que tu negocio realmente puede aplicar.",
    primary: "Únete a la lista",
    secondary: "Descubre cómo funciona",
    note: "Lanzamiento inicial en Reino Unido y España.",
    points: ["Entiende lo que importa", "Sabe qué mejorar primero", "Comprueba si está funcionando"],
  },
  preview: "Vista previa del producto",
  demo: "Datos de demostración · mayo de 2026",
  dashboard: {
    overview: "Resumen del negocio", greeting: "Buenos días", health: "Salud del negocio", good: "Bien", seo: "SEO", performance: "Rendimiento", reviews: "Reseñas", competitor: "Posición competitiva", ahead: "Por delante del 62 %", trend: "Evolución de salud", top: "Recomendación principal", recommendation: "Aclara mejor tu servicio principal y ubicación", recent: "Datos recientes", insightOne: "Mejoró la velocidad móvil", insightTwo: "Dos nuevas oportunidades de reseñas",
  },
  trust: ["Creado para negocios de Reino Unido y España", "Contenido en inglés y español", "Diseñado para pequeñas empresas", "Beta privada próximamente", "Sin obligación de suscripción"],
  workflow: {
    title: "Cómo NegoTrack convierte señales dispersas en acciones claras.",
    body: "Una vista conectada sustituye herramientas separadas e informes técnicos.",
    steps: [
      { title: "Recopilamos señales", body: "Web, SEO, reseñas, competidores y visibilidad local." },
      { title: "La IA comprende", body: "NegoTrack identifica las señales que más importan." },
      { title: "Priorizamos", body: "Las recomendaciones se ordenan por impacto esperado y dificultad." },
      { title: "Tú mejoras", body: "Actúa y comprueba si el negocio avanza." },
    ],
  },
  scan: {
    title: "Mira cómo las señales se convierten en un plan claro.",
    body: "Prueba el recorrido del producto con una web de ejemplo. Esta vista es simulada y no rastrea ni analiza la dirección introducida.",
    placeholder: "https://tunegocio.es", action: "Analizar web", scanning: "Creando tu vista previa", reset: "Probar otra web", invalid: "Introduce una dirección válida, por ejemplo https://tunegocio.es.",
    stages: ["Comprobando la salud de la web", "Revisando las bases SEO", "Analizando la usabilidad móvil", "Identificando señales de confianza", "Comparando competidores", "Creando tu plan de acción"],
    metrics: [["Salud del negocio", "86"], ["Rendimiento web", "82"], ["Usabilidad móvil", "89"], ["Señales de confianza", "Sólidas"], ["Oportunidades de conversión", "Altas"]],
    top: "Recomendación principal", recommendation: "Aclara mejor tu servicio principal y ubicación en la página de inicio.",
  },
  health: {
    title: "La salud de tu negocio de un vistazo.", body: "Una sola vista de lo que funciona, lo que necesita atención y lo que ha cambiado.", score: "Puntuación de salud", breakdown: "Desglose de puntuación", trend: "Evolución", yours: "Tu negocio", average: "Media del sector", trending: "6 puntos más este mes",
    metrics: [["Rendimiento", "92"], ["SEO", "78"], ["Reseñas", "4.6"], ["Visibilidad local", "72"], ["Competidores", "62"]],
  },
  monitored: {
    title: "Supervisamos lo que realmente impulsa tu negocio.", body: "Elige una señal para ver cómo NegoTrack la convierte en algo útil.",
    items: [
      { key: "website", label: "Web", title: "Claridad antes que complejidad", body: "Consulta velocidad, estructura y conversión juntas, explicadas sin tecnicismos.", metric: "82 de rendimiento" },
      { key: "seo", label: "SEO", title: "Primero, unas bases sólidas", body: "Entiende los cambios técnicos y de contenido con mayor potencial de descubrimiento.", metric: "78 en fundamentos" },
      { key: "reviews", label: "Reseñas", title: "Reputación con contexto", body: "Sigue valoraciones, respuestas y oportunidades sin perder la historia del cliente.", metric: "4.6 de media" },
      { key: "competitors", label: "Competidores", title: "Entiende qué cambió", body: "Detecta movimientos relevantes en visibilidad, reseñas e impulso digital.", metric: "Por delante del 62 %" },
      { key: "performance", label: "Rendimiento", title: "Rapidez donde importa", body: "Supervisa señales de uso reales y prioriza mejoras que afectan a clientes.", metric: "92 de rendimiento" },
      { key: "actions", label: "Acciones con IA", title: "Una próxima acción clara", body: "Pasa de hallazgos a tareas priorizadas según impacto y esfuerzo.", metric: "3 acciones listas" },
      { key: "local", label: "Visibilidad local", title: "Más fácil de encontrar cerca", body: "Reúne búsqueda local y estado del perfil de empresa en una sola vista.", metric: "72 de visibilidad" },
    ],
  },
  features: {
    title: "Funciones potentes. Resultados claros.", body: "Explora el producto a partir de las preguntas que ya tienes sobre tu negocio.", tabs: ["Todas", "Web", "SEO", "Reseñas", "Competidores", "Informes"],
    items: [
      { title: "Análisis web", category: "Web", body: "Analiza velocidad, salud técnica, claridad del contenido y oportunidades de conversión." },
      { title: "Puntuación de salud", category: "Informes", body: "Una puntuación clara para las señales digitales más importantes." },
      { title: "Seguimiento de competidores", category: "Competidores", body: "Observa cómo mejoran tus competidores y dónde aparecen oportunidades." },
      { title: "Recomendaciones con IA", category: "Web", body: "Recibe prioridades claras según su impacto empresarial." },
      { title: "Seguimiento de reseñas", category: "Reseñas", body: "Sigue valoraciones, patrones de respuesta y sentimiento del cliente." },
      { title: "Resumen semanal", category: "Informes", body: "Recibe un resumen sencillo de los cambios y los próximos pasos." },
      { title: "Seguimiento del progreso", category: "Informes", body: "Comprueba si las acciones completadas mejoran el rendimiento." },
      { title: "Visibilidad local", category: "SEO", body: "Entiende cómo aparece tu negocio en búsquedas locales." },
    ],
  },
  story: {
    title: "Todo lo que tu negocio necesita para seguir avanzando.", body: "Desde la próxima acción hasta la visión del mercado, cada vista está diseñada para decidir.",
    recommendation: {
      title: "Recomendaciones con IA que generan impacto.", body: "Entiende por qué importa una acción, su dificultad y el siguiente paso antes de dedicarle tiempo.", sortImpact: "Priorizar impacto", sortEffort: "Priorizar facilidad",
      items: [
        { title: "Aclara tu servicio principal y ubicación", impact: "Impacto alto", effort: "Fácil", detail: "Ayuda a entender tu oferta antes de que el visitante se marche.", action: "Actualizar la introducción" },
        { title: "Mejora la carga móvil inicial", impact: "Impacto alto", effort: "Medio", detail: "Reduce la espera antes de que tu mensaje principal sea utilizable.", action: "Optimizar el recurso principal" },
        { title: "Responde a reseñas recientes", impact: "Impacto medio", effort: "Fácil", detail: "Demuestra a futuros clientes que escuchas sus comentarios.", action: "Responder a tres reseñas" },
      ],
    },
    competitors: {
      title: "Adelántate a tu competencia.", body: "Detecta cambios relevantes en visibilidad, reseñas e impulso sin vivir en hojas de cálculo.", headers: ["Negocio", "Salud", "Reseñas", "Visibilidad", "Cambio"],
      rows: [["Tu negocio", "86", "128", "78", "+4"], ["Competidor A", "74", "141", "68", "+1"], ["Competidor B", "68", "96", "71", "−2"]],
    },
    report: { title: "Informes que sí vas a utilizar.", body: "Un resumen semanal tranquilo explica qué cambió, por qué importa y dónde centrarte.", date: "Resumen semanal · 28 de julio de 2026", items: ["La salud del negocio subió 4 puntos", "Mejoró la velocidad web", "Un competidor obtuvo nuevas reseñas", "Tres acciones recomendadas"] },
  },
  comparison: {
    title: "De hallazgo técnico a decisión útil.", body: "Mueve el divisor para comparar una auditoría tradicional con la explicación clara de NegoTrack.", traditional: "Auditoría tradicional", negotrack: "Explicación de NegoTrack", findings: ["Falta el H1", "El teléfono no se puede pulsar", "Falta el horario", "Señales de confianza insuficientes"], explanation: "Tu página de inicio no explica claramente tu servicio principal ni tu ubicación. Los visitantes pueden marcharse antes de entender qué ofreces.", action: "Acción sugerida: reescribe la primera pantalla alrededor de tu servicio, ubicación y mejor prueba.", label: "Posición de comparación",
  },
  businessTypes: {
    title: "Creado alrededor de la forma en que funciona tu negocio.", body: "Previsualiza cómo se adaptan las prioridades a cada tipo de negocio. Estos ejemplos ilustran la experiencia prevista.",
    items: [
      { label: "Oficios y servicios del hogar", company: "Calefacción Norte", score: "84", priority: "Aclara las zonas de cobertura urgente", detail: "Visibilidad local · llamadas · zonas de servicio" },
      { label: "Servicios profesionales", company: "Riverside Legal", score: "79", priority: "Refuerza experiencia y confianza", detail: "Servicios · credenciales · consultas" },
      { label: "Salud y clínicas", company: "Clínica Centro", score: "88", priority: "Aclara la disponibilidad de citas", detail: "Descubrimiento local · confianza · reserva móvil" },
      { label: "Hostelería", company: "Mesa del Puerto", score: "81", priority: "Destaca horarios y reservas", detail: "Reseñas · mapas · conversión de reservas" },
      { label: "Comercio y automoción", company: "Taller Norte", score: "76", priority: "Mejora las páginas de servicios locales", detail: "Servicios · búsqueda local · reseñas" },
      { label: "Agencias", company: "Studio Common", score: "90", priority: "Crea un resumen semanal para clientes", detail: "Portfolio · informes · calidad de leads" },
    ],
  },
  markets: { title: "Creado para negocios del Reino Unido y España.", body: "Dos mercados iniciales, cada uno con su idioma y contexto de búsqueda local.", uk: ["Recomendaciones en inglés", "Contexto de búsqueda local del Reino Unido", "Comparación de competidores", "Información de Google Business"], es: ["Recomendaciones en español", "Visibilidad local", "Comparación de competidores", "Perfil de Empresa en Google"] },
  capabilities: { title: "Todas las capacidades. Una plataforma.", coming: "Próximamente", items: ["Puntuación de salud", "Auditoría web", "Seguimiento SEO", "Análisis de competidores", "Seguimiento de reseñas", "Visibilidad local", "Seguimiento de rendimiento", "Análisis de contenido", "Recomendaciones con IA", "Informes automáticos", "Seguimiento del progreso", "Informes para agencias"] },
  cta: { title: "Sé de los primeros en crecer mejor con NegoTrack.", body: "Únete a la lista y recibe una de las primeras invitaciones al acceso anticipado.", benefits: ["Unirse es gratis", "Sin compromiso", "Solo actualizaciones ocasionales"] },
  form: {
    title: "Únete a la lista de la beta privada", body: "Dinos dónde estás y cómo quieres recibir noticias.", email: "Correo de trabajo", emailPlaceholder: "tu@negocio.es", name: "Nombre", business: "Nombre del negocio", website: "URL de la web", country: "País", language: "Idioma preferido", type: "Tipo de negocio", challenge: "Mayor reto de crecimiento digital", privacy: "Acepto que NegoTrack guarde estos datos para gestionar mi registro en la lista.", marketing: "Enviadme actualizaciones ocasionales del producto. (Opcional)", submit: "Unirme a la lista", submitting: "Registrando…", optional: "Añadir datos opcionales del negocio", success: "Ya estás en la lista de NegoTrack. Te mantendremos al día.", duplicate: "Ya formas parte de la lista de NegoTrack. Te mantendremos al día.", error: "No hemos podido guardar tu registro. Revisa el formulario e inténtalo de nuevo.", privacyError: "Acepta el aviso de privacidad para unirte a la lista.", emailError: "Introduce un correo válido.", countries: [["GB", "Reino Unido"], ["ES", "España"]],
  },
  footer: {
    summary: "Inteligencia de negocio con IA para pequeñas empresas del Reino Unido y España.", product: "Producto", solutions: "Soluciones", resources: "Recursos", company: "Empresa", stay: "Mantente al día", stayBody: "Recibe novedades e invitaciones de acceso anticipado.", email: "Tu correo",
    links: { overview: "Resumen", features: "Funciones", how: "Cómo funciona", early: "Acceso anticipado", small: "Pequeñas empresas", agencies: "Agencias", local: "Negocios locales", uk: "Reino Unido", spain: "España", blog: "Blog", guides: "Guías", help: "Centro de ayuda", status: "Estado", about: "Acerca de", contact: "Contacto", privacy: "Privacidad", terms: "Términos" },
    rights: "© 2026 NegoTrack. Todos los derechos reservados.",
  },
};

export type Dictionary = Localized<typeof en>;

export const dictionaries: Record<Locale, Dictionary> = {
  "en-GB": en,
  "es-ES": es,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
