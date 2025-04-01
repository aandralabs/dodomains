"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Slider } from "@/src/components/ui/slider";
import { Label } from "@/src/components/ui/label";
import { Waves } from "@/src/components/ui/waves";
import { cn } from "@/src/lib/utils";

// Expanded TLD lists for user selection
const POPULAR_TLDS = ["com", "net", "org", "io", "co", "app", "dev"];
const CREATIVE_TLDS = ["ai", "io", "co", "me", "app", "xyz", "tech", "design"];
const COUNTRY_TLDS = ["us", "uk", "ca", "eu", "de", "fr", "jp", "au"];
const SPECIALTY_TLDS = [
  "store",
  "shop",
  "blog",
  "online",
  "site",
  "web",
  "digital",
  "cloud",
];

// Inside your component, add these brand color constants
const REGISTRAR_COLORS = {
  godaddy: {
    bg: "bg-[#00A4A6]",
    hover: "hover:bg-[#00858a]",
    text: "text-white",
  },
  namecheap: {
    bg: "bg-[#FF5126]",
    hover: "hover:bg-[#e64621]",
    text: "text-white",
  },
};

const DOMAIN_STYLES = [
  { id: "short", label: "Short & Simple" },
  { id: "brandable", label: "Brandable" },
  { id: "balanced", label: "Balanced" },
  { id: "creative", label: "Creative" },
  { id: "funny", label: "Funny" },
  { id: "professional", label: "Professional" },
];

export default function Home() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [description, setDescription] = useState("");
  const [domainLength, setDomainLength] = useState([10]);
  const [domainStyle, setDomainStyle] = useState("balanced");
  const [results, setResults] = useState<
    {
      name: string;
      available: boolean;
      affiliateLinks?: {
        godaddy: string;
        namecheap: string;
      } | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedTlds, setSelectedTlds] = useState<string[]>([]);
  const [tldCategory, setTldCategory] = useState("popular");
  const [loadingMessage, setLoadingMessage] = useState("");

  // Array of funny dodo loading messages
  const dodoMessages = [
    "Dodo's tiny brain is working hard...",
    "Hmm, what rhymes with your keywords?",
    "Dodo pecking at random keys...",
    "Eating domain names that taste bad...",
    "Dodo forgot what we're doing...",
    "Bird brain loading... please wait...",
    "Looking under rocks for cool names...",
    "Dodo trying very hard not to go extinct again...",
    "Asking other birds for name ideas...",
    "Dodo fell asleep... waking up now!",
    "Oops! Dodo sat on the keyboard...",
    "Drawing domain names with feathers...",
    "Dodo thinking: 'What would Google name this?'",
    "Running in circles for inspiration...",
    "Dodo brain on fire with ideas!",
    "Your domain eggs are hatching soon...",
    "Dodo making domain magic happen...",
    "Spilling coffee on best domain ideas...",
  ];

  // Get all TLDs based on category
  const getTldsByCategory = (category: string) => {
    switch (category) {
      case "popular":
        return POPULAR_TLDS;
      case "creative":
        return CREATIVE_TLDS;
      case "country":
        return COUNTRY_TLDS;
      case "specialty":
        return SPECIALTY_TLDS;
      default:
        return POPULAR_TLDS;
    }
  };

  const toggleTld = (tld: string) => {
    if (selectedTlds.includes(tld)) {
      setSelectedTlds(selectedTlds.filter((t) => t !== tld));
    } else {
      setSelectedTlds([...selectedTlds, tld]);
    }
  };

  // Get recommended TLDs based on current domain style
  const getRecommendedTlds = () => {
    return domainStyle === "creative" || domainStyle === "funny"
      ? CREATIVE_TLDS
      : POPULAR_TLDS;
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const generateDomains = async () => {
    setLoading(true);
    setResults([]);

    // Start the loading message animation
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setLoadingMessage(dodoMessages[messageIndex % dodoMessages.length]);
      messageIndex++;
    }, 2000);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords,
          description,
          domainLength: domainLength[0],
          domainStyle,
          tlds: selectedTlds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate domains");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error:", error);
      // Show error message to user
    } finally {
      clearInterval(messageInterval);
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <main>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 sm:p-6 md:p-8 relative pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <Waves
            lineColor="hsl(var(--foreground)/0.02)"
            backgroundColor="transparent"
            waveSpeedX={0.005}
            waveSpeedY={0.002}
            waveAmpX={20}
            waveAmpY={10}
            friction={0.98}
            tension={0.002}
            xGap={30}
            yGap={60}
          />
        </div>
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <header className="text-center space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-2">
                <Image
                  src="/logo-backgroundless.png"
                  alt="dodomains logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto backdrop-blur-[1px] bg-background/30 px-2 py-1 rounded">
              The first 100% free domain name generator to use advanced LLMs for
              highly creative, available domain suggestions
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground backdrop-blur-[1px] bg-background/30 px-2 py-1 rounded">
              <span>100% Free to Use</span>
              <span>•</span>
              <span>AI-Powered Suggestions</span>
              <span>•</span>
              <span>Available Domains Only</span>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-8">
            {/* Input Card with Glass Effect */}
            <Card className="relative z-10 backdrop-blur-sm bg-background/80 border-opacity-50 shadow-lg">
              <CardHeader>
                <CardTitle>Dodo-Powered Domain Name Generator</CardTitle>
                <CardDescription>
                  Enter keywords related to your project and our free LLM
                  technology will generate uniquely creative, available domain
                  names. Our hard-working dodo is standing by!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      id="keywords"
                      placeholder="Add keywords (e.g., creative, design). Don't forget to press enter!"
                      value={currentKeyword}
                      onChange={(e) => setCurrentKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                    />
                    <Button onClick={addKeyword} className="shrink-0">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {keyword}
                        <button
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => removeKeyword(keyword)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Project Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe your project or website"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium">
                    Customize Your Domains
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="length">Domain Length</Label>
                      <span className="text-muted-foreground text-sm">
                        {domainLength[0]} characters
                      </span>
                    </div>
                    <Slider
                      id="length"
                      min={3}
                      max={20}
                      step={1}
                      value={domainLength}
                      onValueChange={setDomainLength}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Domain Style</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {DOMAIN_STYLES.map((style) => (
                        <div
                          key={style.id}
                          className={`p-2 border rounded flex items-center justify-between cursor-pointer hover:bg-muted/50 ${
                            domainStyle === style.id
                              ? "bg-primary/10 border-primary"
                              : ""
                          }`}
                          onClick={() => setDomainStyle(style.id)}
                        >
                          <span>{style.label}</span>
                          {domainStyle === style.id && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {domainStyle === "funny"
                        ? "Warning: Our dodo may laugh uncontrollably while generating these"
                        : domainStyle === "professional"
                          ? "Our dodo will put on a tiny business suit for this one"
                          : domainStyle === "creative"
                            ? "The dodo is stretching its creative wings (though it can't fly)"
                            : "Our dodo is fluffing its feathers, ready to think"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>TLD Options (Optional)</Label>
                      <span className="text-muted-foreground text-xs">
                        Leave unselected for AI to choose
                      </span>
                    </div>

                    {/* TLD Category Selector */}
                    <div className="mb-2">
                      <Tabs
                        value={tldCategory}
                        onValueChange={setTldCategory}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="popular">Popular</TabsTrigger>
                          <TabsTrigger value="creative">Creative</TabsTrigger>
                          <TabsTrigger value="country">Country</TabsTrigger>
                          <TabsTrigger value="specialty">Specialty</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* TLD Selection Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {getTldsByCategory(tldCategory).map((tld) => (
                        <div
                          key={tld}
                          className={`p-2 border rounded flex items-center justify-between cursor-pointer hover:bg-muted/50 ${
                            selectedTlds.includes(tld)
                              ? "bg-primary/10 border-primary"
                              : ""
                          }`}
                          onClick={() => toggleTld(tld)}
                        >
                          <span className="font-mono">.{tld}</span>
                          {selectedTlds.includes(tld) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Recommended TLDs Info */}
                    {selectedTlds.length === 0 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        <p className="mb-1">
                          Based on your &quot;{domainStyle}&quot; style, the AI
                          will prioritize these TLDs:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {getRecommendedTlds().map((tld) => (
                            <Badge
                              key={tld}
                              variant="outline"
                              className="text-xs"
                            >
                              .{tld}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected TLDs Display */}
                    {selectedTlds.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          Selected TLDs:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedTlds.map((tld) => (
                            <Badge
                              key={tld}
                              className="px-2 py-1 flex items-center gap-1"
                            >
                              .{tld}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTld(tld);
                                }}
                                className="hover:text-accent-foreground"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="w-full text-center mb-1">
                  <p className="text-sm text-muted-foreground">
                    Our dodo promises not to go extinct before finding your
                    perfect domain
                  </p>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={generateDomains}
                  disabled={loading || keywords.length === 0}
                >
                  {loading ? "Generating Domains..." : "Generate Domain Ideas"}
                </Button>

                {loading && (
                  <div className="w-full text-center mt-2">
                    <p className="text-muted-foreground text-sm italic">
                      {loadingMessage}
                    </p>
                  </div>
                )}
              </CardFooter>
            </Card>

            {/* Results Card with Glass Effect */}
            {results.length > 0 && (
              <Card className="backdrop-blur-sm bg-background/80 border-opacity-50 shadow-lg">
                <CardHeader>
                  <CardTitle>Domain Suggestions</CardTitle>
                  <CardDescription>
                    Based on your keywords: {keywords.join(", ")}. Our dodo is
                    proud of these finds!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="available">Available</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="space-y-4 mt-4">
                      {results.map((domain, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg gap-2"
                        >
                          <div>
                            <h3 className="font-medium">{domain.name}</h3>
                            <p
                              className={`text-sm ${domain.available ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                            >
                              {domain.available ? "Available" : "Taken"}
                            </p>
                          </div>
                          <div className="flex items-center w-full sm:w-auto">
                            {domain.available && (
                              <div className="flex flex-col sm:flex-row gap-1 items-stretch sm:items-center w-full sm:w-auto">
                                <Button
                                  className={cn(
                                    REGISTRAR_COLORS.godaddy.bg,
                                    REGISTRAR_COLORS.godaddy.hover,
                                    REGISTRAR_COLORS.godaddy.text,
                                    "border-0 w-full sm:w-auto",
                                  )}
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={domain.affiliateLinks?.godaddy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    GoDaddy
                                  </a>
                                </Button>
                                <Button
                                  className={cn(
                                    REGISTRAR_COLORS.namecheap.bg,
                                    REGISTRAR_COLORS.namecheap.hover,
                                    REGISTRAR_COLORS.namecheap.text,
                                    "border-0 w-full sm:w-auto",
                                  )}
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={domain.affiliateLinks?.namecheap}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Namecheap
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="available" className="space-y-4 mt-4">
                      {results
                        .filter((d) => d.available)
                        .map((domain, i) => (
                          <div
                            key={i}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg gap-2"
                          >
                            <div>
                              <h3 className="font-medium">{domain.name}</h3>
                              <p className="text-sm text-green-600 dark:text-green-400">
                                Available
                              </p>
                            </div>
                            <div className="flex items-center w-full sm:w-auto">
                              {domain.available && (
                                <div className="flex flex-col sm:flex-row gap-1 items-stretch sm:items-center w-full sm:w-auto">
                                  <Button
                                    className={cn(
                                      REGISTRAR_COLORS.godaddy.bg,
                                      REGISTRAR_COLORS.godaddy.hover,
                                      REGISTRAR_COLORS.godaddy.text,
                                      "border-0 w-full sm:w-auto",
                                    )}
                                    size="sm"
                                    asChild
                                  >
                                    <a
                                      href={domain.affiliateLinks?.godaddy}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      GoDaddy
                                    </a>
                                  </Button>
                                  <Button
                                    className={cn(
                                      REGISTRAR_COLORS.namecheap.bg,
                                      REGISTRAR_COLORS.namecheap.hover,
                                      REGISTRAR_COLORS.namecheap.text,
                                      "border-0 w-full sm:w-auto",
                                    )}
                                    size="sm"
                                    asChild
                                  >
                                    <a
                                      href={domain.affiliateLinks?.namecheap}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Namecheap
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Adding SEO-friendly content sections */}
          <section className="mt-12 space-y-6 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold backdrop-blur-[1px] bg-background/30 py-1 rounded">
              How Our AI Domain Generator Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2 backdrop-blur-[1px] bg-background/30 p-2 rounded">
                <h3 className="font-medium">1. Enter Your Keywords</h3>
                <p className="text-muted-foreground">
                  Provide keywords and a brief description of your project
                </p>
              </div>
              <div className="space-y-2 backdrop-blur-[1px] bg-background/30 p-2 rounded">
                <h3 className="font-medium">2. LLM-Powered Generation</h3>
                <p className="text-muted-foreground">
                  Our LLM technology creates uniquely creative and brandable
                  domain suggestions
                </p>
              </div>
              <div className="space-y-2 backdrop-blur-[1px] bg-background/30 p-2 rounded">
                <h3 className="font-medium">3. Availability Check</h3>
                <p className="text-muted-foreground">
                  We verify domain availability in real-time so you only see
                  domains you can register
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 space-y-6 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold backdrop-blur-[1px] bg-background/30 py-1 rounded">
              Why Choose dodomains.dev
            </h2>
            <ul className="grid md:grid-cols-2 gap-4 text-left">
              <li className="flex gap-2 items-start backdrop-blur-[1px] bg-background/30 p-2 rounded">
                <span className="text-primary">✓</span>
                <span>100% free to use with no hidden costs</span>
              </li>
              <li className="flex gap-2 items-start backdrop-blur-[1px] bg-background/30 p-2 rounded">
                <span className="text-primary">✓</span>
                <span>First domain generator to use advanced LLMs</span>
              </li>
              <li className="flex gap-2 items-start backdrop-blur-[1px] bg-background/30 p-2 rounded">
                <span className="text-primary">✓</span>
                <span>
                  Verified against over 270+ million existing domain records
                  worldwide to ensure availability
                </span>
              </li>
              <li className="flex gap-2 items-start backdrop-blur-[1px] bg-background/30 p-2 rounded">
                <span className="text-primary">✓</span>
                <span>
                  Highly creative domain suggestions beyond traditional
                  generators
                </span>
              </li>
            </ul>
          </section>

          <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground backdrop-blur-[1px] bg-background/30 p-2 rounded">
            <p>
              © {new Date().getFullYear()} dodomains.dev. The first 100% free
              LLM-powered domain name generator.
            </p>
            <p className="mt-2">
              Find uniquely creative and available domain names for your
              business, startup, or personal project without any cost.
            </p>
            <p className="mt-2">
              Built with ❤️ by{" "}
              <a
                href="https://x.com/redouaneoachour"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                redouane
              </a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
