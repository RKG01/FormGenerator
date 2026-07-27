import Link from "next/link";
import React from "react";
import { Progress } from "./ui/progress";
import { getForms } from "@/actions/getForms";
import { getUserSubscription } from "@/actions/userSubscription"; 
import { MAX_FREE_FORM } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";

type Props = {
  userId: string | undefined;
}

const UpgradeButton: React.FC<Props> = async ({ userId }) => {
  const forms = await getForms(userId); 
  const isSubscribed = await getUserSubscription(userId!);

  const formsGenerated = forms?.data?.length || 0;
  const percentage = Math.min((formsGenerated / MAX_FREE_FORM) * 100, 100);

  return (
    <div className="w-full max-w-7xl mx-auto mb-6">
      {isSubscribed ? (
        <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
          <CardContent className="flex items-center gap-4 py-4 px-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                Pro Plan Active
              </h4>
              <p className="text-xs text-muted-foreground">
                You have unlimited form creation and priority support. Thank you for subscribing!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 shadow-sm backdrop-blur-md">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Free Plan Limits
                  <span className="text-xs font-normal text-muted-foreground">
                    ({formsGenerated} / {MAX_FREE_FORM} forms used)
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  Upgrade to dynamic unlimited forms, AI tagging, and Stripe payments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto flex-1 sm:flex-initial justify-end">
              <div className="w-full sm:w-48 space-y-1">
                <Progress value={percentage} className="h-2 bg-violet-500/10 [&>div]:bg-violet-500" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{percentage}% capacity</span>
                  <span>{MAX_FREE_FORM - formsGenerated} left</span>
                </div>
              </div>
              
              <Link href="/dashboard/upgrade" passHref className="flex-shrink-0">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white font-medium gap-1.5 shadow-md shadow-violet-500/10 transition-all duration-200">
                  Upgrade
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpgradeButton;