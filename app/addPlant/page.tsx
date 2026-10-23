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
import { PLANT_TYPES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { PlantFormSchema } from "@/schemas/plantFormSchema";
import { uiStrings } from "@/lib/uiStrings";

const text = uiStrings.addPlantForm;

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
          <p className="my-2">{text.title}</p>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="my-2">
                <FormLabel>{text.name.label}</FormLabel>
                <FormControl>
                  <Input placeholder={text.name.placeholder} {...field} />
                </FormControl>
                <FormDescription>{text.name.description}</FormDescription>
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
                  <FormLabel>{text.type.label}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={text.type.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* The stored value stays the English type; only the label is translated */}
                        {Object.entries(PLANT_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {uiStrings.plantTypeLabel(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>{text.type.description}</FormDescription>
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
                <FormLabel>{text.size.label}</FormLabel>
                <FormControl>
                  <Input placeholder={text.size.placeholder} {...field} />
                </FormControl>
                <FormDescription>{text.size.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>{text.amount.label}</FormLabel>
                <FormControl>
                  <Input placeholder={text.amount.placeholder} {...field} />
                </FormControl>
                <FormDescription>{text.amount.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dest"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>{text.dest.label}</FormLabel>
                <FormControl>
                  <Input placeholder={text.dest.placeholder} {...field} />
                </FormControl>
                <FormDescription>{text.dest.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>{text.price.label}</FormLabel>
                <FormControl>
                  <Input placeholder={text.price.placeholder} {...field} />
                </FormControl>
                <FormDescription>{text.price.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dateAdded"
            render={({ field }) => (
              <FormItem className="py-2">
                <FormLabel>{text.dateAdded.label}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder={text.dateAdded.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{text.dateAdded.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="py-2">
            {text.submit}
          </Button>
        </form>
      </Form>
    </section>
  );
}
