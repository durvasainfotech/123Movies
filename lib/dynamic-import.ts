import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

export function dynamicImport<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  options: {
    ssr?: boolean;
    loading?: () => JSX.Element | null;
  } = { ssr: false }
) {
  return dynamic<T>(() => loader().then((mod) => mod.default), options);
}
