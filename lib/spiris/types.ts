export type SpirisTokenResponse = {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	token_type: string;
};

export type SpirisCustomer = {
	Id?: string;
	Name: string;
	EmailAddress?: string | null;
	MobilePhone?: string | null;
	Telephone?: string | null;
	InvoiceAddress1?: string | null;
	InvoiceAddress2?: string | null;
	InvoicePostalCode?: string;
	InvoiceCity?: string;
	InvoiceCountryCode?: string | null;
	DeliveryAddress1?: string | null;
	DeliveryAddress2?: string | null;
	DeliveryPostalCode?: string | null;
	DeliveryCity?: string | null;
	DeliveryCountryCode?: string | null;
	DeliveryCustomerName?: string | null;
	CustomerNumber?: string | null;
	CorporateIdentityNumber?: string | null;
	ContactPersonName?: string | null;
	ContactPersonEmail?: string | null;
	IsActive: boolean;
	IsPrivatePerson: boolean;
	TermsOfPaymentId: string;
	CurrencyCode?: string | null;
	Notes?: string | null;
	ReverseChargeOnConstructionServices?: boolean;
	GLN?: string | null;
	Iban?: string | null;
	VatNumber?: string | null;
	WebshopCustomerNumber?: number | null;
};

export type SpirisCustomerInvoiceDraftRow = {
	Id?: string;
	LineNumber?: number | null;
	ArticleId?: string | null;
	IsTextRow: boolean;
	Text?: string | null;
	UnitPrice?: number | null;
	Quantity?: number;
	DiscountPercentage?: number;
	WorkCostType?: number;
	IsWorkCost?: boolean;
	WorkHours?: number | null;
	MaterialCosts?: number | null;
	ReversedConstructionServicesVatFree: boolean;
	CostCenterItemId1?: string | null;
	CostCenterItemId2?: string | null;
	CostCenterItemId3?: string | null;
	ProjectId?: string | null;
};

export type SpirisCustomerInvoiceDraft = {
	Id?: string;
	CustomerId: string;
	IsCreditInvoice?: boolean;
	RotReducedInvoicingType: number;
	RotReducedInvoicingPropertyName?: string | null;
	RotReducedInvoicingOrgNumber?: string | null;
	RotReducedInvoicingAmount?: number;
	RotReducedInvoicingAutomaticDistribution?: boolean;
	RotPropertyType?: number | null;
	HouseWorkOtherCosts?: number | null;
	Rows?: SpirisCustomerInvoiceDraftRow[] | null;
	Persons?: unknown[] | null;
	YourReference?: string | null;
	OurReference?: string | null;
	BuyersOrderReference?: string | null;
	ElectronicReference?: string | null;
	SubscriptionNumber?: string | null;
	ContractNumber?: string | null;
	InvoiceCustomerName?: string | null;
	InvoiceAddress1?: string | null;
	InvoiceAddress2?: string | null;
	InvoicePostalCode?: string | null;
	InvoiceCity?: string | null;
	InvoiceCountryCode?: string | null;
	InvoiceCurrencyCode?: string | null;
	DeliveryCustomerName?: string | null;
	DeliveryAddress1?: string | null;
	DeliveryAddress2?: string | null;
	DeliveryPostalCode?: string | null;
	DeliveryCity?: string | null;
	DeliveryCountryCode?: string | null;
	DeliveryMethodId?: string | null;
	DeliveryTermId?: string | null;
};

export type SpirisInvoice = {
	Id: string;
	InvoiceNumber: number;
	CustomerId: string;
	CreatedUtc?: string;
	InvoiceDate?: string;
	DueDate?: string;
	TotalAmount?: number;
	VatAmount?: number;
	RotReducedInvoicingAmount?: number;
	RotReducedInvoicingType?: number;
	IsCreditInvoice?: boolean;
	CurrencyCode?: string;
	CustomerName?: string;
	YourReference?: string | null;
	OurReference?: string | null;
	Rows?: SpirisInvoiceRow[];
	Status?: string;
	TotalVatAmount?: number;
	TotalAmountIncVat?: number;
};

export type SpirisInvoiceRow = {
	Id?: string;
	ArticleNumber?: string;
	ArticleId?: string | null;
	IsTextRow?: boolean;
	Text?: string | null;
	UnitPrice?: number;
	Quantity?: number;
	DiscountPercentage?: number;
	AmountNoVat?: number;
	VatRate?: number | null;
	LineNumber?: number;
	CostCenterItemId1?: string | null;
	CostCenterItemId2?: string | null;
	CostCenterItemId3?: string | null;
	ProjectId?: string | null;
};

export type PaginationMeta = {
	CurrentPage: number;
	PageSize: number;
	TotalNumberOfPages: number;
	TotalNumberOfResults: number;
	ServerTimeUtc?: string;
};

export type PaginatedResponse<T> = {
	Data: T[];
	Meta: PaginationMeta;
};

export type SpirisArticle = {
	Id: string;
	Name: string;
	NameEnglish?: string;
	NetPrice: number;
};

export type SpirisUnit = {
	Id: string;
	Name: string;
	Code?: string;
	Abbreviation: string;
};

export type SpirisError = {
	ErrorCode?: number;
	DeveloperErrorMessage?: string;
	ErrorId?: string;
	Errors?: { code?: string; message?: string }[];
};
