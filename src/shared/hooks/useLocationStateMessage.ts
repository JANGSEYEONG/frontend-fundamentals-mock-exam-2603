import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';

const locationStateMessageSchema = z.object({
  text: z.string(),
});
type LocationStateMessage = z.infer<typeof locationStateMessageSchema>;

export function createLocationStateMessage(message: LocationStateMessage) {
  return locationStateMessageSchema.parse(message);
}

export function useLocationStateMessage(): LocationStateMessage | null {
  const location = useLocation();
  const result = locationStateMessageSchema.safeParse(location.state);

  useEffect(() => {
    window.history.replaceState(null, '');
  }, []);

  if (!result.success) {
    return null;
  }

  return { text: result.data.text } as const;
}
