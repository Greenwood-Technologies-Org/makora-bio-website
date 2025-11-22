import { ArrowDown, Zap, ArrowUp } from "lucide-react";

const ClinboxHelps = () => {
  const benefits = [
    {
      icon: ArrowDown,
      metric: "75%",
      description: "less time on email (6–10 hours saved per week per FTE)",
    },
    {
      icon: Zap,
      metric: "95%",
      description: "of urgent messages auto escalated (AEs, deviations, patient questions, contract blockers)",
    },
    {
      icon: ArrowUp,
      metric: "50%",
      description: "faster task resolution (with AI assistance)",
    },
  ];

  return (
    <section className="py-8 px-6 lg:px-8" id="clinbox">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-6">
          Helping sponsors, CROs, and sites
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="relative">
                <div className="p-8 animate-fade-in flex items-start gap-4" style={{ animationDelay: `${index * 100}ms` }}>
                  <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="font-bold text-foreground">{benefit.metric}</strong> {benefit.description}
                    </p>
                  </div>
                </div>
                {index < benefits.length - 1 && (
                  <>
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-24 border-r border-border" />
                    <div className="md:hidden border-t border-border" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClinboxHelps;
