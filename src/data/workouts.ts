import { db } from "@/src/db";
import { workouts } from "@/src/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function createWorkout(userId: string, name: string) {
  const [workout] = await db
    .insert(workouts)
    .values({ clerkUserId: userId, name, startedAt: new Date() })
    .returning();
  return workout;
}

export async function getWorkoutById(userId: string, workoutId: number) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.clerkUserId, userId)));
  return workout ?? null;
}

export async function updateWorkout(userId: string, workoutId: number, name: string) {
  const [workout] = await db
    .update(workouts)
    .set({ name })
    .where(and(eq(workouts.id, workoutId), eq(workouts.clerkUserId, userId)))
    .returning();
  return workout;
}

export async function getWorkoutsForUserByDate(userId: string, date: string) {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T00:00:00`);
  end.setDate(end.getDate() + 1);

  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.clerkUserId, userId),
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end)
      )
    );
}
