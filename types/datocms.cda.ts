type Maybe<T> = T | null;
type InputMaybe<T> = Maybe<T>;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BooleanType: { input: any; output: any; }
  CustomData: { input: any; output: any; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  FloatType: { input: any; output: any; }
  IntType: { input: any; output: any; }
  ItemId: { input: any; output: any; }
  JsonField: { input: any; output: any; }
  MetaTagAttributes: { input: any; output: any; }
  UploadId: { input: any; output: any; }
};

type AboutModelContentField = {
  __typename?: 'AboutModelContentField';
  blocks: Array<ImageRecord>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

type AboutModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<AboutModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<AboutModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  content?: InputMaybe<StructuredTextFilter>;
  headline?: InputMaybe<StringFilter>;
  id?: InputMaybe<ItemIdFilter>;
  intro?: InputMaybe<StructuredTextFilter>;
  position?: InputMaybe<PositionFilter>;
  slug?: InputMaybe<SlugFilter>;
  title?: InputMaybe<StringFilter>;
};

type AboutModelIntroField = {
  __typename?: 'AboutModelIntroField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

enum AboutModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  headline_ASC = 'headline_ASC',
  headline_DESC = 'headline_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  position_ASC = 'position_ASC',
  position_DESC = 'position_DESC',
  title_ASC = 'title_ASC',
  title_DESC = 'title_DESC'
}

/** Record of type About (about) */
type AboutRecord = RecordInterface & {
  __typename?: 'AboutRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  content?: Maybe<AboutModelContentField>;
  headline: Scalars['String']['output'];
  id: Scalars['ItemId']['output'];
  intro?: Maybe<AboutModelIntroField>;
  position?: Maybe<Scalars['IntType']['output']>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};


/** Record of type About (about) */
type AboutRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

/** Block of type Assistant (assistant) */
type AssistantRecord = RecordInterface & {
  __typename?: 'AssistantRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  days?: Maybe<Scalars['IntType']['output']>;
  hours?: Maybe<Scalars['IntType']['output']>;
  id: Scalars['ItemId']['output'];
};


/** Block of type Assistant (assistant) */
type AssistantRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type BookingModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<BookingModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<BookingModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  end?: InputMaybe<DateTimeFilter>;
  equipment?: InputMaybe<LinksFilter>;
  id?: InputMaybe<ItemIdFilter>;
  member?: InputMaybe<LinkFilter>;
  note?: InputMaybe<StringFilter>;
  report?: InputMaybe<LinkFilter>;
  reported?: InputMaybe<BooleanFilter>;
  start?: InputMaybe<DateTimeFilter>;
  workshop?: InputMaybe<LinkFilter>;
};

enum BookingModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  end_ASC = 'end_ASC',
  end_DESC = 'end_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  note_ASC = 'note_ASC',
  note_DESC = 'note_DESC',
  reported_ASC = 'reported_ASC',
  reported_DESC = 'reported_DESC',
  start_ASC = 'start_ASC',
  start_DESC = 'start_DESC'
}

/** Record of type Booking (booking) */
type BookingRecord = RecordInterface & {
  __typename?: 'BookingRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  end?: Maybe<Scalars['DateTime']['output']>;
  equipment: Array<EquipmentRecord>;
  id: Scalars['ItemId']['output'];
  member?: Maybe<MemberRecord>;
  note?: Maybe<Scalars['String']['output']>;
  report?: Maybe<ReportRecord>;
  reported: Scalars['BooleanType']['output'];
  start?: Maybe<Scalars['DateTime']['output']>;
  workshop?: Maybe<WorkshopRecord>;
};


/** Record of type Booking (booking) */
type BookingRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

/** Specifies how to filter Boolean fields */
type BooleanFilter = {
  /** Search for records with an exact match */
  eq?: InputMaybe<Scalars['BooleanType']['input']>;
};

type CollectionMetadata = {
  __typename?: 'CollectionMetadata';
  count: Scalars['IntType']['output'];
};

enum ColorBucketType {
  black = 'black',
  blue = 'blue',
  brown = 'brown',
  cyan = 'cyan',
  green = 'green',
  grey = 'grey',
  orange = 'orange',
  pink = 'pink',
  purple = 'purple',
  red = 'red',
  white = 'white',
  yellow = 'yellow'
}

type ColorField = {
  __typename?: 'ColorField';
  alpha: Scalars['IntType']['output'];
  blue: Scalars['IntType']['output'];
  cssRgb: Scalars['String']['output'];
  green: Scalars['IntType']['output'];
  hex: Scalars['String']['output'];
  red: Scalars['IntType']['output'];
};

type ContactModelContentField = {
  __typename?: 'ContactModelContentField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type Contact (contact) */
type ContactRecord = RecordInterface & {
  __typename?: 'ContactRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  content: ContactModelContentField;
  id: Scalars['ItemId']['output'];
  title: Scalars['String']['output'];
};


/** Record of type Contact (contact) */
type ContactRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type CourseModelAboutField = {
  __typename?: 'CourseModelAboutField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

type CourseModelAboutOrganizerField = {
  __typename?: 'CourseModelAboutOrganizerField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

type CourseModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<CourseModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<CourseModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  about?: InputMaybe<StructuredTextFilter>;
  aboutOrganizer?: InputMaybe<StructuredTextFilter>;
  amount?: InputMaybe<IntegerFilter>;
  end?: InputMaybe<DateTimeFilter>;
  goal?: InputMaybe<StructuredTextFilter>;
  id?: InputMaybe<ItemIdFilter>;
  image?: InputMaybe<FileFilter>;
  included?: InputMaybe<StringFilter>;
  intro?: InputMaybe<StructuredTextFilter>;
  language?: InputMaybe<StringFilter>;
  member?: InputMaybe<LinkFilter>;
  organizerLink?: InputMaybe<StringFilter>;
  price?: InputMaybe<IntegerFilter>;
  slug?: InputMaybe<SlugFilter>;
  start?: InputMaybe<DateTimeFilter>;
  targetGroup?: InputMaybe<StructuredTextFilter>;
  title?: InputMaybe<StringFilter>;
  workshop?: InputMaybe<LinkFilter>;
};

type CourseModelGoalField = {
  __typename?: 'CourseModelGoalField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

type CourseModelIntroField = {
  __typename?: 'CourseModelIntroField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

enum CourseModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  amount_ASC = 'amount_ASC',
  amount_DESC = 'amount_DESC',
  end_ASC = 'end_ASC',
  end_DESC = 'end_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  included_ASC = 'included_ASC',
  included_DESC = 'included_DESC',
  language_ASC = 'language_ASC',
  language_DESC = 'language_DESC',
  organizerLink_ASC = 'organizerLink_ASC',
  organizerLink_DESC = 'organizerLink_DESC',
  price_ASC = 'price_ASC',
  price_DESC = 'price_DESC',
  start_ASC = 'start_ASC',
  start_DESC = 'start_DESC',
  title_ASC = 'title_ASC',
  title_DESC = 'title_DESC'
}

type CourseModelTargetGroupField = {
  __typename?: 'CourseModelTargetGroupField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type Course (course) */
type CourseRecord = RecordInterface & {
  __typename?: 'CourseRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  about: CourseModelAboutField;
  aboutOrganizer: CourseModelAboutOrganizerField;
  amount?: Maybe<Scalars['IntType']['output']>;
  end: Scalars['DateTime']['output'];
  goal: CourseModelGoalField;
  id: Scalars['ItemId']['output'];
  image: FileField;
  included?: Maybe<Scalars['String']['output']>;
  intro: CourseModelIntroField;
  language?: Maybe<Scalars['String']['output']>;
  member: MemberRecord;
  organizerLink?: Maybe<Scalars['String']['output']>;
  price: Scalars['IntType']['output'];
  slug: Scalars['String']['output'];
  start: Scalars['DateTime']['output'];
  targetGroup: CourseModelTargetGroupField;
  title: Scalars['String']['output'];
  workshop: WorkshopRecord;
};


/** Record of type Course (course) */
type CourseRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

/** Specifies how to filter by creation datetime */
type CreatedAtFilter = {
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Specifies how to filter Date fields */
type DateFilter = {
  /** Search for records with an exact match */
  eq?: InputMaybe<Scalars['Date']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with a value that's strictly greater than the one specified */
  gt?: InputMaybe<Scalars['Date']['input']>;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte?: InputMaybe<Scalars['Date']['input']>;
  /** Filter records with a value that's less than the one specified */
  lt?: InputMaybe<Scalars['Date']['input']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte?: InputMaybe<Scalars['Date']['input']>;
  /** Exclude records with an exact match */
  neq?: InputMaybe<Scalars['Date']['input']>;
};

/** Specifies how to filter DateTime fields */
type DateTimeFilter = {
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq?: InputMaybe<Scalars['DateTime']['input']>;
};

type EmailModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<EmailModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EmailModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  action?: InputMaybe<StringFilter>;
  button?: InputMaybe<StringFilter>;
  id?: InputMaybe<ItemIdFilter>;
  subject?: InputMaybe<StringFilter>;
  text?: InputMaybe<TextFilter>;
};

enum EmailModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  action_ASC = 'action_ASC',
  action_DESC = 'action_DESC',
  button_ASC = 'button_ASC',
  button_DESC = 'button_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  subject_ASC = 'subject_ASC',
  subject_DESC = 'subject_DESC'
}

/** Record of type Email (email) */
type EmailRecord = RecordInterface & {
  __typename?: 'EmailRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  action: Scalars['String']['output'];
  button?: Maybe<Scalars['String']['output']>;
  id: Scalars['ItemId']['output'];
  subject: Scalars['String']['output'];
  text: Scalars['String']['output'];
};


/** Record of type Email (email) */
type EmailRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};


/** Record of type Email (email) */
type EmailRecordtextArgs = {
  markdown?: InputMaybe<Scalars['Boolean']['input']>;
};

type EquipmentModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<EquipmentModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<EquipmentModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  bookable?: InputMaybe<BooleanFilter>;
  exclusive?: InputMaybe<BooleanFilter>;
  id?: InputMaybe<ItemIdFilter>;
  image?: InputMaybe<FileFilter>;
  manual?: InputMaybe<FileFilter>;
  price?: InputMaybe<StringFilter>;
  slug?: InputMaybe<SlugFilter>;
  summary?: InputMaybe<StructuredTextFilter>;
  title?: InputMaybe<StringFilter>;
  titleShort?: InputMaybe<StringFilter>;
};

enum EquipmentModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  bookable_ASC = 'bookable_ASC',
  bookable_DESC = 'bookable_DESC',
  exclusive_ASC = 'exclusive_ASC',
  exclusive_DESC = 'exclusive_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  price_ASC = 'price_ASC',
  price_DESC = 'price_DESC',
  titleShort_ASC = 'titleShort_ASC',
  titleShort_DESC = 'titleShort_DESC',
  title_ASC = 'title_ASC',
  title_DESC = 'title_DESC'
}

type EquipmentModelSummaryField = {
  __typename?: 'EquipmentModelSummaryField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type Equipment (equipment) */
type EquipmentRecord = RecordInterface & {
  __typename?: 'EquipmentRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  bookable: Scalars['BooleanType']['output'];
  exclusive: Scalars['BooleanType']['output'];
  id: Scalars['ItemId']['output'];
  image?: Maybe<FileField>;
  manual?: Maybe<FileField>;
  price?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  summary?: Maybe<EquipmentModelSummaryField>;
  title: Scalars['String']['output'];
  titleShort?: Maybe<Scalars['String']['output']>;
};


/** Record of type Equipment (equipment) */
type EquipmentRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

enum FaviconType {
  appleTouchIcon = 'appleTouchIcon',
  icon = 'icon',
  msApplication = 'msApplication'
}

type FileField = FileFieldInterface & {
  __typename?: 'FileField';
  _createdAt: Scalars['DateTime']['output'];
  /** The DatoCMS URL where you can edit this entity. To use this field, you need to set a X-Base-Editing-Url header in the request */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  alt?: Maybe<Scalars['String']['output']>;
  author?: Maybe<Scalars['String']['output']>;
  basename: Scalars['String']['output'];
  blurUpThumb?: Maybe<Scalars['String']['output']>;
  blurhash?: Maybe<Scalars['String']['output']>;
  colors: Array<ColorField>;
  copyright?: Maybe<Scalars['String']['output']>;
  customData: Scalars['CustomData']['output'];
  exifInfo: Scalars['CustomData']['output'];
  filename: Scalars['String']['output'];
  focalPoint?: Maybe<focalPoint>;
  format: Scalars['String']['output'];
  height?: Maybe<Scalars['IntType']['output']>;
  id: Scalars['UploadId']['output'];
  md5: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  responsiveImage?: Maybe<ResponsiveImage>;
  size: Scalars['IntType']['output'];
  smartTags: Array<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  thumbhash?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
  video?: Maybe<UploadVideoField>;
  width?: Maybe<Scalars['IntType']['output']>;
};


type FileFieldaltArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldblurUpThumbArgs = {
  imgixParams?: InputMaybe<ImgixParams>;
  punch?: Scalars['Float']['input'];
  quality?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
};


type FileFieldcustomDataArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldfocalPointArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldresponsiveImageArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  imgixParams?: InputMaybe<ImgixParams>;
  locale?: InputMaybe<SiteLocale>;
  sizes?: InputMaybe<Scalars['String']['input']>;
};


type FileFieldtitleArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldurlArgs = {
  imgixParams?: InputMaybe<ImgixParams>;
};

type FileFieldInterface = {
  _createdAt: Scalars['DateTime']['output'];
  /** The DatoCMS URL where you can edit this entity. To use this field, you need to set a X-Base-Editing-Url header in the request */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  alt?: Maybe<Scalars['String']['output']>;
  author?: Maybe<Scalars['String']['output']>;
  basename: Scalars['String']['output'];
  blurUpThumb?: Maybe<Scalars['String']['output']>;
  blurhash?: Maybe<Scalars['String']['output']>;
  colors: Array<ColorField>;
  copyright?: Maybe<Scalars['String']['output']>;
  customData: Scalars['CustomData']['output'];
  exifInfo: Scalars['CustomData']['output'];
  filename: Scalars['String']['output'];
  focalPoint?: Maybe<focalPoint>;
  format: Scalars['String']['output'];
  height?: Maybe<Scalars['IntType']['output']>;
  id: Scalars['UploadId']['output'];
  md5: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  responsiveImage?: Maybe<ResponsiveImage>;
  size: Scalars['IntType']['output'];
  smartTags: Array<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  thumbhash?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
  video?: Maybe<UploadVideoField>;
  width?: Maybe<Scalars['IntType']['output']>;
};


type FileFieldInterfacealtArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldInterfaceblurUpThumbArgs = {
  imgixParams?: InputMaybe<ImgixParams>;
  punch?: Scalars['Float']['input'];
  quality?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
};


type FileFieldInterfacecustomDataArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldInterfacefocalPointArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldInterfaceresponsiveImageArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  imgixParams?: InputMaybe<ImgixParams>;
  locale?: InputMaybe<SiteLocale>;
  sizes?: InputMaybe<Scalars['String']['input']>;
};


type FileFieldInterfacetitleArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type FileFieldInterfaceurlArgs = {
  imgixParams?: InputMaybe<ImgixParams>;
};

/** Specifies how to filter Single-file/image fields */
type FileFilter = {
  /** Search for records with an exact match. The specified value must be an Upload ID */
  eq?: InputMaybe<Scalars['UploadId']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records that have one of the specified uploads */
  in?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
  /** Exclude records with an exact match. The specified value must be an Upload ID */
  neq?: InputMaybe<Scalars['UploadId']['input']>;
  /** Filter records that do not have one of the specified uploads */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
};

/** Record of type Footer (footer) */
type FooterRecord = RecordInterface & {
  __typename?: 'FooterRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  facebook: Scalars['String']['output'];
  id: Scalars['ItemId']['output'];
  instagram: Scalars['String']['output'];
  support: Array<SupporterRecord>;
};


/** Record of type Footer (footer) */
type FooterRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

/** Specifies how to filter Multiple files/images field */
type GalleryFilter = {
  /** Filter records that have all of the specified uploads. The specified values must be Upload IDs */
  allIn?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
  /** Filter records that have one of the specified uploads. The specified values must be Upload IDs */
  anyIn?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
  /** Search for records with an exact match. The specified values must be Upload IDs */
  eq?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records that do not have any of the specified uploads. The specified values must be Upload IDs */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
};

type GalleryImageModelCaptionField = {
  __typename?: 'GalleryImageModelCaptionField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Block of type Gallery image (gallery_image) */
type GalleryImageRecord = RecordInterface & {
  __typename?: 'GalleryImageRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  caption?: Maybe<GalleryImageModelCaptionField>;
  id: Scalars['ItemId']['output'];
  image?: Maybe<FileField>;
};


/** Block of type Gallery image (gallery_image) */
type GalleryImageRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type GlobalSeoField = {
  __typename?: 'GlobalSeoField';
  facebookPageUrl?: Maybe<Scalars['String']['output']>;
  fallbackSeo?: Maybe<SeoField>;
  siteName?: Maybe<Scalars['String']['output']>;
  titleSuffix?: Maybe<Scalars['String']['output']>;
  twitterAccount?: Maybe<Scalars['String']['output']>;
};

/** Block of type Image (image) */
type ImageRecord = RecordInterface & {
  __typename?: 'ImageRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  id: Scalars['ItemId']['output'];
  image?: Maybe<FileField>;
};


/** Block of type Image (image) */
type ImageRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type ImgixParams = {
  /**
   * Aspect Ratio
   *
   * Specifies an aspect ratio to maintain when resizing and cropping the image
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/aspect-ratio)
   */
  ar?: InputMaybe<Scalars['String']['input']>;
  /**
   * Automatic
   *
   * Applies automatic enhancements to images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/automatic)
   */
  auto?: InputMaybe<Array<ImgixParamsAuto>>;
  /**
   * Background Color
   *
   * Colors the background of padded and partially-transparent images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/background-color)
   */
  bg?: InputMaybe<Scalars['String']['input']>;
  /**
   * Background Removal
   *
   * Removes background from image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/background/background-removal)
   */
  bgRemove?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Background Removal Fallback
   *
   * Overrides default fallback behavior for bg-remove failures.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/background/background-removal-fallback)
   */
  bgRemoveFallback?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Background Removal Foreground Type
   *
   * Specifies the image foreground type for background removal.
   *
   * Depends on: `bg-remove=true`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/background/background-removal-foreground-type)
   */
  bgRemoveFgType?: InputMaybe<Array<ImgixParamsBgRemoveFgType>>;
  /**
   * Background Removal Semi Transparency
   *
   * Enables background removal while retaining semi-transparent areas.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/background/background-removal-semi-transparency)
   */
  bgRemoveSemiTransparency?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Background Replacement
   *
   * Replaces background from image using a string based prompt.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/background/background-replacement)
   */
  bgReplace?: InputMaybe<Scalars['String']['input']>;
  /**
   * Background Replace Fallback
   *
   * Overrides default fallback behavior for bg-replace failures.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/background/background-replace-fallback)
   */
  bgReplaceFallback?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Background Replacement Negative Prompt
   *
   * Provides a negative text suggestion for background replacement.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/background/background-replacement-negative-prompt)
   */
  bgReplaceNegPrompt?: InputMaybe<Scalars['String']['input']>;
  /**
   * Blend
   *
   * Specifies the location of the blend image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend)
   */
  blend?: InputMaybe<Scalars['String']['input']>;
  /**
   * Blend Align
   *
   * Changes the blend alignment relative to the parent image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-align)
   */
  blendAlign?: InputMaybe<Array<ImgixParamsBlendAlign>>;
  /**
   * Blend Alpha
   *
   * Changes the alpha of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-alpha)
   */
  blendAlpha?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Blend Color
   *
   * Specifies a color to use when applying the blend.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-color)
   */
  blendColor?: InputMaybe<Scalars['String']['input']>;
  /**
   * Blend Crop
   *
   * Specifies the type of crop for blend images.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-crop)
   */
  blendCrop?: InputMaybe<Array<ImgixParamsBlendCrop>>;
  /**
   * Blend Fit
   *
   * Specifies the fit mode for blend images.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-fit)
   */
  blendFit?: InputMaybe<ImgixParamsBlendFit>;
  /**
   * Blend Height
   *
   * Adjusts the height of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-height)
   */
  blendH?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Blend Mode
   *
   * Sets the blend mode for a blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-mode)
   */
  blendMode?: InputMaybe<ImgixParamsBlendMode>;
  /**
   * Blend Padding
   *
   * Applies padding to the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-padding)
   */
  blendPad?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Blend Size
   *
   * Adjusts the size of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-size)
   */
  blendSize?: InputMaybe<ImgixParamsBlendSize>;
  /**
   * Blend Width
   *
   * Adjusts the width of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-width)
   */
  blendW?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Blend X Position
   *
   * Adjusts the x-offset of the blend image relative to its parent.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-x-position)
   */
  blendX?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Blend Y Position
   *
   * Adjusts the y-offset of the blend image relative to its parent.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/blending/blend-y-position)
   */
  blendY?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Gaussian Blur
   *
   * Applies a gaussian blur to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/stylize/gaussian-blur)
   */
  blur?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Border Size & Color
   *
   * Applies a border to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size)
   */
  border?: InputMaybe<Scalars['String']['input']>;
  /**
   * Border Bottom
   *
   * Sets bottom border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/border-bottom)
   */
  borderBottom?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Border Left
   *
   * Sets left border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/border-left)
   */
  borderLeft?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Outer Border Radius
   *
   * Sets the outer radius of the image's border in pixels.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/outer-border-radius)
   */
  borderRadius?: InputMaybe<Scalars['String']['input']>;
  /**
   * Inner Border Radius
   *
   * Sets the inner radius of the image's border in pixels.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/inner-border-radius)
   */
  borderRadiusInner?: InputMaybe<Scalars['String']['input']>;
  /**
   * Border Right
   *
   * Sets right border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/border-right)
   */
  borderRight?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Border Top
   *
   * Sets top border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/border-top)
   */
  borderTop?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Brightness
   *
   * Adjusts the brightness of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/brightness)
   */
  bri?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Client Hints
   *
   * Sets one or more Client-Hints headers
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/client-hints)
   */
  ch?: InputMaybe<Array<ImgixParamsCh>>;
  /**
   * Chroma Subsampling
   *
   * Specifies the output chroma subsampling rate.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/chroma-subsampling)
   */
  chromasub?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Color Quantization
   *
   * Limits the number of unique colors in an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/color-quantization)
   */
  colorquant?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Palette Color Count
   *
   * Specifies how many colors to include in a palette-extraction response.
   *
   * Depends on: `palette`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/color-palette/palette-color-count)
   */
  colors?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Contrast
   *
   * Adjusts the contrast of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/contrast)
   */
  con?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Mask Corner Radius
   *
   * Specifies the radius value for a rounded corner mask.
   *
   * Depends on: `mask=corners`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/mask-image/mask-corner-radius)
   */
  cornerRadius?: InputMaybe<Scalars['String']['input']>;
  /**
   * Crop Mode
   *
   * Specifies how to crop an image.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/crop-mode)
   */
  crop?: InputMaybe<Array<ImgixParamsCrop>>;
  /**
   * Color Space
   *
   * Specifies the color space of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/color-space)
   */
  cs?: InputMaybe<ImgixParamsCs>;
  /**
   * Download
   *
   * Forces a URL to use send-file in its response.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/download)
   */
  dl?: InputMaybe<Scalars['String']['input']>;
  /**
   * Dots Per Inch
   *
   * Sets the DPI value in the EXIF header.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/dots-per-inch)
   */
  dpi?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Device Pixel Ratio
   *
   * Adjusts the device-pixel ratio of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/device-pixel-ratio)
   */
  dpr?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Duotone
   *
   * Applies a duotone effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/stylize/duotone)
   */
  duotone?: InputMaybe<Scalars['String']['input']>;
  /**
   * Duotone Alpha
   *
   * Changes the alpha of the duotone effect atop the source image.
   *
   * Depends on: `duotone`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/stylize/duotone-alpha)
   */
  duotoneAlpha?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Exposure
   *
   * Adjusts the exposure of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/exposure)
   */
  exp?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Url Expiration Timestamp
   *
   * A Unix timestamp specifying a UTC time. Requests made to this URL after that time will output a 404 status code.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/expiration)
   */
  expires?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Face Blur
   *
   * Specifies the amount of blur to apply to detected faces. Defaults to 0.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/face-detection/face-blur)
   */
  faceBlur?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Face Pixelation
   *
   * Specifies the pixelation amount of the face.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/face-detection/face-pixelation)
   */
  facePixel?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Face Index
   *
   * Selects a face to crop to.
   *
   * Depends on: `fit=facearea`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/face-detection/face-index)
   */
  faceindex?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Face Padding
   *
   * Adjusts padding around a selected face.
   *
   * Depends on: `fit=facearea`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/face-detection/face-padding)
   */
  facepad?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Json Face Data
   *
   * Specifies that face data should be included in output when combined with `fm=json`.
   *
   * Depends on: `fm=json`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/face-detection/json-face-data)
   */
  faces?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Fill Mode
   *
   * Determines how to fill in additional space created by the fit setting
   *
   * Depends on: `fit`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-mode)
   */
  fill?: InputMaybe<ImgixParamsFill>;
  /**
   * Fill Color
   *
   * Sets the fill color for images with additional space created by the fit setting
   *
   * Depends on: `fill=solid`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-color)
   */
  fillColor?: InputMaybe<Scalars['String']['input']>;
  /**
   * Fill Generative Fallback
   *
   * Sets the fallback behavior for generative fill.
   *
   * Depends on: `fit=fill`, `fill=gen`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-generative-fallback)
   */
  fillGenFallback?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Fill Generative Negative Prompt
   *
   * Provides a negative text suggestion to the generative fill parameter. Used to reduce the probability of a subject, detail, or object appearing in generative output.
   *
   * Depends on: `fit=fill`, `fill=gen`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-generative-negative-prompt)
   */
  fillGenNegPrompt?: InputMaybe<Scalars['String']['input']>;
  /**
   * Fill Generative Position
   *
   * Sets the position of the Origin Image in relation to the generative fill.
   *
   * Depends on: `fit=fill`, `fill=gen`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-generative-position)
   */
  fillGenPos?: InputMaybe<Array<ImgixParamsFillGenPos>>;
  /**
   * Fill Generative Prompt
   *
   * Provides a text suggestion to the generative fill parameter.
   *
   * Depends on: `fit=fill`, `fill=gen`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-generative-prompt)
   */
  fillGenPrompt?: InputMaybe<Scalars['String']['input']>;
  /**
   * Fill Generative Seed
   *
   * Sets the generative seed value. Used to generate similar outputs from different prompts.
   *
   * Depends on: `fit=fill`, `fill=gen`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-generative-seed)
   */
  fillGenSeed?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Fill Gradient Color Space
   *
   * Defines the color space as linear, sRGB, Oklab, HSL, or LCH for gradient color interpolation
   *
   * Depends on: `fit=fill`, `fill=gradient`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-color-space)
   */
  fillGradientCs?: InputMaybe<ImgixParamsFillGradientCs>;
  /**
   * Fill Gradient Linear
   *
   * Blends a gradient between two colors, {color1} and {color2}, along a straight path
   *
   * Depends on: `fit=fill`, `fill=gradient`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-linear)
   */
  fillGradientLinear?: InputMaybe<Scalars['String']['input']>;
  /**
   * Fill Gradient Linear Direction
   *
   * The fill-gradient-linear-direction specifies the gradient's direction, flowing towards the bottom, top, right, or left
   *
   * Depends on: `fit=fill`, `fill=gen`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-linear-direction)
   */
  fillGradientLinearDirection?: InputMaybe<Array<ImgixParamsFillGradientLinearDirection>>;
  /**
   * Fill Gradient Radial
   *
   * The fill-gradient-radial parameter creates a circular gradient transitioning from a central color (Color1) to an outer color (Color2)
   *
   * Depends on: `fit=fill`, `fill=gradient`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-radial)
   */
  fillGradientRadial?: InputMaybe<Scalars['String']['input']>;
  /**
   * Fill Gradient Radial Radius
   *
   * Parameter defines the radial gradient's radius as pixels or a percentage (0.0-1.0) of the image's smallest dimension
   *
   * Depends on: `fit=fill`, `fill=gradient`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-radial-radius)
   */
  fillGradientRadialRadius?: InputMaybe<Scalars['String']['input']>;
  /**
   * Fill Gradient Radial X
   *
   * Specifies the location of the radial gradient's center along the x-axis, using either a pixel value or a floating point percentage (ranging from 0.0 to 1.0) of the image's width
   *
   * Depends on: `fit=fill`, `fill=gradient`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-radial-x)
   */
  fillGradientRadialX?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Fill Gradient Radial Y
   *
   * Parameter sets the radial gradient's center on the y-axis, using pixels or a 0.0 to 1.0 percentage of the image's height
   *
   * Depends on: `fit=fill`, `fill=gradient`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-radial-y)
   */
  fillGradientRadialY?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Fill Gradient Type
   *
   * Specifies if a gradient is radial (circular) or linear (straight)
   *
   * Depends on: `fit=fill`, `fill=gradient`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/fill-gradient-type)
   */
  fillGradientType?: InputMaybe<ImgixParamsFillGradientType>;
  /**
   * Resize Fit Mode
   *
   * Specifies how to map the source image to the output image dimensions.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/resize-fit-mode)
   */
  fit?: InputMaybe<ImgixParamsFit>;
  /**
   * Flip Axis
   *
   * Flips an image on a specified axis.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/rotation/flip-axis)
   */
  flip?: InputMaybe<ImgixParamsFlip>;
  /**
   * Output Format
   *
   * Changes the format of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/output-format)
   */
  fm?: InputMaybe<ImgixParamsFm>;
  /**
   * Focal Point Debug
   *
   * Displays crosshairs identifying the location of the set focal point
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/focal-point-crop/focal-point-debug)
   */
  fpDebug?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Focal Point X Position
   *
   * Sets the relative horizontal value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/focal-point-crop/focal-point-x-position)
   */
  fpX?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Focal Point Y Position
   *
   * Sets the relative vertical value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/focal-point-crop/focal-point-y-position)
   */
  fpY?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Focal Point Zoom
   *
   * Sets the relative zoom value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/focal-point-crop/focal-point-zoom)
   */
  fpZ?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Frames Per Second
   *
   * Specifies the framerate of the generated image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/animation/frames-per-second)
   */
  fps?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Frame Selection
   *
   * Specifies the frame of an animated image to use.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/animation/frame-selection)
   */
  frame?: InputMaybe<Scalars['String']['input']>;
  /**
   * Gamma
   *
   * Adjusts the gamma of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/gamma)
   */
  gam?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Animated Gif Quality
   *
   * Specifies the quality of the animated gif. The higher the value, the better more compression is applied.
   *
   * Depends on: `fm=gif`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/animation/animated-gif-quality)
   */
  gifQ?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Grid Colors
   *
   * Sets grid colors for the transparency checkerboard grid.
   *
   * Depends on: `transparency`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/grid-colors)
   */
  gridColors?: InputMaybe<Scalars['String']['input']>;
  /**
   * Grid Size
   *
   * Sets grid size for the transparency checkerboard grid.
   *
   * Depends on: `transparency`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/grid-size)
   */
  gridSize?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Image Height
   *
   * Adjusts the height of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/image-height)
   */
  h?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Highlight
   *
   * Adjusts the highlights of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/highlight)
   */
  high?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Halftone
   *
   * Applies a half-tone effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/stylize/halftone)
   */
  htn?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Hue Shift
   *
   * Adjusts the hue of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/hue-shift)
   */
  hue?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Frame Interval
   *
   * Displays every Nth frame starting with the first frame.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/animation/frame-interval)
   */
  interval?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Invert
   *
   * Inverts the colors on the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/invert)
   */
  invert?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Iptc Passthrough
   *
   * Determine if IPTC data should be passed for JPEG images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/iptc-passthrough)
   */
  iptc?: InputMaybe<ImgixParamsIptc>;
  /**
   * Jpg Progressive
   *
   * Specifies whether or not a jpg/jpeg uses progressive (true) or baseline (false)
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/jpg-progressive)
   */
  jpgProgressive?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Animation Loop Count
   *
   * Specifies the number of times an animated image should repeat. A value of 0 means infinite looping.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/animation)
   */
  loop?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Lossless Compression
   *
   * Specifies that the output image should be a lossless variant.
   *
   * Depends on: `fm=webp`, `fm=jxr`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/lossless-compression)
   */
  lossless?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * License Plate Blur
   *
   * Specifies the amount of blur to apply to detected license plates. Defaults to 0.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/license-plate-detection/license-plate-blur)
   */
  lpBlur?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Watermark Image Url
   *
   * Specifies the location of the watermark image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-image-url)
   */
  mark?: InputMaybe<Scalars['String']['input']>;
  /**
   * Watermark Alignment Mode
   *
   * Changes the watermark alignment relative to the parent image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-alignment-mode)
   */
  markAlign?: InputMaybe<Array<ImgixParamsMarkAlign>>;
  /**
   * Watermark Alpha
   *
   * Changes the alpha of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-alpha)
   */
  markAlpha?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Watermark Base Url
   *
   * Changes base URL of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-base-url)
   */
  markBase?: InputMaybe<Scalars['String']['input']>;
  /**
   * Watermark Fit Mode
   *
   * Specifies the fit mode for watermark images.
   *
   * Depends on: `mark`, `markw`, `markh`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-fit-mode)
   */
  markFit?: InputMaybe<ImgixParamsMarkFit>;
  /**
   * Watermark Height
   *
   * Adjusts the height of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-height)
   */
  markH?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Watermark If Minimum Height
   *
   * Displays the watermark if rendered base image pixel height is equal to or larger than the supplied value
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-if-minimum-height)
   */
  markIfMinHeight?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Watermark If Minimum Width
   *
   * Displays the watermark if rendered base image pixel width is equal to or larger than the supplied value
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-if-minimum-width)
   */
  markIfMinWidth?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Watermark Padding
   *
   * Applies padding to the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-padding)
   */
  markPad?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Watermark Rotation
   *
   * Rotates a watermark or tiled watermarks by a specified number of degrees.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-rotation)
   */
  markRot?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Watermark Scale
   *
   * Adjusts the scale of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-scale)
   */
  markScale?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Watermark Tile
   *
   * Adds tiled watermark.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-tile)
   */
  markTile?: InputMaybe<ImgixParamsMarkTile>;
  /**
   * Watermark Width
   *
   * Adjusts the width of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-width)
   */
  markW?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Watermark X Position
   *
   * Adjusts the x-offset of the watermark image relative to its parent.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-x-position)
   */
  markX?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Watermark Y Position
   *
   * Adjusts the y-offset of the watermark image relative to its parent.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/watermark/watermark-y-position)
   */
  markY?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Mask Type
   *
   * Defines the type of mask and specifies the URL if that type is selected.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/mask-image/mask-type)
   */
  mask?: InputMaybe<Scalars['String']['input']>;
  /**
   * Mask Background Color
   *
   * Colors the background of the transparent mask area of images
   *
   * Depends on: `mask`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/mask-image/mask-background-color)
   */
  maskBg?: InputMaybe<Scalars['String']['input']>;
  /**
   * Maximum Height
   *
   * Specifies the maximum height of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/maximum-height)
   */
  maxH?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Maximum Width
   *
   * Specifies the maximum width of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/maximum-width)
   */
  maxW?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Minimum Height
   *
   * Specifies the minimum height of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/minimum-height)
   */
  minH?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Minimum Width
   *
   * Specifies the minimum width of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/minimum-width)
   */
  minW?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Monochrome
   *
   * Applies a monochrome effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/stylize/monochrome)
   */
  monochrome?: InputMaybe<Scalars['String']['input']>;
  /**
   * Noise Reduction Bound
   *
   * Reduces the noise in an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/noise-reduction/noise-reduction-bound)
   */
  nr?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Noise Reduction Sharpen
   *
   * Provides a threshold by which to sharpen an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/noise-reduction/noise-reduction-sharpen)
   */
  nrs?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Object Removal Negative Prompt
   *
   * Provides a negative text suggestion to object-removal-prompt. Used to reduce the probability of a subject, detail, or object appearing in generative output.
   *
   * Depends on: `object-removal-rect`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/object-manipulation/object-removal-negative-prompt)
   */
  objectRemovalNegativePrompt?: InputMaybe<Scalars['String']['input']>;
  /**
   * Object Removal Prompt
   *
   * Suggest auto generative fill for the object-removal-rect parameter
   *
   * Depends on: `object-removal-rect`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/object-manipulation/object-removal-prompt)
   */
  objectRemovalPrompt?: InputMaybe<Scalars['String']['input']>;
  /**
   * Object Removal
   *
   * Using a specified rectangle, an object is removed from the image
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/object-manipulation/object-removal)
   */
  objectRemovalRect?: InputMaybe<Scalars['String']['input']>;
  /**
   * Object Removal Seed
   *
   * Sets the generative seed value for object-removal. Used to generate new outputs from the same prompt
   *
   * Depends on: `object-removal-rect`, `object-removal-prompt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/object-manipulation/object-removal-seed)
   */
  objectRemovalSeed?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Orientation
   *
   * Changes the image orientation.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/rotation/orientation)
   */
  orient?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Padding
   *
   * Pads an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/padding)
   */
  pad?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Padding Bottom
   *
   * Sets bottom padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/padding-bottom)
   */
  padBottom?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Padding Left
   *
   * Sets left padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/padding-left)
   */
  padLeft?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Padding Right
   *
   * Sets right padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/padding-right)
   */
  padRight?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Padding Top
   *
   * Sets top padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/border-and-padding/padding-top)
   */
  padTop?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Pdf Page Number
   *
   * Selects a page from a PDF for display.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/pdf/pdf-page-number)
   */
  page?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Color Palette Extraction
   *
   * Specifies an output format for palette-extraction.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/color-palette/color-palette-extraction)
   */
  palette?: InputMaybe<ImgixParamsPalette>;
  /**
   * Pdf Annotation
   *
   * Enables or disables PDF annotation.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/pdf/pdf-annotation)
   */
  pdfAnnotation?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Css Prefix
   *
   * Specifies a CSS prefix for all classes in palette-extraction.
   *
   * Depends on: `palette=css`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/color-palette/css-prefix)
   */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /**
   * Pixellate
   *
   * Applies a pixelation effect to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/stylize/pixellate)
   */
  px?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Output Quality
   *
   * Adjusts the quality of an output image.
   *
   * Depends on: `fm=avif`, `fm=jpg`, `fm=pjpg`, `fm=webp`, `fm=jxr`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/output-quality)
   */
  q?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Rasterize Bypass
   *
   * Bypasses all rendering parameters (including default parameters) and serves the original image. Works for svg+xml,x-eps,pdf, and vnd.adobe.illustrator.
   */
  rasterizeBypass?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Source Rectangle Region
   *
   * Crops an image to a specified rectangle.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/source-rectangle-region)
   */
  rect?: InputMaybe<Scalars['String']['input']>;
  /**
   * Reverse
   *
   * Reverses the frame order on the source animation.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/animation/reverse)
   */
  reverse?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Rotation
   *
   * Rotates an image by a specified number of degrees.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/rotation/rotation)
   */
  rot?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Rotation Type
   *
   * Changes the rotation type.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/rotation/rotation-type)
   */
  rotType?: InputMaybe<ImgixParamsRotType>;
  /**
   * Saturation
   *
   * Adjusts the saturation of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/saturation)
   */
  sat?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Sepia Tone
   *
   * Applies a sepia effect to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/stylize/sepia-tone)
   */
  sepia?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Shadow
   *
   * Adjusts the highlights of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/shadow)
   */
  shad?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Sharpen
   *
   * Adjusts the sharpness of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/sharpen)
   */
  sharp?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Frame Skip
   *
   * Skips every Nth frame starting with the first frame.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/animation/frame-skip)
   */
  skip?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Bypasses any [DatoCMS Automatic Image Optimization](https://www.datocms.com/docs/cdn-settings/advanced-asset-settings) that might be set up for the project.
   *
   * Exercise caution when using this parameter, as it could significantly increase your bandwidth costs.
   */
  skipDefaultOptimizations?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Sanitize Svg
   *
   * Specifies whether to sanitize an SVG.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/format/sanitize-svg)
   */
  svgSanitize?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Transparency
   *
   * Adds checkerboard behind images which support transparency.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/fill/transparency)
   */
  transparency?: InputMaybe<ImgixParamsTransparency>;
  /**
   * Trim Image
   *
   * Trims the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/trim/trim-image)
   */
  trim?: InputMaybe<ImgixParamsTrim>;
  /**
   * Trim Alpha
   *
   * Specifies a trim alpha on a trim operation.
   *
   * Depends on: `trim=alpha`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/trim/trim-alpha)
   */
  trimAlpha?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Trim Color
   *
   * Specifies a trim color on a trim operation.
   *
   * Depends on: `trim=color`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/trim/trim-color)
   */
  trimColor?: InputMaybe<Scalars['String']['input']>;
  /**
   * Trim Mean Difference
   *
   * Specifies the mean difference on a trim operation.
   *
   * Depends on: `trim=auto`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/trim/trim-mean-difference)
   */
  trimMd?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Trim Padding
   *
   * Pads the area of the source image before trimming.
   *
   * Depends on: `trim`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/trim/trim-padding)
   */
  trimPad?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Trim Standard Deviation
   *
   * Specifies the standard deviation on a trim operation.
   *
   * Depends on: `trim=auto`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/trim/trim-standard-deviation)
   */
  trimSd?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Trim Tolerance
   *
   * Specifies the tolerance on a trim operation.
   *
   * Depends on: `trim=color`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/trim/trim-tolerance)
   */
  trimTol?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Text String
   *
   * Sets the text string to render.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-string)
   */
  txt?: InputMaybe<Scalars['String']['input']>;
  /**
   * Text Align
   *
   * Sets the vertical and horizontal alignment of rendered text relative to the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-align)
   */
  txtAlign?: InputMaybe<Array<ImgixParamsTxtAlign>>;
  /**
   * Text Clipping Mode
   *
   * Sets the clipping properties of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-clipping-mode)
   */
  txtClip?: InputMaybe<Array<ImgixParamsTxtClip>>;
  /**
   * Text Color
   *
   * Specifies the color of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-color)
   */
  txtColor?: InputMaybe<Scalars['String']['input']>;
  /**
   * Text Fit Mode
   *
   * Specifies the fit approach for rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-fit-mode)
   */
  txtFit?: InputMaybe<ImgixParamsTxtFit>;
  /**
   * Text Font
   *
   * Selects a font for rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-font)
   */
  txtFont?: InputMaybe<Scalars['String']['input']>;
  /**
   * Text Leading
   *
   * Sets the leading (line spacing) for rendered text. Only works on the multi-line text endpoint.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/typesetting-endpoint/text-leading)
   */
  txtLead?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Text Outline
   *
   * Outlines the rendered text with a specified color.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-outline)
   */
  txtLine?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Text Outline Color
   *
   * Specifies a text outline color.
   *
   * Depends on: `txt`, `txtline`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-outline-color)
   */
  txtLineColor?: InputMaybe<Scalars['String']['input']>;
  /**
   * Text Padding
   *
   * Specifies the padding (in device-independent pixels) between a textbox and the edges of the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-padding)
   */
  txtPad?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Text Shadow
   *
   * Applies a shadow to rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-shadow)
   */
  txtShad?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Text Font Size
   *
   * Sets the font size of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-font-size)
   */
  txtSize?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Text Tracking
   *
   * Sets the tracking (letter spacing) for rendered text. Only works on the multi-line text endpoint.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/typesetting-endpoint/text-tracking)
   */
  txtTrack?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Text Width
   *
   * Sets the width of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-width)
   */
  txtWidth?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Text X Position
   *
   * Sets the horizontal (x) position of the text in pixels relative to the left edge of the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-x-position)
   */
  txtX?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Text Y Position
   *
   * Sets the vertical (y) position of the text in pixels relative to the top edge of the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/text/text-y-position)
   */
  txtY?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Super Resolution
   *
   * Uses generative AI fill to upscale low resolution images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/super-resolution)
   */
  upscale?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Super Resolution Fallback
   *
   * Overrides default fallback behavior for super resolution failures
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/super-resolution)
   */
  upscaleFallback?: InputMaybe<Scalars['BooleanType']['input']>;
  /**
   * Unsharp Mask
   *
   * Sharpens the source image using an unsharp mask.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/unsharp-mask)
   */
  usm?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Unsharp Mask Radius
   *
   * Specifies the radius for an unsharp mask operation.
   *
   * Depends on: `usm`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/unsharp-mask-radius)
   */
  usmrad?: InputMaybe<Scalars['FloatType']['input']>;
  /**
   * Vibrance
   *
   * Adjusts the vibrance of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/adjustment/vibrance)
   */
  vib?: InputMaybe<Scalars['IntType']['input']>;
  /**
   * Image Width
   *
   * Adjusts the width of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/rendering/size/image-width)
   */
  w?: InputMaybe<Scalars['FloatType']['input']>;
};

enum ImgixParamsAuto {
  compress = 'compress',
  enhance = 'enhance',
  format = 'format',
  redeye = 'redeye'
}

enum ImgixParamsBgRemoveFgType {
  auto = 'auto',
  car = 'car'
}

enum ImgixParamsBlendAlign {
  bottom = 'bottom',
  center = 'center',
  left = 'left',
  middle = 'middle',
  right = 'right',
  top = 'top'
}

enum ImgixParamsBlendCrop {
  bottom = 'bottom',
  faces = 'faces',
  left = 'left',
  right = 'right',
  top = 'top'
}

enum ImgixParamsBlendFit {
  clamp = 'clamp',
  clip = 'clip',
  crop = 'crop',
  max = 'max',
  scale = 'scale'
}

enum ImgixParamsBlendMode {
  burn = 'burn',
  color = 'color',
  darken = 'darken',
  difference = 'difference',
  dodge = 'dodge',
  exclusion = 'exclusion',
  hardlight = 'hardlight',
  hue = 'hue',
  lighten = 'lighten',
  luminosity = 'luminosity',
  multiply = 'multiply',
  normal = 'normal',
  overlay = 'overlay',
  saturation = 'saturation',
  screen = 'screen',
  softlight = 'softlight'
}

enum ImgixParamsBlendSize {
  inherit = 'inherit'
}

enum ImgixParamsCh {
  dpr = 'dpr',
  saveData = 'saveData',
  width = 'width'
}

enum ImgixParamsCrop {
  bottom = 'bottom',
  edges = 'edges',
  entropy = 'entropy',
  faces = 'faces',
  focalpoint = 'focalpoint',
  left = 'left',
  right = 'right',
  top = 'top'
}

enum ImgixParamsCs {
  adobergb1998 = 'adobergb1998',
  origin = 'origin',
  srgb = 'srgb',
  strip = 'strip',
  tinysrgb = 'tinysrgb'
}

enum ImgixParamsFill {
  blur = 'blur',
  gen = 'gen',
  generative = 'generative',
  gradient = 'gradient',
  solid = 'solid'
}

enum ImgixParamsFillGenPos {
  bottom = 'bottom',
  center = 'center',
  left = 'left',
  middle = 'middle',
  right = 'right',
  top = 'top'
}

enum ImgixParamsFillGradientCs {
  hsl = 'hsl',
  lch = 'lch',
  linear = 'linear',
  oklab = 'oklab',
  srgb = 'srgb'
}

enum ImgixParamsFillGradientLinearDirection {
  bottom = 'bottom',
  left = 'left',
  right = 'right',
  top = 'top'
}

enum ImgixParamsFillGradientType {
  linear = 'linear',
  radial = 'radial'
}

enum ImgixParamsFit {
  clamp = 'clamp',
  clip = 'clip',
  crop = 'crop',
  facearea = 'facearea',
  fill = 'fill',
  fillmax = 'fillmax',
  max = 'max',
  min = 'min',
  scale = 'scale'
}

enum ImgixParamsFlip {
  h = 'h',
  hv = 'hv',
  v = 'v'
}

enum ImgixParamsFm {
  avif = 'avif',
  blurhash = 'blurhash',
  gif = 'gif',
  jp2 = 'jp2',
  jpg = 'jpg',
  json = 'json',
  jxr = 'jxr',
  mp4 = 'mp4',
  pjpg = 'pjpg',
  png = 'png',
  png8 = 'png8',
  png32 = 'png32',
  webm = 'webm',
  webp = 'webp'
}

enum ImgixParamsIptc {
  allow = 'allow',
  block = 'block'
}

enum ImgixParamsMarkAlign {
  bottom = 'bottom',
  center = 'center',
  left = 'left',
  middle = 'middle',
  right = 'right',
  top = 'top'
}

enum ImgixParamsMarkFit {
  clip = 'clip',
  crop = 'crop',
  fill = 'fill',
  max = 'max',
  scale = 'scale'
}

enum ImgixParamsMarkTile {
  grid = 'grid'
}

enum ImgixParamsPalette {
  css = 'css',
  json = 'json'
}

enum ImgixParamsRotType {
  pivot = 'pivot',
  straighten = 'straighten'
}

enum ImgixParamsTransparency {
  grid = 'grid'
}

enum ImgixParamsTrim {
  alpha = 'alpha',
  auto = 'auto',
  color = 'color'
}

enum ImgixParamsTxtAlign {
  bottom = 'bottom',
  center = 'center',
  left = 'left',
  middle = 'middle',
  right = 'right',
  top = 'top'
}

enum ImgixParamsTxtClip {
  ellipsis = 'ellipsis',
  end = 'end',
  middle = 'middle',
  start = 'start'
}

enum ImgixParamsTxtFit {
  max = 'max'
}

type InEnglishModelContentField = {
  __typename?: 'InEnglishModelContentField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type In English (in_english) */
type InEnglishRecord = RecordInterface & {
  __typename?: 'InEnglishRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  content: InEnglishModelContentField;
  id: Scalars['ItemId']['output'];
  title: Scalars['String']['output'];
};


/** Record of type In English (in_english) */
type InEnglishRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

/** Specifies how to filter by usage */
type InUseFilter = {
  /** Search uploads that are currently used by some record or not */
  eq?: InputMaybe<Scalars['BooleanType']['input']>;
};

/** Specifies how to filter Integer fields */
type IntegerFilter = {
  /** Search for records with an exact match */
  eq?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with a value that's strictly greater than the one specified */
  gt?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with a value that's less than the one specified */
  lt?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte?: InputMaybe<Scalars['IntType']['input']>;
  /** Exclude records with an exact match */
  neq?: InputMaybe<Scalars['IntType']['input']>;
};

/** Specifies how to filter by ID */
type ItemIdFilter = {
  /** Search the record with the specified ID */
  eq?: InputMaybe<Scalars['ItemId']['input']>;
  /** Search records with the specified IDs */
  in?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
  /** Exclude the record with the specified ID */
  neq?: InputMaybe<Scalars['ItemId']['input']>;
  /** Search records that do not have the specified IDs */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
};

enum ItemStatus {
  draft = 'draft',
  published = 'published',
  updated = 'updated'
}

/** Specifies how to filter Single-link fields */
type LinkFilter = {
  /** Search for records with an exact match. The specified value must be a Record ID */
  eq?: InputMaybe<Scalars['ItemId']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records linked to one of the specified records */
  in?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
  /** Exclude records with an exact match. The specified value must be a Record ID */
  neq?: InputMaybe<Scalars['ItemId']['input']>;
  /** Filter records not linked to one of the specified records */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
};

/** Specifies how to filter Multiple-links fields */
type LinksFilter = {
  /** Filter records linked to all of the specified records. The specified values must be Record IDs */
  allIn?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
  /** Filter records linked to at least one of the specified records. The specified values must be Record IDs */
  anyIn?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
  /** Search for records with an exact match. The specified values must be Record IDs */
  eq?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records not linked to any of the specified records. The specified values must be Record IDs */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ItemId']['input']>>>;
};

type MemberModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<MemberModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<MemberModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  address?: InputMaybe<StringFilter>;
  cardNumber?: InputMaybe<StringFilter>;
  city?: InputMaybe<StringFilter>;
  compartment?: InputMaybe<StringFilter>;
  contract?: InputMaybe<FileFilter>;
  email?: InputMaybe<StringFilter>;
  firstName?: InputMaybe<StringFilter>;
  id?: InputMaybe<ItemIdFilter>;
  lastName?: InputMaybe<StringFilter>;
  memberStatus?: InputMaybe<StringFilter>;
  notes?: InputMaybe<StringFilter>;
  phone?: InputMaybe<StringFilter>;
  phoneHome?: InputMaybe<StringFilter>;
  postalCode?: InputMaybe<StringFilter>;
  sex?: InputMaybe<StringFilter>;
  ssa?: InputMaybe<StringFilter>;
  user?: InputMaybe<StringFilter>;
  verificationToken?: InputMaybe<StringFilter>;
  workshops?: InputMaybe<LinksFilter>;
  yearlyFee?: InputMaybe<StringFilter>;
};

enum MemberModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  address_ASC = 'address_ASC',
  address_DESC = 'address_DESC',
  cardNumber_ASC = 'cardNumber_ASC',
  cardNumber_DESC = 'cardNumber_DESC',
  city_ASC = 'city_ASC',
  city_DESC = 'city_DESC',
  compartment_ASC = 'compartment_ASC',
  compartment_DESC = 'compartment_DESC',
  email_ASC = 'email_ASC',
  email_DESC = 'email_DESC',
  firstName_ASC = 'firstName_ASC',
  firstName_DESC = 'firstName_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  lastName_ASC = 'lastName_ASC',
  lastName_DESC = 'lastName_DESC',
  memberStatus_ASC = 'memberStatus_ASC',
  memberStatus_DESC = 'memberStatus_DESC',
  notes_ASC = 'notes_ASC',
  notes_DESC = 'notes_DESC',
  phoneHome_ASC = 'phoneHome_ASC',
  phoneHome_DESC = 'phoneHome_DESC',
  phone_ASC = 'phone_ASC',
  phone_DESC = 'phone_DESC',
  postalCode_ASC = 'postalCode_ASC',
  postalCode_DESC = 'postalCode_DESC',
  sex_ASC = 'sex_ASC',
  sex_DESC = 'sex_DESC',
  ssa_ASC = 'ssa_ASC',
  ssa_DESC = 'ssa_DESC',
  user_ASC = 'user_ASC',
  user_DESC = 'user_DESC',
  verificationToken_ASC = 'verificationToken_ASC',
  verificationToken_DESC = 'verificationToken_DESC',
  yearlyFee_ASC = 'yearlyFee_ASC',
  yearlyFee_DESC = 'yearlyFee_DESC'
}

/** Record of type Member (member) */
type MemberRecord = RecordInterface & {
  __typename?: 'MemberRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  address: Scalars['String']['output'];
  cardNumber?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  compartment?: Maybe<Scalars['String']['output']>;
  contract?: Maybe<FileField>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ItemId']['output'];
  lastName: Scalars['String']['output'];
  memberStatus: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  phoneHome?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  sex: Scalars['String']['output'];
  ssa: Scalars['String']['output'];
  user?: Maybe<Scalars['String']['output']>;
  verificationToken?: Maybe<Scalars['String']['output']>;
  workshops: Array<WorkshopRecord>;
  yearlyFee?: Maybe<Scalars['String']['output']>;
};


/** Record of type Member (member) */
type MemberRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

enum MuxThumbnailFormatType {
  gif = 'gif',
  jpg = 'jpg',
  png = 'png'
}

/** Specifies how to filter by image orientation */
type OrientationFilter = {
  /** Search uploads with the specified orientation */
  eq?: InputMaybe<UploadOrientation>;
  /** Exclude uploads with the specified orientation */
  neq?: InputMaybe<UploadOrientation>;
};

/** Specifies how to filter by position (sorted and tree-like collections) */
type PositionFilter = {
  /** Search for records with an exact match */
  eq?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with a value that's strictly greater than the one specified */
  gt?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with a value that's less than the one specified */
  lt?: InputMaybe<Scalars['IntType']['input']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte?: InputMaybe<Scalars['IntType']['input']>;
  /** Exclude records with an exact match */
  neq?: InputMaybe<Scalars['IntType']['input']>;
};

/** Specifies how to filter by publication datetime */
type PublishedAtFilter = {
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq?: InputMaybe<Scalars['DateTime']['input']>;
};

/** The query root for this schema */
type Query = {
  __typename?: 'Query';
  /** Returns meta information regarding a record collection */
  _allAboutsMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allBookingsMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allCoursesMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allEmailsMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allEquipmentMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allMembersMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allReportsMeta: CollectionMetadata;
  /** Returns meta information regarding an assets collection */
  _allUploadsMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allWorkshopsMeta: CollectionMetadata;
  /** Returns the single instance record */
  _site: Site;
  /** Returns a specific record */
  about?: Maybe<AboutRecord>;
  /** Returns a collection of records */
  allAbouts: Array<AboutRecord>;
  /** Returns a collection of records */
  allBookings: Array<BookingRecord>;
  /** Returns a collection of records */
  allCourses: Array<CourseRecord>;
  /** Returns a collection of records */
  allEmails: Array<EmailRecord>;
  /** Returns a collection of records */
  allEquipment: Array<EquipmentRecord>;
  /** Returns a collection of records */
  allMembers: Array<MemberRecord>;
  /** Returns a collection of records */
  allReports: Array<ReportRecord>;
  /** Returns a collection of assets */
  allUploads: Array<FileField>;
  /** Returns a collection of records */
  allWorkshops: Array<WorkshopRecord>;
  /** Returns a specific record */
  booking?: Maybe<BookingRecord>;
  /** Returns the single instance record */
  contact?: Maybe<ContactRecord>;
  /** Returns a specific record */
  course?: Maybe<CourseRecord>;
  /** Returns a specific record */
  email?: Maybe<EmailRecord>;
  /** Returns a specific record */
  equipment?: Maybe<EquipmentRecord>;
  /** Returns the single instance record */
  footer?: Maybe<FooterRecord>;
  /** Returns the single instance record */
  inEnglish?: Maybe<InEnglishRecord>;
  /** Returns a specific record */
  member?: Maybe<MemberRecord>;
  /** Returns a specific record */
  report?: Maybe<ReportRecord>;
  /** Returns the single instance record */
  signUpStart?: Maybe<SignUpStartRecord>;
  /** Returns the single instance record */
  start?: Maybe<StartRecord>;
  /** Returns a specific asset */
  upload?: Maybe<FileField>;
  /** Returns a specific record */
  workshop?: Maybe<WorkshopRecord>;
  /** Returns the single instance record */
  workshopsStart?: Maybe<WorkshopsStartRecord>;
};


/** The query root for this schema */
type Query_allAboutsMetaArgs = {
  filter?: InputMaybe<AboutModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allBookingsMetaArgs = {
  filter?: InputMaybe<BookingModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allCoursesMetaArgs = {
  filter?: InputMaybe<CourseModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allEmailsMetaArgs = {
  filter?: InputMaybe<EmailModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allEquipmentMetaArgs = {
  filter?: InputMaybe<EquipmentModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allMembersMetaArgs = {
  filter?: InputMaybe<MemberModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allReportsMetaArgs = {
  filter?: InputMaybe<ReportModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allUploadsMetaArgs = {
  filter?: InputMaybe<UploadFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_allWorkshopsMetaArgs = {
  filter?: InputMaybe<WorkshopModelFilter>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type Query_siteArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type QueryaboutArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<AboutModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<AboutModelOrderBy>>>;
};


/** The query root for this schema */
type QueryallAboutsArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<AboutModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<AboutModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallBookingsArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<BookingModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<BookingModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallCoursesArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<CourseModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<CourseModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallEmailsArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<EmailModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<EmailModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallEquipmentArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<EquipmentModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<EquipmentModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallMembersArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<MemberModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<MemberModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallReportsArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<ReportModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<ReportModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallUploadsArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<UploadFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<UploadOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QueryallWorkshopsArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<WorkshopModelFilter>;
  first?: InputMaybe<Scalars['IntType']['input']>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<WorkshopModelOrderBy>>>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
};


/** The query root for this schema */
type QuerybookingArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<BookingModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<BookingModelOrderBy>>>;
};


/** The query root for this schema */
type QuerycontactArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type QuerycourseArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<CourseModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<CourseModelOrderBy>>>;
};


/** The query root for this schema */
type QueryemailArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<EmailModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<EmailModelOrderBy>>>;
};


/** The query root for this schema */
type QueryequipmentArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<EquipmentModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<EquipmentModelOrderBy>>>;
};


/** The query root for this schema */
type QueryfooterArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type QueryinEnglishArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type QuerymemberArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<MemberModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<MemberModelOrderBy>>>;
};


/** The query root for this schema */
type QueryreportArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<ReportModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<ReportModelOrderBy>>>;
};


/** The query root for this schema */
type QuerysignUpStartArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type QuerystartArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


/** The query root for this schema */
type QueryuploadArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<UploadFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<UploadOrderBy>>>;
};


/** The query root for this schema */
type QueryworkshopArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  filter?: InputMaybe<WorkshopModelFilter>;
  locale?: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<WorkshopModelOrderBy>>>;
};


/** The query root for this schema */
type QueryworkshopsStartArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};

type RecordInterface = {
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  id: Scalars['ItemId']['output'];
};


type RecordInterface_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type ReportModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<ReportModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<ReportModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  booking?: InputMaybe<LinkFilter>;
  date?: InputMaybe<DateFilter>;
  days?: InputMaybe<IntegerFilter>;
  extraCost?: InputMaybe<IntegerFilter>;
  hours?: InputMaybe<IntegerFilter>;
  id?: InputMaybe<ItemIdFilter>;
  member?: InputMaybe<LinkFilter>;
  workshop?: InputMaybe<LinkFilter>;
};

enum ReportModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  date_ASC = 'date_ASC',
  date_DESC = 'date_DESC',
  days_ASC = 'days_ASC',
  days_DESC = 'days_DESC',
  extraCost_ASC = 'extraCost_ASC',
  extraCost_DESC = 'extraCost_DESC',
  hours_ASC = 'hours_ASC',
  hours_DESC = 'hours_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC'
}

/** Record of type Report (report) */
type ReportRecord = RecordInterface & {
  __typename?: 'ReportRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  assistants: Array<AssistantRecord>;
  booking?: Maybe<BookingRecord>;
  date: Scalars['Date']['output'];
  days?: Maybe<Scalars['IntType']['output']>;
  extraCost?: Maybe<Scalars['IntType']['output']>;
  hours?: Maybe<Scalars['IntType']['output']>;
  id: Scalars['ItemId']['output'];
  member: MemberRecord;
  workshop: WorkshopRecord;
};


/** Record of type Report (report) */
type ReportRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

/** Specifies how to filter by upload type */
type ResolutionFilter = {
  /** Search uploads with the specified resolution */
  eq?: InputMaybe<ResolutionType>;
  /** Search uploads with the specified resolutions */
  in?: InputMaybe<Array<InputMaybe<ResolutionType>>>;
  /** Exclude uploads with the specified resolution */
  neq?: InputMaybe<ResolutionType>;
  /** Search uploads without the specified resolutions */
  notIn?: InputMaybe<Array<InputMaybe<ResolutionType>>>;
};

enum ResolutionType {
  icon = 'icon',
  large = 'large',
  medium = 'medium',
  small = 'small'
}

type ResponsiveImage = {
  __typename?: 'ResponsiveImage';
  alt?: Maybe<Scalars['String']['output']>;
  aspectRatio: Scalars['FloatType']['output'];
  base64?: Maybe<Scalars['String']['output']>;
  bgColor?: Maybe<Scalars['String']['output']>;
  height: Scalars['IntType']['output'];
  sizes: Scalars['String']['output'];
  src: Scalars['String']['output'];
  srcSet: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  webpSrcSet: Scalars['String']['output'];
  width: Scalars['IntType']['output'];
};

type SeoField = {
  __typename?: 'SeoField';
  description?: Maybe<Scalars['String']['output']>;
  image?: Maybe<FileField>;
  noIndex?: Maybe<Scalars['BooleanType']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  twitterCard?: Maybe<Scalars['String']['output']>;
};

type SignUpStartModelIntroField = {
  __typename?: 'SignUpStartModelIntroField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type Sign up (start) (sign_up_start) */
type SignUpStartRecord = RecordInterface & {
  __typename?: 'SignUpStartRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  id: Scalars['ItemId']['output'];
  intro: SignUpStartModelIntroField;
  title: Scalars['String']['output'];
};


/** Record of type Sign up (start) (sign_up_start) */
type SignUpStartRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type Site = {
  __typename?: 'Site';
  favicon?: Maybe<FileField>;
  faviconMetaTags: Array<Tag>;
  globalSeo?: Maybe<GlobalSeoField>;
  locales: Array<SiteLocale>;
  noIndex?: Maybe<Scalars['BooleanType']['output']>;
};


type SitefaviconMetaTagsArgs = {
  variants?: InputMaybe<Array<InputMaybe<FaviconType>>>;
};


type SiteglobalSeoArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};

enum SiteLocale {
  sv = 'sv'
}

/** Specifies how to filter Slug fields */
type SlugFilter = {
  /** Search for records with an exact match */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Filter records that have one of the specified slugs */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude records with an exact match */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Filter records that do have one of the specified slugs */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

type StartModelAboutUsField = {
  __typename?: 'StartModelAboutUsField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type Start (start) */
type StartRecord = RecordInterface & {
  __typename?: 'StartRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  aboutUs?: Maybe<StartModelAboutUsField>;
  gallery: Array<GalleryImageRecord>;
  id: Scalars['ItemId']['output'];
  title?: Maybe<Scalars['String']['output']>;
};


/** Record of type Start (start) */
type StartRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

/** Specifies how to filter by status */
type StatusFilter = {
  /** Search the record with the specified status */
  eq?: InputMaybe<ItemStatus>;
  /** Search records with the specified statuses */
  in?: InputMaybe<Array<InputMaybe<ItemStatus>>>;
  /** Exclude the record with the specified status */
  neq?: InputMaybe<ItemStatus>;
  /** Search records without the specified statuses */
  notIn?: InputMaybe<Array<InputMaybe<ItemStatus>>>;
};

/** Specifies how to filter Single-line string fields */
type StringFilter = {
  /** Search for records with an exact match */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not [DEPRECATED] */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records that equal one of the specified values */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter records with the specified field set as blank (null or empty string) */
  isBlank?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with the specified field present (neither null, nor empty string) */
  isPresent?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude records with an exact match */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Filter records that do not equal one of the specified values */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude records based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

type StringMatchesFilter = {
  caseSensitive?: InputMaybe<Scalars['BooleanType']['input']>;
  pattern: Scalars['String']['input'];
  regexp?: InputMaybe<Scalars['BooleanType']['input']>;
};

/** Specifies how to filter Structured Text fields values */
type StructuredTextFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not [DEPRECATED] */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with the specified field set as blank (null or single empty paragraph) */
  isBlank?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with the specified field present (neither null, nor empty string) */
  isPresent?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude records based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

/** Block of type Supporter (supporter) */
type SupporterRecord = RecordInterface & {
  __typename?: 'SupporterRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  id: Scalars['ItemId']['output'];
  logo: FileField;
  name: Scalars['String']['output'];
};


/** Block of type Supporter (supporter) */
type SupporterRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type Tag = {
  __typename?: 'Tag';
  attributes?: Maybe<Scalars['MetaTagAttributes']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  tag: Scalars['String']['output'];
};

/** Specifies how to filter text fields */
type TextFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not [DEPRECATED] */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with the specified field set as blank (null or empty string) */
  isBlank?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with the specified field present (neither null, nor empty string) */
  isPresent?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude records based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by upload type */
type TypeFilter = {
  /** Search uploads with the specified type */
  eq?: InputMaybe<UploadType>;
  /** Search uploads with the specified types */
  in?: InputMaybe<Array<InputMaybe<UploadType>>>;
  /** Exclude uploads with the specified type */
  neq?: InputMaybe<UploadType>;
  /** Search uploads without the specified types */
  notIn?: InputMaybe<Array<InputMaybe<UploadType>>>;
};

/** Specifies how to filter by update datetime */
type UpdatedAtFilter = {
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Specifies how to filter by default alt */
type UploadAltFilter = {
  /** Search the uploads with the specified alt */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Filter uploads with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Search uploads with the specified values as default alt */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude the uploads with the specified alt */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Search uploads that do not have the specified values as default alt */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by auhtor */
type UploadAuthorFilter = {
  /** Filter uploads with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by basename */
type UploadBasenameFilter = {
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by colors */
type UploadColorsFilter = {
  /** Filter uploads that have all of the specified colors */
  allIn?: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
  /** Filter uploads that have at least one of the specified colors */
  anyIn?: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
  /** Filter uploads that have the specified colors */
  contains?: InputMaybe<ColorBucketType>;
  /** Search for uploads with an exact match */
  eq?: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
  /** Filter uploads that do not have any of the specified colors */
  notIn?: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
};

/** Specifies how to filter by copyright */
type UploadCopyrightFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by creation datetime */
type UploadCreatedAtFilter = {
  /** Search for uploads with an exact match */
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's strictly greater than the one specified */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's greater than or equal to the one specified */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's less than the one specified */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's less or equal than the one specified */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Exclude uploads with an exact match */
  neq?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Specifies how to filter by filename */
type UploadFilenameFilter = {
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

type UploadFilter = {
  AND?: InputMaybe<Array<InputMaybe<UploadFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<UploadFilter>>>;
  _createdAt?: InputMaybe<UploadCreatedAtFilter>;
  _updatedAt?: InputMaybe<UploadUpdatedAtFilter>;
  alt?: InputMaybe<UploadAltFilter>;
  author?: InputMaybe<UploadAuthorFilter>;
  basename?: InputMaybe<UploadBasenameFilter>;
  colors?: InputMaybe<UploadColorsFilter>;
  copyright?: InputMaybe<UploadCopyrightFilter>;
  filename?: InputMaybe<UploadFilenameFilter>;
  format?: InputMaybe<UploadFormatFilter>;
  height?: InputMaybe<UploadHeightFilter>;
  id?: InputMaybe<UploadIdFilter>;
  inUse?: InputMaybe<InUseFilter>;
  md5?: InputMaybe<UploadMd5Filter>;
  mimeType?: InputMaybe<UploadMimeTypeFilter>;
  notes?: InputMaybe<UploadNotesFilter>;
  orientation?: InputMaybe<OrientationFilter>;
  path?: InputMaybe<UploadPathFilter>;
  resolution?: InputMaybe<ResolutionFilter>;
  size?: InputMaybe<UploadSizeFilter>;
  smartTags?: InputMaybe<UploadTagsFilter>;
  tags?: InputMaybe<UploadTagsFilter>;
  title?: InputMaybe<UploadTitleFilter>;
  type?: InputMaybe<TypeFilter>;
  width?: InputMaybe<UploadWidthFilter>;
};

/** Specifies how to filter by format */
type UploadFormatFilter = {
  /** Search the asset with the specified format */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets with the specified formats */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude the asset with the specified format */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets that do not have the specified formats */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** Specifies how to filter by height */
type UploadHeightFilter = {
  /** Search assets with the specified height */
  eq?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger than the specified height */
  gt?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger or equal to the specified height */
  gte?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets smaller than the specified height */
  lt?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger or equal to the specified height */
  lte?: InputMaybe<Scalars['IntType']['input']>;
  /** Search assets that do not have the specified height */
  neq?: InputMaybe<Scalars['IntType']['input']>;
};

/** Specifies how to filter by ID */
type UploadIdFilter = {
  /** Search the asset with the specified ID */
  eq?: InputMaybe<Scalars['UploadId']['input']>;
  /** Search assets with the specified IDs */
  in?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
  /** Exclude the asset with the specified ID */
  neq?: InputMaybe<Scalars['UploadId']['input']>;
  /** Search assets that do not have the specified IDs */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['UploadId']['input']>>>;
};

/** Specifies how to filter by MD5 */
type UploadMd5Filter = {
  /** Search the asset with the specified MD5 */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets with the specified MD5s */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude the asset with the specified MD5 */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets that do not have the specified MD5s */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** Specifies how to filter by mime type */
type UploadMimeTypeFilter = {
  /** Search the asset with the specified mime type */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets with the specified mime types */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude the asset with the specified mime type */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets that do not have the specified mime types */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by notes */
type UploadNotesFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

enum UploadOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  basename_ASC = 'basename_ASC',
  basename_DESC = 'basename_DESC',
  filename_ASC = 'filename_ASC',
  filename_DESC = 'filename_DESC',
  format_ASC = 'format_ASC',
  format_DESC = 'format_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  mimeType_ASC = 'mimeType_ASC',
  mimeType_DESC = 'mimeType_DESC',
  resolution_ASC = 'resolution_ASC',
  resolution_DESC = 'resolution_DESC',
  size_ASC = 'size_ASC',
  size_DESC = 'size_DESC'
}

enum UploadOrientation {
  landscape = 'landscape',
  portrait = 'portrait',
  square = 'square'
}

/** Specifies how to filter by path */
type UploadPathFilter = {
  /** Search the asset with the specified path */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets with the specified paths */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude the asset with the specified path */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets that do not have the specified paths */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** Specifies how to filter by size */
type UploadSizeFilter = {
  /** Search assets with the specified size (in bytes) */
  eq?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger than the specified size (in bytes) */
  gt?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger or equal to the specified size (in bytes) */
  gte?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets smaller than the specified size (in bytes) */
  lt?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger or equal to the specified size (in bytes) */
  lte?: InputMaybe<Scalars['IntType']['input']>;
  /** Search assets that do not have the specified size (in bytes) */
  neq?: InputMaybe<Scalars['IntType']['input']>;
};

/** Specifies how to filter by tags */
type UploadTagsFilter = {
  /** Filter uploads linked to all of the specified tags */
  allIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter uploads linked to at least one of the specified tags */
  anyIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter uploads linked to the specified tag */
  contains?: InputMaybe<Scalars['String']['input']>;
  /** Search for uploads with an exact match */
  eq?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter uploads not linked to any of the specified tags */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Specifies how to filter by default title */
type UploadTitleFilter = {
  /** Search the asset with the specified title */
  eq?: InputMaybe<Scalars['String']['input']>;
  /** Filter assets with the specified field defined (i.e. with any value) or not */
  exists?: InputMaybe<Scalars['BooleanType']['input']>;
  /** Search assets with the specified as default title */
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Filter uploads based on a regular expression */
  matches?: InputMaybe<StringMatchesFilter>;
  /** Exclude the asset with the specified title */
  neq?: InputMaybe<Scalars['String']['input']>;
  /** Search assets that do not have the specified as default title */
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Exclude uploads based on a regular expression */
  notMatches?: InputMaybe<StringMatchesFilter>;
};

enum UploadType {
  archive = 'archive',
  audio = 'audio',
  image = 'image',
  pdfdocument = 'pdfdocument',
  presentation = 'presentation',
  richtext = 'richtext',
  spreadsheet = 'spreadsheet',
  video = 'video'
}

/** Specifies how to filter by update datetime */
type UploadUpdatedAtFilter = {
  /** Search for uploads with an exact match */
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's strictly greater than the one specified */
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's greater than or equal to the one specified */
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's less than the one specified */
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter uploads with a value that's less or equal than the one specified */
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  /** Exclude uploads with an exact match */
  neq?: InputMaybe<Scalars['DateTime']['input']>;
};

type UploadVideoField = {
  __typename?: 'UploadVideoField';
  alt?: Maybe<Scalars['String']['output']>;
  blurUpThumb?: Maybe<Scalars['String']['output']>;
  blurhash?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Int']['output']>;
  framerate?: Maybe<Scalars['Int']['output']>;
  height: Scalars['IntType']['output'];
  mp4Url?: Maybe<Scalars['String']['output']>;
  muxAssetId: Scalars['String']['output'];
  muxPlaybackId: Scalars['String']['output'];
  streamingUrl: Scalars['String']['output'];
  thumbhash?: Maybe<Scalars['String']['output']>;
  thumbnailUrl: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  width: Scalars['IntType']['output'];
};


type UploadVideoFieldaltArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};


type UploadVideoFieldblurUpThumbArgs = {
  imgixParams?: InputMaybe<ImgixParams>;
  punch?: Scalars['Float']['input'];
  quality?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
};


type UploadVideoFieldmp4UrlArgs = {
  exactRes?: InputMaybe<VideoMp4Res>;
  res?: InputMaybe<VideoMp4Res>;
};


type UploadVideoFieldthumbnailUrlArgs = {
  format?: InputMaybe<MuxThumbnailFormatType>;
};


type UploadVideoFieldtitleArgs = {
  fallbackLocales?: InputMaybe<Array<SiteLocale>>;
  locale?: InputMaybe<SiteLocale>;
};

/** Specifies how to filter by width */
type UploadWidthFilter = {
  /** Search assets with the specified width */
  eq?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger than the specified width */
  gt?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger or equal to the specified width */
  gte?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets smaller than the specified width */
  lt?: InputMaybe<Scalars['IntType']['input']>;
  /** Search all assets larger or equal to the specified width */
  lte?: InputMaybe<Scalars['IntType']['input']>;
  /** Search assets that do not have the specified width */
  neq?: InputMaybe<Scalars['IntType']['input']>;
};

enum VideoMp4Res {
  high = 'high',
  low = 'low',
  medium = 'medium'
}

type WorkshopModelFilter = {
  AND?: InputMaybe<Array<InputMaybe<WorkshopModelFilter>>>;
  OR?: InputMaybe<Array<InputMaybe<WorkshopModelFilter>>>;
  _createdAt?: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt?: InputMaybe<PublishedAtFilter>;
  _isValid?: InputMaybe<BooleanFilter>;
  _publicationScheduledAt?: InputMaybe<PublishedAtFilter>;
  _publishedAt?: InputMaybe<PublishedAtFilter>;
  _status?: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt?: InputMaybe<PublishedAtFilter>;
  _updatedAt?: InputMaybe<UpdatedAtFilter>;
  email?: InputMaybe<StringFilter>;
  equipment?: InputMaybe<LinksFilter>;
  equipmentPrice?: InputMaybe<StringFilter>;
  gallery?: InputMaybe<GalleryFilter>;
  id?: InputMaybe<ItemIdFilter>;
  image?: InputMaybe<FileFilter>;
  intro?: InputMaybe<StructuredTextFilter>;
  priceDay?: InputMaybe<IntegerFilter>;
  priceHour?: InputMaybe<IntegerFilter>;
  priceMonth?: InputMaybe<IntegerFilter>;
  priceWeek?: InputMaybe<IntegerFilter>;
  slug?: InputMaybe<SlugFilter>;
  text?: InputMaybe<StructuredTextFilter>;
  title?: InputMaybe<StringFilter>;
  titleLong?: InputMaybe<StringFilter>;
};

type WorkshopModelIntroField = {
  __typename?: 'WorkshopModelIntroField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

enum WorkshopModelOrderBy {
  _createdAt_ASC = '_createdAt_ASC',
  _createdAt_DESC = '_createdAt_DESC',
  _firstPublishedAt_ASC = '_firstPublishedAt_ASC',
  _firstPublishedAt_DESC = '_firstPublishedAt_DESC',
  _isValid_ASC = '_isValid_ASC',
  _isValid_DESC = '_isValid_DESC',
  _publicationScheduledAt_ASC = '_publicationScheduledAt_ASC',
  _publicationScheduledAt_DESC = '_publicationScheduledAt_DESC',
  _publishedAt_ASC = '_publishedAt_ASC',
  _publishedAt_DESC = '_publishedAt_DESC',
  _status_ASC = '_status_ASC',
  _status_DESC = '_status_DESC',
  _unpublishingScheduledAt_ASC = '_unpublishingScheduledAt_ASC',
  _unpublishingScheduledAt_DESC = '_unpublishingScheduledAt_DESC',
  _updatedAt_ASC = '_updatedAt_ASC',
  _updatedAt_DESC = '_updatedAt_DESC',
  email_ASC = 'email_ASC',
  email_DESC = 'email_DESC',
  equipmentPrice_ASC = 'equipmentPrice_ASC',
  equipmentPrice_DESC = 'equipmentPrice_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  priceDay_ASC = 'priceDay_ASC',
  priceDay_DESC = 'priceDay_DESC',
  priceHour_ASC = 'priceHour_ASC',
  priceHour_DESC = 'priceHour_DESC',
  priceMonth_ASC = 'priceMonth_ASC',
  priceMonth_DESC = 'priceMonth_DESC',
  priceWeek_ASC = 'priceWeek_ASC',
  priceWeek_DESC = 'priceWeek_DESC',
  titleLong_ASC = 'titleLong_ASC',
  titleLong_DESC = 'titleLong_DESC',
  title_ASC = 'title_ASC',
  title_DESC = 'title_DESC'
}

type WorkshopModelTextField = {
  __typename?: 'WorkshopModelTextField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type Worskhop (workshop) */
type WorkshopRecord = RecordInterface & {
  __typename?: 'WorkshopRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  equipment: Array<EquipmentRecord>;
  equipmentPrice?: Maybe<Scalars['String']['output']>;
  gallery: Array<FileField>;
  id: Scalars['ItemId']['output'];
  image: FileField;
  intro?: Maybe<WorkshopModelIntroField>;
  priceDay: Scalars['IntType']['output'];
  priceHour: Scalars['IntType']['output'];
  priceMonth: Scalars['IntType']['output'];
  priceWeek: Scalars['IntType']['output'];
  slug: Scalars['String']['output'];
  text?: Maybe<WorkshopModelTextField>;
  title: Scalars['String']['output'];
  titleLong?: Maybe<Scalars['String']['output']>;
};


/** Record of type Worskhop (workshop) */
type WorkshopRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type WorkshopsStartModelIntroField = {
  __typename?: 'WorkshopsStartModelIntroField';
  blocks: Array<Scalars['String']['output']>;
  inlineBlocks: Array<Scalars['String']['output']>;
  links: Array<Scalars['String']['output']>;
  value: Scalars['JsonField']['output'];
};

/** Record of type Workshops (start) (workshops_start) */
type WorkshopsStartRecord = RecordInterface & {
  __typename?: 'WorkshopsStartRecord';
  _createdAt: Scalars['DateTime']['output'];
  /** Editing URL */
  _editingUrl?: Maybe<Scalars['String']['output']>;
  _firstPublishedAt: Scalars['DateTime']['output'];
  _isValid: Scalars['BooleanType']['output'];
  _modelApiKey: Scalars['String']['output'];
  _publicationScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _publishedAt: Scalars['DateTime']['output'];
  /** Generates SEO and Social card meta tags to be used in your frontend */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  _updatedAt: Scalars['DateTime']['output'];
  id: Scalars['ItemId']['output'];
  intro: WorkshopsStartModelIntroField;
  title: Scalars['String']['output'];
};


/** Record of type Workshops (start) (workshops_start) */
type WorkshopsStartRecord_seoMetaTagsArgs = {
  locale?: InputMaybe<SiteLocale>;
};

type focalPoint = {
  __typename?: 'focalPoint';
  x: Scalars['FloatType']['output'];
  y: Scalars['FloatType']['output'];
};

type AboutQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


type AboutQuery = { __typename?: 'Query', about?: { __typename?: 'AboutRecord', title: string, headline: string, slug: string, intro?: { __typename?: 'AboutModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, content?: { __typename?: 'AboutModelContentField', value: any, links: Array<string>, blocks: Array<{ __typename: 'ImageRecord', id: any, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null }> } | null } | null };

type AllAboutsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type AllAboutsQuery = { __typename?: 'Query', allAbouts: Array<{ __typename?: 'AboutRecord', title: string, headline: string, slug: string, intro?: { __typename?: 'AboutModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }>, _allAboutsMeta: { __typename?: 'CollectionMetadata', count: any } };

type AboutFragment = { __typename?: 'AboutRecord', title: string, headline: string, slug: string, intro?: { __typename?: 'AboutModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, content?: { __typename?: 'AboutModelContentField', value: any, links: Array<string>, blocks: Array<{ __typename: 'ImageRecord', id: any, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null }> } | null };

type AboutLightFragment = { __typename?: 'AboutRecord', title: string, headline: string, slug: string, intro?: { __typename?: 'AboutModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null };

type BookingQueryVariables = Exact<{
  id: Scalars['ItemId']['input'];
}>;


type BookingQuery = { __typename?: 'Query', booking?: { __typename?: 'BookingRecord', id: any, note?: string | null, reported: any, start?: any | null, end?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string, phone: string, phoneHome?: string | null, sex: string, address: string, postalCode: string, city: string, ssa: string, cardNumber?: string | null, compartment?: string | null, workshops: Array<{ __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } }> } | null, workshop?: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null, report?: { __typename?: 'ReportRecord', id: any, date: any, days?: any | null, hours?: any | null, assistants: Array<{ __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null }>, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null };

type AllBookingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type AllBookingsQuery = { __typename?: 'Query', allBookings: Array<{ __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> }>, _allBookingsMeta: { __typename?: 'CollectionMetadata', count: any } };

type AllBookingsByMemberQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
  memberId?: InputMaybe<Scalars['ItemId']['input']>;
}>;


type AllBookingsByMemberQuery = { __typename?: 'Query', allBookings: Array<{ __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> }>, _allBookingsMeta: { __typename?: 'CollectionMetadata', count: any } };

type PastBookingsByMemberQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
  memberId?: InputMaybe<Scalars['ItemId']['input']>;
  now?: InputMaybe<Scalars['DateTime']['input']>;
}>;


type PastBookingsByMemberQuery = { __typename?: 'Query', allBookings: Array<{ __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> }>, _allBookingsMeta: { __typename?: 'CollectionMetadata', count: any } };

type FutureBookingsByMemberQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
  memberId?: InputMaybe<Scalars['ItemId']['input']>;
  now?: InputMaybe<Scalars['DateTime']['input']>;
}>;


type FutureBookingsByMemberQuery = { __typename?: 'Query', allBookings: Array<{ __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> }>, _allBookingsMeta: { __typename?: 'CollectionMetadata', count: any } };

type AllBookingsSearchQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
  end?: InputMaybe<Scalars['DateTime']['input']>;
  workshopId?: InputMaybe<Scalars['ItemId']['input']>;
}>;


type AllBookingsSearchQuery = { __typename?: 'Query', allBookings: Array<{ __typename?: 'BookingRecord', id: any, start?: any | null, end?: any | null, workshop?: { __typename?: 'WorkshopRecord', id: any, title: string } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, title: string, titleShort?: string | null, bookable: any, exclusive: any }> }>, _allBookingsMeta: { __typename?: 'CollectionMetadata', count: any } };

type BookingFragment = { __typename?: 'BookingRecord', id: any, note?: string | null, reported: any, start?: any | null, end?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string, phone: string, phoneHome?: string | null, sex: string, address: string, postalCode: string, city: string, ssa: string, cardNumber?: string | null, compartment?: string | null, workshops: Array<{ __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } }> } | null, workshop?: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null, report?: { __typename?: 'ReportRecord', id: any, date: any, days?: any | null, hours?: any | null, assistants: Array<{ __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null }>, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> };

type BookingLightFragment = { __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> };

type ContactQueryVariables = Exact<{ [key: string]: never; }>;


type ContactQuery = { __typename?: 'Query', contact?: { __typename?: 'ContactRecord', id: any, title: string, content: { __typename?: 'ContactModelContentField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } } | null };

type CourseQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


type CourseQuery = { __typename?: 'Query', course?: { __typename?: 'CourseRecord', id: any, title: string, price: any, start: any, end: any, slug: string, _updatedAt: any, _status: ItemStatus, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, intro: { __typename?: 'CourseModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any }, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } } | null };

type CourseByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ItemId']['input']>;
}>;


type CourseByIdQuery = { __typename?: 'Query', course?: { __typename?: 'CourseRecord', id: any, title: string, price: any, start: any, end: any, slug: string, _updatedAt: any, _status: ItemStatus, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, intro: { __typename?: 'CourseModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any }, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } } | null };

type AllCoursesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type AllCoursesQuery = { __typename?: 'Query', allCourses: Array<{ __typename?: 'CourseRecord', id: any, title: string, price: any, start: any, end: any, slug: string, _updatedAt: any, _status: ItemStatus, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, intro: { __typename?: 'CourseModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any }, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } }>, _allCoursesMeta: { __typename?: 'CollectionMetadata', count: any } };

type AllCoursesByMemberQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
  memberId?: InputMaybe<Scalars['ItemId']['input']>;
}>;


type AllCoursesByMemberQuery = { __typename?: 'Query', allCourses: Array<{ __typename?: 'CourseRecord', id: any, title: string, price: any, start: any, end: any, slug: string, _updatedAt: any, _status: ItemStatus, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } }>, _allCoursesMeta: { __typename?: 'CollectionMetadata', count: any } };

type AllComingCoursesQueryVariables = Exact<{
  today?: InputMaybe<Scalars['DateTime']['input']>;
}>;


type AllComingCoursesQuery = { __typename?: 'Query', allCourses: Array<{ __typename?: 'CourseRecord', id: any, title: string, price: any, start: any, end: any, slug: string, _updatedAt: any, _status: ItemStatus, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } }> };

type CourseFragment = { __typename?: 'CourseRecord', id: any, title: string, price: any, start: any, end: any, slug: string, _updatedAt: any, _status: ItemStatus, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, intro: { __typename?: 'CourseModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any }, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } };

type CourseLightFragment = { __typename?: 'CourseRecord', id: any, title: string, price: any, start: any, end: any, slug: string, _updatedAt: any, _status: ItemStatus, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } };

type EquipmentQueryVariables = Exact<{ [key: string]: never; }>;


type EquipmentQuery = { __typename?: 'Query', equipment?: { __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null } | null };

type AllEquipmentQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type AllEquipmentQuery = { __typename?: 'Query', allEquipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }>, _allEquipmentMeta: { __typename?: 'CollectionMetadata', count: any } };

type EquipmentFragment = { __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null };

type EquipmentLightFragment = { __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null };

type FooterQueryVariables = Exact<{ [key: string]: never; }>;


type FooterQuery = { __typename?: 'Query', footer?: { __typename?: 'FooterRecord', id: any, instagram: string, facebook: string, support: Array<{ __typename?: 'SupporterRecord', name: string, logo: { __typename?: 'FileField', url: string } }> } | null };

type FileFragment = { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string };

type ImageFragment = { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null };

type ImageThumbnailFragment = { __typename?: 'FileField', alt?: string | null, basename: string, format: string, height?: any | null, id: any, mimeType: string, size: any, title?: string | null, url: string, width?: any | null, responsiveImage?: { __typename?: 'ResponsiveImage', alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, height: any, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null, width: any } | null };

type MediaFragment = { __typename?: 'FileField', id: any, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, width?: any | null, height?: any | null, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null, video?: { __typename?: 'UploadVideoField', thumbnailUrl: string, streamingUrl: string, mp4Url?: string | null, framerate?: number | null, duration?: number | null, mp4high?: string | null, mp4med?: string | null, mp4low?: string | null } | null };

type SiteFragment = { __typename?: 'Site', locales: Array<SiteLocale>, faviconMetaTags: Array<{ __typename?: 'Tag', attributes?: any | null, content?: string | null, tag: string }>, globalSeo?: { __typename?: 'GlobalSeoField', facebookPageUrl?: string | null, siteName?: string | null, titleSuffix?: string | null, twitterAccount?: string | null, fallbackSeo?: { __typename?: 'SeoField', description?: string | null, title?: string | null, twitterCard?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null } | null } | null };

type GlobalQueryVariables = Exact<{
  locale?: InputMaybe<SiteLocale>;
}>;


type GlobalQuery = { __typename?: 'Query', site: { __typename?: 'Site', locales: Array<SiteLocale>, faviconMetaTags: Array<{ __typename?: 'Tag', attributes?: any | null, content?: string | null, tag: string }>, globalSeo?: { __typename?: 'GlobalSeoField', facebookPageUrl?: string | null, siteName?: string | null, titleSuffix?: string | null, twitterAccount?: string | null, fallbackSeo?: { __typename?: 'SeoField', description?: string | null, title?: string | null, twitterCard?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null } | null } | null } };

type InEnglishQueryVariables = Exact<{ [key: string]: never; }>;


type InEnglishQuery = { __typename?: 'Query', inEnglish?: { __typename?: 'InEnglishRecord', id: any, title: string, content: { __typename?: 'InEnglishModelContentField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } } | null };

type MemberQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


type MemberQuery = { __typename?: 'Query', member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string, phone: string, phoneHome?: string | null, sex: string, address: string, postalCode: string, city: string, ssa: string, cardNumber?: string | null, compartment?: string | null, workshops: Array<{ __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } }> } | null };

type AllMembersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type AllMembersQuery = { __typename?: 'Query', allMembers: Array<{ __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string, phone: string, phoneHome?: string | null, sex: string, address: string, postalCode: string, city: string, ssa: string, cardNumber?: string | null, compartment?: string | null, workshops: Array<{ __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } }> }>, _allMembersMeta: { __typename?: 'CollectionMetadata', count: any } };

type MemberFragment = { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string, phone: string, phoneHome?: string | null, sex: string, address: string, postalCode: string, city: string, ssa: string, cardNumber?: string | null, compartment?: string | null, workshops: Array<{ __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } }> };

type MemberLightFragment = { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string };

type ReportQueryVariables = Exact<{ [key: string]: never; }>;


type ReportQuery = { __typename?: 'Query', report?: { __typename?: 'ReportRecord', id: any, date: any, days?: any | null, hours?: any | null, extraCost?: any | null, assistants: Array<{ __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null }>, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, booking?: { __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } } | null };

type AllReportsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type AllReportsQuery = { __typename?: 'Query', allReports: Array<{ __typename?: 'ReportRecord', id: any, date: any, days?: any | null, hours?: any | null, extraCost?: any | null, assistants: Array<{ __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null }>, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, booking?: { __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } }>, _allReportsMeta: { __typename?: 'CollectionMetadata', count: any } };

type AllReportsByMemberQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
  memberId?: InputMaybe<Scalars['ItemId']['input']>;
}>;


type AllReportsByMemberQuery = { __typename?: 'Query', allReports: Array<{ __typename?: 'ReportRecord', id: any, date: any, days?: any | null, hours?: any | null, extraCost?: any | null, assistants: Array<{ __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null }>, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, booking?: { __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } }>, _allReportsMeta: { __typename?: 'CollectionMetadata', count: any } };

type ReportFragment = { __typename?: 'ReportRecord', id: any, date: any, days?: any | null, hours?: any | null, extraCost?: any | null, assistants: Array<{ __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null }>, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, booking?: { __typename?: 'BookingRecord', id: any, end?: any | null, note?: string | null, reported: any, start?: any | null, member?: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string } | null, workshop?: { __typename?: 'WorkshopRecord', email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, title: string, titleLong?: string | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } | null, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } } };

type ReportLightFragment = { __typename?: 'ReportRecord', id: any, date: any, days?: any | null, hours?: any | null, assistants: Array<{ __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null }>, member: { __typename?: 'MemberRecord', id: any, firstName: string, lastName: string, email: string }, workshop: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } };

type AssistantFragment = { __typename?: 'AssistantRecord', id: any, days?: any | null, hours?: any | null };

type SignUpStartQueryVariables = Exact<{ [key: string]: never; }>;


type SignUpStartQuery = { __typename?: 'Query', signUpStart?: { __typename?: 'SignUpStartRecord', id: any, title: string, intro: { __typename?: 'SignUpStartModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } } | null };

type SitemapQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type SitemapQuery = { __typename?: 'Query', allAbouts: Array<{ __typename?: 'AboutRecord', slug: string, _updatedAt: any }>, _allAboutsMeta: { __typename?: 'CollectionMetadata', count: any }, allWorkshops: Array<{ __typename?: 'WorkshopRecord', slug: string, _updatedAt: any }>, _allWorkshopsMeta: { __typename?: 'CollectionMetadata', count: any }, allCourses: Array<{ __typename?: 'CourseRecord', slug: string, _updatedAt: any }>, _allCoursesMeta: { __typename?: 'CollectionMetadata', count: any } };

type StartQueryVariables = Exact<{ [key: string]: never; }>;


type StartQuery = { __typename?: 'Query', start?: { __typename?: 'StartRecord', title?: string | null, gallery: Array<{ __typename?: 'GalleryImageRecord', image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, caption?: { __typename?: 'GalleryImageModelCaptionField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }>, aboutUs?: { __typename?: 'StartModelAboutUsField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null } | null, allWorkshops: Array<{ __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } }> };

type StartFragment = { __typename?: 'StartRecord', title?: string | null, gallery: Array<{ __typename?: 'GalleryImageRecord', image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, caption?: { __typename?: 'GalleryImageModelCaptionField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }>, aboutUs?: { __typename?: 'StartModelAboutUsField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null };

type WorkshopStartQueryVariables = Exact<{ [key: string]: never; }>;


type WorkshopStartQuery = { __typename?: 'Query', workshopsStart?: { __typename?: 'WorkshopsStartRecord', id: any, title: string, intro: { __typename?: 'WorkshopsStartModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } } | null };

type WorkshopQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


type WorkshopQuery = { __typename?: 'Query', workshop?: { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> } | null };

type AllWorkshopsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['IntType']['input']>;
  skip?: InputMaybe<Scalars['IntType']['input']>;
}>;


type AllWorkshopsQuery = { __typename?: 'Query', allWorkshops: Array<{ __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> }>, _allWorkshopsMeta: { __typename?: 'CollectionMetadata', count: any } };

type WorkshopFragment = { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, email?: string | null, priceDay: any, priceHour: any, priceMonth: any, priceWeek: any, slug: string, intro?: { __typename?: 'WorkshopModelIntroField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, text?: { __typename?: 'WorkshopModelTextField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }, gallery: Array<{ __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null }>, equipment: Array<{ __typename?: 'EquipmentRecord', id: any, bookable: any, exclusive: any, price?: string | null, title: string, titleShort?: string | null, image?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } | null, manual?: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string } | null, summary?: { __typename?: 'EquipmentModelSummaryField', blocks: Array<string>, inlineBlocks: Array<string>, links: Array<string>, value: any } | null }> };

type WorkshopLightFragment = { __typename?: 'WorkshopRecord', id: any, title: string, titleLong?: string | null, slug: string, image: { __typename?: 'FileField', id: any, width?: any | null, height?: any | null, alt?: string | null, basename: string, format: string, mimeType: string, size: any, title?: string | null, url: string, responsiveImage?: { __typename?: 'ResponsiveImage', width: any, height: any, alt?: string | null, aspectRatio: any, base64?: string | null, bgColor?: string | null, sizes: string, src: string, srcSet: string, webpSrcSet: string, title?: string | null } | null } };
