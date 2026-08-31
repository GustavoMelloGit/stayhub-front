import { useMutation } from '@tanstack/react-query';
import { WaitlistService } from './WaitlistService';
import type { WaitlistPayload } from './waitlist.schema';

/**
 * Inscrição na lista de espera. Não usa `queryClient` porque a landing é
 * anônima e não mantém nenhum estado de servidor em cache.
 */
export const useJoinWaitlist = () => {
  const {
    mutate: joinWaitlist,
    isPending: isJoining,
    isSuccess: hasJoined,
    error: joinError,
    data: waitlistEntry,
    reset: resetWaitlist,
  } = useMutation({
    mutationFn: (payload: WaitlistPayload) => WaitlistService.join(payload),
  });

  return {
    joinWaitlist,
    isJoining,
    hasJoined,
    joinError,
    waitlistEntry,
    resetWaitlist,
  };
};
