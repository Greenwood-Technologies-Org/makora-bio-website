

const integrations = [
  { name: "Microsoft Outlook", logo: "📧" },
  { name: "Gmail", logo: "📮" },
  { name: "Slack", logo: "💬" },
  { name: "Calendly", logo: "📅" },
  { name: "Salesforce", logo: "☁️" },
  { name: "Zoom", logo: "🎥" },
];

const Integrations = () => {
  return (
    <section className="py-8 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-medium text-center mb-12">
          Seamless Integrations Across Your Clinical Trial Workflows
        </h2>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex gap-12 animate-scroll"
            style={{ 
              animation: 'scrollCarousel 20s linear infinite',
            }}
          >
            {[...integrations, ...integrations, ...integrations].map((integration, index) => (
              <div
                key={`${integration.name}-${index}`}
                className="flex-shrink-0 w-40 text-center space-y-3"
              >
                <div className="w-24 h-24 mx-auto bg-card rounded-2xl shadow-md flex items-center justify-center text-4xl border border-border">
                  {integration.logo}
                </div>
                <p className="text-sm font-medium text-foreground">{integration.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
