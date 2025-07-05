/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Auth_CreateProfile($userName: String!) {\n    createProfile(userName: $userName) {\n      userName\n    }\n  }\n": typeof types.Auth_CreateProfileDocument,
    "\n  mutation Auth_UpdateUserName($userName: String!) {\n    updateProfile(userName: $userName) {\n      userName\n    }\n  }\n": typeof types.Auth_UpdateUserNameDocument,
    "\n  mutation Auth_DeleteAccount {\n    deleteProfile\n  }\n": typeof types.Auth_DeleteAccountDocument,
    "\n  query Auth_GetHealthCheck {\n    healthCheck\n  }\n": typeof types.Auth_GetHealthCheckDocument,
    "\n  query Auth_GetUserExists($userName: String!) {\n    userExists(userName: $userName)\n  }\n": typeof types.Auth_GetUserExistsDocument,
    "\n  query Auth_GetProfile {\n    profile {\n      userName\n    }\n  }\n": typeof types.Auth_GetProfileDocument,
};
const documents: Documents = {
    "\n  mutation Auth_CreateProfile($userName: String!) {\n    createProfile(userName: $userName) {\n      userName\n    }\n  }\n": types.Auth_CreateProfileDocument,
    "\n  mutation Auth_UpdateUserName($userName: String!) {\n    updateProfile(userName: $userName) {\n      userName\n    }\n  }\n": types.Auth_UpdateUserNameDocument,
    "\n  mutation Auth_DeleteAccount {\n    deleteProfile\n  }\n": types.Auth_DeleteAccountDocument,
    "\n  query Auth_GetHealthCheck {\n    healthCheck\n  }\n": types.Auth_GetHealthCheckDocument,
    "\n  query Auth_GetUserExists($userName: String!) {\n    userExists(userName: $userName)\n  }\n": types.Auth_GetUserExistsDocument,
    "\n  query Auth_GetProfile {\n    profile {\n      userName\n    }\n  }\n": types.Auth_GetProfileDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Auth_CreateProfile($userName: String!) {\n    createProfile(userName: $userName) {\n      userName\n    }\n  }\n"): (typeof documents)["\n  mutation Auth_CreateProfile($userName: String!) {\n    createProfile(userName: $userName) {\n      userName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Auth_UpdateUserName($userName: String!) {\n    updateProfile(userName: $userName) {\n      userName\n    }\n  }\n"): (typeof documents)["\n  mutation Auth_UpdateUserName($userName: String!) {\n    updateProfile(userName: $userName) {\n      userName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Auth_DeleteAccount {\n    deleteProfile\n  }\n"): (typeof documents)["\n  mutation Auth_DeleteAccount {\n    deleteProfile\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Auth_GetHealthCheck {\n    healthCheck\n  }\n"): (typeof documents)["\n  query Auth_GetHealthCheck {\n    healthCheck\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Auth_GetUserExists($userName: String!) {\n    userExists(userName: $userName)\n  }\n"): (typeof documents)["\n  query Auth_GetUserExists($userName: String!) {\n    userExists(userName: $userName)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Auth_GetProfile {\n    profile {\n      userName\n    }\n  }\n"): (typeof documents)["\n  query Auth_GetProfile {\n    profile {\n      userName\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;