import { Card } from "@/components/ui/card";
import FontConverter from "./components/FontConverter";

export default function Home() {
  return (
    <div className="container mx-auto py-8 font-[family-name:var(--font-geist-sans)] h-full flex items-center justify-center">
      <Card className="p-10 max-w-xl w-full mx-auto">
        <h1 className="text-3xl font-bold mb-6">Font Converter</h1>
        <FontConverter />
      </Card>
    </div>
  );
}
