import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RightPanel } from "@/components/dashboard/RightPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 max-w-6xl mx-auto">
          <WelcomeBanner />
          
          <div className="flex gap-6 justify-center">
            <div className="flex-1 max-w-3xl">
              <ActivityFeed />
            </div>
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
