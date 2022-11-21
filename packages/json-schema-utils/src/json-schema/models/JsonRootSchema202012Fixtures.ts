import { JsonRootSchema202012Object } from './JsonSchema202012';

export class JsonRootSchema202012Fixtures {
  public static get any(): JsonRootSchema202012Object {
    return {
      $schema: 'http://json-schema.org/draft/2020-12/schema',
    };
  }

  public static get with$DefsOne(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      $defs: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withAdditionalProperties(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      additionalProperties: { $ref: 'other.json' },
    };
  }

  public static get withAllOfTwo(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      allOf: [{ maximum: 30 }, { minimum: 20 }],
    };
  }

  public static get withAnyOfTwo(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      anyOf: [{ maximum: 30 }, { minimum: 20 }],
    };
  }

  public static get withContains(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      contains: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withDependentSchemasOne(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      dependentSchemas: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withElse(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      else: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withIf(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      if: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withItems(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      items: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withNot(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      not: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withOneOfTwo(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      oneOf: [{ maximum: 20 }, { minimum: 30 }],
    };
  }

  public static get withPatternProperiesOne(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      patternProperties: {
        '^[a-z0-9]+$': {
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withPrefixItemsOne(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      prefixItems: [
        {
          enabledToggle: {
            default: null,
            description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
            title: 'Enabled',
            type: ['boolean', 'null'],
          },
        },
      ],
    };
  }

  public static get withProperiesOne(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      properties: {
        z39: {
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withProperyNames(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      propertyNames: { maxLength: 3 },
    };
  }

  public static get withThen(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      then: {
        enabledToggle: {
          default: null,
          description: `Whether the feature is enabled (true),
disabled (false), or under
automatic control (null)`,
          title: 'Enabled',
          type: ['boolean', 'null'],
        },
      },
    };
  }

  public static get withUnevaluatedItems(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      unevaluatedItems: { maxLength: 3 },
    };
  }

  public static get withUnevaluatedProperties(): JsonRootSchema202012Object {
    return {
      ...JsonRootSchema202012Fixtures.any,
      unevaluatedProperties: { maxLength: 3 },
    };
  }
}
