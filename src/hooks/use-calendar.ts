import { useState, useMemo, useCallback, useEffect } from 'react';

export interface CalendarDay {
  id: string;
  dayNum: string;
  dayName: string;
  isToday: boolean;
  dateKey: string;
  day: number;
}

export const useCalendar = () => {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(formatDate(new Date()));

  const monthDays = useMemo(() => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= numDays; i++) {
      const date = new Date(year, month, i);
      const dateKey = formatDate(date);

      days.push({
        id: dateKey,
        dayNum: i.toString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: formatDate(new Date()) === dateKey,
        dateKey: dateKey,
        day: i
      });
    }
    return days;
  }, [currentDate]);

  useEffect(() => {
    const exists = monthDays.some(d => d.dateKey === selectedDateKey);
    if (!exists && monthDays.length > 0) {
      setSelectedDateKey(monthDays[0].dateKey);
    }
  }, [monthDays]);

  const changeMonth = useCallback((offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }, []);

  const changeYear = useCallback((offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear() + offset, prev.getMonth(), 1));
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateKey(formatDate(today));
  }, []);

  const setMonth = useCallback((monthIndex: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), monthIndex, 1));
  }, []);

  return {
    currentDate,
    selectedDateKey,
    setSelectedDateKey,
    monthDays,
    changeMonth,
    changeYear,
    setMonth,
    goToToday,
    formatDate,
    monthYearLabel: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };
};
