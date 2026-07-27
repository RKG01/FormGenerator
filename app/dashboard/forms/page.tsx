import { getForms } from "@/actions/getForms";
import { getUserSubscription } from "@/actions/userSubscription";
import FormList from "@/components/FormList";
import GenerateFormInput from "@/components/GenerateFormInput";
import UpgradeButton from "@/components/UpgradeButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/types/form";
import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import React from "react";

const MyForm = async () => {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">User not found</h1>
      </div>
    );
  }

  const [forms, isSubscribed] = await Promise.all([
    getForms(user.id),
    getUserSubscription(user.id),
  ]);
  const totalForms = forms?.data?.length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <UpgradeButton userId={user.id} />

      <section className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-xl">My Forms</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              {" "}
              <Plus /> Create New Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Write a prompt</DialogTitle>
              <DialogDescription>
                Write a clean prompt to get better results.
              </DialogDescription>
            </DialogHeader>
            <GenerateFormInput totalForms={totalForms} isSubscribed={isSubscribed} />
          </DialogContent>
        </Dialog>
      </section>
      <div className="grid grid-cols-4 gap-2">
        {forms?.data?.map((form:Form, index: number) => (
          <FormList key={index} form={form} />
        ))}
      </div>
    </div>
  );
};

export default MyForm;