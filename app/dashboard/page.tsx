import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DatePicker from './DatePicker';
import { getWorkoutsForUserByDate } from '@/src/data/workouts';

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const { date } = await searchParams;
  const selectedDate = date ?? todayString();
  const displayDate = format(new Date(`${selectedDate}T00:00:00`), 'do MMM yyyy');

  const workouts = await getWorkoutsForUserByDate(userId, selectedDate);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>

        <div className="mb-8 flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Date</span>
          <DatePicker selectedDate={selectedDate} />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
            Workouts on {displayDate}
          </h2>
          <Button asChild>
            <Link href="/dashboard/workout/new">Log new workout</Link>
          </Button>
        </div>

        {workouts.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No workouts logged for this date.
          </p>
        ) : (
          <ul className="space-y-3">
            {workouts.map((workout) => (
              <li key={workout.id}>
                <Link href={`/dashboard/workout/${workout.id}`}>
                  <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                    <CardContent className="px-5 py-4">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {workout.name ?? 'Untitled Workout'}
                      </p>
                      {workout.startedAt && (
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Started at{' '}
                          {format(workout.startedAt, 'HH:mm')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
