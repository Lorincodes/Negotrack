"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Logo } from "./ui";

/**
 * Site footer, extracted so pages other than the homepage can carry the real
 * chrome. Anchor links point back at the homepage rather than at the current
 * URL, because a capability or guide page has no #early-access section of its
 * own to scroll to.
 */
export function Footer({ locale, copy }: { locale: Locale; copy: Dictionary["footer"] }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function forwardEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = document.getElementById("early-access");
    if (target) {
      window.dispatchEvent(new CustomEvent("prefill-waitlist", { detail: email }));
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      return;
    }
    // Off the homepage there is no #early-access to scroll to, so send them to
    // the form on the homepage instead of silently doing nothing.
    router.push(`/${locale}#early-access`);
  }

  const home = `/${locale}`;
  const groups = [
    { title: copy.product, links: [[copy.links.overview, `${home}#overview`], [copy.links.features, `${home}#features`], [copy.links.how, `${home}#how-it-works`], [copy.links.early, `${home}#early-access`]] },
    { title: copy.solutions, links: [[copy.links.small, `${home}#business-types`], [copy.links.agencies, `${home}#business-types`], [copy.links.local, `${home}#markets`], [copy.links.uk, `${home}#markets`], [copy.links.spain, `${home}#markets`]] },
    { title: copy.resources, links: [[copy.links.guides, `${home}/guides`], [copy.links.features, `${home}/capabilities`], [copy.links.help, `${home}/help`], [copy.links.status, `${home}/status`]] },
    { title: copy.company, links: [[copy.links.about, `${home}/about`], [copy.links.contact, `${home}/contact`], [copy.links.privacy, `${home}/privacy`], [copy.links.terms, `${home}/terms`]] },
  ];

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand"><Logo /><p>{copy.summary}</p><span><ShieldCheck aria-hidden="true" />Private beta · UK &amp; Spain</span></div>
        {groups.map((group) => (
          <div className="footer-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map(([label, href]) => <Link href={href} key={`${group.title}-${label}`}>{label}</Link>)}
          </div>
        ))}
        <div className="footer-updates">
          <h3>{copy.stay}</h3><p>{copy.stayBody}</p>
          <form onSubmit={forwardEmail}>
            <label className="sr-only" htmlFor="footer-email">{copy.email}</label>
            <input id="footer-email" type="email" required placeholder={copy.email} value={email} onChange={(event) => setEmail(event.target.value)} />
            <button type="submit" aria-label={copy.stay}><ArrowRight aria-hidden="true" /></button>
          </form>
        </div>
      </div>
      <div className="container site-footer__bottom"><p>{copy.rights}</p><p>Understand. Improve. Grow.</p></div>
    </footer>
  );
}
