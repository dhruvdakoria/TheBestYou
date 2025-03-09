"use client";

import { useRouter } from "next/navigation";

interface DatePickerProps {
  defaultValue?: string;
  onDateChange?: (date: string) => void;
  searchParams?: Record<string, string>;
}

export default function DatePicker({
  defaultValue,
  searchParams = {},
}: DatePickerProps) {
  const router = useRouter();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set("date", dateStr);

    // Preserve other search params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "date" && value) {
        url.searchParams.set(key, value);
      }
    });

    window.location.href = url.toString();
  };

  return (
    <input
      type="date"
      defaultValue={defaultValue || new Date().toISOString().split("T")[0]}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      onChange={handleDateChange}
    />
  );
}
