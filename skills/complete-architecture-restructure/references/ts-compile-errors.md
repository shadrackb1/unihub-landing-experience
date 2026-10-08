# Common TypeScript/React Compile Errors and Fixes

## Encountered During Architecture Restructure

| Error Code | Description | Fix |
|------------|-------------|-----|
| `TS2307: Cannot find module` | A module import can't be resolved. | Create the missing directory and/or barrel export (`index.ts`). Verify the path alias `@/...` resolves correctly in `tsconfig.json` paths. |
| `TS2308: Module ... has already exported a member` | A barrel export (`export *`) contains a name already exported by another module in the same barrel. | In the barrel export, explicitly re-export to resolve ambiguity, or remove the duplicate from one module. Check `src/shared/ui/index.ts` for `Select`, `Slider`, `Tabs` duplicates with `./primitives`. |
| `TS2345: Type ... is not assignable to type ...` | A value's type isn't compatible with the expected type. | Narrow the type (add `| undefined` checks, use definite assignment assertions, or adjust the function signature). Example: `ready ||= ''` or `String(ready)` before passing to a `string` parameter. |
| `TS2694: Namespace has no exported member` (Radix UI) | A Radix UI namespace doesn't have the expected member. | Check the `@radix-ui/react-*` version compatibility. May need to update imports or use the correct export name. Example: Radix v1+ moved some exports. |
| `context.boundary ? ... : undefined` | Using `context.boundary ? ... : undefined` when `boundary` could be `undefined` from an index signature. | Use `context.boundary !== undefined ? ... : undefined` to explicitly check for `undefined` rather than truthiness. |
| `Property 'className' does not exist on type 'IntrinsicAttributes'` | A component's props type doesn't include `className` expected by JSX. | Ensure the component's props type is correct. Add `className` to `IntrinsicAttributes` if extending a native element, or adjust the component signature. |
| `Argument of type 'string | undefined' is not assignable to parameter of type 'string'` | A value of type `string | undefined` is being passed where `string` is expected. | Add a guard `ready ||= ''` or use `?? ''` / `String(ready)` before passing to the expected type. |
| `TS2307: Cannot find module './types'` (domain/index.ts) | The domain barrel references submodules that don't exist yet. | Create the missing directories (`src/domain/types/`, `src/domain/schemas/`, etc.) and their barrel exports (`index.ts`). |
| `TS2322: Type '{ className: string; }' is not assignable to type 'IntrinsicAttributes'` | JSX intrinsic element type mismatch. | Ensure the component's props interface is compatible with `IntrinsicAttributes`, or wrap in a custom component that accepts the props. |
| `TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'` | Similar to above — a possibly-undefined string reaching a strict `string` parameter. | Add null-conditional/chaining or default-before-usage: `ready ?? ''` or `String(ready)`. |
| `TS4111: Property 'boundary' comes from an index signature` | Accessing a property that comes from an index signature using dot notation in a ternary. | Use bracket notation with undefined check: `context.boundary !== undefined ? { boundary: String(context.boundary) } : undefined`. |
| `TS2694 / TS2322: Radix UI namespace errors` | ForwardedRef type mismatches, missing RootProps/ContentProps. | Check Radix version compatibility. Update imports. Some v1 Radix components export differently than v0. |
| `TS2658: Type 'xxx' is not valid as a jsx element` | A type can't be used as a JSX element. | Verify the type is a React component/function or check the import. Often means a variable/const is being used directly as `<Component />` without being imported or defined. |

## Fixes Applied in This Session

1. **`lovable-error-reporting.ts`**: Changed `context.boundary ? { ... } : undefined` to `context.boundary !== undefined ? { ... } : undefined` to satisfy TS index-signature check.

2. **Domain layer**: Created `src/domain/types/`, `src/domain/schemas/`, `src/domain/constants/`, `src/domain/utils/` directories with `index.ts` barrel files to resolve `TS2307: Cannot find module` errors.

3. **Shared barrels**: Fixed duplicate exports in `src/shared/ui/index.ts` (`Select`, `Slider`, `Tabs` already exported by `./primitives`).

4. **Type narrowing**: Added `| undefined` guards and explicit type conversions throughout the codebase to resolve `TS2345` and `TS2694` errors.

5. **Radix UI compatibility**: Verified `@radix-ui/react-*` version compatibility and updated imports where namespace members changed.