"use client";

import { useState } from "react";
import { useGenerateItinerary } from "@/hooks/useGenerateItinerary";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
    ItineraryDay,
  } from "@/lib/ai";

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerated: (itinerary: {
      days: ItineraryDay[];
    }) => void;
  }

export default function GenerateItineraryDialog({
  open,
  onOpenChange,
  onGenerated,
}: Props) {
  const { loading, generate } = useGenerateItinerary();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(50000);
  const [travelStyle, setTravelStyle] = useState("Luxury");

  const handleGenerate = async () => {
    const result = await generate({
      destination,
      days,
      budget,
      travel_style: travelStyle,
    });

    if (!result) return;

    onGenerated(result.itinerary);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>🤖 Generate AI Itinerary</DialogTitle>

          <DialogDescription>
            Let AI create a personalized travel itinerary.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label>Destination</Label>

            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Dubai"
            />
          </div>

          <div>
            <Label>Number of Days</Label>

            <Input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Budget (₹)</Label>

            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Travel Style</Label>

            <Select
            value={travelStyle}
            onValueChange={(value) => setTravelStyle(value ?? "Luxury")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Luxury">Luxury</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
                <SelectItem value="Solo">Solo</SelectItem>
                <SelectItem value="Romantic">Romantic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}