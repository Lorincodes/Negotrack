import type { MetadataRoute } from "next";

/**
 * Every crawler is allowed, including AI ones, and that is a deliberate choice
 * rather than an oversight.
 *
 * Blocking training crawlers is rational for publishers who sell access to their
 * words. NegoTrack is the opposite case: an unknown brand whose name is actively
 * mistaken for negotiation software by the models people ask about it. Ingestion
 * is the only mechanism that eventually corrects what those models believe, so
 * refusing it would prolong the problem it is meant to guard against.
 *
 * The tiers are listed separately because they fail differently: blocking the
 * first costs future model knowledge, the second costs citation in AI search
 * results today, and the third breaks the case where a person has explicitly
 * pasted a NegoTrack URL and asked an assistant to read it.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.negotrack.com";
  const access = { allow: "/", disallow: ["/api/"] };

  return {
    rules: [
      { userAgent: "*", ...access },
      // Model training and grounding.
      {
        userAgent: ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent"],
        ...access,
      },
      // Retrieval for AI search surfaces. Bingbot matters twice over: ChatGPT
      // Search and Copilot both answer from Bing's index, so a page Bing has not
      // indexed cannot be cited there at all.
      {
        userAgent: ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "Bingbot", "Amazonbot", "DuckAssistBot"],
        ...access,
      },
      // Fetches a person triggered by pasting a URL into an assistant.
      { userAgent: ["ChatGPT-User", "Claude-User", "Perplexity-User"], ...access },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
