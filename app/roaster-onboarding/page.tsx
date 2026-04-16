"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "../../components/ui/use-toast";

const roasterSchema = z.object({
  roaster_name: z.string().min(2, "Roaster name is required"),
  origin: z.string().min(2, "Origin is required"),
  specialty_roasts: z.string().min(10, "Specialty roasts description should be at least 10 characters"),
  flavor_notes: z.string().min(5, "Flavor notes should be at least 5 characters"),
  price_point: z.number().min(1, "Price must be greater than zero"),
});

type RoasterFormData = z.infer<typeof roasterSchema>;

export default function RoasterOnboardingPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoasterFormData>({
    resolver: zodResolver(roasterSchema),
  });

  async function onSubmit(data: RoasterFormData) {
    try {
      const response = await fetch(
        "https://app.baget.ai/api/public/databases/44022dcb-83ad-4200-9684-79b1220e8510/rows",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        }
      );

      if (response.ok) {
        toast({ title: "Roaster product submitted successfully!" });
        reset();
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission failed",
          description: errorData?.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to submit your product. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow-md mt-12">
      <h1 className="text-3xl font-playfair mb-6 text-espresso">Roaster Product Submission</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="roaster_name" className="block mb-1 font-semibold">
            Roaster Name
          </label>
          <Input
            type="text"
            id="roaster_name"
            placeholder="Example: Summit Coffee Roasters"
            {...register("roaster_name")}
            aria-invalid={errors.roaster_name ? "true" : "false"}
          />
          {errors.roaster_name && (
            <p className="text-red-600 text-sm mt-1">{errors.roaster_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="origin" className="block mb-1 font-semibold">
            Origin
          </label>
          <Input
            type="text"
            id="origin"
            placeholder="Example: Ethiopia, Yirgacheffe"
            {...register("origin")}
            aria-invalid={errors.origin ? "true" : "false"}
          />
          {errors.origin && (
            <p className="text-red-600 text-sm mt-1">{errors.origin.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="specialty_roasts" className="block mb-1 font-semibold">
            Specialty Roasts Description
          </label>
          <Textarea
            id="specialty_roasts"
            placeholder="Describe your unique roasting styles and offerings"
            {...register("specialty_roasts")}
            aria-invalid={errors.specialty_roasts ? "true" : "false"}
            className="min-h-[100px]"
          />
          {errors.specialty_roasts && (
            <p className="text-red-600 text-sm mt-1">{errors.specialty_roasts.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="flavor_notes" className="block mb-1 font-semibold">
            Flavor Notes
          </label>
          <Textarea
            id="flavor_notes"
            placeholder="Notes on flavor profile of your beans"
            {...register("flavor_notes")}
            aria-invalid={errors.flavor_notes ? "true" : "false"}
            className="min-h-[80px]"
          />
          {errors.flavor_notes && (
            <p className="text-red-600 text-sm mt-1">{errors.flavor_notes.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price_point" className="block mb-1 font-semibold">
            Price per Bag (USD)
          </label>
          <Input
            type="number"
            step="0.01"
            id="price_point"
            placeholder="Example: 22.50"
            {...register("price_point", { valueAsNumber: true })}
            aria-invalid={errors.price_point ? "true" : "false"}
          />
          {errors.price_point && (
            <p className="text-red-600 text-sm mt-1">{errors.price_point.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
          {isSubmitting ? "Submitting..." : "Submit Product"}
        </Button>
      </form>
    </main>
  );
}
