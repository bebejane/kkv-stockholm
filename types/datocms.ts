import type { ItemTypeDefinition } from '@datocms/cma-client';
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
    image: {
      type: 'file';
    };
    intro: {
      type: 'structured_text';
    };
    text_about: {
      type: 'structured_text';
    };
    text_target_group: {
      type: 'structured_text';
    };
    text_goal: {
      type: 'structured_text';
    };
    included: {
      type: 'string';
    };
    workshop: {
      type: 'link';
    };
    member: {
      type: 'link';
    };
    about_organizer: {
      type: 'structured_text';
    };
    organizer_link: {
      type: 'string';
    };
    start: {
      type: 'date_time';
    };
    end: {
      type: 'date_time';
    };
    amount: {
      type: 'integer';
    };
    price: {
      type: 'integer';
    };
    language: {
      type: 'string';
    };
    slug: {
      type: 'slug';
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
    equipment_price: {
      type: 'string';
    };
    image: {
      type: 'file';
    };
    gallery: {
      type: 'gallery';
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
export type Report = ItemTypeDefinition<
  EnvironmentSettings,
  'MirWU35CQ66mLEinO1GHkQ',
  {
    member: {
      type: 'link';
    };
    booking: {
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
    extra_cost: {
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
    reported: {
      type: 'boolean';
    };
    report: {
      type: 'link';
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
export type Email = ItemTypeDefinition<
  EnvironmentSettings,
  'ajcA28GlRmSqrhG7VdFYdg',
  {
    subject: {
      type: 'string';
    };
    text: {
      type: 'text';
    };
    button: {
      type: 'string';
    };
    action: {
      type: 'string';
    };
  }
>;
export type Member = ItemTypeDefinition<
  EnvironmentSettings,
  'b44GORd_TmaheYg4z180PA',
  {
    workshops: {
      type: 'links';
    };
    user: {
      type: 'string';
    };
    first_name: {
      type: 'string';
    };
    phone: {
      type: 'string';
    };
    verification_token: {
      type: 'string';
    };
    compartment: {
      type: 'string';
    };
    last_name: {
      type: 'string';
    };
    phone_home: {
      type: 'string';
    };
    card_number: {
      type: 'string';
    };
    email: {
      type: 'string';
    };
    sex: {
      type: 'string';
    };
    notes: {
      type: 'string';
    };
    member_status: {
      type: 'string';
    };
    address: {
      type: 'string';
    };
    postal_code: {
      type: 'string';
    };
    yearly_fee: {
      type: 'string';
    };
    contract: {
      type: 'file';
    };
    city: {
      type: 'string';
    };
    ssa: {
      type: 'string';
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
export type AnyBlock = Supporter | Image | GalleryImage | Assistant;
export type AnyModel =
  | Course
  | Equipment
  | Workshop
  | Contact
  | Report
  | SignUpStart
  | About
  | Start
  | Footer
  | Booking
  | InEnglish
  | Email
  | Member
  | WorkshopsStart;
export type AnyBlockOrModel = AnyBlock | AnyModel;
