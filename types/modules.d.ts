declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const value: DocumentNode;
  export default value;
}
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}