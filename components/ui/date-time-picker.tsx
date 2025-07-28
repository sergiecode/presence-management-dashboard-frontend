"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  userTimezone?: string;
}

export function DateTimePicker({
  date,
  onDateChange,
  className,
  placeholder = "Seleccionar fecha y hora",
  userTimezone = "America/Argentina/Buenos_Aires",
}: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date && !isNaN(date.getTime()) ? 
      date.toLocaleTimeString("es-ES", { 
        hour: "2-digit", 
        minute: "2-digit", 
        timeZone: userTimezone 
      }) : ""
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate && !isNaN(newDate.getTime()) && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      newDate.setHours(hours, minutes, 0, 0);
    }
    onDateChange(newDate);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (date && !isNaN(date.getTime()) && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      onDateChange(newDate);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date && !isNaN(date.getTime()) ? format(date, "PPP HH:mm", { locale: es }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            formatters={{
              formatMonthDropdown: (date) =>
                date.toLocaleString("es", { month: "long" }),
              formatCaption: (date) =>
                date.toLocaleString("es", { month: "long", year: "numeric" }),
              formatWeekdayName: (date) =>
                date.toLocaleString("es", { weekday: "short" }),
            }}
          />
          <div className="p-3 border-t">
            <Label htmlFor="time" className="text-sm font-medium">
              Hora
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-32"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 