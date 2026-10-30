// Tells TypeScript about the jest-axe matcher registered in setup.ts.
// @types/jest-axe only adds it to Jest's types, not Vitest's.
import "vitest";

declare module "vitest" {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    // Unused, but must match Vitest's own Matchers declaration to merge with it.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T = unknown,
  > {
    toHaveNoViolations(): R;
  }
}
