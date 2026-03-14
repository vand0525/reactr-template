import type {
  CSSProperties,
  ReactNode,
  ComponentPropsWithoutRef,
} from 'react';
import type { SpaceTokenType } from '../../types';

export type LayoutTag =
  | 'div'
  | 'span'
  | 'aside'
  | 'section'
  | 'article';

export type LayoutAlignment =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch'
  | 'baseline';

export type LayoutJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

export type StackDirection = 'row' | 'column';

export type StackBaseProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type StackOwnProps = {
  tag?: LayoutTag;
  direction?: StackDirection;
  spacing?: SpaceTokenType | string;
  alignment?: LayoutAlignment;
  justify?: LayoutJustify;
  wrap?: boolean;
};

export type StackProps = StackBaseProps &
  StackOwnProps &
  ComponentPropsWithoutRef<'div'>;
