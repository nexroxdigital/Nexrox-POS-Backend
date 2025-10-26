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
export { tags } from "./tags.js";

export { activityLog } from "./paths/activityLog.path.js";
export { userPaths } from "./paths/user.paths.js";
export { suppliersPaths } from "./paths/supplier.path.js";
export { categoryPaths } from "./paths/category.path.js";
export { customerPaths } from "./paths/customer.path.js";
export { accountPaths } from "./paths/account.path.js";
