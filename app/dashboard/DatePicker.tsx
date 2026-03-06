'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  selectedDate: string;
}

export default function DatePicker({ selectedDate }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const date = new Date(`${selectedDate}T00:00:00`);

  function handleSelect(selected: Date | undefined) {
    if (!selected) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', format(selected, 'yyyy-MM-dd'));
    router.push(`/dashboard?${params.toString()}`);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-48 justify-start gap-2 text-left font-normal">
          <CalendarIcon className="h-4 w-4" />
          {format(date, 'do MMM yyyy')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
