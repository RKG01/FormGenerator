"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { publishForm } from "@/actions/publishForm";
import FormPublishDialog from "./FormPublishDialog";
import toast from "react-hot-toast";
import { submitForm } from "@/actions/submitForm";

type Props = { form: any; isEditMode: boolean };

const AiGeneratedForm: React.FC<Props> = ({ form, isEditMode }) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.FormEvent<HTMLButtonElement>
  ) => {
    const target = e.target as HTMLInputElement; // Ensure proper type assertion
    const { name, value, type, checked } = target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      const res = await publishForm(form.id);
      console.log(res);

      setSuccessDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await submitForm(form.id, formData);

    if (data?.success) {
      toast.success(data.message);
      setFormData({});
    }

    if (!data?.success) {
      toast.error(data?.message);
    }
  };

  return (
    <div>
      <form onSubmit={isEditMode ? handlePublish : handleSubmit}>
        {form.content.fields.map((item: any, index: number) => (
          <div key={index} className="mb-4">
            <Label>{item.label}</Label>
            {item.type === "text" ||
            item.type === "email" ||
            item.type === "password" ||
            item.type === "date" ||
            item.type === "name" ||
            item.type === "number" ||
            item.type === "file" ? (
              <Input
                type={item.type}
                name={item.name}
                placeholder={`Enter your ${item.name}...`}
                required={!isEditMode && item.required}
                onChange={handleChange}
              />
            ) : item.type === "textarea" ? (
              <Textarea
                className="w-full border rounded"
                name={item.name}
                placeholder={`Enter your ${item.name}...`}
                required={!isEditMode && item.required}
                onChange={handleChange}
              />
            ) : item.type === "select" ? (
              <Select
                onValueChange={(value) => handleSelectChange(item.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select your ${item.name}...`} />
                </SelectTrigger>
                <SelectContent>
                  {item.options && item.options.length > 0 ? (
                    item.options.map((option: any, idx: number) => (
                      <SelectItem
                        key={idx}
                        value={option?.label || `${option}`}
                      >
                        {option.label || option}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={"not-found"} disabled>
                      No options available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            ) : item.type === "radio" ? (
              <RadioGroup
                onValueChange={(value: string) =>
                  handleSelectChange(item.name, value)
                }
                name={item.name}
              >
                {item.options && item.options.length > 0 ? (
                  item.options.map((option: any, idx: number) => (
                    <Label key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.value || option}
                        required={!isEditMode && item.required}
                      />
                      <span>{option.label || option}</span>
                    </Label>
                  ))
                ) : (
                  <Label>No options available</Label>
                )}
              </RadioGroup>
            ) : item.type === "checkbox" ? (
              item.options && item.options.length > 0 ? (
                item.options.map((option: any, idx: number) => (
                  <Label key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      name={item.name}
                      value={option.value}
                      onChange={handleChange}
                    />
                    <span>{option.label}</span>
                  </Label>
                ))
              ) : (
                <Label> No options available</Label>
              )
            ) : null}
          </div>
        ))}
        <Button type="submit">{isEditMode ? "Publish" : "Submit"}</Button>
      </form>
      <FormPublishDialog
        formId={form.id}
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
      />
    </div>
  );
};

export default AiGeneratedForm;
