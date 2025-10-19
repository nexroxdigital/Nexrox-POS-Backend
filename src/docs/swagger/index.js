/**
 *  OpenAPI Specification Exports
 * --------------------------------------------
 *  This file serves as the central export hub for
 *  all Swagger/OpenAPI components, paths, and tags for documentation.
 *
 *  Included:
 *    - Schemas: Data models used across the API
 *    - Paths:   Endpoint definitions per resource
 *    - Tags:    Grouping and categorization for docs
 */

export { schemas } from "./components/schemas.js";
export { userPaths } from "./paths/user.paths.js";
export { tags } from "./tags.js";

// Future exports
// export { productPaths } from "./paths/product.paths.js";
// export { orderPaths } from "./paths/order.paths.js";
