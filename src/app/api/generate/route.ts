import { NextResponse } from "next/server";
import OpenAI from "openai";
import { observeOpenAI } from "langfuse";
import pool from "@/src/lib/db";
import { z } from "zod";

// Initialize OpenAI client
const openai = observeOpenAI(
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

// Validation schema
const generateRequestSchema = z.object({
  keywords: z.array(z.string().max(30)).min(1).max(5),
  description: z.string().max(300).optional(),
  domainLength: z.number().min(3).max(20),
  domainStyle: z.string().min(1),
  tlds: z.array(z.string()).optional(),
});

// Popular TLDs for different purposes
const POPULAR_TLDS = ["com", "net", "org", "io", "co", "app", "dev"];
const CREATIVE_TLDS = ["ai", "io", "co", "me", "app", "xyz", "tech", "design"];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body against schema
    const validationResult = generateRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 },
      );
    }

    const { keywords, description, domainLength, domainStyle, tlds } = validationResult.data;

    // Validate required inputs
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords are required" },
        { status: 400 },
      );
    }

    // If specific TLDs are selected, use them; otherwise let the AI choose
    const userSelectedTlds = Boolean(tlds && tlds.length > 0);

    // Build the prompt for the AI
    const prompt = buildPrompt(
      keywords,
      description,
      domainLength,
      domainStyle,
      tlds,
      userSelectedTlds,
    );

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL as string,
      messages: [
        {
          role: "system",
          content:
            "You are a domain name generation expert. Generate creative, memorable, and available domain names based on the provided keywords and parameters. Return only valid domain suggestions in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the AI response
    const suggestions = JSON.parse(response.choices[0].message.content || "{}");

    // Check domain availability using the database
    const results = await checkDomainAvailability(suggestions.domains);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error generating domains:", error);
    return NextResponse.json(
      { error: "Failed to generate domain suggestions" },
      { status: 500 },
    );
  }
}

function buildPrompt(
  keywords: string[],
  description: string | undefined,
  domainLength: number,
  domainStyle: string,
  tlds: string[] | undefined,
  userSelectedTlds: boolean,
) {
  let tldInstructions = "";

  if (userSelectedTlds && tlds) {
    tldInstructions = `TLDs to consider: ${tlds.join(", ")}
Please only use these specific TLDs in your suggestions.`;
  } else {
    // Decide which TLD set to recommend based on domain style
    const recommendedTlds =
      domainStyle === "creative" || domainStyle === "funny"
        ? CREATIVE_TLDS
        : POPULAR_TLDS;

    tldInstructions = `No specific TLDs were selected by the user.
Please choose appropriate TLDs from popular options like: ${recommendedTlds.join(", ")}
Select the TLD that best fits each domain name. For professional domains, prefer .com when appropriate.
For each suggestion, pick the TLD that enhances the domain's meaning or marketability.`;
  }

  return `
Generate domain name suggestions based on the following parameters:

Keywords: ${keywords.join(", ")}
${description ? `Project Description: ${description}` : ""}
Preferred Domain Length: ${domainLength} characters (approximately for the name part, excluding TLD)
Domain Style: ${domainStyle}

${tldInstructions}

Please provide 5-10 domain name suggestions that:
1. Are creative and memorable
2. Reflect the keywords and project description
3. Match the requested style (${domainStyle})
4. Are approximately ${domainLength} characters long (excluding TLD)
5. Would likely be available (not common words or very short domains)
6. Each suggestion should include both the domain name and an appropriate TLD

Explanation for different styles:
- "short": Brief, concise domains that are easy to remember
- "brandable": Unique, made-up words that can become strong brand identifiers
- "balanced": A good mix of meaningfulness and creativity
- "creative": Unusual, innovative combinations that stand out
- "funny": Playful, humorous domains that evoke a smile
- "professional": Serious, trustworthy domains suitable for business

Return your response as a JSON object with this structure:
{
  "domains": [
    {"name": "example", "tld": "com"},
    {"name": "anotherexample", "tld": "io"}
  ]
}
`;
}

// Domain availability check
async function checkDomainAvailability(
  domainSuggestions: { name: string; tld: string }[],
) {
  // Prepare all full domain names to check
  const fullDomains = domainSuggestions.map(
    (domain) => `${domain.name}.${domain.tld}`,
  );

  // Create a Set for existing domains
  let existingDomains = new Set<string>();

  try {
    // Check all domains at once with a single query
    const query = {
      text: `SELECT domain FROM domains WHERE domain = ANY($1)`,
      values: [fullDomains],
    };

    const result = await pool.query(query);

    // Create a Set of existing domains for faster lookups
    existingDomains = new Set(
      result.rows.map((row: { domain: string }) => row.domain.toLowerCase()),
    );
  } catch (error) {
    console.error("Database query error:", error);
    // In case of error, existingDomains remains empty, marking all domains as available
  } finally {
    // Map the domain suggestions with availability information
    return domainSuggestions.map((domain) => {
      const fullDomain = `${domain.name}.${domain.tld}`;
      const available = !existingDomains.has(fullDomain.toLowerCase());

      // Generate affiliate links for available domains
      const affiliateLinks = available
        ? {
            godaddy: `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain.name}&tld=.${domain.tld}&checkAvail=1`,
            namecheap: `https://www.anrdoezrs.net/click-101410219-12892698?url=${encodeURIComponent(`https://www.namecheap.com/domains/registration/results/?domain=${domain.name}.${domain.tld}`)}`,
          }
        : null;

      return {
        name: fullDomain,
        available,
        affiliateLinks,
      };
    });
  }
}
