import type { SpaceTokenType } from '../types';

export function resolveSpaceToken(space?: SpaceTokenType | string): string | undefined {
	if (space === undefined) return undefined;

	if (typeof space === 'number') {
		return `var(--space-${space})`;
	}

	return space;
}
