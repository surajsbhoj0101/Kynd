import type { SyntheticEvent } from 'react';

export const handleImgError = (
  e: SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
) => {
  e.currentTarget.src = fallbackSrc;
};
