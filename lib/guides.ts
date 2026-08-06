import type { Locale } from "./i18n";

/**
 * Guide articles.
 *
 * Each guide belongs to exactly one locale and carries its own native slug.
 * The Spanish guides are not translations of the English ones and never should
 * be: the two markets ask different questions, in different words, against
 * different platforms and different law. Writing one set and translating it
 * would produce content that ranks for nothing in either language.
 *
 * Structure follows what answer engines and featured snippets extract: the
 * question as the title, the answer complete within the opening paragraph, then
 * question-shaped subheadings. Nothing here cites usage figures, customers or
 * results NegoTrack does not have.
 */

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  /** Rendered as an ordered checklist when `numbered`, otherwise a plain list. */
  list?: string[];
  numbered?: boolean;
};

export type Guide = {
  slug: string;
  locale: Locale;
  title: string;
  /** Meta description and the page's own standfirst. */
  description: string;
  published: string;
  updated: string;
  /** Answers the title question completely, in the first 40-60 words. */
  answer: string;
  sections: GuideSection[];
  faq?: { q: string; a: string }[];
};

export const guides: Guide[] = [
  // ── Español ───────────────────────────────────────────────────────────────
  {
    slug: "por-que-mi-negocio-no-aparece-en-google-maps",
    locale: "es-ES",
    title: "Por qué mi negocio no aparece en Google Maps",
    description:
      "Nueve motivos por los que un negocio no sale en Google Maps y cómo comprobar cada uno, explicado sin tecnicismos para autónomos y pymes.",
    published: "2026-08-06",
    updated: "2026-08-06",
    answer:
      "Si tu negocio no aparece en Google Maps casi siempre es por uno de estos motivos: la ficha no está verificada, está duplicada, la categoría es incorrecta, la dirección no cumple las normas de Google, o simplemente estás buscando desde una ubicación demasiado lejana. Los nueve casos siguientes cubren prácticamente todas las situaciones reales.",
    sections: [
      {
        heading: "Antes de nada: comprueba que no es un espejismo",
        paragraphs: [
          "Google personaliza los resultados de Maps según dónde estás. Si buscas tu propio negocio desde casa, a diez kilómetros, es normal que no salga: Google está mostrando lo que le resulta útil a alguien que está donde tú estás.",
          "La comprobación correcta no es buscar tu nombre. Es buscar el servicio que ofreces, desde la zona donde quieres que te encuentren, en una ventana de incógnito y sin haber iniciado sesión. Si buscas tu nombre exacto y sales, eso no significa que te encuentren; significa que Google sabe que existes.",
        ],
      },
      {
        heading: "Los nueve motivos, en orden de frecuencia",
        numbered: true,
        list: [
          "La ficha no está verificada. Sin verificar, Google puede mostrarla de forma limitada o no mostrarla. Es el motivo número uno y el más fácil de arreglar.",
          "Hay fichas duplicadas. Si alguien creó una ficha años atrás y tú creaste otra, Google reparte las señales entre las dos y ninguna gana. Hay que reclamar y fusionar.",
          "La categoría principal es incorrecta o demasiado genérica. «Empresa» no compite con «fontanero». La categoría principal pesa más que todas las secundarias juntas.",
          "La dirección incumple las normas. Google exige presencia física real en la dirección indicada, en el horario indicado. Un apartado de correos, una oficina virtual o la casa de un familiar acaban en suspensión.",
          "El negocio es a domicilio y la dirección está visible. Si vas al cliente, tienes que ocultar la dirección y definir un área de servicio. Si la dejas visible sin atender allí, incumples.",
          "La ficha está suspendida y no te has enterado. Google no siempre avisa de forma evidente. Entra en tu perfil y busca cualquier aviso de suspensión o de que necesita verificación.",
          "El horario está vacío o desactualizado. Una ficha sin horario transmite abandono, y Google prioriza fichas que parecen activas y mantenidas.",
          "No hay ninguna reseña. Google no penaliza la ausencia de reseñas, pero en igualdad de condiciones el negocio con reseñas recientes gana.",
          "El negocio es demasiado nuevo. Una ficha recién verificada tarda semanas en asentarse. Si has hecho todo bien y llevas dos semanas, la respuesta suele ser esperar.",
        ],
      },
      {
        heading: "Qué revisar primero si solo tienes diez minutos",
        paragraphs: [
          "Entra en tu Perfil de Empresa en Google y comprueba tres cosas por este orden: que aparezca como verificado, que la categoría principal sea exactamente lo que haces, y que el horario esté completo. Esas tres cubren la mayoría de los casos en los que un negocio real no sale.",
          "Después, busca en Google el nombre de tu negocio junto con tu ciudad y mira si aparece más de una ficha. Los duplicados son silenciosos y hacen mucho daño, porque dividen las reseñas y las señales entre dos fichas que compiten entre sí.",
        ],
      },
      {
        heading: "Lo que no va a arreglarlo",
        paragraphs: [
          "Publicar en la ficha todos los días no compensa una categoría mal elegida. Añadir veinte categorías secundarias no compensa una principal incorrecta. Y pagar por «aparecer el primero en Maps» no existe como producto: nadie puede garantizarte una posición en el paquete local.",
          "Si alguien te lo ofrece, lo que está vendiendo es o bien anuncios (que son otra cosa y se marcan como tales) o bien humo.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Cuánto tarda un negocio nuevo en aparecer en Google Maps?",
        a: "Tras verificar la ficha, lo habitual es que empiece a aparecer en días y que se asiente en varias semanas. Si tras un mes con la ficha verificada, la categoría correcta y el horario completo sigues sin aparecer para búsquedas de tu servicio en tu zona, lo más probable es que haya un duplicado o una suspensión.",
      },
      {
        q: "¿Puedo aparecer en Google Maps sin dirección física?",
        a: "Sí, si atiendes a domicilio. Tienes que ocultar la dirección y configurar un área de servicio. Lo que no puedes es mostrar una dirección donde no atiendes al público: eso incumple las normas de Google y puede acabar en suspensión de la ficha.",
      },
      {
        q: "¿Las reseñas hacen que aparezca más arriba?",
        a: "Influyen, pero no son lo primero. La distancia respecto a quien busca, la categoría principal y la coherencia de los datos del negocio pesan más. Las reseñas ayudan a desempatar y, sobre todo, a que quien te ve te elija.",
      },
    ],
  },

  {
    slug: "como-pedir-resenas-en-google",
    locale: "es-ES",
    title: "Cómo pedir reseñas en Google sin resultar pesado",
    description:
      "Cuándo pedir una reseña, cómo pedirla, qué está permitido y qué no, y por qué los incentivos son mala idea. Guía práctica para autónomos y pymes.",
    published: "2026-08-06",
    updated: "2026-08-06",
    answer:
      "Se piden reseñas en persona y en el momento en que el cliente está satisfecho, no por correo tres semanas después. La petición funciona cuando es concreta, fácil y honesta: un enlace directo, una frase corta y ninguna condición. Ofrecer descuentos o regalos a cambio está prohibido por Google y puede costarte las reseñas y la ficha.",
    sections: [
      {
        heading: "El momento importa más que el mensaje",
        paragraphs: [
          "La mayoría de las reseñas que no llegan es porque se pidieron tarde. El cliente está contento justo cuando termina el trabajo, cuando recoge el coche arreglado, cuando sale de la consulta. Una semana después ese momento ya pasó.",
          "Si tu trabajo termina cara a cara, pide la reseña cara a cara. Es incómodo la primera vez y deja de serlo a la tercera. Es, con diferencia, lo que más funciona.",
        ],
      },
      {
        heading: "Cómo pedirla para que la escriban de verdad",
        numbered: true,
        list: [
          "Usa tu enlace directo de reseña. Desde tu Perfil de Empresa en Google puedes generar un enlace corto que abre la ventana de reseña directamente. Si el cliente tiene que buscarte, no lo hará.",
          "Pide en el momento, en persona o por WhatsApp el mismo día. El correo electrónico funciona mucho peor para esto.",
          "Sé concreto. «¿Te importaría contar en dos líneas cómo fue?» funciona mejor que «déjanos una reseña».",
          "Pídelo una vez. Si no la escriben, no insistas. Perseguir a un cliente por una reseña cuesta más de lo que vale.",
          "Ponlo por escrito donde ya estás: en la firma del correo, en la factura, en un QR en el mostrador.",
        ],
      },
      {
        heading: "Lo que no puedes hacer",
        paragraphs: [
          "Las normas de Google sobre contenido son claras en tres puntos, y conviene conocerlos porque incumplirlos no solo borra la reseña: puede afectar a la ficha entera.",
        ],
        list: [
          "No ofrezcas nada a cambio. Ni descuentos, ni sorteos, ni un café. Un incentivo convierte la reseña en una transacción y está prohibido.",
          "No pidas reseñas solo a los clientes contentos. Filtrar a quién le pides es una práctica sancionable, además de darte una imagen falsa de tu propio negocio.",
          "No escribas reseñas tú mismo ni pidas a familiares que las escriban. Google detecta patrones de este tipo mejor de lo que la gente cree, y en España además puede constituir publicidad engañosa.",
        ],
      },
      {
        heading: "Qué hacer con una reseña negativa",
        paragraphs: [
          "Responder siempre, en público, sin discutir y sin dar datos del cliente. Una respuesta serena a una crítica dura convence más a quien la lee que diez reseñas de cinco estrellas, porque demuestra cómo tratas un problema.",
          "El objetivo de la respuesta no es convencer a quien se quejó. Es hablarle a la persona que está leyendo esa reseña seis meses después decidiendo si te llama.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Puedo ofrecer un descuento a cambio de una reseña?",
        a: "No. Las políticas de Google prohíben expresamente incentivar reseñas. Las reseñas obtenidas así pueden eliminarse y las infracciones repetidas pueden afectar a la visibilidad de tu ficha.",
      },
      {
        q: "¿Cuántas reseñas necesita un negocio local?",
        a: "No hay un número mágico. Importa más que sean recientes y que haya un flujo constante que acumular muchas de golpe. Un negocio con quince reseñas repartidas en el último año transmite más actividad que uno con cincuenta de hace tres años.",
      },
      {
        q: "¿Puedo eliminar una reseña injusta?",
        a: "Solo puedes solicitar su retirada si incumple las políticas de Google: insultos, contenido no relacionado, conflicto de intereses o datos personales. Que sea injusta o falsa no basta por sí solo, aunque puedes reportarla y responder públicamente.",
      },
    ],
  },

  {
    slug: "web-kit-digital-que-revisar",
    locale: "es-ES",
    title: "Te hicieron la web con el Kit Digital: 10 cosas que revisar ahora",
    description:
      "Tu web subvencionada ya está entregada y no entra nadie. Diez comprobaciones concretas que puedes hacer tú mismo para saber si funciona o está abandonada.",
    published: "2026-08-06",
    updated: "2026-08-06",
    answer:
      "Una web entregada no es una web que funcione. Las diez comprobaciones de esta guía —indexación, ficha de Google, velocidad, móvil, textos, contacto, formularios, analítica, dominio y mantenimiento— se hacen en menos de una hora sin conocimientos técnicos, y sirven para saber qué te entregaron realmente y qué falta.",
    sections: [
      {
        heading: "El problema que casi nadie te cuenta",
        paragraphs: [
          "Las ayudas a la digitalización pagan la creación de la web. No pagan que alguien la mire después. El resultado habitual es una web correcta el día de la entrega que nadie ha vuelto a abrir desde entonces, sin analítica, sin posicionamiento y a veces sin estar siquiera en Google.",
          "Esto no significa que te hayan engañado. Significa que el encargo terminó donde terminó el presupuesto. Lo que viene después te toca a ti, y la buena noticia es que la mayor parte se comprueba sin saber programar.",
        ],
      },
      {
        heading: "Las diez comprobaciones",
        numbered: true,
        list: [
          "¿Está en Google? Busca site:tudominio.es en Google. Si no aparece nada, tu web no está indexada y ninguna otra cosa importa hasta arreglarlo.",
          "¿Tienes ficha de Google verificada y enlazada a la web? Para un negocio local, la ficha trae más clientes que la web durante el primer año.",
          "¿Cuánto tarda en cargar en el móvil, con datos y no con wifi? Si pasa de cuatro o cinco segundos, estás perdiendo visitas antes de que vean nada.",
          "¿Se lee bien en el móvil? Ábrela en tu teléfono. Texto minúsculo, botones que no se pueden pulsar con el dedo o tener que hacer zoom son motivos de abandono inmediato.",
          "¿Dice en los primeros segundos qué haces y dónde? Muchas webs subvencionadas abren con una frase genérica. Quien entra debe saber a qué te dedicas y en qué zona trabajas sin bajar la página.",
          "¿El teléfono es pulsable y está arriba? En un negocio local, la llamada es la conversión. Si hay que buscar el número, lo has perdido.",
          "¿Funciona el formulario de contacto? Envíate un mensaje de prueba hoy mismo. Los formularios rotos son sorprendentemente comunes y nadie se entera porque, precisamente, no llega nada.",
          "¿Hay analítica instalada? Si no puedes saber cuánta gente entra, no puedes saber si algo mejora. Sin esto, estás a ciegas.",
          "¿El dominio está a tu nombre? Comprueba quién figura como titular. Si está a nombre del proveedor, tienes un problema el día que quieras cambiar.",
          "¿Alguien actualiza el gestor de contenidos? Una web sin actualizar durante meses acaba siendo un problema de seguridad, no solo de marketing.",
        ],
      },
      {
        heading: "Por dónde empezar si algo falla",
        paragraphs: [
          "El orden importa. Si no estás indexado, empieza por ahí; da igual lo bonita que sea la web si Google no la tiene. Si estás indexado pero no llega nadie, mira la ficha de Google y los textos: en negocios locales, la ficha y la claridad del mensaje explican la mayoría de los casos.",
          "Si llega gente pero no contacta, el problema no es de visibilidad sino de la propia página: velocidad, móvil, claridad y facilidad de contacto, en ese orden.",
        ],
      },
      {
        heading: "Qué pedirle a tu proveedor y cómo",
        paragraphs: [
          "Si detectas fallos, pídelos por escrito y en concreto. «La web no funciona» no lleva a ninguna parte. «El formulario de contacto no envía nada, lo he probado el día 6» sí.",
          "Antes de contratar mantenimiento con nadie, pide que te digan qué incluye exactamente: si es solo actualizar el gestor, es una cosa; si incluye revisar posicionamiento y contenidos, es otra bastante distinta y bastante más cara.",
        ],
      },
    ],
    faq: [
      {
        q: "¿La subvención cubre el mantenimiento de la web?",
        a: "Depende de la convocatoria y de lo que firmaste con tu proveedor. Muchas ayudas cubren un periodo de prestación del servicio y no el mantenimiento indefinido. Revisa tu acuerdo concreto y consulta las bases oficiales del programa, porque las condiciones cambian entre convocatorias.",
      },
      {
        q: "¿Cómo sé si mi web está en Google?",
        a: "Busca en Google site: seguido de tu dominio, sin espacio: por ejemplo site:minegocio.es. Si no aparece ningún resultado, la web no está indexada. Es lo primero que hay que resolver.",
      },
      {
        q: "¿El dominio es mío o del proveedor?",
        a: "Debería ser tuyo. Comprueba a nombre de quién está registrado y a qué correo llegan las renovaciones. Si figura el proveedor como titular, pide el traspaso por escrito: el dominio es el activo, la web se puede rehacer.",
      },
    ],
  },

  // ── English ───────────────────────────────────────────────────────────────
  {
    slug: "why-isnt-my-business-showing-on-google-maps",
    locale: "en-GB",
    title: "Why isn't my business showing on Google Maps?",
    description:
      "Nine reasons a business does not appear on Google Maps, how to check each one, and what to fix first. Written for owners, not marketers.",
    published: "2026-08-06",
    updated: "2026-08-06",
    answer:
      "A business usually fails to appear on Google Maps for one of a handful of reasons: the profile is unverified, duplicated, in the wrong category, at an address that breaks Google's rules, or you are searching from too far away. The nine checks below cover almost every real case, and most take minutes.",
    sections: [
      {
        heading: "First, make sure it is actually missing",
        paragraphs: [
          "Google personalises Maps results by where you are. Searching for your own business from home, ten miles away, and not seeing it proves very little — Google is showing what is useful to someone standing where you are standing.",
          "The right test is to search the service you provide, from the area you want to be found in, in a private window while signed out. Searching your exact business name and finding it only proves Google knows you exist. It does not mean anyone looking for what you sell will find you.",
        ],
      },
      {
        heading: "The nine reasons, most common first",
        numbered: true,
        list: [
          "The profile is not verified. Unverified profiles show in limited ways or not at all. This is the single most common cause and the easiest to fix.",
          "There are duplicate profiles. If someone created a listing years ago and you created another, Google splits the signals between them and neither wins. They need claiming and merging.",
          "The primary category is wrong or too vague. 'Business' does not compete with 'plumber'. Your primary category carries more weight than every secondary one combined.",
          "The address breaks Google's rules. Google requires a real, staffed presence at the address during stated hours. PO boxes, virtual offices and a relative's house all lead to suspension.",
          "You serve customers at their location but show an address. If you travel to clients, hide the address and set a service area. Showing an address you do not staff is a violation.",
          "The profile is suspended and you have not noticed. Google does not always make this obvious. Open your profile and look for any suspension or reverification notice.",
          "Opening hours are missing or stale. An empty schedule signals an abandoned listing, and Google favours profiles that look maintained.",
          "There are no reviews at all. Google does not penalise having none, but between two similar businesses the one with recent reviews wins.",
          "The listing is simply too new. A newly verified profile takes weeks to settle. If everything is correct and it has been a fortnight, the answer is usually to wait.",
        ],
      },
      {
        heading: "The ten-minute version",
        paragraphs: [
          "Open your Google Business Profile and check three things in this order: that it says verified, that the primary category is exactly what you do, and that opening hours are complete. Those three account for most cases where a real business does not appear.",
          "Then search your business name plus your town and look for more than one listing. Duplicates are silent and damaging, because they divide your reviews and signals between two profiles competing with each other.",
        ],
      },
      {
        heading: "What will not fix it",
        paragraphs: [
          "Posting to your profile daily does not compensate for the wrong primary category. Adding twenty secondary categories does not either. And nobody can sell you a guaranteed position in the local map pack — that product does not exist.",
          "If someone offers it, they are selling either ads, which are labelled as ads and are a different thing entirely, or nothing at all.",
        ],
      },
    ],
    faq: [
      {
        q: "How long does a new business take to appear on Google Maps?",
        a: "After verification, listings typically start appearing within days and settle over several weeks. If a month has passed with a verified profile, the correct primary category and complete hours, and you still do not appear for service searches in your area, look for a duplicate listing or a suspension.",
      },
      {
        q: "Can I appear on Google Maps without a shopfront?",
        a: "Yes, if you travel to customers. Hide your address and configure a service area instead. What you cannot do is display an address where you do not serve customers — that breaks Google's guidelines and risks suspension.",
      },
      {
        q: "Do reviews affect Maps ranking?",
        a: "They contribute, but they are not the first thing. Proximity to the person searching, your primary category and the consistency of your business details matter more. Reviews help break ties and, more importantly, help people choose you once they see you.",
      },
    ],
  },

  {
    slug: "how-to-ask-for-google-reviews",
    locale: "en-GB",
    title: "How to ask for Google reviews without being annoying",
    description:
      "When to ask, how to ask, what UK rules now allow, and why incentives are a bad idea. A practical guide for small business owners.",
    published: "2026-08-06",
    updated: "2026-08-06",
    answer:
      "Ask in person, at the moment the customer is happy — not by email three weeks later. The request works when it is specific, easy and unconditional: a direct link, one short sentence, no strings. Offering discounts or gifts in exchange is against Google's policies and, in the UK, sits on the wrong side of consumer law.",
    sections: [
      {
        heading: "Timing beats wording",
        paragraphs: [
          "Most reviews that never arrive were asked for too late. A customer is pleased the moment the job is finished, when they collect the repaired car, when they leave the appointment. A week later that moment has gone.",
          "If your work ends face to face, ask face to face. It is awkward the first time and stops being awkward by the third. It is by a distance the most effective method available to a small business.",
        ],
      },
      {
        heading: "How to ask so they actually write one",
        numbered: true,
        list: [
          "Use your direct review link. Your Google Business Profile can generate a short link that opens the review box immediately. If the customer has to search for you, they will not.",
          "Ask at the moment, in person or by message the same day. Email performs far worse for this.",
          "Be specific. 'Would you mind saying in a line or two how it went?' works better than 'please leave us a review'.",
          "Ask once. If they do not write one, let it go. Chasing a customer for a review costs more goodwill than the review is worth.",
          "Put it where you already are: email signature, invoice, a QR code at the counter.",
        ],
      },
      {
        heading: "What you must not do",
        paragraphs: [
          "Google's content policies are explicit on three points, and the UK has tightened the law around fake and incentivised reviews. Breaking these does not just remove the review — it can affect the whole listing.",
        ],
        list: [
          "Do not offer anything in return. No discounts, no prize draws, no free coffee. An incentive turns a review into a transaction and is prohibited.",
          "Do not ask only your happy customers. Screening who gets asked — sometimes sold as 'review gating' — is against policy and gives you a false picture of your own business.",
          "Do not write reviews yourself or ask family to. Google detects these patterns better than people assume, and in the UK fake reviews are now squarely a consumer-protection matter.",
        ],
      },
      {
        heading: "Answering a bad review",
        paragraphs: [
          "Always reply, in public, without arguing and without revealing customer details. A calm reply to a harsh review persuades readers more than ten five-star ratings, because it shows how you behave when something goes wrong.",
          "The reply is not really aimed at the person who complained. It is aimed at the person reading that review six months later, deciding whether to call you.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I offer a discount in exchange for a review?",
        a: "No. Google's policies prohibit incentivised reviews, and UK consumer law has tightened considerably around fake and incentivised reviews. Reviews obtained this way can be removed and repeated breaches can affect your listing's visibility.",
      },
      {
        q: "How many Google reviews does a small business need?",
        a: "There is no magic number. A steady trickle matters more than a large batch: fifteen reviews spread across the last year signals an active business more convincingly than fifty from three years ago.",
      },
      {
        q: "Can I get an unfair review removed?",
        a: "You can request removal only if it breaches Google's policies — abuse, off-topic content, conflicts of interest or personal information. Being unfair or inaccurate is not, by itself, sufficient grounds, though you can report it and reply publicly.",
      },
    ],
  },

  {
    slug: "is-my-website-losing-customers",
    locale: "en-GB",
    title: "Is your website losing you customers? A ten-minute check",
    description:
      "Seven checks any small business owner can run on their own website in ten minutes, without tools or technical knowledge, and what to do about each.",
    published: "2026-08-06",
    updated: "2026-08-06",
    answer:
      "Open your own website on your phone, on mobile data rather than wifi, and time it. Most small business sites lose customers for four plain reasons: they load too slowly, they do not say what the business does, the phone number is hard to reach, and the contact form is quietly broken. All four are checkable in ten minutes.",
    sections: [
      {
        heading: "Test it the way a customer meets it",
        paragraphs: [
          "You know your own website too well to judge it. You know where everything is, you have it cached, and you are usually on a desktop connected to fast broadband. Almost none of that is true for the person deciding whether to call you.",
          "So test it the way they meet it: on a phone, on mobile data, having never seen it before. That single change surfaces most of the problems below without any tools at all.",
        ],
      },
      {
        heading: "The seven checks",
        numbered: true,
        list: [
          "Time the load. Count the seconds until you can read something useful. Past four or five seconds on mobile data, a meaningful share of visitors are gone before the page appears.",
          "Read the first screen without scrolling. Does it say what you do and where you do it? A stranger should know within seconds whether they are in the right place.",
          "Find the phone number. On a local business site it should be visible immediately and tappable. If you have to hunt, so does everyone else.",
          "Send yourself a message through the contact form. Broken forms are common and invisible: nothing arrives, and nobody tells you, because the failure looks exactly like nobody getting in touch.",
          "Check it in one hand. Small text, buttons too close together, anything needing pinch-zoom — all of it costs you visitors on the device most of them are using.",
          "Search Google for site: followed by your domain. No results means the site is not indexed, and nothing else matters until that is fixed.",
          "Look for anything out of date. Last year's opening hours, a closed location, a price that changed. Stale details cost trust faster than an ugly design does.",
        ],
      },
      {
        heading: "Fix them in this order",
        paragraphs: [
          "Indexing first — an invisible site cannot lose customers because it never gets any. Then the broken contact route, because that is enquiries you have already earned and are losing at the last step.",
          "After that: clarity of the first screen, then speed, then mobile layout. Design comes last, and usually matters far less than owners expect.",
        ],
      },
    ],
    faq: [
      {
        q: "How fast should a small business website be?",
        a: "On mobile data, aim for something readable within about two to three seconds. Past four or five, drop-off rises sharply. Speed matters more on phones than on desktop, which is where most local searches happen.",
      },
      {
        q: "Do I need to redesign my website?",
        a: "Usually not. Most small business sites lose customers because of speed, clarity, a hard-to-find phone number or a broken form — none of which a redesign necessarily fixes, and all of which are cheaper to address directly.",
      },
      {
        q: "How do I know if my website is on Google?",
        a: "Search Google for site: followed by your domain with no space, for example site:mybusiness.co.uk. If nothing comes back, the site is not indexed, and that is the first thing to resolve.",
      },
    ],
  },
];

export function guidesForLocale(locale: Locale): Guide[] {
  return guides.filter((guide) => guide.locale === locale);
}

export function findGuide(locale: Locale, slug: string): Guide | undefined {
  return guides.find((guide) => guide.locale === locale && guide.slug === slug);
}
