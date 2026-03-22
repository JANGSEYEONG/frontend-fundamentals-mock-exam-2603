import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';

export const locationMessageSchema = z.object({
  message: z.string(),
});
export function createLocationMessageState(data: z.infer<typeof locationMessageSchema>) {
  return locationMessageSchema.parse(data);
}

export function useLocationMessage() {
  const location = useLocation();

  const [message] = useState<string | null>(() => {
    const result = locationMessageSchema.safeParse(location.state);
    if (!result.success) return null;

    window.history.replaceState({}, '');
    return result.data.message;
  });

  return { message } as const;
}
