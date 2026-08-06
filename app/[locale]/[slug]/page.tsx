import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { DemoBadge, Logo } from "@/components/marketing/ui";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type PageCopy = {
  title: string;
  lead: string;
  /** Rendered as sequential paragraphs. */
  body: string[];
  /** Question-shaped subheadings with direct answers, for pages that need them. */
  faq?: { q: string; a: string }[];
};

type PageEntry = {
  en: PageCopy;
  es: PageCopy;
  /**
   * Pages that cannot be honestly filled yet are still real pages for humans,
   * but they are not search results. Advertising a dozen near-empty URLs on a
   * new domain shapes how the whole site is assessed, so they stay reachable
   * and crawlable while being kept out of the index until they carry content.
   */
  noindex?: true;
  /** Restricts a page to one locale, for slugs that only make sense in that language. */
  only?: Locale;
};

const DISAMBIGUATION_EN =
  "NegoTrack takes its name from “negocio”, the Spanish word for business, combined with “track”, meaning to monitor something over time. It is not negotiation software, sales software or a contract-management tool.";
const DISAMBIGUATION_ES =
  "NegoTrack toma su nombre de “negocio” y de “track” (seguimiento en inglés). No es un software de negociación, ni de ventas, ni una herramienta de gestión de contratos.";

const pages: Record<string, PageEntry> = {
  "what-is-negotrack": {
    only: "en-GB",
    en: {
      title: "What is NegoTrack?",
      lead: "NegoTrack is a business-health monitoring platform for small businesses in the United Kingdom and Spain.",
      body: [
        "NegoTrack brings the signals that decide whether a small business gets found and chosen — website health, search visibility, page speed, mobile usability, reviews, local presence and competitor movement — into one plain-language view, and turns them into an ordered list of what to fix first.",
        DISAMBIGUATION_EN,
        "It is built for owners who do not have time to read a technical audit and do not want to hire an agency to interpret one. The product is in development; the waiting list is open for the private beta.",
      ],
      faq: [
        {
          q: "Is NegoTrack negotiation software?",
          a: "No. NegoTrack monitors the digital health of a small business — its website, visibility, reviews and competitors. It has nothing to do with negotiations, deals or counteroffers. A separate, unrelated product shares a similar name.",
        },
        {
          q: "What does the name NegoTrack mean?",
          a: "“Nego” comes from the Spanish word negocio, meaning business. “Track” means to monitor and improve performance over time. Together: tracking the health of your business.",
        },
        {
          q: "Who is NegoTrack for?",
          a: "Owners of small businesses in the United Kingdom and Spain — trades and home services, professional services, clinics, hospitality, retail and automotive, and agencies managing several clients.",
        },
        {
          q: "Is NegoTrack available yet?",
          a: "Not yet. NegoTrack is in development and the private beta has not opened. The waiting list is the way to be told when it does. Every figure shown on this website is clearly labelled demonstration data.",
        },
      ],
    },
    es: { title: "", lead: "", body: [] },
  },

  "que-es-negotrack": {
    only: "es-ES",
    es: {
      title: "¿Qué es NegoTrack?",
      lead: "NegoTrack es una plataforma de seguimiento de la salud digital para pequeñas empresas del Reino Unido y España.",
      body: [
        "NegoTrack reúne las señales que determinan si un negocio pequeño se encuentra y se elige — estado de la web, visibilidad en buscadores, velocidad, usabilidad móvil, reseñas, presencia local y movimientos de la competencia — en una sola vista en lenguaje claro, y las convierte en una lista ordenada de qué arreglar primero.",
        DISAMBIGUATION_ES,
        "Está pensado para autónomos y pymes que no tienen tiempo de leer una auditoría técnica ni ganas de contratar una agencia para que se la interprete. El producto está en desarrollo y la lista de espera de la beta privada está abierta.",
      ],
      faq: [
        {
          q: "¿NegoTrack es un software de negociación?",
          a: "No. NegoTrack hace seguimiento de la salud digital de un negocio: su web, su visibilidad, sus reseñas y su competencia. No tiene ninguna relación con negociaciones, acuerdos ni contraofertas. Existe otro producto sin relación con nosotros que usa un nombre parecido.",
        },
        {
          q: "¿Qué significa el nombre NegoTrack?",
          a: "“Nego” viene de negocio. “Track” significa seguimiento en inglés. Juntos: el seguimiento de la salud de tu negocio.",
        },
        {
          q: "¿Para quién es NegoTrack?",
          a: "Para autónomos y pymes de España y del Reino Unido: oficios y servicios a domicilio, servicios profesionales, clínicas, hostelería, comercio y automoción, y agencias que gestionan varios clientes.",
        },
        {
          q: "¿Ya se puede usar NegoTrack?",
          a: "Todavía no. NegoTrack está en desarrollo y la beta privada no se ha abierto. La lista de espera es la forma de enterarte cuando ocurra. Todas las cifras de esta web son datos de demostración claramente etiquetados.",
        },
      ],
    },
    en: { title: "", lead: "", body: [] },
  },

  about: {
    en: {
      title: "About NegoTrack",
      lead: "Understand. Improve. Grow.",
      body: [
        "Small businesses are told to “be online”, then left to work out what that means. The information exists — search rankings, page speed, reviews, map listings, competitor activity — but it is scattered across a dozen dashboards, written for specialists, and rarely says which problem to fix first.",
        "NegoTrack exists to answer one question: what is holding this business back, and what should be done about it this week. It collects the same signals an agency would, translates them into plain language, orders them by what will actually move the needle, and then tracks whether the changes worked.",
        DISAMBIGUATION_EN,
        "NegoTrack is being built for the United Kingdom and Spain, with English and Spanish treated as equal launch markets rather than one being a translation of the other. The product is in development. No live scanning service is operating yet, and every product interface shown on this site uses clearly labelled demonstration data.",
      ],
    },
    es: {
      title: "Acerca de NegoTrack",
      lead: "Entiende. Mejora. Crece.",
      body: [
        "A las pequeñas empresas se les dice que “estén en internet” y luego se las deja solas para averiguar qué significa eso. La información existe — posiciones de búsqueda, velocidad de la web, reseñas, fichas de Google, actividad de la competencia — pero está repartida en una docena de paneles, escrita para especialistas y casi nunca dice qué hay que arreglar primero.",
        "NegoTrack existe para responder a una sola pregunta: qué está frenando este negocio y qué conviene hacer esta semana. Reúne las mismas señales que miraría una agencia, las traduce a lenguaje claro, las ordena por impacto real y después comprueba si los cambios han funcionado.",
        DISAMBIGUATION_ES,
        "NegoTrack se está construyendo para España y el Reino Unido, tratando el español y el inglés como mercados de lanzamiento equivalentes y no como una traducción del otro. El producto está en desarrollo. Todavía no hay ningún servicio de análisis en funcionamiento, y todas las interfaces de producto que aparecen en esta web usan datos de demostración claramente etiquetados.",
      ],
    },
  },

  contact: {
    en: {
      title: "Contact",
      lead: "The fastest route in is the waiting list.",
      body: [
        "NegoTrack is in development and the team is small, so the waiting list is where enquiries are handled first. Joining it from the homepage and adding your business details tells us what kind of business you run and what you need — which is the information that shapes what gets built next.",
        "If you are an agency managing several clients, say so when you join. Agency partners have different needs from single-site owners and are being planned for separately.",
        "For questions about your waiting-list registration, including access to or deletion of your data, use the same channel and reference the email address you signed up with.",
      ],
    },
    es: {
      title: "Contacto",
      lead: "La vía más rápida es la lista de espera.",
      body: [
        "NegoTrack está en desarrollo y el equipo es pequeño, así que las consultas se atienden primero a través de la lista de espera. Apuntarte desde la página de inicio e incluir los datos de tu negocio nos dice a qué te dedicas y qué necesitas, que es justo la información que decide qué se construye a continuación.",
        "Si eres una agencia que gestiona varios clientes, indícalo al apuntarte. Las agencias tienen necesidades distintas a las de un negocio con una sola web y se están planificando por separado.",
        "Para cualquier consulta sobre tu registro en la lista, incluido el acceso a tus datos o su eliminación, utiliza el mismo canal e indica el correo con el que te apuntaste.",
      ],
    },
  },

  privacy: {
    en: {
      title: "Privacy",
      lead: "Waiting-list data is used only to manage early access.",
      body: [
        "Email, country, preferred language and consent are required. Optional business details help us understand demand. Marketing consent is separate and optional.",
        "Analytics cookies are only set after you accept them. Declining is remembered and no analytics or session-recording script is loaded.",
        "Contact the NegoTrack team to request access to your data or its deletion.",
      ],
    },
    es: {
      title: "Privacidad",
      lead: "Los datos de la lista se usan únicamente para gestionar el acceso anticipado.",
      body: [
        "El correo, el país, el idioma preferido y el consentimiento son obligatorios. Los datos opcionales del negocio ayudan a entender la demanda. El consentimiento de marketing es independiente y opcional.",
        "Las cookies analíticas solo se activan si las aceptas. Si las rechazas, se recuerda tu decisión y no se carga ningún script de analítica ni de grabación de sesión.",
        "Contacta con NegoTrack para solicitar acceso a tus datos o su eliminación.",
      ],
    },
  },

  terms: {
    en: {
      title: "Terms",
      lead: "NegoTrack is currently a pre-release product preview.",
      body: [
        "The website-scan experience and all dashboard values shown on this site are demonstrations. They are not professional advice and not a live assessment of any website you enter.",
        "No address entered into the demonstration scan is fetched, crawled or stored.",
      ],
    },
    es: {
      title: "Términos",
      lead: "NegoTrack es actualmente una vista previa de un producto en desarrollo.",
      body: [
        "La experiencia de análisis y todos los valores del panel que aparecen en esta web son demostraciones. No constituyen asesoramiento profesional ni una evaluación real de ninguna web introducida.",
        "Ninguna dirección introducida en el análisis de demostración se descarga, rastrea ni almacena.",
      ],
    },
  },

  // ── Not indexed until they carry real content ────────────────────────────
  pricing: {
    noindex: true,
    en: {
      title: "Pricing",
      lead: "Pricing has not been announced yet.",
      body: ["NegoTrack is in development. Join the private-beta waiting list to hear about early access and launch plans."],
    },
    es: {
      title: "Precios",
      lead: "Los precios aún no se han anunciado.",
      body: ["NegoTrack está en desarrollo. Únete a la lista de la beta privada para conocer el acceso anticipado y los planes de lanzamiento."],
    },
  },
  // `guides` is no longer here: it now has a real index at
  // app/[locale]/guides/page.tsx listing published articles, and that route
  // takes precedence over this catch-all slug.
  help: {
    noindex: true,
    en: {
      title: "Help centre",
      lead: "Support resources will launch with the private beta.",
      body: ["For early questions, use the contact page and tell us what you would like NegoTrack to explain."],
    },
    es: {
      title: "Centro de ayuda",
      lead: "Los recursos de soporte llegarán con la beta privada.",
      body: ["Para consultas iniciales, utiliza la página de contacto y cuéntanos qué quieres que NegoTrack explique."],
    },
  },
  status: {
    noindex: true,
    en: {
      title: "Status",
      lead: "Marketing website available.",
      body: ["The NegoTrack product platform is still in development; no public scanning service is currently operating."],
    },
    es: {
      title: "Estado",
      lead: "Web de presentación disponible.",
      body: ["La plataforma de NegoTrack sigue en desarrollo; actualmente no existe un servicio público de análisis."],
    },
  },
};

type PageProps = { params: Promise<{ locale: string; slug: string }> };

function copyFor(entry: PageEntry, locale: Locale): PageCopy {
  return locale === "es-ES" ? entry.es : entry.en;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.entries(pages)
      .filter(([, entry]) => !entry.only || entry.only === locale)
      .map(([slug]) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = pages[slug];
  if (!isLocale(locale) || !entry || (entry.only && entry.only !== locale)) return {};
  const content = copyFor(entry, locale);
  return {
    title: `${content.title} | NegoTrack`,
    description: content.lead,
    alternates: { canonical: `/${locale}/${slug}` },
    ...(entry.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function InfoPage({ params }: PageProps) {
  const { locale: candidate, slug } = await params;
  const entry = pages[slug];
  if (!isLocale(candidate) || !entry || (entry.only && entry.only !== candidate)) notFound();
  const locale: Locale = candidate;
  const content = copyFor(entry, locale);

  // Question-shaped headings with the answer immediately after are the shape
  // answer engines extract most reliably, so the same markup carries FAQPage.
  const faqSchema = content.faq && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <main className="info-page">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
        />
      )}
      <div className="container info-page__inner">
        <Link href={`/${locale}`} aria-label="NegoTrack home"><Logo /></Link>
        <div style={{ marginTop: 56 }}>
          <DemoBadge>{locale === "es-ES" ? "Información de lanzamiento" : "Launch information"}</DemoBadge>
        </div>
        <h1>{content.title}</h1>
        <h2 style={{ marginTop: 20, fontSize: "1.25rem" }}>{content.lead}</h2>
        {content.body.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        {content.faq?.map(({ q, a }) => (
          <section key={q}>
            <h2 style={{ marginTop: 32, fontSize: "1.25rem" }}>{q}</h2>
            <p>{a}</p>
          </section>
        ))}
        <Link className="button button--secondary" href={`/${locale}`}>
          <ArrowLeft aria-hidden="true" />{locale === "es-ES" ? "Volver al inicio" : "Back to homepage"}
        </Link>
      </div>
    </main>
  );
}
