import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RightPanel } from "@/components/dashboard/RightPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage="home" />
      <Header />
      
      <main className="ml-52 pt-16">
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[1100px]">
            <WelcomeBanner />
            <DashboardHero />
            <div className="flex gap-6 items-start">
              <div className="flex-1 max-w-3xl">
                <ActivityFeed />
              </div>
              <div className="sticky top-20">
                <RightPanel />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
