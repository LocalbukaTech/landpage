'use client';

import {useToastContext} from '@/components/ui/toast';

export function useToast() {
  const {show} = useToastContext();

  return {
    toast: show,
  };
}
