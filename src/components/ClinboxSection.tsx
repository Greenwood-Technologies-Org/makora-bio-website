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
            <img src={logo} alt="Clinbox" className="h-16 w-16" />
            <h2 className="text-6xl font-bold text-primary">
              Clinbox
            </h2>
          </div>
          <p className="text-2xl text-muted-foreground">
            The intelligent inbox for clinical research operations
          </p>
        </div>

        {/* Problem Section */}
        <div className="mb-20 fade-in-section">
          <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
            Problem
          </h3>
          <div className="max-w-5xl mx-auto mb-8">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Clinical operations staff spend 2+ hours per day on email, 
              digging through files like strategy docs, SOPs, and vendor systems to answer routine questions. 
              Response times average 2 days, and every redirect adds another 
              2 days. Complex threads, like contract negotiation and query resolution, can drag on for 2+ weeks.
            </p>
            <p className="text-lg leading-relaxed font-semibold">
              60% of sites and 43% of sponsors/CROs say poor communication severely impacts SSU, patient enrollment, and site engagement.
            </p>
          </div>

          {/* Problem Testimonials */}
          <div className="max-w-4xl mx-auto">
            <Carousel 
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 5000,
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
            Solution
          </h3>
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-lg text-foreground leading-relaxed text-center">
              Clinbox is an AI-powered inbox purpose-built 
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

          {/* Demo Video */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/xLIS7Ef1nTc"
                title="Clinbox Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Value Section */}
        <div className="mb-20 fade-in-section">
          <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
            Value
          </h3>
          <div className="max-w-6xl mx-auto">
            <p className="text-lg text-foreground text-center">
              Clinbox reduces email overhead while preserving oversight and compliance.
            </p>
            <p className="text-lg text-foreground mb-8 text-center">
              We estimate the following ROI at the sponsor, site, and study levels:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-lg mb-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Sponsor Staff</h4>
                    <p className="text-2xl font-bold text-primary mb-2">75%</p>
                    <p className="text-muted-foreground mb-2">
                      less time per email
                    </p>
                    <p className="text-sm text-muted-foreground">
                      (6-10 hrs saved per week / FTE)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-lg mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Site Engagement</h4>
                    <p className="text-2xl font-bold text-primary mb-2">10-20%</p>
                    <p className="text-muted-foreground mb-2">
                      faster complex thread resolution
                    </p>
                    <p className="text-sm text-muted-foreground">
                      50% faster quick threads
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-lg mb-4">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Study Level</h4>
                    <p className="text-2xl font-bold text-primary mb-2">10-20%</p>
                    <p className="text-muted-foreground mb-2">
                      fewer repeat questions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      within 4-8 weeks via analytics
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Demo Testimonials */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Carousel 
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 5000,
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
