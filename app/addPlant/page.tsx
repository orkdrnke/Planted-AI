"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePlantStore } from "@/lib/store/plantsStore";
import { PLANT_TYPES } from "@/lib/mockdata";
import { useRouter } from "next/navigation";
import { PlantFormSchema } from "@/schemas/plantFormSchema";

export default function AddPlantForm() {
  const form = useForm({
    resolver: zodResolver(PlantFormSchema),
    defaultValues: {
      name: "",
      type: "",
      size: "",
      amount: "",
      price: "",
      dest: "",
      dateAdded: "",
    },
  });
  const { control } = form;
  const addPlant = usePlantStore((store) => store.addPlant);
  const router = useRouter();

  async function onSubmit(data: z.output<typeof PlantFormSchema>) {
    addPlant(data);
    router.replace("/myGarden");
  }

  return (
    <section className="flex flex-col gap-2 w-[50%] mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <p className="my-2">Form title: Add a new plant</p>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel>Plant Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of your plant
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <FormItem className="py-2">
                  <FormLabel>Plant Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PLANT_TYPES).map(([key, label]) => (
                          <SelectItem key={key} value={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Pick a type for the plant</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="size"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Plant Size</FormLabel>
                <FormControl>
                  <Input placeholder="size" {...field} />
                </FormControl>
                <FormDescription>How big is it</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="amount" {...field} />
                </FormControl>
                <FormDescription>How many plants</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dest"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Plant Destination</FormLabel>
                <FormControl>
                  <Input placeholder="destination" {...field} />
                </FormControl>
                <FormDescription>
                  Is it for outside use or for your room?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="price" {...field} />
                </FormControl>
                <FormDescription>How much did it cost</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dateAdded"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>Date Added</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="date added" {...field} />
                </FormControl>
                <FormDescription>
                  When did you add this plant to your collection?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="py-2">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}
