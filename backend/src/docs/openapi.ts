/** Hand-written OpenAPI 3 document, served as Swagger UI at /docs. */
const errorResponse = { description: 'Error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } };

export const openApiDocument = {
  openapi: '3.0.3',
  info: { title: 'Appscrip PLP API', version: '1.0.0', description: 'Products, categories, filters, sorting, search and pagination.' },
  paths: {
    '/products': {
      get: {
        summary: 'List products (paginated, filterable, sortable, searchable)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50, default: 12 } },
          { name: 'category', in: 'query', description: 'Comma separated category slugs', schema: { type: 'string', example: 'jewelery,electronics' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number', minimum: 0 } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number', minimum: 0 } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['recommended', 'newest', 'popular', 'price_asc', 'price_desc'], default: 'recommended' } },
          { name: 'q', in: 'query', description: 'Search in title and description', schema: { type: 'string' } },
          { name: 'inStock', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'Page of products', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductList' } } } },
          400: errorResponse,
        },
      },
    },
    '/products/{id}': {
      get: {
        summary: 'Get one product',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Product' }, 400: errorResponse, 404: errorResponse },
      },
    },
    '/products/slug/{slug}': {
      get: {
        summary: 'Get one product by SEO-friendly slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }],
        responses: { 200: { description: 'Product' }, 400: errorResponse, 404: errorResponse },
      },
    },
    '/categories': { get: { summary: 'List categories with product counts', responses: { 200: { description: 'Categories' } } } },
    '/health': { get: { summary: 'Liveness check', responses: { 200: { description: 'OK' } } } },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'object', properties: { statusCode: { type: 'integer' }, code: { type: 'string' }, message: { type: 'string' }, details: {} } } },
      },
      ProductList: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { type: 'object' } },
          meta: { type: 'object', properties: { page: { type: 'integer' }, limit: { type: 'integer' }, total: { type: 'integer' }, totalPages: { type: 'integer' } } },
        },
      },
    },
  },
};
