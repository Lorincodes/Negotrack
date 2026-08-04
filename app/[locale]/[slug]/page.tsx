import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { DemoBadge, Logo } from "@/components/marketing/ui";
import { isLocale, locales, type Locale } from "@/lib/i18n";

const pages = {
  pricing: {
    en: ["Pricing", "Pricing has not been announced yet.", "NegoTrack is currently in development. Join the private-beta waitlist to hear about early access and launch plans."],
    es: ["Precios", "Los precios aún no se han anunciado.", "NegoTrack está actualmente en desarrollo. Únete a la lista de la beta privada para conocer el acceso anticipado y los planes de lanzamiento."],
  },
  blog: {
    en: ["Blog", "Practical business-health guidance is coming soon.", "We are preparing clear guides for small-business owners in the United Kingdom and Spain."],
    es: ["Blog", "Próximamente publicaremos orientación práctica sobre salud empresarial.", "Estamos preparando guías claras para pequeñas empresas del Reino Unido y España."],
  },
  guides: {
    en: ["Guides", "Understand the digital signals behind your business.", "Our first guides will cover website clarity, local visibility, reviews, performance and competitor context."],
    es: ["Guías", "Entiende las señales digitales de tu negocio.", "Las primeras guías tratarán claridad web, visibilidad local, reseñas, rendimiento y contexto competitivo."],
  },
  help: {
    en: ["Help centre", "Support resources will launch with private beta.", "For early questions, use the contact page and tell us what you would like NegoTrack to explain."],
    es: ["Centro de ayuda", "Los recursos de soporte llegarán con la beta privada.", "Para consultas iniciales, utiliza la página de contacto y cuéntanos qué quieres que NegoTrack explique."],
  },
  status: {
    en: ["Status", "Marketing website available.", "The NegoTrack product platform is still in development; no public scanning service is currently operating."],
    es: ["Estado", "Web de presentación disponible.", "La plataforma de NegoTrack sigue en desarrollo; actualmente no existe un servicio público de análisis."],
  },
  about: {
    en: ["About NegoTrack", "Understand. Improve. Grow.", "NegoTrack is being built to turn scattered website, visibility, review and competitor signals into clear priorities for small businesses."],
    es: ["Acerca de NegoTrack", "Entiende. Mejora. Crece.", "NegoTrack se está creando para convertir señales dispersas de web, visibilidad, reseñas y competencia en prioridades claras para pequeñas empresas."],
  },
  contact: {
    en: ["Contact", "Start with the early-access waitlist.", "Join the waitlist from the homepage and include your business details so the NegoTrack team can understand your needs."],
    es: ["Contacto", "Empieza por la lista de acceso anticipado.", "Únete desde la página de inicio e incluye los datos de tu negocio para que el equipo de NegoTrack entienda tus necesidades."],
  },
  privacy: {
    en: ["Privacy", "Waiting-list data is used only to manage early access.", "Email, country, preferred language and consent are required. Optional business details help us understand demand. Marketing consent is separate and optional. Contact the NegoTrack team to request access or deletion."],
    es: ["Privacidad", "Los datos de la lista se usan únicamente para gestionar el acceso anticipado.", "El correo, país, idioma preferido y consentimiento son obligatorios. Los datos opcionales ayudan a entender la demanda. El consentimiento de marketing es independiente y opcional. Contacta con NegoTrack para solicitar acceso o eliminación."],
  },
  terms: {
    en: ["Terms", "NegoTrack is currently a pre-release product preview.", "The website-scan experience and all dashboard values are demonstrations. They are not professional advice or a live assessment of any submitted website."],
    es: ["Términos", "NegoTrack es actualmente una vista previa de un producto en desarrollo.", "La experiencia de análisis y todos los valores del panel son demostraciones. No constituyen asesoramiento profesional ni una evaluación real de ninguna web introducida."],
  },
} as const;

type Slug = keyof typeof pages;
type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => Object.keys(pages).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !(slug in pages)) return {};
  const content = pages[slug as Slug][locale === "es-ES" ? "es" : "en"];
  return { title: `${content[0]} | NegoTrack`, description: content[2], alternates: { canonical: `/${locale}/${slug}` } };
}

export default async function InfoPage({ params }: PageProps) {
  const { locale: candidate, slug } = await params;
  if (!isLocale(candidate) || !(slug in pages)) notFound();
  const locale: Locale = candidate;
  const content = pages[slug as Slug][locale === "es-ES" ? "es" : "en"];
  return (
    <main className="info-page">
      <div className="container info-page__inner">
        <Link href={`/${locale}`} aria-label="NegoTrack home"><Logo /></Link>
        <div style={{ marginTop: 56 }}><DemoBadge>{locale === "es-ES" ? "Información de lanzamiento" : "Launch information"}</DemoBadge></div>
        <h1>{content[0]}</h1><h2 style={{ marginTop: 20, fontSize: "1.45rem" }}>{content[1]}</h2><p>{content[2]}</p>
        <Link className="button button--secondary" href={`/${locale}`}><ArrowLeft aria-hidden="true" />{locale === "es-ES" ? "Volver al inicio" : "Back to homepage"}</Link>
      </div>
    </main>
  );
}
