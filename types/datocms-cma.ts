import { ItemTypeDefinition } from '@datocms/cma-client';
type EnvironmentSettings = {
  locales: 'sv' | 'en';
};
export type Post = ItemTypeDefinition<
  EnvironmentSettings,
  '520129',
  {
    title: {
      type: 'string';
      localized: true;
    };
    color: {
      type: 'link';
    };
    intro: {
      type: 'text';
      localized: true;
    };
    content: {
      type: 'structured_text';
      localized: true;
    };
    image: {
      type: 'file';
    };
    slug: {
      type: 'slug';
      localized: true;
    };
    author: {
      type: 'link';
    };
  }
>;
export type Page = ItemTypeDefinition<
  EnvironmentSettings,
  '876485',
  {
    title: {
      type: 'string';
    };
    intro: {
      type: 'text';
    };
  }
>;
export type User = ItemTypeDefinition<
  EnvironmentSettings,
  'BmmC_204Q2q80pakRIUNhA',
  {
    user_id: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
    email_verified: {
      type: 'date_time';
    };
    name: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    accounts: {
      type: 'links';
    };
    sessions: {
      type: 'links';
    };
    user_verification_tokens: {
      type: 'links';
    };
  }
>;
export type UserAccount = ItemTypeDefinition<
  EnvironmentSettings,
  'CANE8qJyT8OmtkreQWhLng',
  {
    account_id: {
      type: 'string';
    };
    user_id: {
      type: 'string';
    };
    account_type: {
      type: 'string';
    };
    provider: {
      type: 'string';
    };
    provider_account_id: {
      type: 'string';
    };
    refresh_token: {
      type: 'string';
    };
    access_token: {
      type: 'string';
    };
    expires_at: {
      type: 'integer';
    };
    token_type: {
      type: 'string';
    };
    scope: {
      type: 'string';
    };
    id_token: {
      type: 'string';
    };
    session_state: {
      type: 'string';
    };
  }
>;
export type Start = ItemTypeDefinition<
  EnvironmentSettings,
  'EDSrTw81QlK2PiluP8Fnsw',
  {
    headline: {
      type: 'string';
      localized: true;
    };
    intro: {
      type: 'text';
    };
    posts: {
      type: 'links';
    };
  }
>;
export type Author = ItemTypeDefinition<
  EnvironmentSettings,
  'OVWjZwVwQZmaCAyjO1P20w',
  {
    name: {
      type: 'string';
    };
  }
>;
export type Color = ItemTypeDefinition<
  EnvironmentSettings,
  'SvgIE1bUSaiQEmf-iBbczQ',
  {
    label: {
      type: 'string';
    };
    color: {
      type: 'color';
    };
  }
>;
export type UserVerificationToken = ItemTypeDefinition<
  EnvironmentSettings,
  'VDNPpHABRT6-EHrYrfQeQQ',
  {
    identifier: {
      type: 'string';
    };
    token: {
      type: 'string';
    };
    timestamp: {
      type: 'integer';
    };
  }
>;
export type UserSession = ItemTypeDefinition<
  EnvironmentSettings,
  'ddvS6N7lSsao3H2Rw9FJwQ',
  {
    user_id: {
      type: 'string';
    };
    session_id: {
      type: 'string';
    };
    session_token: {
      type: 'string';
    };
    timestamp: {
      type: 'integer';
    };
  }
>;
export type AnyBlock = Page;
export type AnyModel =
  | Post
  | User
  | UserAccount
  | Start
  | Author
  | Color
  | UserVerificationToken
  | UserSession;
export type AnyBlockOrModel = AnyBlock | AnyModel;
