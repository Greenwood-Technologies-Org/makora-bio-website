import { ArrowDownRight, Zap, ArrowUpRight } from "lucide-react";

const ClinboxHelps = () => {
  const benefits = [
    {
      icon: ArrowDownRight,
      metric: "75%",
      description: "less time on email (5-8 hours saved per week per FTE)",
    },
    {
      icon: Zap,
      metric: "95%",
      description: "urgent messages auto escalated (AEs, deviations, patient questions, contract blockers)",
    },
    {
      icon: ArrowUpRight,
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
                <div className="p-8 animate-fade-in flex flex-col items-center text-center" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-8 h-8 text-primary flex-shrink-0" />
                    <p className="text-3xl font-semibold text-foreground">{benefit.metric}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
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
