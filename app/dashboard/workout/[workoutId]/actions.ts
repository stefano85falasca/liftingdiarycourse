"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/src/data/workouts";

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  startedAt: z.coerce.date().nullable().optional(),
  finishedAt: z.coerce.date().nullable().optional(),
});

export async function updateWorkoutAction(params: {
  workoutId: number;
  name: string;
  startedAt?: string | null;
  finishedAt?: string | null;
}) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthenticated" };

  const parsed = UpdateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const workout = await updateWorkout(userId, parsed.data.workoutId, {
    name: parsed.data.name,
    startedAt: parsed.data.startedAt,
    finishedAt: parsed.data.finishedAt,
  });
  return { workout };
}
