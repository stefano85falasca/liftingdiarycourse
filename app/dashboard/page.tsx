import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import DatePicker from './DatePicker';

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

// Placeholder workout type — replace with real type once schema is wired up
interface Workout {
  id: string;
  name: string | null;
  startedAt: Date | null;
}

const PLACEHOLDER_WORKOUTS: Workout[] = [];

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { date } = await searchParams;
  const selectedDate = date ?? todayString();
  const displayDate = format(new Date(`${selectedDate}T00:00:00`), 'do MMM yyyy');

  const workouts: Workout[] = PLACEHOLDER_WORKOUTS;

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

        <h2 className="mb-4 text-lg font-medium text-zinc-800 dark:text-zinc-200">
          Workouts on {displayDate}
        </h2>

        {workouts.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No workouts logged for this date.
          </p>
        ) : (
          <ul className="space-y-3">
            {workouts.map((workout) => (
              <li key={workout.id}>
                <Card>
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
