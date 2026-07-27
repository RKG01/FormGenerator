import { getForms } from "@/actions/getForms";
import { getUserSubscription } from "@/actions/userSubscription";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PricingPage from "@/components/PricingPage";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const HomePage = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [forms, isSubscribed] = await Promise.all([
    getForms(user.id),
    getUserSubscription(user.id) as Promise<boolean>,
  ]);
  const totalNumberOfFormCreated = forms?.data?.length || (0 as number);

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <HeroSection
        totalForms={totalNumberOfFormCreated}
        isSubscribed={isSubscribed}
      />
      <PricingPage userId={user?.id} />
      <Footer />
    </div>
  );
};

export default HomePage;
