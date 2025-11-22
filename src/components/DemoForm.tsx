import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const DemoForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inboxType: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Demo request submitted! We'll be in touch soon.");
    setFormData({ name: "", email: "", inboxType: "" });
  };

  return (
    <section className="py-8 px-6 lg:px-8 bg-secondary/30" id="demo">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="text-4xl font-semibold mb-4">Try a Demo</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl shadow-lg border border-border animate-fade-in">
          <div className="text-center mb-6">
            <p className="text-xl text-muted-foreground mb-2">1 minute live demo with ClinBox</p>
            <p className="text-muted-foreground">See ClinBox work in a simulated inbox</p>
          </div>
          
          <div>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-12"
            />
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-12"
            />
          </div>
          
          <div>
            <Select
              value={formData.inboxType}
              onValueChange={(value) => setFormData({ ...formData, inboxType: value })}
              required
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Inbox Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ctm">CTM</SelectItem>
                <SelectItem value="cra">CRA</SelectItem>
                <SelectItem value="crc">CRC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" size="lg" className="w-full">
            Try Demo
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By clicking "Try Demo," you agree to receive emails from Makora Bio and agree to our Terms of Service
          </p>
        </form>
      </div>
    </section>
  );
};

export default DemoForm;
