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
    short_course: {
      type: 'boolean';
    };
    intro: {
      type: 'structured_text';
    };
    about: {
      type: 'structured_text';
    };
    target_group: {
      type: 'structured_text';
    };
    goal: {
      type: 'structured_text';
    };
    included: {
      type: 'string';
    };
    preparation: {
      type: 'structured_text';
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
    hide_from_website: {
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
export type CourseTerm = ItemTypeDefinition<
  EnvironmentSettings,
  'JwYJfKziS06d-Fz2A329fw',
  {
    long: {
      type: 'structured_text';
    };
    short: {
      type: 'structured_text';
    };
  }
>;
export type LinkWithImage = ItemTypeDefinition<
  EnvironmentSettings,
  'KFHSR9HORYybRriCDQfsfw',
  {
    items: {
      type: 'rich_text';
      blocks: LinkWithImageItem;
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
    max_hours: {
      type: 'integer';
    };
    hide_from_booking: {
      type: 'boolean';
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
      blocks: Staff;
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
    text: {
      type: 'structured_text';
    };
  }
>;
export type BookingHelp = ItemTypeDefinition<
  EnvironmentSettings,
  'N88JsIwQQ-i3LNNydyjUag',
  {
    workshop: {
      type: 'structured_text';
    };
    equipment: {
      type: 'structured_text';
    };
    calendar: {
      type: 'structured_text';
    };
  }
>;
export type Staff = ItemTypeDefinition<
  EnvironmentSettings,
  'OymRSuPaQjKAB5x26CKT8g',
  {
    staff_list: {
      type: 'rich_text';
      blocks: StaffItem;
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
      blocks: LinkWithImage | Image;
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
    aborted: {
      type: 'date_time';
    };
    note: {
      type: 'string';
    };
    note_internal: {
      type: 'string';
    };
    report: {
      type: 'link';
    };
  }
>;
export type LinkWithImageItem = ItemTypeDefinition<
  EnvironmentSettings,
  'X06h2z2US6esCaYnDbcGKA',
  {
    image: {
      type: 'file';
    };
    text: {
      type: 'string';
    };
    link: {
      type: 'string';
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
export type StaffItem = ItemTypeDefinition<
  EnvironmentSettings,
  'Zb9NRpRbRvWEYiSRhYN5NQ',
  {
    image: {
      type: 'file';
    };
    text: {
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
    references: {
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
    sex: {
      type: 'string';
    };
    portfolio: {
      type: 'string';
    };
    address: {
      type: 'string';
    };
    card_number: {
      type: 'string';
    };
    education: {
      type: 'text';
    };
    email: {
      type: 'string';
    };
    postal_code: {
      type: 'string';
    };
    notes: {
      type: 'string';
    };
    member_status: {
      type: 'string';
    };
    artistic_practice: {
      type: 'text';
    };
    city: {
      type: 'string';
    };
    yearly_fee: {
      type: 'string';
    };
    ssa: {
      type: 'string';
    };
    contract: {
      type: 'file';
    };
    rules_accepted: {
      type: 'boolean';
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
export type AnyBlock =
  | LinkWithImage
  | Staff
  | Supporter
  | Image
  | GalleryImage
  | LinkWithImageItem
  | StaffItem
  | Assistant;
export type AnyModel =
  | Course
  | Equipment
  | CourseTerm
  | Workshop
  | Contact
  | Report
  | SignUpStart
  | BookingHelp
  | About
  | Start
  | Footer
  | Booking
  | InEnglish
  | Email
  | Member
  | WorkshopsStart;
export type AnyBlockOrModel = AnyBlock | AnyModel;
