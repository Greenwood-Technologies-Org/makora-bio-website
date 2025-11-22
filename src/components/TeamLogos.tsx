const TeamLogos = () => {
  const companies = [
    { name: "MIT", logo: "🎓" },
    { name: "Atlassian", logo: "⚡" },
    { name: "Recursion Pharmaceuticals", logo: "🧬" },
    { name: "Citadel Security", logo: "🔒" },
  ];

  return (
    <section className="py-8 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Our best-in-class teammates have worked at:
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-12">
          {companies.map((company) => (
            <div key={company.name} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-3xl">{company.logo}</span>
              <span className="text-sm font-medium">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamLogos;
