export function inject(fallback?: () => any): any;

export enum InjectType {
  Context = 'Context',
  Application = 'Application',
}

export function Context(constructor: Function): any;
export function Application(constructor: Function): any;

export function getComponent(constructor: any, ctx: any, injectType?: InjectType): any;
