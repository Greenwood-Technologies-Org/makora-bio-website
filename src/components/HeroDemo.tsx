import { useEffect, useState } from "react";
import { Mail, Zap, CheckCircle, Database, Sparkle } from "lucide-react";

const HeroDemo = () => {
  const stepSets = [
    [
      { icon: Mail, text: "BloodSight Diagnostics result for Subject 102-045" },
      { icon: Zap, text: "Activating blood-draw vendor workflow" },
      { icon: CheckCircle, text: "Checking collection timestamps and hemolysis flags" },
      { icon: Database, text: "Logging in Medidata Rave" },
    ],
    [
      { icon: Mail, text: "Site 203 has low IP before patient visit" },
      { icon: Sparkle, text: "Quick Action: expedite IP transfer" },
      { icon: Mail, text: "Following up with Jim Collins (IP Manager)" },
      { icon: Mail, text: "Following up with Site 203 for updated timeline" },
    ],
    [
        { icon: Mail, text: "Site 118: SAE reported for Subject 04-203" },
        { icon: Zap, text: "Triggering SAE workflow" },
        { icon: Mail, text: "Forwarding SAE details to safety distribution list" },
        { icon: Database, text: "Submitting to ArisGlobal Safety Portal" },
    ],
  ];

  const [setIndex, setSetIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [direction, setDirection] = useState<'in' | 'out'>('in');

  const steps = stepSets[setIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      if (direction === 'in') {
        setVisibleSteps((prev) => {
          const next = prev + 1;
          if (next > steps.length) {
            setDirection('out');
            return 0;
          }
          return next;
        });
      } else {
        setVisibleSteps((prev) => {
          const next = prev - 1;
          if (next < 0) {
            setDirection('in');
            setSetIndex((prevSet) => (prevSet + 1) % stepSets.length);
            return 0;
          }
          return next;
        });
      }
    }, 3000); // Change every 1.5 seconds

    return () => clearInterval(interval);
  }, [direction, steps.length, stepSets.length]);

  return (
    <div className="w-full max-w-md border-2 border-primary rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg p-6" style={{ aspectRatio: "9/9" }}>
      <div className="flex flex-col space-y-6 h-full justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isVisible = direction === 'in' && index < visibleSteps;

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