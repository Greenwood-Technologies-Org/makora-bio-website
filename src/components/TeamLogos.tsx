const TeamLogos = () => {
  const companies = [
    { name: "MIT", logo: "/team_logos/MIT.png" },
    { name: "Atlassian", logo: "/team_logos/atlassian.png" },
    { name: "Recursion Pharmaceuticals", logo: "/team_logos/recursion_pharma.png" },
    { name: "Citadel Securities", logo: "/team_logos/citadel_securities.webp" },
    { name: "Georgia Tech", logo: "/team_logos/georgia_tech.png" },
    { name: "CWRU", logo: "/team_logos/CWRU.png" },
  ];

  return (
    <section className="py-8 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-center mb-8">
          Our best-in-class teammates have experience from:
        </p>
        
        {/* Uniform brick layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div 
              key={company.name} 
              className="h-32 w-full rounded-lg bg-white p-6 flex items-center justify-center"
            >
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamLogos;
