import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";
import { Mail, Zap, BarChart3, Clock, Users, TrendingUp } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import logo from "@/assets/clinbox-logo.png";

const ClinboxSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const sections = sectionRef.current.querySelectorAll(".fade-in-section");
      sections.forEach((section) => observer.observe(section));
    }

    return () => observer.disconnect();
  }, []);

  const problemQuotes = [
    {
      quote: "The most frustrating part of my job is email admin work. I spend hours digging through archives to answer questions.",
      author: "In-House CRA at Large CRO",
    },
    {
      quote: "The best sponsors reply fast, even just to say they're looking into it. The bad ones go silent until they finally have an answer.",
      author: "CRC at Private Research Site",
    },
    {
      quote: "Our email culture is so bad that we sometimes have to visit sites in person, which really hurts our SSU timelines.",
      author: "CRA at Small Sponsor",
    },
  ];

  const demoQuotes = [
    {
      quote: "This would be super helpful for my emails as a CRA. I spend so much time referencing other docs and threads.",
      author: "CRA at Large Sponsor",
    },
    {
      quote: "Sponsor teams would save so much time with AI recommendations for their communications!",
      author: "PM at Large Sponsor",
    },
    {
      quote: "I reply to emails 4x faster with AI, but still spend lots of time switching between my inbox and ChatGPT.",
      author: "CRC at Large University",
    },
  ];

  const features = [
    {
      icon: Mail,
      title: "Smart Organization",
      description: "Organize emails into tasks and subtasks tied to study workflows",
    },
    {
      icon: Zap,
      title: "AI Automation",
      description: "Automate routine actions with AI-suggested replies, escalations, and meetings",
    },
    {
      icon: BarChart3,
      title: "Context-Aware",
      description: "Integrate documents and prior threads for intelligent recommendations",
    },
    {
      icon: TrendingUp,
      title: "Process Insights",
      description: "Analyze communications to uncover bottlenecks and improve over time",
    },
  ];

  return (
    <section id="clinbox" className="py-20 scroll-mt-20" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-section">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={logo} alt="Clinbox" className="h-16 w-16 md:h-20 md:w-20" />
            <h2 className="text-4xl md:text-6xl font-bold text-foreground">
              Clinbox
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-primary font-semibold">
            The intelligent inbox for clinical research operations
          </p>
        </div>

        {/* Problem Section */}
        <div className="mb-20 fade-in-section">
          <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
            The Problem
          </h3>
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Sponsor teams spend <span className="font-bold text-primary">2+ hours per day</span> on email, 
              digging through files like strategy docs, SOPs, and vendor systems to answer routine questions. 
              Response times average <span className="font-bold">2 days</span>, and every redirect adds another 
              2 days. Complex threads like contract negotiation can drag on for{" "}
              <span className="font-bold">2+ weeks</span>.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              <span className="font-bold text-primary">60% of sites</span> and{" "}
              <span className="font-bold text-primary">43% of sponsors/CROs</span> say poor 
              communication severely impacts SSU, patient enrollment, and site engagement.
            </p>
          </div>

          {/* Problem Testimonials */}
          <div className="max-w-4xl mx-auto">
            <Carousel 
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 3000,
                })
              ]}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {problemQuotes.map((item, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-background border-border">
                      <CardContent className="p-8">
                        <p className="text-lg italic text-foreground mb-4">"{item.quote}"</p>
                        <p className="text-sm font-medium text-muted-foreground">— {item.author}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </div>
        </div>

        {/* Solution Section */}
        <div className="mb-20 fade-in-section">
          <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
            The Solution
          </h3>
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xl text-foreground leading-relaxed text-center">
              Clinbox is an <span className="font-bold text-primary">AI-powered inbox</span> purpose-built 
              for clinical operations. It helps sponsor teams manage threads, draft replies, and surface insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Value Section */}
        <div className="mb-20 fade-in-section">
          <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
            The Value
          </h3>
          <div className="max-w-6xl mx-auto">
            <p className="text-lg text-foreground mb-8 text-center">
              Clinbox reduces email overhead while preserving oversight and compliance
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-foreground mb-2">Sponsor Staff</h4>
                  <p className="text-2xl font-bold text-primary mb-2">≈75%</p>
                  <p className="text-sm text-muted-foreground">
                    less time per actionable email
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (6-10 hrs saved per week / FTE)
                  </p>
                </div>

                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-foreground mb-2">Site Engagement</h4>
                  <p className="text-2xl font-bold text-primary mb-2">10-20%</p>
                  <p className="text-sm text-muted-foreground">
                    faster complex thread resolution
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    50% faster quick threads
                  </p>
                </div>

                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-foreground mb-2">Study Level</h4>
                  <p className="text-2xl font-bold text-primary mb-2">10-20%</p>
                  <p className="text-sm text-muted-foreground">
                    fewer repeat questions
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    within 4-8 weeks via analytics
                  </p>
                </div>
              </div>
            </div>

          {/* Demo Testimonials */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Carousel 
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 3000,
                })
              ]}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {demoQuotes.map((item, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-background border-border">
                      <CardContent className="p-8">
                        <p className="text-lg italic text-foreground mb-4">"{item.quote}"</p>
                        <p className="text-sm font-medium text-muted-foreground">— {item.author}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinboxSection;
