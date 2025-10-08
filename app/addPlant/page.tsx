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

export const FormSchema = z.object({
  name: z.string().min(3, { message: "too short" }),
  type: z.string().min(5, { message: "min 5 chars" }),
  size: z.string(),
  amount: z.string(),
  price: z.string(),
  dest: z.string().min(5, { message: "min 5 chars" }),
});
export type TPlant = z.infer<typeof FormSchema> & { id?: string };

export default function AddPlantForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: "",
      size: "",
      amount: "",
      price: "",
      dest: "",
    },
  });
  const { control } = form;
  const addPlant = usePlantStore((store) => store.addPlant);
  const router = useRouter();

  function onSubmit(data: z.output<typeof FormSchema>) {
    console.log("🚀 ~ onSubmit ~ data:", data);
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
              console.log("field", field);
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
          <Button type="submit" className="py-2">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}
