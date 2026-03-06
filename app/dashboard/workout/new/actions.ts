"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/src/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
});

export async function createWorkoutAction(params: { name: string }) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthenticated" };

  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const workout = await createWorkout(userId, parsed.data.name);
  return { workout };
}
