import { Shield, Lock, CheckCircle } from "lucide-react";

const Security = () => {
  const features = [
    {
      icon: Lock,
      title: "Your data stays private",
      description:
        "We protect your privileged data with end-to-end encryption, isolated from all other customer data.",
    },
    {
      icon: Shield,
      title: "Full data control",
      description:
        "Full visibility into your clinical trial operations, allowing precise control over data access and usage.",
    },
    {
      icon: CheckCircle,
      title: "Compliant",
      description:
        "Meets ICH-GCP and FDA standards, with audit trails aligned to 21 CFR Part 11",
    },
  ];

  return (
    <section className="pb-6 pt-12 px-6 lg:px-8" id="security">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-medium text-center mb-6">Security</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="relative">
                <div
                  className="text-center space-y-4 animate-fade-in p-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                {index < features.length - 1 && (
                  <>
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-32 border-r border-border" />
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

export default Security;
