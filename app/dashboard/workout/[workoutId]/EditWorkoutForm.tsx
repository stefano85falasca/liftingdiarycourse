"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkoutAction } from "./actions";

interface Workout {
  id: number;
  name: string | null;
}

interface Props {
  workout: Workout;
}

export default function EditWorkoutForm({ workout }: Props) {
  const router = useRouter();
  const [name, setName] = useState(workout.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const result = await updateWorkoutAction({ workoutId: workout.id, name });
    if (result?.error) {
      setError(
        typeof result.error === "string"
          ? result.error
          : (result.error.name?.[0] ?? "Invalid input")
      );
      setPending(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Card>
      <CardContent className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workout Name</Label>
            <Input
              id="name"
              placeholder="e.g. Morning Push Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
