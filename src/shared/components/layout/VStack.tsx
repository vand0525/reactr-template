import type { StackProps } from './types';
import { Stack } from './Stack';

type VStackProps = Omit<StackProps, 'direction'>;

export function VStack(props: VStackProps) {
  return <Stack {...props} direction="column" />;
}