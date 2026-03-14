import type { StackProps } from './types';
import { Stack } from './Stack';

type HStackProps = Omit<StackProps, 'direction'>;

export function HStack(props: HStackProps) {
	return <Stack {...props} direction="row" />;
}
