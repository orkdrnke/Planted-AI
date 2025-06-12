import { Button } from "@/components/ui/button";

export default function myGarden() {
  return (
    <div className="flex flex-col p-4 text-3xl">
      <h1 className="text-4xl text-center font-[family-name:var(--font-geist-mono)]">
        My Garden
      </h1>
      <div>
        <p className="text-lg font-[family-name:var(--font-geist-mono)]">
          Plants in my garden
        </p>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">Cucumbers</li>
          <li className="mb-2 tracking-[-.01em]">Tulips</li>
          <li className="mb-2 tracking-[-.01em]">Oleandr</li>
          <li className="mb-2 tracking-[-.01em]">Rubber Tree</li>
          <li className="mb-2 tracking-[-.01em]">Palm tree</li>
        </ol>
      </div>
      <div>
        <Button variant="default" size="lg" className="cursor-pointer">
          Add a Plant
        </Button>
      </div>
      <div>
        <Button variant="ghost" size="lg" className="cursor-pointer">
          Show Grouped
        </Button>
      </div>
    </div>
  );
}
