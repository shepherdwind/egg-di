export function inject(fallback?: () => any): any;

export enum InjectType {
  Context = 'Context',
  Application = 'Application',
  Property = 'Property',
}

export function Context(constructor: Function): any;
export function Application(constructor: Function): any;

export function getComponent(constructor: any, ctx: any, injectType?: InjectType): any;

export const INJECTED_TAG_CLASS: Symbol;
export const INJECTED_TAG_PROP: Symbol;
