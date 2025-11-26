import { useEffect, useState } from "react";
import { Mail, Zap, CheckCircle, Database } from "lucide-react";

const HeroDemo = () => {
  const steps = [
    { icon: Mail, text: "New email from BloodSight Diagnostics" },
    { icon: Zap, text: "Activating blood-draw vendor workflow" },
    { icon: CheckCircle, text: "Checking collection timestamps and hemolysis flags" },
    { icon: Database, text: "Logging in Medidata Rave" },
  ];

  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSteps((prev) => (prev + 1) % (steps.length + 1));
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full max-w-md border-2 border-primary rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg p-6" style={{ aspectRatio: "9/9" }}>
      <div className="flex flex-col space-y-4 h-full justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isVisible = index < visibleSteps;

          return (
            <div
              key={index}
              className={`flex items-center space-x-3 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
              }`}
            >
              <div
                className="text-primary"
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-black">
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroDemo;