import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const spec = parse(await readFile(join(root, 'swigerapi.yaml'), 'utf8'));
const schemas = spec.components?.schemas ?? {};
const paths = spec.paths ?? {};

const routeNames = {
  'customers-favorites': 'customerFavorites',
  'customers-auth': 'customerAuth',
  'customers-orders': 'customerOrders',
  'public-news': 'publicNews',
  'public-products': 'publicProducts',
  'public-stores': 'publicStores',
  'stores-addresses': 'storeAddresses',
  'stores-categories': 'storeCategories',
  'stores-colors': 'storeColors',
  'stores-contacts': 'storeContacts',
  'stores-discounts': 'storeDiscounts',
  'stores-icons': 'storeIcons',
  'stores-auth': 'storeAuth',
  'stores-news': 'storeNews',
  'stores-orders': 'storeOrders',
  'stores-product-material-categories': 'storeProductMaterialCategories',
  'stores-product-materials': 'storeProductMaterials',
  'stores-product-photos': 'storeProductPhotos',
  'stores-product-variants': 'storeProductVariants',
  'stores-products': 'storeProducts',
  'stores-reports': 'storeReports',
  'stores-services': 'storeServices',
  'stores-social-links': 'storeSocialLinks',
  'stores-store': 'store',
  'stores-tags': 'storeTags',
};

const operationsByRoute = new Map();

for (const [path, pathItem] of Object.entries(paths)) {
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!['get', 'post', 'patch', 'put', 'delete'].includes(method)) continue;

    const route = operation.tags?.[0];
    if (!route) throw new Error(`Missing tag for ${method.toUpperCase()} ${path}`);

    if (!operationsByRoute.has(route)) operationsByRoute.set(route, []);
    operationsByRoute.get(route).push({ method, operation, path });
  }
}

function refName(schema) {
  return schema?.$ref?.split('/').pop();
}

function literal(value) {
  return value === null ? 'null' : JSON.stringify(value);
}

function withNullable(type, schema) {
  if (schema?.nullable && !type.split(' | ').includes('null')) return `${type} | null`;
  return type;
}

function schemaType(schema) {
  if (!schema) return 'unknown';
  if (schema.$ref) return refName(schema);

  if (schema.oneOf) {
    const types = [...new Set(schema.oneOf.map(schemaType))];
    return withNullable(types.join(' | ') || 'unknown', schema);
  }

  if (schema.anyOf) {
    const types = [...new Set(schema.anyOf.map(schemaType))];
    return withNullable(types.join(' | ') || 'unknown', schema);
  }

  if (schema.allOf) {
    return withNullable(schema.allOf.map(schemaType).join(' & ') || 'unknown', schema);
  }

  if (schema.enum) return withNullable(schema.enum.map(literal).join(' | ') || 'never', schema);

  if (schema.type === 'array') return withNullable(`Array<${schemaType(schema.items)}>`, schema);
  if (schema.type === 'object' || schema.properties) {
    if (!schema.properties) return 'Record<string, unknown>';

    const required = new Set(schema.required ?? []);
    const fields = Object.entries(schema.properties).map(([name, property]) => {
      const optional = required.has(name) ? '' : '?';
      return `  ${JSON.stringify(name)}${optional}: ${schemaType(property)};`;
    });

    return `{
${fields.join('\n')}
}`;
  }

  if (schema.type === 'integer' || schema.type === 'number') return withNullable('number', schema);
  if (schema.type === 'boolean') return withNullable('boolean', schema);
  if (schema.type === 'string') {
    if (schema.format === 'binary') return withNullable('File | Blob', schema);
    return withNullable('string', schema);
  }

  return 'unknown';
}

function generatedTypes() {
  const output = [
    '// Generated from swigerapi.yaml. Do not edit manually.',
    '',
  ];

  for (const [name, schema] of Object.entries(schemas)) {
    const value = schemaType(schema);
    if (value.startsWith('{\n')) {
      output.push(`export interface ${name} ${value}`);
    } else {
      output.push(`export type ${name} = ${value};`);
    }
  }

  return output.join('\n');
}

function pascal(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

function camel(value) {
  const result = pascal(value);
  return result ? result[0].toLowerCase() + result.slice(1) : result;
}

function requestSchema(operation) {
  const content = operation.requestBody?.content ?? {};
  return Object.values(content).map((entry) => entry.schema).find(Boolean);
}

function responseSchema(operation) {
  const responses = operation.responses ?? {};
  const response = responses['200'] ?? responses['201'] ?? Object.values(responses)[0];
  const content = response?.content ?? {};
  return Object.values(content).map((entry) => entry.schema).find(Boolean);
}

function operationInfo(entry) {
  const { operation } = entry;
  const id = operation.operationId;
  const prefix = pascal(id);
  const params = (operation.parameters ?? [])
    .filter((parameter) => parameter.in === 'path')
    .map((parameter) => ({
      apiName: parameter.name,
      name: camel(parameter.name),
      type: schemaType(parameter.schema),
    }));
  const body = requestSchema(operation);
  const response = responseSchema(operation);

  return {
    ...entry,
    id,
    prefix,
    functionName: camel(id),
    params,
    bodyName: body ? `${prefix}Body` : null,
    bodySchema: body,
    responseName: response ? `${prefix}Response` : null,
    responseSchema: response,
    bodyRequired: Boolean(operation.requestBody?.required),
  };
}

function typeFile(operations) {
  const schemasUsed = new Set();
  for (const operation of operations) {
    const body = refName(operation.bodySchema);
    const response = refName(operation.responseSchema);
    if (body) schemasUsed.add(body);
    if (response) schemasUsed.add(response);
  }

  const lines = [
    '// Generated from swigerapi.yaml. Do not edit manually.',
    '',
    schemasUsed.size
      ? `import type { ${[...schemasUsed].sort().join(', ')} } from '../../generated.types';`
      : '',
    `export type { ${[...schemasUsed].sort().join(', ')} } from '../../generated.types';`,
    '',
  ];

  for (const operation of operations) {
    if (operation.params.length) {
      lines.push(`export interface ${operation.prefix}Params {`);
      for (const param of operation.params) lines.push(`  ${param.name}: ${param.type};`);
      lines.push('}', '');
    }

    const body = operation.bodySchema
      ? refName(operation.bodySchema) ?? schemaType(operation.bodySchema)
      : null;
    if (body) lines.push(`export type ${operation.bodyName} = ${body};`, '');

    const response = operation.responseSchema
      ? refName(operation.responseSchema) ?? schemaType(operation.responseSchema)
      : null;
    if (response) lines.push(`export type ${operation.responseName} = ${response};`, '');
  }

  return lines.join('\n').trimEnd() + '\n';
}

function apiFile(operations) {
  const imports = new Set();
  for (const operation of operations) {
    if (operation.params.length) imports.add(`${operation.prefix}Params`);
    if (operation.bodyName) imports.add(operation.bodyName);
    if (operation.responseName) imports.add(operation.responseName);
  }

  const lines = [
    '// Generated from swigerapi.yaml. Do not edit manually.',
    '',
    "import { apiRequest, buildPath } from '../../client';",
    imports.size ? `import type { ${[...imports].sort().join(', ')} } from './ROUTE.types';` : '',
    '',
  ];

  for (const operation of operations) {
    const args = [];
    if (operation.params.length) args.push(`params: ${operation.prefix}Params`);
    if (operation.bodyName) args.push(`body${operation.bodyRequired ? '' : '?'}: ${operation.bodyName} | FormData`);

    const returnType = operation.responseName ? operation.responseName : 'void';
    lines.push(`export function ${operation.functionName}(${args.join(', ')}): Promise<${returnType}> {`);

    const pathParams = operation.params.length
      ? `{ ${operation.params.map((param) => `${param.apiName}: params.${param.name}`).join(', ')} }`
      : '{}';
    const pathExpression = `buildPath(${JSON.stringify(operation.path)}, ${pathParams})`;
    lines.push(`  return apiRequest<${returnType}>(${pathExpression}, {`);
    lines.push(`    method: '${operation.method.toUpperCase()}',`);
    if (operation.bodyName) lines.push('    body,');
    lines.push('  });', '}', '');
  }

  return lines.join('\n');
}

await mkdir(join(root, 'src/api/routes'), { recursive: true });
await writeFile(join(root, 'src/api/generated.types.ts'), generatedTypes(), 'utf8');

for (const [route, entries] of operationsByRoute) {
  const fileBase = routeNames[route];
  if (!fileBase) throw new Error(`No route mapping for ${route}`);

  const operations = entries.map(operationInfo);
  const directory = join(root, 'src/api/routes', route);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, `${fileBase}.types.ts`), typeFile(operations), 'utf8');
  await writeFile(
    join(directory, `${fileBase}.api.ts`),
    apiFile(operations).replaceAll('./ROUTE.types', `./${fileBase}.types`),
    'utf8',
  );
}

console.log(`Generated ${operationsByRoute.size} route groups from swigerapi.yaml.`);
