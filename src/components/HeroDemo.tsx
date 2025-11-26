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
  // used to trigger a grouped fade-out animation
  const [isFadingOut, setIsFadingOut] = useState(false);

  const steps = stepSets[setIndex];

  useEffect(() => {
    const perStepDelay = 3000; // how long each step stays visible as it comes in
    const bufferDuration = 3000; // how long to keep the full set visible before fade-out
    const fadeOutDuration = 500; // quick group fade-out duration

    let t: ReturnType<typeof setTimeout> | undefined;

    if (isFadingOut) {
      // once fading out, wait for the fadeOutDuration then switch sets and show first step quickly
      t = setTimeout(() => {
        setIsFadingOut(false);
        setSetIndex((prev) => (prev + 1) % stepSets.length);
        // immediately show first step of next set so group switch feels faster
        setVisibleSteps(1);
      }, fadeOutDuration);
    } else {
      if (visibleSteps < steps.length) {
        // still bringing steps in, schedule the next one
        t = setTimeout(() => setVisibleSteps((v) => v + 1), perStepDelay);
      } else if (visibleSteps === steps.length) {
        // full set visible, wait the buffer then start fade out
        t = setTimeout(() => setIsFadingOut(true), bufferDuration);
      }
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [isFadingOut, visibleSteps, steps.length, stepSets.length]);

  return (
    <div className="w-full max-w-md border-2 border-primary rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg p-6" style={{ aspectRatio: "9/9" }}>
      <div className="flex flex-col space-y-6 h-full justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrentlyShown = index < visibleSteps;
          const isFadingOutThisItem = isFadingOut && isCurrentlyShown;
          const isVisible = isCurrentlyShown && !isFadingOut;

          return (
            <div
              key={index}
              className={`flex items-center space-x-3 transition-all duration-1000 ${
                isFadingOutThisItem ? "opacity-0 translate-y-24" : isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
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