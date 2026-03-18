"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/src/data/workouts";

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(255),
});

export async function updateWorkoutAction(params: { workoutId: number; name: string }) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthenticated" };

  const parsed = UpdateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const workout = await updateWorkout(userId, parsed.data.workoutId, parsed.data.name);
  return { workout };
}
