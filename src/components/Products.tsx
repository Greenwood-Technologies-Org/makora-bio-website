import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const mcpServers = [
  {
    title: "ChEMBL MCP Server",
    description: "Quickly query bioactivity data from ChEMBL for target-compound relationships.",
    icon: "🧬"
  },
  {
    title: "PubChem MCP Server", 
    description: "Summarize compound info and compare structures across public datasets.",
    icon: "⚗️"
  },
  {
    title: "PubMed MCP Server",
    description: "Automatically find and rank relevant papers for your experimental context.", 
    icon: "📚"
  },
  {
    title: "AlphaFold MCP Server",
    description: "Integrate structure predictions into your experimental planning pipeline.",
    icon: "🧪"
  }
];

const Products = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What We're Building
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We're creating research-ready MCP servers and agents, optimized for fast, reproducible, and accessible scientific workflows.
          </p>
        </div>

        {/* MCP Servers Section */}
        <div className="mb-16">
          <div className={`text-center mb-12 fade-in-up ${isVisible ? 'visible' : ''}`}>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              MCP Servers
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mcpServers.map((server, index) => (
              <div
                key={server.title}
                className={`fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full bg-card/50 border-border hover:bg-card/80 transition-all duration-300 hover:glow-blue">
                  <CardHeader>
                    <div className="text-4xl mb-4">{server.icon}</div>
                    <CardTitle className="text-xl">{server.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {server.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className={`text-center fade-in-up ${isVisible ? 'visible' : ''}`}>
            <Button variant="waitlist" size="lg" className="text-lg px-8 py-6">
              Access MCP Servers
            </Button>
          </div>
        </div>

        {/* Research Assistant Agent Section */}
        <div className={`text-center fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Research Assistant Agent
          </h3>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Scientists can leverage the smartest AI models with our optimized MCP servers to access powerful agentic research assistance. Get intelligent help with experimental design, literature review, and data analysis.
          </p>
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            Access Research Assistant
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;