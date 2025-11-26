import { useEffect, useState, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps = stepSets[setIndex];

  useEffect(() => {
    initialTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setVisibleSteps(1);
      initialTimeoutRef.current = null;
    }, 3000);

    return () => {
      if (initialTimeoutRef.current) clearTimeout(initialTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        setVisibleSteps((prev) => {
          const next = prev + 1;
          if (next > steps.length) {
            setIsLoading(true);
            setVisibleSteps(0);
            return 0;
          }
          return next;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading, steps.length]);

  useEffect(() => {
    if (isLoading && visibleSteps === 0) {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setVisibleSteps(1);
        setSetIndex((prevSet) => (prevSet + 1) % stepSets.length);
        loadingTimeoutRef.current = null;
      }, 4000); // 3s loading + 1s pause
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoading, visibleSteps, stepSets.length]);

  return (
    <div className="w-full max-w-md border-2 border-primary rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg p-6 relative overflow-hidden" style={{ aspectRatio: "9/9" }}>
      <div className={`flex flex-col space-y-6 h-full justify-center transition-all duration-1000 ${isLoading ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isVisible = !isLoading && index < visibleSteps;

          return (
            <div
              key={index}
              className={`flex items-center space-x-3 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
              }`}
            >
              <div className="text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-black">
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${isLoading ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <span className="font-medium text-black mb-2">Monitoring Inbox</span>
        <div className="flex space-x-1">
          <span className="inline-block animate-bounce">.</span>
          <span className="inline-block animate-bounce" style={{animationDelay: '0.1s'}}>.</span>
          <span className="inline-block animate-bounce" style={{animationDelay: '0.2s'}}>.</span>
        </div>
      </div>
    </div>
  );
};

export default HeroDemo;