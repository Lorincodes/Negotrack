import type { Locale } from "./i18n";

/**
 * Long-form capability pages.
 *
 * A capability that has a story here gets the full editorial treatment: its own
 * product visuals, its own section order, its own examples. Capabilities
 * without one fall back to the shorter template, so the two can coexist while
 * the set is built out.
 *
 * Every figure in here is invented demonstration data and is labelled as such
 * wherever it renders. Nothing describes a real business, a real customer or a
 * real measurement.
 */

export type KeywordRow = {
  term: string;
  position: number;
  /** Places moved since the previous check. Negative means it fell. */
  change: number;
  page: string | null;
};

export type Outcome = { number: string; text: string };

export type IndustryInsight = {
  key: string;
  label: string;
  headline: string;
  detail: string;
  metric: string;
  metricLabel: string;
};

export type CapabilityStory = {
  slug: string;
  locale: Locale;
  eyebrow: string;
  headline: string;
  lead: string;

  /** Hero console figures. */
  hero: {
    score: number;
    scoreLabel: string;
    scoreCaption: string;
    tracked: number;
    trackedLabel: string;
    indexed: string;
    indexedLabel: string;
    rows: KeywordRow[];
    tableTitle: string;
    tableMeta: string;
    badgeOne: { title: string; detail: string };
    badgeTwo: { title: string; detail: string };
  };

  /** Alternating benefit sections. */
  benefitOne: { eyebrow: string; heading: string; body: string[]; chartTitle: string; chartMeta: string; series: number[] };
  benefitTwo: { eyebrow: string; heading: string; body: string[]; rowTitle: string; rows: KeywordRow[] };

  /** The dark full-width moment. */
  insight: {
    heading: string;
    label: string;
    term: string;
    position: string;
    trend: string;
    actionLabel: string;
    action: string;
    impactLabel: string;
    impact: string;
    effortLabel: string;
    effort: string;
  };

  outcomes: { heading: string; items: Outcome[] };

  comparison: {
    heading: string;
    beforeLabel: string;
    before: string[];
    afterLabel: string;
    after: string[];
  };

  industries: { heading: string; lead: string; items: IndustryInsight[] };

  finale: { heading: string; body: string };
};

export const capabilityStories: CapabilityStory[] = [
  {
    slug: "seo-tracking",
    locale: "en-GB",
    eyebrow: "SEO Tracking",
    headline: "Know where customers can actually find you.",
    lead: "Track the searches that matter locally, see which pages are winning, and understand exactly where visibility is being lost — without reading a report written for specialists.",

    hero: {
      score: 78,
      scoreLabel: "Search visibility",
      scoreCaption: "+5 vs last week",
      tracked: 24,
      trackedLabel: "Local terms tracked",
      indexed: "38 of 41",
      indexedLabel: "Pages indexed",
      tableTitle: "Local search positions",
      tableMeta: "Checked this morning",
      rows: [
        { term: "boiler repair near me", position: 4, change: 2, page: "/services/boiler-repair" },
        { term: "emergency plumber", position: 7, change: 3, page: "/services/emergency" },
        { term: "heating engineer", position: 9, change: 2, page: "/services" },
        { term: "boiler service cost", position: 14, change: -1, page: null },
      ],
      badgeOne: { title: "Search visibility", detail: "up 5 points" },
      badgeTwo: { title: "Two pages", detail: "newly indexed" },
    },

    benefitOne: {
      eyebrow: "Movement over time",
      heading: "See movement, not just rankings.",
      body: [
        "A position on a Tuesday tells you almost nothing. What matters is the direction it has been travelling, and whether the work you did last month is showing up yet.",
        "NegoTrack records every check and shows the trend, so a term slipping three places over a fortnight looks different from one that bounced yesterday and came back.",
        "You are not asked to interpret a thousand keywords either. Tracking stays on the terms that plausibly bring paying work in your area — the rest is noise dressed up as thoroughness.",
      ],
      chartTitle: "Search visibility",
      chartMeta: "Last 12 weeks · demonstration data",
      series: [52, 55, 54, 58, 61, 60, 64, 67, 66, 71, 74, 78],
    },

    benefitTwo: {
      eyebrow: "Down to the page",
      heading: "Know which page needs attention.",
      body: [
        "Every tracked term is tied to the page that answers it, so a ranking problem becomes a specific page problem you can act on.",
        "Where no page covers a term you offer, that shows up as a gap rather than a bad position — because there is nothing to improve until something exists to rank.",
      ],
      rowTitle: "Term, page and next action",
      rows: [
        { term: "boiler repair near me", position: 4, change: 2, page: "/services/boiler-repair" },
        { term: "boiler service cost", position: 14, change: -1, page: null },
        { term: "landlord gas certificate", position: 22, change: 0, page: null },
      ],
    },

    insight: {
      heading: "NegoTrack doesn't just show the problem. It tells you what to do next.",
      label: "Search opportunity detected",
      term: "emergency plumber Manchester",
      position: "Currently 11th",
      trend: "Visibility rising for four weeks",
      actionLabel: "Recommended action",
      action: "Rewrite the emergency service page title around the phrase people actually search, and link to it from the two pages that already rank well.",
      impactLabel: "Expected impact",
      impact: "High",
      effortLabel: "Effort",
      effort: "Low",
    },

    outcomes: {
      heading: "Less reporting. More knowing what to do.",
      items: [
        { number: "01", text: "Know which searches actually bring customers." },
        { number: "02", text: "See when visibility improves or declines." },
        { number: "03", text: "Understand which action should happen next." },
      ],
    },

    comparison: {
      heading: "One place, instead of five.",
      beforeLabel: "Before NegoTrack",
      before: ["Search Console in one tab", "A ranking tool in another", "A spreadsheet nobody updates", "PageSpeed, occasionally", "Notes about what you tried"],
      afterLabel: "With NegoTrack",
      after: ["One dashboard", "One priority list", "One weekly view"],
    },

    industries: {
      heading: "Different trade, different search.",
      lead: "The terms that matter change completely by business type. Pick one to see the kind of movement NegoTrack surfaces.",
      items: [
        { key: "trades", label: "Trades", headline: "Emergency plumber Manchester moved from 9th to 5th.", detail: "Urgent-intent terms move fastest and convert hardest. NegoTrack watches the ones attached to a callout, not the ones attached to a blog post.", metric: "9th → 5th", metricLabel: "in four weeks" },
        { key: "professional", label: "Professional services", headline: "Six service terms had no page covering them.", detail: "Professional firms usually offer far more than their website says. The gap between services sold and services published is the single biggest source of missed search.", metric: "6 gaps", metricLabel: "found on first scan" },
        { key: "healthcare", label: "Healthcare", headline: "Dental implants gained 18% more impressions.", detail: "Clinics compete on a small set of high-value treatments. Impressions rising before positions do is the earliest signal that a page is starting to work.", metric: "+18%", metricLabel: "impressions this month" },
        { key: "hospitality", label: "Hospitality", headline: "Sunday lunch bookings peaked three weeks early.", detail: "Hospitality search is seasonal and local. Knowing a term is climbing before the season starts is worth more than knowing where it finished.", metric: "3 weeks", metricLabel: "of early warning" },
        { key: "retail", label: "Retail & automotive", headline: "MOT near me slipped two places after a site change.", detail: "A quiet drop after a website update is the most common and least noticed cause of lost enquiries. It shows up here as a change, not a mystery.", metric: "−2 places", metricLabel: "flagged same week" },
        { key: "agencies", label: "Agencies", headline: "Client visibility rose across six tracked terms.", detail: "Agencies need the same picture for every client without opening five tools each time. One view per client, comparable month to month.", metric: "6 terms", metricLabel: "improving together" },
      ],
    },

    finale: {
      heading: "Know what needs attention before it becomes a problem.",
      body: "NegoTrack is in development. Join the waiting list and we will tell you when the private beta opens.",
    },
  },
];

export function findStory(locale: Locale, slug: string): CapabilityStory | undefined {
  return capabilityStories.find((story) => story.locale === locale && story.slug === slug);
}
