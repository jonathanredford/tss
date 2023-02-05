import { zodResolver as rawZodResolver } from "@hookform/resolvers/zod";
import { FieldValues, ResolverResult, Resolver } from "react-hook-form";
import { z } from "zod";

export const zodResolver = <T extends z.Schema<any, any>>(
    schema: T,
    schemaOptions?: Partial<z.ParseParams>,
    factoryOptions?: {
        mode?: "async" | "sync";
    }
) => {
    const rawResolver = rawZodResolver(schema, schemaOptions, { mode: "sync", ...factoryOptions });
    return process.env.NODE_ENV == "development" ? debugResolver(rawResolver) : rawResolver;
};

export const debugResolver = <TFieldValues extends FieldValues = FieldValues, TContext = any>(
    resolver: Resolver<TFieldValues, TContext>
): ((
    ...resolverArgs: Parameters<Resolver<TFieldValues, TContext>>
) => Promise<ResolverResult<TFieldValues>> | ResolverResult<TFieldValues>) => {
    return process.env.NODE_ENV == "development"
        ? async (...resolverArgs) => {
              const [_values, _context, options] = resolverArgs;

              const result = await resolver(...resolverArgs);

              // If names length is 1, assume we're just re-validating a single field in the form
              if (options.names?.length === 1) return result;

              const erroredKeys = getErrorKeys(result.errors).map(path => path.join("."));

              const erroredKeysNotRegisteredWithReactHookForms = erroredKeys.filter(
                  erroredKey => !options.names?.includes(erroredKey as any)
              );

              if (erroredKeysNotRegisteredWithReactHookForms.length > 0) {
                  // eslint-disable-next-line no-console
                  console.error(
                      `The following keys are expected by the Zod schema but are not registered with react-hook-form:\n\n` +
                          `${erroredKeysNotRegisteredWithReactHookForms.join(", ")}\n\n` +
                          `These keys are preventing the form from being submitted. Either remove them from the Zod schema, or add them to the form.`
                  );
              }

              return result;
          }
        : resolver;
};

const getErrorKeys = (obj: any, existingPath: string[] = []): string[][] => {
    if (typeof obj == "object" && "message" in obj && "type" in obj && "ref" in obj) {
        // Reached leaf react-hook-form error object - return existing path
        return [existingPath];
    } else if (typeof obj == "object") {
        return Object.keys(obj).flatMap(key => getErrorKeys(obj[key], [...existingPath, key]));
    } else if (Array.isArray(obj)) {
        return obj.flatMap((item, index) => getErrorKeys(item, [...existingPath, index.toString()]));
    } else {
        return [existingPath];
    }
};
