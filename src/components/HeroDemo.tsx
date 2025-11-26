import { useEffect, useState } from "react";
import { Mail, Zap, CheckCircle, Database } from "lucide-react";

const HeroDemo = () => {
  const steps = [
    { icon: Mail, text: "New email from BloodSight Diagnostics" },
    { icon: Zap, text: "Activating blood-draw vendor workflow" },
    { icon: CheckCircle, text: "Checking collection timestamps and hemolysis flags" },
    { icon: Database, text: "Logging in Medidata Rave" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000); // Change step every 2 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full max-w-md border-2 border-primary rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg p-6" style={{ aspectRatio: "9/9" }}>
      <div className="flex flex-col space-y-4 h-full justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center space-x-3 transition-all duration-500 ${
                isActive ? "opacity-100 scale-105" : isCompleted ? "opacity-70" : "opacity-40"
              }`}
            >
              <div
                className={`p-2 rounded-full transition-colors duration-500 ${
                  isActive ? "bg-primary text-primary-foreground" : isCompleted ? "bg-green-500 text-white" : "bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium transition-colors duration-500 ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}>
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