import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

const Waitlist = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitToAirtable = async (name: string, email: string) => {
    console.log('Submitting to Airtable...', { name, email });
    console.log('Environment variables:', {
      token: import.meta.env.VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN ? 'Present' : 'Missing',
      baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
      tableName: import.meta.env.VITE_AIRTABLE_TABLE_NAME
    });

    // The correct Airtable API format
    const response = await fetch(`https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_TABLE_NAME}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: name,
              Email: email,
              'Date Added': new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
            }
          }
        ]
      })
    });

    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (!response.ok) {
      throw new Error(`Failed to submit to waitlist: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    return responseData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await submitToAirtable(fullName, email);
      
      // Show success modal after successful submission
      setShowModal(true);
      
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (error) {
      console.error('Error submitting to waitlist:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" ref={sectionRef} className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className={`max-w-2xl mx-auto text-center fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Be the First to Use Our Tools
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            We're building in public. Enter your details to get early access and updates.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <Input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
            <Button type="submit" variant="waitlist" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </div>
      </div>
      
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-8 max-w-md mx-4 text-center">
            <h3 className="text-2xl font-bold mb-4">Added to Waitlist!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for joining our waitlist. We'll keep you updated on our progress.
            </p>
            <Button 
              onClick={() => setShowModal(false)}
              variant="waitlist"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Waitlist;