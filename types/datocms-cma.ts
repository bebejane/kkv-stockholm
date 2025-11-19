import { ItemTypeDefinition } from '@datocms/cma-client';
type EnvironmentSettings = {
  locales: 'sv';
};
export type Course = ItemTypeDefinition<
  EnvironmentSettings,
  'ASbSwj8CRruZl6DOMPtOUQ',
  {
    title: {
      type: 'string';
    };
    intro: {
      type: 'structured_text';
    };
    image: {
      type: 'file';
    };
    workshop: {
      type: 'link';
    };
    organizer: {
      type: 'link';
    };
    start: {
      type: 'date_time';
    };
    end: {
      type: 'date_time';
    };
    price: {
      type: 'integer';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type AuthVerification = ItemTypeDefinition<
  EnvironmentSettings,
  'DIcw-ZFlRW60vbsybu9oNw',
  {
    identifier: {
      type: 'string';
    };
    value: {
      type: 'string';
    };
  }
>;
export type Equipment = ItemTypeDefinition<
  EnvironmentSettings,
  'FpH160VGTFqR7MWYxW06cA',
  {
    title: {
      type: 'string';
    };
    title_short: {
      type: 'string';
    };
    summary: {
      type: 'structured_text';
    };
    image: {
      type: 'file';
    };
    manual: {
      type: 'file';
    };
    bookable: {
      type: 'boolean';
    };
    exclusive: {
      type: 'boolean';
    };
    price: {
      type: 'string';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type Workshop = ItemTypeDefinition<
  EnvironmentSettings,
  'K3VpJtpxR6K3f79zk_TbFg',
  {
    price_hour: {
      type: 'integer';
    };
    price_day: {
      type: 'integer';
    };
    title: {
      type: 'string';
    };
    price_week: {
      type: 'integer';
    };
    title_long: {
      type: 'string';
    };
    intro: {
      type: 'structured_text';
    };
    price_month: {
      type: 'integer';
    };
    image: {
      type: 'file';
    };
    text: {
      type: 'structured_text';
    };
    email: {
      type: 'string';
    };
    equipment: {
      type: 'links';
    };
    slug: {
      type: 'slug';
    };
  }
>;
export type Contact = ItemTypeDefinition<
  EnvironmentSettings,
  'LlLkPilFR36XpzFbqD1VJg',
  {
    title: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
    };
  }
>;
export type AuthAccount = ItemTypeDefinition<
  EnvironmentSettings,
  'LqbxkQXlSEORmFBBW3KkTw',
  {
    account_id: {
      type: 'string';
    };
    provider_id: {
      type: 'string';
    };
    user_id: {
      type: 'link';
    };
    access_token: {
      type: 'string';
    };
    refresh_token: {
      type: 'string';
    };
    id_token: {
      type: 'string';
    };
    access_token_expires_at: {
      type: 'date_time';
    };
    refresh_token_expires_at: {
      type: 'date_time';
    };
    scope: {
      type: 'string';
    };
    password: {
      type: 'string';
    };
  }
>;
export type Report = ItemTypeDefinition<
  EnvironmentSettings,
  'MirWU35CQ66mLEinO1GHkQ',
  {
    member: {
      type: 'link';
    };
    workshop: {
      type: 'link';
    };
    hours: {
      type: 'integer';
    };
    days: {
      type: 'integer';
    };
    date: {
      type: 'date';
    };
    assistants: {
      type: 'rich_text';
      blocks: Assistant;
    };
  }
>;
export type SignUpStart = ItemTypeDefinition<
  EnvironmentSettings,
  'NiRKMBpMRq2d6B6ieXcs2A',
  {
    title: {
      type: 'string';
    };
    intro: {
      type: 'structured_text';
    };
  }
>;
export type About = ItemTypeDefinition<
  EnvironmentSettings,
  'Oz_HmLFSTZeh9Ag0cmfgqQ',
  {
    title: {
      type: 'string';
    };
    headline: {
      type: 'string';
    };
    intro: {
      type: 'structured_text';
    };
    content: {
      type: 'structured_text';
      blocks: Image;
    };
    slug: {
      type: 'slug';
    };
    position: {
      type: 'integer';
    };
  }
>;
export type Supporter = ItemTypeDefinition<
  EnvironmentSettings,
  'P5xKxcefQWWL79oGa_UXgQ',
  {
    name: {
      type: 'string';
    };
    logo: {
      type: 'file';
    };
  }
>;
export type Start = ItemTypeDefinition<
  EnvironmentSettings,
  'SGmMMvV6S8Cc7ZtuJqFfbQ',
  {
    title: {
      type: 'string';
    };
    gallery: {
      type: 'rich_text';
      blocks: GalleryImage;
    };
    about_us: {
      type: 'structured_text';
    };
  }
>;
export type Footer = ItemTypeDefinition<
  EnvironmentSettings,
  'VQRzC_B0QZGxkiW1Nltd0w',
  {
    support: {
      type: 'rich_text';
      blocks: Supporter;
    };
    instagram: {
      type: 'string';
    };
    facebook: {
      type: 'string';
    };
  }
>;
export type Image = ItemTypeDefinition<
  EnvironmentSettings,
  'WeXFBEHERyypj_xEzjTSmQ',
  {
    image: {
      type: 'file';
    };
  }
>;
export type GalleryImage = ItemTypeDefinition<
  EnvironmentSettings,
  'Wp-vRp5RQuKIaOyo6x7hkQ',
  {
    image: {
      type: 'file';
    };
    caption: {
      type: 'structured_text';
    };
  }
>;
export type Booking = ItemTypeDefinition<
  EnvironmentSettings,
  'XG9gW6DGQUqpkNCEZ0MXxg',
  {
    member: {
      type: 'link';
    };
    workshop: {
      type: 'link';
    };
    equipment: {
      type: 'links';
    };
    start: {
      type: 'date_time';
    };
    end: {
      type: 'date_time';
    };
    note: {
      type: 'string';
    };
    report: {
      type: 'link';
    };
    reported: {
      type: 'boolean';
    };
  }
>;
export type InEnglish = ItemTypeDefinition<
  EnvironmentSettings,
  'ZGnF4VhqQ06CedGGE-VILg',
  {
    title: {
      type: 'string';
    };
    content: {
      type: 'structured_text';
    };
  }
>;
export type AuthSession = ItemTypeDefinition<
  EnvironmentSettings,
  'arXh4_xuQiygmKA_LRNmSQ',
  {
    expires_at: {
      type: 'date_time';
    };
    token: {
      type: 'string';
    };
    user_agent: {
      type: 'string';
    };
    ip_address: {
      type: 'string';
    };
    user_id: {
      type: 'link';
    };
  }
>;
export type Member = ItemTypeDefinition<
  EnvironmentSettings,
  'b44GORd_TmaheYg4z180PA',
  {
    first_name: {
      type: 'string';
    };
    last_name: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
    member_status: {
      type: 'string';
    };
    phone: {
      type: 'string';
    };
    phone_home: {
      type: 'string';
    };
    sex: {
      type: 'string';
    };
    address: {
      type: 'string';
    };
    postal_code: {
      type: 'string';
    };
    city: {
      type: 'string';
    };
    ssa: {
      type: 'string';
    };
    card: {
      type: 'string';
    };
    compartment: {
      type: 'string';
    };
    notes: {
      type: 'string';
    };
    departments: {
      type: 'string';
    };
    user: {
      type: 'link';
    };
  }
>;
export type WorkshopsStart = ItemTypeDefinition<
  EnvironmentSettings,
  'cO9hgT6UTPG8pM6O9ri-wg',
  {
    title: {
      type: 'string';
    };
    intro: {
      type: 'structured_text';
    };
  }
>;
export type Assistant = ItemTypeDefinition<
  EnvironmentSettings,
  'dAIuHPSuQB21jiDO4HfTsg',
  {
    hours: {
      type: 'integer';
    };
    days: {
      type: 'integer';
    };
  }
>;
export type AuthUser = ItemTypeDefinition<
  EnvironmentSettings,
  'exSis6UYSr29ffkiuEm4Zw',
  {
    name: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
    email_verified: {
      type: 'boolean';
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
export type AnyBlock = Supporter | Image | GalleryImage | Assistant;
export type AnyModel =
  | Course
  | AuthVerification
  | Equipment
  | Workshop
  | Contact
  | AuthAccount
  | Report
  | SignUpStart
  | About
  | Start
  | Footer
  | Booking
  | InEnglish
  | AuthSession
  | Member
  | WorkshopsStart
  | AuthUser;
export type AnyBlockOrModel = AnyBlock | AnyModel;
