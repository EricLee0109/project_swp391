import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircleIcon } from "lucide-react";
import { useState } from "react";

export interface MenstrualCycleSetupProps {
  onClose: () => void;
}

export default function App({ onClose }: MenstrualCycleSetupProps) {
  const [selectionType, setSelectionType] = useState("automatic");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const settings = {
      type: selectionType,
      ...(selectionType === "manual" && { cycleLength, periodLength }),
    };
    console.log("Saving settings:", settings);
    setIsSaved(true);

    // Close the modal after a short delay to show the success message
    setTimeout(() => {
      setIsSaved(false);
      onClose(); // Call the onClose function passed via props
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4">
      {/* This is the modal overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-bg">
        <Card className="animate-modal-content bg-white-100">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold">
              Menstrual Cycle Setup
            </CardTitle>
            <CardDescription>
              Choose how you would like us to track your cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectionType}
              onValueChange={setSelectionType}
              className="space-y-4"
            >
              <div
                onClick={() => setSelectionType("automatic")}
                className={`flex items-start space-x-4 rounded-lg border p-4 transition-all cursor-pointer ${
                  selectionType === "automatic"
                    ? "border-gray-900 dark:border-gray-50 bg-gray-50 dark:bg-gray-900"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <RadioGroupItem value="automatic" id="automatic" />
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="automatic"
                    className="font-semibold cursor-pointer"
                  >
                    Automatic Tracking
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Predict your cycle based on standard averages.
                  </p>
                </div>
              </div>
              <div
                onClick={() => setSelectionType("manual")}
                className={`flex items-start space-x-4 rounded-lg border p-4 transition-all cursor-pointer ${
                  selectionType === "manual"
                    ? "border-gray-900 dark:border-gray-50 bg-gray-50 dark:bg-gray-900"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <RadioGroupItem value="manual" id="manual" />
                <div className="grid gap-1.5">
                  <Label
                    htmlFor="manual"
                    className="font-semibold cursor-pointer"
                  >
                    Manual Setup
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tell us your typical cycle and period length.
                  </p>
                </div>
              </div>
            </RadioGroup>

            {selectionType === "manual" && (
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-900/50 p-4 animate-fadeIn">
                <div className="grid gap-2">
                  <Label htmlFor="cycle-length">
                    Average Cycle Length (days)
                  </Label>
                  <Input
                    id="cycle-length"
                    type="number"
                    value={cycleLength}
                    onChange={(e) =>
                      setCycleLength(parseInt(e.target.value, 10) || 0)
                    }
                    placeholder="e.g., 28"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="period-length">
                    Average Period Length (days)
                  </Label>
                  <Input
                    id="period-length"
                    type="number"
                    value={periodLength}
                    onChange={(e) =>
                      setPeriodLength(parseInt(e.target.value, 10) || 0)
                    }
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="w-full">
              Save Preferences
            </Button>
          </CardFooter>
        </Card>

        {isSaved && (
          <div className="animate-success fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>
    </div>
  );
}
