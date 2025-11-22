const EmailImpact = () => {
  const impacts = [
    "*10+ hours/week* spent digging through inbox, files, and vendor portals to answer queries",
    "*2-day* average email response time, turning threads into 2+ week delays",
    "*60% of sites & 43% of sponsors* say communication delays hurt SSU, enrollment, and engagement",
  ];

  return (
    <section className="py-8 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-16">
          <div className="lg:w-[30%] mb-12 lg:mb-0 lg:pt-8">
            <h2 className="text-4xl font-semibold text-center lg:text-left">Legacy email slows trials down</h2>
          </div>
          
          <div className="lg:w-[70%] space-y-0">
            {impacts.map((impact, index) => {
              const parts = impact.split(/(\*[^*]+\*)/g);
              return (
                <div key={index}>
                  <div className="py-8 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {parts.map((part, i) => 
                        part.startsWith('*') && part.endsWith('*') ? (
                          <strong key={i} className="font-bold text-foreground">{part.slice(1, -1)}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                  </div>
                  {index < impacts.length - 1 && (
                    <div className="border-t border-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailImpact;
