import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const McpServers = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground">
            MCP Servers
          </h1>
          <p className="text-xl text-muted-foreground mt-6 max-w-2xl">
            Coming soon - Access powerful MCP servers for life sciences research
          </p>
        </div>
      </div>
    </div>
  );
};

export default McpServers;
