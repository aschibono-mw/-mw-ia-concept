import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Zap } from "lucide-react";

const TEAL = "#00827F";

const ExecuteLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="execute" />
      <Header />

      <main className="ml-52 pt-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: "rgba(0,130,127,0.1)" }}
          >
            <Zap className="w-6 h-6" style={{ color: TEAL }} />
          </div>

          <h1 className="text-3xl font-extrabold font-nunito text-foreground mb-3">
            Execute is coming soon
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Based on signals across your searches, Execute will surface your
            highest-impact next steps — from content opportunities to outreach
            moments and strategic communications.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ExecuteLanding;
