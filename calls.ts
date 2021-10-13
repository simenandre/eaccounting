import * as rt from 'runtypes';
import { buildCall } from 'typical-fetch';

function pickQueryValues<T extends Record<string, unknown>, K extends keyof T>(
  subject: T,
  ...keys: K[]
): [key: string, val: string][] {
  return keys
    .map((key) => [key, subject[key]])
    .filter(([, val]) => val !== undefined)
    .map(([key, val]) => [key.toString(), val.toString()]);
}

function pickFromObject<T extends Record<string, unknown>, K extends keyof T>(
  subject: T,
  ...keys: K[]
): Pick<T, K> {
  const pairs = keys
    .map((key) => [key, subject[key]])
    .filter(([, val]) => val !== undefined)
    .map(([key, val]) => [key, val]);
  return Object.fromEntries(pairs);
}

function withRuntype<T>(validator: rt.Runtype<T>) {
  return (data: unknown) => {
    return validator.check(data);
  };
}

const defaultQuerySettingsRt = rt
  .Record({
    EnableExpand: rt.Boolean,
    EnableSelect: rt.Boolean,
    EnableCount: rt.Boolean,
    EnableOrderBy: rt.Boolean,
    EnableFilter: rt.Boolean,
    MaxTop: rt.Number,
  })
  .asPartial();

type DefaultQuerySettings = rt.Static<typeof defaultQuerySettingsRt>;

const iEdmSchemaElementRt = rt
  .Record({
    SchemaElementKind: rt.Number,
    Namespace: rt.String,
    Name: rt.String,
  })
  .asPartial()
  .asReadonly();

type IEdmSchemaElement = rt.Static<typeof iEdmSchemaElementRt>;

const iEdmTypeRt = rt.Record({ TypeKind: rt.Number }).asPartial().asReadonly();

type IEdmType = rt.Static<typeof iEdmTypeRt>;

const iEdmTypeReferenceRt = rt
  .Record({ IsNullable: rt.Boolean, Definition: iEdmTypeRt })
  .asPartial()
  .asReadonly();

type IEdmTypeReference = rt.Static<typeof iEdmTypeReferenceRt>;

const iEdmTermRt = rt
  .Record({
    Type: iEdmTypeReferenceRt,
    AppliesTo: rt.String,
    DefaultValue: rt.String,
    SchemaElementKind: rt.Number,
    Namespace: rt.String,
    Name: rt.String,
  })
  .asPartial()
  .asReadonly();

type IEdmTerm = rt.Static<typeof iEdmTermRt>;

const iEdmVocabularyAnnotatableRt = rt.Record({});

type IEdmVocabularyAnnotatable = rt.Static<typeof iEdmVocabularyAnnotatableRt>;

const iEdmExpressionRt = rt
  .Record({ ExpressionKind: rt.Number })
  .asPartial()
  .asReadonly();

type IEdmExpression = rt.Static<typeof iEdmExpressionRt>;

const iEdmVocabularyAnnotationRt = rt
  .Record({
    Qualifier: rt.String,
    Term: iEdmTermRt,
    Target: iEdmVocabularyAnnotatableRt,
    Value: iEdmExpressionRt,
  })
  .asPartial()
  .asReadonly();

type IEdmVocabularyAnnotation = rt.Static<typeof iEdmVocabularyAnnotationRt>;

const iEdmDirectValueAnnotationsManagerRt = rt.Record({});

type IEdmDirectValueAnnotationsManager = rt.Static<
  typeof iEdmDirectValueAnnotationsManagerRt
>;

type IEdmEntityContainerElement = {
  readonly ContainerElementKind?: number;
  readonly Container?: IEdmEntityContainer;
  readonly Name?: string;
};

const iEdmEntityContainerElementRt: rt.Runtype<IEdmEntityContainerElement> =
  rt.Lazy(() =>
    rt
      .Record({
        ContainerElementKind: rt.Number,
        Container: iEdmEntityContainerRt,
        Name: rt.String,
      })
      .asPartial()
      .asReadonly(),
  );

type IEdmEntityContainer = {
  readonly Elements?: IEdmEntityContainerElement[];
  readonly SchemaElementKind?: number;
  readonly Namespace?: string;
  readonly Name?: string;
};

const iEdmEntityContainerRt: rt.Runtype<IEdmEntityContainer> = rt.Lazy(() =>
  rt
    .Record({
      Elements: rt.Array(iEdmEntityContainerElementRt),
      SchemaElementKind: rt.Number,
      Namespace: rt.String,
      Name: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type IEdmModel = {
  readonly SchemaElements?: IEdmSchemaElement[];
  readonly VocabularyAnnotations?: IEdmVocabularyAnnotation[];
  readonly ReferencedModels?: IEdmModel[];
  readonly DeclaredNamespaces?: string[];
  readonly DirectValueAnnotationsManager?: IEdmDirectValueAnnotationsManager;
  readonly EntityContainer?: IEdmEntityContainer;
};

const iEdmModelRt: rt.Runtype<IEdmModel> = rt.Lazy(() =>
  rt
    .Record({
      SchemaElements: rt.Array(iEdmSchemaElementRt),
      VocabularyAnnotations: rt.Array(iEdmVocabularyAnnotationRt),
      ReferencedModels: rt.Array(iEdmModelRt),
      DeclaredNamespaces: rt.Array(rt.String),
      DirectValueAnnotationsManager: iEdmDirectValueAnnotationsManagerRt,
      EntityContainer: iEdmEntityContainerRt,
    })
    .asPartial()
    .asReadonly(),
);

type IEdmProperty = {
  readonly PropertyKind?: number;
  readonly Type?: IEdmTypeReference;
  readonly DeclaringType?: IEdmStructuredType;
  readonly Name?: string;
};

const iEdmPropertyRt: rt.Runtype<IEdmProperty> = rt.Lazy(() =>
  rt
    .Record({
      PropertyKind: rt.Number,
      Type: iEdmTypeReferenceRt,
      DeclaringType: iEdmStructuredTypeRt,
      Name: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type IEdmStructuredType = {
  readonly IsAbstract?: boolean;
  readonly IsOpen?: boolean;
  readonly BaseType?: IEdmStructuredType;
  readonly DeclaredProperties?: IEdmProperty[];
  readonly TypeKind?: number;
};

const iEdmStructuredTypeRt: rt.Runtype<IEdmStructuredType> = rt.Lazy(() =>
  rt
    .Record({
      IsAbstract: rt.Boolean,
      IsOpen: rt.Boolean,
      BaseType: iEdmStructuredTypeRt,
      DeclaredProperties: rt.Array(iEdmPropertyRt),
      TypeKind: rt.Number,
    })
    .asPartial()
    .asReadonly(),
);

const iEdmStructuralPropertyRt = rt
  .Record({
    DefaultValueString: rt.String,
    PropertyKind: rt.Number,
    Type: iEdmTypeReferenceRt,
    DeclaringType: iEdmStructuredTypeRt,
    Name: rt.String,
  })
  .asPartial()
  .asReadonly();

type IEdmStructuralProperty = rt.Static<typeof iEdmStructuralPropertyRt>;

const edmReferentialConstraintPropertyPairRt = rt
  .Record({
    DependentProperty: iEdmStructuralPropertyRt,
    PrincipalProperty: iEdmStructuralPropertyRt,
  })
  .asPartial()
  .asReadonly();

type EdmReferentialConstraintPropertyPair = rt.Static<
  typeof edmReferentialConstraintPropertyPairRt
>;

const iEdmReferentialConstraintRt = rt
  .Record({ PropertyPairs: rt.Array(edmReferentialConstraintPropertyPairRt) })
  .asPartial()
  .asReadonly();

type IEdmReferentialConstraint = rt.Static<typeof iEdmReferentialConstraintRt>;

type IEdmNavigationProperty = {
  readonly Partner?: IEdmNavigationProperty;
  readonly OnDelete?: number;
  readonly ContainsTarget?: boolean;
  readonly ReferentialConstraint?: IEdmReferentialConstraint;
  readonly PropertyKind?: number;
  readonly Type?: IEdmTypeReference;
  readonly DeclaringType?: IEdmStructuredType;
  readonly Name?: string;
};

const iEdmNavigationPropertyRt: rt.Runtype<IEdmNavigationProperty> = rt.Lazy(
  () =>
    rt
      .Record({
        Partner: iEdmNavigationPropertyRt,
        OnDelete: rt.Number,
        ContainsTarget: rt.Boolean,
        ReferentialConstraint: iEdmReferentialConstraintRt,
        PropertyKind: rt.Number,
        Type: iEdmTypeReferenceRt,
        DeclaringType: iEdmStructuredTypeRt,
        Name: rt.String,
      })
      .asPartial()
      .asReadonly(),
);

const iEdmPathExpressionRt = rt
  .Record({
    PathSegments: rt.Array(rt.String),
    Path: rt.String,
    ExpressionKind: rt.Number,
  })
  .asPartial()
  .asReadonly();

type IEdmPathExpression = rt.Static<typeof iEdmPathExpressionRt>;

type IEdmNavigationPropertyBinding = {
  readonly NavigationProperty?: IEdmNavigationProperty;
  readonly Target?: IEdmNavigationSource;
  readonly Path?: IEdmPathExpression;
};

const iEdmNavigationPropertyBindingRt: rt.Runtype<IEdmNavigationPropertyBinding> =
  rt.Lazy(() =>
    rt
      .Record({
        NavigationProperty: iEdmNavigationPropertyRt,
        Target: iEdmNavigationSourceRt,
        Path: iEdmPathExpressionRt,
      })
      .asPartial()
      .asReadonly(),
  );

type IEdmNavigationSource = {
  readonly NavigationPropertyBindings?: IEdmNavigationPropertyBinding[];
  readonly Path?: IEdmPathExpression;
  readonly Type?: IEdmType;
  readonly Name?: string;
};

const iEdmNavigationSourceRt: rt.Runtype<IEdmNavigationSource> = rt.Lazy(() =>
  rt
    .Record({
      NavigationPropertyBindings: rt.Array(iEdmNavigationPropertyBindingRt),
      Path: iEdmPathExpressionRt,
      Type: iEdmTypeRt,
      Name: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

const oDataPathSegmentRt = rt.Intersect(
  rt.Record({ Identifier: rt.String }).asPartial(),
  rt.Record({ EdmType: iEdmTypeRt }).asPartial().asReadonly(),
);

type ODataPathSegment = rt.Static<typeof oDataPathSegmentRt>;

const oDataPathRt = rt
  .Record({
    EdmType: iEdmTypeRt,
    NavigationSource: iEdmNavigationSourceRt,
    Segments: rt.Array(oDataPathSegmentRt),
    PathTemplate: rt.String,
    Path: rt.Array(oDataPathSegmentRt),
  })
  .asPartial()
  .asReadonly();

type ODataPath = rt.Static<typeof oDataPathRt>;

const iServiceProviderRt = rt.Record({});

type IServiceProvider = rt.Static<typeof iServiceProviderRt>;

const oDataQueryContextRt = rt
  .Record({
    DefaultQuerySettings: defaultQuerySettingsRt,
    Model: iEdmModelRt,
    ElementType: iEdmTypeRt,
    NavigationSource: iEdmNavigationSourceRt,
    ElementClrType: rt.String,
    Path: oDataPathRt,
    RequestContainer: iServiceProviderRt,
  })
  .asPartial()
  .asReadonly();

type ODataQueryContext = rt.Static<typeof oDataQueryContextRt>;

const oDataRawQueryOptionsRt = rt
  .Record({
    Filter: rt.String,
    Apply: rt.String,
    OrderBy: rt.String,
    Top: rt.String,
    Skip: rt.String,
    Select: rt.String,
    Expand: rt.String,
    Count: rt.String,
    Format: rt.String,
    SkipToken: rt.String,
    DeltaToken: rt.String,
  })
  .asPartial()
  .asReadonly();

type ODataRawQueryOptions = rt.Static<typeof oDataRawQueryOptionsRt>;

const selectExpandQueryValidatorRt = rt.Record({});

type SelectExpandQueryValidator = rt.Static<
  typeof selectExpandQueryValidatorRt
>;

const selectItemRt = rt.Record({});

type SelectItem = rt.Static<typeof selectItemRt>;

const selectExpandClauseRt = rt
  .Record({ SelectedItems: rt.Array(selectItemRt), AllSelected: rt.Boolean })
  .asPartial()
  .asReadonly();

type SelectExpandClause = rt.Static<typeof selectExpandClauseRt>;

const selectExpandQueryOptionRt = rt.Intersect(
  rt
    .Record({
      Validator: selectExpandQueryValidatorRt,
      LevelsMaxLiteralExpansionDepth: rt.Number,
    })
    .asPartial(),
  rt
    .Record({
      Context: oDataQueryContextRt,
      RawSelect: rt.String,
      RawExpand: rt.String,
      SelectExpandClause: selectExpandClauseRt,
    })
    .asPartial()
    .asReadonly(),
);

type SelectExpandQueryOption = rt.Static<typeof selectExpandQueryOptionRt>;

const transformationNodeRt = rt
  .Record({ Kind: rt.Number })
  .asPartial()
  .asReadonly();

type TransformationNode = rt.Static<typeof transformationNodeRt>;

const applyClauseRt = rt
  .Record({ Transformations: rt.Array(transformationNodeRt) })
  .asPartial()
  .asReadonly();

type ApplyClause = rt.Static<typeof applyClauseRt>;

const applyQueryOptionRt = rt
  .Record({
    Context: oDataQueryContextRt,
    ResultClrType: rt.String,
    ApplyClause: applyClauseRt,
    RawValue: rt.String,
  })
  .asPartial()
  .asReadonly();

type ApplyQueryOption = rt.Static<typeof applyQueryOptionRt>;

const filterQueryValidatorRt = rt.Record({});

type FilterQueryValidator = rt.Static<typeof filterQueryValidatorRt>;

const singleValueNodeRt = rt
  .Record({ TypeReference: iEdmTypeReferenceRt, Kind: rt.Number })
  .asPartial()
  .asReadonly();

type SingleValueNode = rt.Static<typeof singleValueNodeRt>;

const rangeVariableRt = rt
  .Record({
    Name: rt.String,
    TypeReference: iEdmTypeReferenceRt,
    Kind: rt.Number,
  })
  .asPartial()
  .asReadonly();

type RangeVariable = rt.Static<typeof rangeVariableRt>;

const filterClauseRt = rt
  .Record({
    Expression: singleValueNodeRt,
    RangeVariable: rangeVariableRt,
    ItemType: iEdmTypeReferenceRt,
  })
  .asPartial()
  .asReadonly();

type FilterClause = rt.Static<typeof filterClauseRt>;

const filterQueryOptionRt = rt.Intersect(
  rt.Record({ Validator: filterQueryValidatorRt }).asPartial(),
  rt
    .Record({
      Context: oDataQueryContextRt,
      FilterClause: filterClauseRt,
      RawValue: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type FilterQueryOption = rt.Static<typeof filterQueryOptionRt>;

const orderByNodeRt = rt
  .Record({ Direction: rt.Number })
  .asPartial()
  .asReadonly();

type OrderByNode = rt.Static<typeof orderByNodeRt>;

const orderByQueryValidatorRt = rt.Record({});

type OrderByQueryValidator = rt.Static<typeof orderByQueryValidatorRt>;

type OrderByClause = {
  readonly ThenBy?: OrderByClause;
  readonly Expression?: SingleValueNode;
  readonly Direction?: number;
  readonly RangeVariable?: RangeVariable;
  readonly ItemType?: IEdmTypeReference;
};

const orderByClauseRt: rt.Runtype<OrderByClause> = rt.Lazy(() =>
  rt
    .Record({
      ThenBy: orderByClauseRt,
      Expression: singleValueNodeRt,
      Direction: rt.Number,
      RangeVariable: rangeVariableRt,
      ItemType: iEdmTypeReferenceRt,
    })
    .asPartial()
    .asReadonly(),
);

const orderByQueryOptionRt = rt.Intersect(
  rt.Record({ Validator: orderByQueryValidatorRt }).asPartial(),
  rt
    .Record({
      Context: oDataQueryContextRt,
      OrderByNodes: rt.Array(orderByNodeRt),
      RawValue: rt.String,
      OrderByClause: orderByClauseRt,
    })
    .asPartial()
    .asReadonly(),
);

type OrderByQueryOption = rt.Static<typeof orderByQueryOptionRt>;

const skipQueryValidatorRt = rt.Record({});

type SkipQueryValidator = rt.Static<typeof skipQueryValidatorRt>;

const skipQueryOptionRt = rt.Intersect(
  rt.Record({ Validator: skipQueryValidatorRt }).asPartial(),
  rt
    .Record({
      Context: oDataQueryContextRt,
      RawValue: rt.String,
      Value: rt.Number,
    })
    .asPartial()
    .asReadonly(),
);

type SkipQueryOption = rt.Static<typeof skipQueryOptionRt>;

const topQueryValidatorRt = rt.Record({});

type TopQueryValidator = rt.Static<typeof topQueryValidatorRt>;

const topQueryOptionRt = rt.Intersect(
  rt.Record({ Validator: topQueryValidatorRt }).asPartial(),
  rt
    .Record({
      Context: oDataQueryContextRt,
      RawValue: rt.String,
      Value: rt.Number,
    })
    .asPartial()
    .asReadonly(),
);

type TopQueryOption = rt.Static<typeof topQueryOptionRt>;

const countQueryValidatorRt = rt.Record({});

type CountQueryValidator = rt.Static<typeof countQueryValidatorRt>;

const countQueryOptionRt = rt.Intersect(
  rt.Record({ Validator: countQueryValidatorRt }).asPartial(),
  rt
    .Record({
      Context: oDataQueryContextRt,
      RawValue: rt.String,
      Value: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type CountQueryOption = rt.Static<typeof countQueryOptionRt>;

const oDataQueryValidatorRt = rt.Record({});

type ODataQueryValidator = rt.Static<typeof oDataQueryValidatorRt>;

const oDataQueryOptionsAccountBalanceAPIRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsAccountBalanceAPI = rt.Static<
  typeof oDataQueryOptionsAccountBalanceAPIRt
>;

const paginationMetadataRt = rt
  .Record({
    CurrentPage: rt.Number,
    PageSize: rt.Number,
    TotalNumberOfPages: rt.Number,
    TotalNumberOfResults: rt.Number,
    ServerTimeUtc: rt.String,
  })
  .asPartial();

type PaginationMetadata = rt.Static<typeof paginationMetadataRt>;

const accountBalanceAPIRt = rt
  .Record({
    AccountNumber: rt.Number,
    AccountName: rt.String,
    Balance: rt.Number,
    AccountType: rt.Number,
    AccountTypeDescription: rt.String,
  })
  .asPartial()
  .asReadonly();

type AccountBalanceAPI = rt.Static<typeof accountBalanceAPIRt>;

const paginatedResponseAccountBalanceAPIRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(accountBalanceAPIRt) })
  .asPartial();

type PaginatedResponseAccountBalanceAPI = rt.Static<
  typeof paginatedResponseAccountBalanceAPIRt
>;

const oDataQueryOptionsAccountApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsAccountApi = rt.Static<
  typeof oDataQueryOptionsAccountApiRt
>;

const accountApiRt = rt.Intersect(
  rt
    .Record({
      Name: rt.String,
      Number: rt.String,
      VatCodeId: rt.String,
      FiscalYearId: rt.String,
      IsActive: rt.Boolean,
      IsProjectAllowed: rt.Boolean,
      IsCostCenterAllowed: rt.Boolean,
      IsBlockedForManualBooking: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      VatCodeDescription: rt.String,
      ReferenceCode: rt.String,
      Type: rt.Number,
      TypeDescription: rt.String,
      ModifiedUtc: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type AccountApi = rt.Static<typeof accountApiRt>;

const paginatedResponseAccountApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(accountApiRt) })
  .asPartial();

type PaginatedResponseAccountApi = rt.Static<
  typeof paginatedResponseAccountApiRt
>;

const oDataQueryOptionsStandardAccountApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsStandardAccountApi = rt.Static<
  typeof oDataQueryOptionsStandardAccountApiRt
>;

const standardAccountApiRt = rt
  .Record({ AccountType: rt.String, AccountNumber: rt.Number })
  .asPartial();

type StandardAccountApi = rt.Static<typeof standardAccountApiRt>;

const paginatedResponseStandardAccountApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(standardAccountApiRt) })
  .asPartial();

type PaginatedResponseStandardAccountApi = rt.Static<
  typeof paginatedResponseStandardAccountApiRt
>;

const oDataQueryOptionsAccountTypesAPIRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsAccountTypesAPI = rt.Static<
  typeof oDataQueryOptionsAccountTypesAPIRt
>;

const accountTypesAPIRt = rt
  .Record({ Type: rt.Number, TypeDescription: rt.String })
  .asPartial();

type AccountTypesAPI = rt.Static<typeof accountTypesAPIRt>;

const paginatedResponseAccountTypesAPIRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(accountTypesAPIRt) })
  .asPartial();

type PaginatedResponseAccountTypesAPI = rt.Static<
  typeof paginatedResponseAccountTypesAPIRt
>;

const oDataQueryOptionsAllocationPeriodApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsAllocationPeriodApi = rt.Static<
  typeof oDataQueryOptionsAllocationPeriodApiRt
>;

const allocationPeriodRowApiRt = rt
  .Record({
    Id: rt.String,
    AllocationPeriodId: rt.String,
    AccountNumber: rt.Number,
    Amount: rt.Number,
    Quantity: rt.Number,
    Weight: rt.Number,
    DebitCredit: rt.Number,
  })
  .asPartial();

type AllocationPeriodRowApi = rt.Static<typeof allocationPeriodRowApiRt>;

const allocationPeriodApiRt = rt.Intersect(
  rt
    .Record({
      Id: rt.String,
      SupplierInvoiceId: rt.String,
      SupplierInvoiceRow: rt.Number,
      ManualVoucherId: rt.String,
      ManualVoucherRow: rt.Number,
      AllocationPeriodSourceType: rt.Number,
      Status: rt.Number,
      CostCenterItemId1: rt.String,
      CostCenterItemId2: rt.String,
      CostCenterItemId3: rt.String,
      ProjectId: rt.String,
      BookkeepingDate: rt.String,
      CreatedUtc: rt.String,
      Rows: rt.Array(allocationPeriodRowApiRt),
    })
    .asPartial(),
  rt
    .Record({
      DebitAccountNumber: rt.Number,
      CreditAccountNumber: rt.Number,
      Amount: rt.Number,
    })
    .asPartial()
    .asReadonly(),
);

type AllocationPeriodApi = rt.Static<typeof allocationPeriodApiRt>;

const paginatedResponseAllocationPeriodApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(allocationPeriodApiRt) })
  .asPartial();

type PaginatedResponseAllocationPeriodApi = rt.Static<
  typeof paginatedResponseAllocationPeriodApiRt
>;

const allocationPlanRt = rt
  .Record({
    SupplierInvoiceId: rt.String,
    SupplierInvoiceRow: rt.Number,
    VoucherId: rt.String,
    VoucherRow: rt.Number,
    BookkeepingStartDate: rt.String,
    AmountToAllocate: rt.Number,
    QuantityToAllocate: rt.Number,
    WeightToAllocate: rt.Number,
    AllocationAccountNumber: rt.Number,
    NumberOfAllocationPeriods: rt.Number,
  })
  .asPartial();

type AllocationPlan = rt.Static<typeof allocationPlanRt>;

const approvalApiRt = rt
  .Record({
    DocumentApprovalStatus: rt.Number,
    RejectionMessage: rt.String,
    RejectionMessageReceivers: rt.Array(rt.String),
  })
  .asPartial();

type ApprovalApi = rt.Static<typeof approvalApiRt>;

const documentApprovalEventApiRt = rt
  .Record({
    DocumentApprovalStatus: rt.Number,
    CreatedUtc: rt.String,
    CreatedByUserId: rt.String,
  })
  .asPartial();

type DocumentApprovalEventApi = rt.Static<typeof documentApprovalEventApiRt>;

const vatReportApiRt = rt
  .Record({
    Id: rt.String,
    Name: rt.String,
    StartDate: rt.String,
    EndDate: rt.String,
    DocumentApprovalStatus: rt.Number,
    DocumentId: rt.String,
    CreatedUtc: rt.String,
    IsRegretted: rt.Boolean,
    RegrettedByUserId: rt.String,
    RegrettedDate: rt.String,
    ModifiedUtc: rt.String,
    SentForApprovalByUserId: rt.String,
    VoucherId: rt.String,
    TotalAmount: rt.Number,
    ApprovalEventsHistory: rt.Array(documentApprovalEventApiRt),
  })
  .asPartial();

type VatReportApi = rt.Static<typeof vatReportApiRt>;

const oDataQueryOptionsAppStoreActivationStatusApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsAppStoreActivationStatusApi = rt.Static<
  typeof oDataQueryOptionsAppStoreActivationStatusApiRt
>;

const appStoreActivationStatusApiRt = rt
  .Record({
    Id: rt.String,
    ActivationStatus: rt.Number,
    ModifiedUtc: rt.String,
  })
  .asPartial();

type AppStoreActivationStatusApi = rt.Static<
  typeof appStoreActivationStatusApiRt
>;

const paginatedResponseAppStoreActivationStatusApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(appStoreActivationStatusApiRt),
  })
  .asPartial();

type PaginatedResponseAppStoreActivationStatusApi = rt.Static<
  typeof paginatedResponseAppStoreActivationStatusApiRt
>;

const oDataQueryOptionsArticleAccountCodingApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsArticleAccountCodingApi = rt.Static<
  typeof oDataQueryOptionsArticleAccountCodingApiRt
>;

const articleAccountCodingAPIRt = rt.Intersect(
  rt
    .Record({
      Name: rt.String,
      NameEnglish: rt.String,
      Type: rt.String,
      VatRate: rt.String,
      IsActive: rt.Boolean,
      VatRatePercent: rt.Number,
      DomesticSalesSubjectToReversedConstructionVatAccountNumber: rt.Number,
      DomesticSalesSubjectToVatAccountNumber: rt.Number,
      DomesticSalesVatExemptAccountNumber: rt.Number,
      ForeignSalesSubjectToMossAccountNumber: rt.Number,
      ForeignSalesSubjectToThirdPartySalesAccountNumber: rt.Number,
      ForeignSalesSubjectToVatWithinEuAccountNumber: rt.Number,
      ForeignSalesVatExemptOutsideEuAccountNumber: rt.Number,
      ForeignSalesVatExemptWithinEuAccountNumber: rt.Number,
      DomesticSalesVatCodeExemptAccountNumber: rt.Number,
    })
    .asPartial(),
  rt.Record({ Id: rt.String, ChangedUtc: rt.String }).asPartial().asReadonly(),
);

type ArticleAccountCodingAPI = rt.Static<typeof articleAccountCodingAPIRt>;

const paginatedResponseArticleAccountCodingApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(articleAccountCodingAPIRt),
  })
  .asPartial();

type PaginatedResponseArticleAccountCodingApi = rt.Static<
  typeof paginatedResponseArticleAccountCodingApiRt
>;

const oDataQueryOptionsArticleLabelApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsArticleLabelApi = rt.Static<
  typeof oDataQueryOptionsArticleLabelApiRt
>;

const articleLabelApiRt = rt.Intersect(
  rt.Record({ Name: rt.String, Description: rt.String }).asPartial(),
  rt.Record({ Id: rt.String }).asPartial().asReadonly(),
);

type ArticleLabelApi = rt.Static<typeof articleLabelApiRt>;

const paginatedResponseArticleLabelApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(articleLabelApiRt) })
  .asPartial();

type PaginatedResponseArticleLabelApi = rt.Static<
  typeof paginatedResponseArticleLabelApiRt
>;

const oDataQueryOptionsArticleApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsArticleApi = rt.Static<
  typeof oDataQueryOptionsArticleApiRt
>;

const articleBarcodeApiRt = rt
  .Record({ Barcode: rt.String, BarcodeType: rt.Number })
  .asPartial();

type ArticleBarcodeApi = rt.Static<typeof articleBarcodeApiRt>;

const articleApiRt = rt.Intersect(
  rt
    .Record({
      IsActive: rt.Boolean,
      Number: rt.String,
      Name: rt.String,
      NameEnglish: rt.String,
      NetPrice: rt.Number,
      GrossPrice: rt.Number,
      CodingId: rt.String,
      UnitId: rt.String,
      StockBalance: rt.Number,
      HouseWorkType: rt.Number,
      PurchasePrice: rt.Number,
      SendToWebshop: rt.Boolean,
      UsesMoss: rt.Boolean,
      ArticleLabels: rt.Array(articleLabelApiRt),
      IsStock: rt.Boolean,
      StockLocationReference: rt.String,
      FreightCosts: rt.Number,
      UpdateStockPrices: rt.Boolean,
      Barcodes: rt.Array(articleBarcodeApiRt),
      GreenTechnologyType: rt.Number,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      CodingName: rt.String,
      UnitName: rt.String,
      UnitAbbreviation: rt.String,
      StockBalanceManuallyChangedUtc: rt.String,
      StockBalanceReserved: rt.Number,
      StockBalanceAvailable: rt.Number,
      CreatedUtc: rt.String,
      ChangedUtc: rt.String,
      PurchasePriceManuallyChangedUtc: rt.String,
      FreightCostsManuallyChangedUtc: rt.String,
      StockValue: rt.Number,
    })
    .asPartial()
    .asReadonly(),
);

type ArticleApi = rt.Static<typeof articleApiRt>;

const paginatedResponseArticleApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(articleApiRt) })
  .asPartial();

type PaginatedResponseArticleApi = rt.Static<
  typeof paginatedResponseArticleApiRt
>;

const attachmentLinkApiRt = rt
  .Record({
    DocumentId: rt.String,
    DocumentType: rt.Number,
    AttachmentIds: rt.Array(rt.String),
  })
  .asPartial();

type AttachmentLinkApi = rt.Static<typeof attachmentLinkApiRt>;

const oDataQueryOptionsAttachmentResultApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsAttachmentResultApi = rt.Static<
  typeof oDataQueryOptionsAttachmentResultApiRt
>;

const attachmentResultApiRt = rt.Intersect(
  rt
    .Record({
      ContentType: rt.String,
      DocumentId: rt.String,
      AttachedDocumentType: rt.Number,
      FileName: rt.String,
      TemporaryUrl: rt.String,
      Comment: rt.String,
      SupplierName: rt.String,
      AmountInvoiceCurrency: rt.Number,
      Type: rt.Number,
      AttachmentStatus: rt.Number,
    })
    .asPartial(),
  rt
    .Record({ Id: rt.String, UploadedBy: rt.String, ImageDate: rt.String })
    .asPartial()
    .asReadonly(),
);

type AttachmentResultApi = rt.Static<typeof attachmentResultApiRt>;

const paginatedResponseAttachmentResultApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(attachmentResultApiRt) })
  .asPartial();

type PaginatedResponseAttachmentResultApi = rt.Static<
  typeof paginatedResponseAttachmentResultApiRt
>;

const attachmentUploadApiRt = rt
  .Record({
    Id: rt.String,
    ContentType: rt.String,
    FileName: rt.String,
    Data: rt.String,
    Url: rt.String,
  })
  .asPartial();

type AttachmentUploadApi = rt.Static<typeof attachmentUploadApiRt>;

const oDataQueryOptionsBankAccountApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsBankAccountApi = rt.Static<
  typeof oDataQueryOptionsBankAccountApiRt
>;

const bankAccountApiRt = rt.Intersect(
  rt
    .Record({
      Bank: rt.String,
      BankAccountType: rt.Number,
      Bban: rt.String,
      Iban: rt.String,
      Name: rt.String,
      IsActive: rt.Boolean,
      LedgerAccountNumber: rt.Number,
      HasActiveBankAgreement: rt.Boolean,
      IsDefaultChequeAccount: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      BankAccountTypeDescription: rt.String,
      Id: rt.String,
      CurrencyCode: rt.String,
      ModifiedUtc: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type BankAccountApi = rt.Static<typeof bankAccountApiRt>;

const paginatedResponseBankAccountApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(bankAccountApiRt) })
  .asPartial();

type PaginatedResponseBankAccountApi = rt.Static<
  typeof paginatedResponseBankAccountApiRt
>;

const oDataQueryOptionsBankTransactionApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsBankTransactionApi = rt.Static<
  typeof oDataQueryOptionsBankTransactionApiRt
>;

const bankTransactionRowApiRt = rt
  .Record({
    PaymentVoucherId: rt.String,
    PaymentVoucherNumber: rt.String,
    AmountTransactionCurrency: rt.Number,
    Number: rt.String,
    Name: rt.String,
    Reference: rt.String,
    Source: rt.String,
    SourceId: rt.String,
    VoucherId: rt.String,
  })
  .asPartial();

type BankTransactionRowApi = rt.Static<typeof bankTransactionRowApiRt>;

const bankTransactionApiRt = rt
  .Record({
    Id: rt.String,
    TransactionDate: rt.String,
    IsReconciled: rt.Boolean,
    Reference: rt.String,
    OriginalAmount: rt.Number,
    ChargeAmount: rt.Number,
    ChargeCurrency: rt.String,
    TransactionAmount: rt.Number,
    TransactionAmountCurrency: rt.String,
    OriginalCurrency: rt.String,
    Rows: rt.Array(bankTransactionRowApiRt),
  })
  .asPartial();

type BankTransactionApi = rt.Static<typeof bankTransactionApiRt>;

const paginatedResponseBankTransactionApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(bankTransactionApiRt) })
  .asPartial();

type PaginatedResponseBankTransactionApi = rt.Static<
  typeof paginatedResponseBankTransactionApiRt
>;

const oDataQueryOptionsBankApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsBankApi = rt.Static<typeof oDataQueryOptionsBankApiRt>;

const bankApiRt = rt.Record({ Id: rt.String, Name: rt.String }).asPartial();

type BankApi = rt.Static<typeof bankApiRt>;

const paginatedResponseBankApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(bankApiRt) })
  .asPartial();

type PaginatedResponseBankApi = rt.Static<typeof paginatedResponseBankApiRt>;

const oDataQueryOptionsCompanySettingsApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCompanySettingsApi = rt.Static<
  typeof oDataQueryOptionsCompanySettingsApiRt
>;

const taxDeclarationDateApiRt = rt
  .Record({ Month: rt.Number, Day: rt.Number })
  .asPartial();

type TaxDeclarationDateApi = rt.Static<typeof taxDeclarationDateApiRt>;

const companyTextsApiRt = rt
  .Record({
    CustomerInvoiceTextDomestic: rt.String,
    CustomerInvoiceTextForeign: rt.String,
    OrderTextDomestic: rt.String,
    OrderTextForeign: rt.String,
    OverDueTextDomestic: rt.String,
    OverDueTextForeign: rt.String,
  })
  .asPartial();

type CompanyTextsApi = rt.Static<typeof companyTextsApiRt>;

const autoInvoiceApiRt = rt
  .Record({
    AutoInvoiceActivationStatus: rt.Number,
    AutoInvoiceB2CStatus: rt.Number,
    AutoInvoiceInboundStatus: rt.Number,
  })
  .asPartial()
  .asReadonly();

type AutoInvoiceApi = rt.Static<typeof autoInvoiceApiRt>;

const approvalSettingsApiRt = rt
  .Record({
    UsesSupplierInvoiceApproval: rt.Boolean,
    UsesVatReportApproval: rt.Boolean,
  })
  .asPartial()
  .asReadonly();

type ApprovalSettingsApi = rt.Static<typeof approvalSettingsApiRt>;

const companyRotRutSettingsApiRt = rt
  .Record({
    RutMaxAmountForPersBelow65Year: rt.Number,
    RutMaxAmountForPersOver65Year: rt.Number,
    RutReducedInvoicingPercent: rt.Number,
    RotReducedInvoicingMaxAmount: rt.Number,
    RotReducedInvoicingPercent: rt.Number,
  })
  .asPartial();

type CompanyRotRutSettingsApi = rt.Static<typeof companyRotRutSettingsApiRt>;

const companySettingsApiRt = rt.Intersect(
  rt
    .Record({
      Name: rt.String,
      Email: rt.String,
      Phone: rt.String,
      MobilePhone: rt.String,
      Address1: rt.String,
      Address2: rt.String,
      CountryCode: rt.String,
      PostalCode: rt.String,
      City: rt.String,
      Website: rt.String,
      BankGiro: rt.String,
      PlusGiro: rt.String,
      CompanyText: companyTextsApiRt,
      UsesMoss: rt.Boolean,
      UsesPaymentReferenceNumber: rt.Boolean,
      AutoInvoice: autoInvoiceApiRt,
      ApprovalSettings: approvalSettingsApiRt,
      UsesReverseConstructionVat: rt.Boolean,
      UsesRotReducedInvoicing: rt.Boolean,
      BankgiroNumberPrint: rt.String,
      KeepOriginalDraftDate: rt.Boolean,
      UsePaymentFilesForOutgoingPayments: rt.Boolean,
      UseAutomaticVatCalculation: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      CurrencyCode: rt.String,
      TermsOfPaymentId: rt.String,
      CorporateIdentityNumber: rt.String,
      VatCode: rt.String,
      BankAccount: rt.String,
      Iban: rt.String,
      AccountingLockedTo: rt.String,
      AccountingLockInterval: rt.Number,
      TaxDeclarationDate: taxDeclarationDateApiRt,
      Gln: rt.String,
      ProductVariant: rt.Number,
      TypeOfBusiness: rt.Number,
      VatPeriod: rt.Number,
      ActivatedModules: rt.Array(rt.String),
      NextCustomerNumber: rt.Number,
      NextSupplierNumber: rt.Number,
      NextCustomerInvoiceNumber: rt.Number,
      NextQuoteNumber: rt.Number,
      ShowPricesExclVatPC: rt.Boolean,
      IsPayslipActivated: rt.Boolean,
      DomesticCurrencyRounding: rt.Number,
      CompanyRotRutSettings: companyRotRutSettingsApiRt,
      CompanyStatus: rt.Number,
      CompanyIdentifier: rt.String,
      ShowCostCenterReminder: rt.Boolean,
      ShowProjectReminder: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type CompanySettingsApi = rt.Static<typeof companySettingsApiRt>;

const accountingLockDateApiRt = rt
  .Record({ Year: rt.Number, Month: rt.Number })
  .asPartial();

type AccountingLockDateApi = rt.Static<typeof accountingLockDateApiRt>;

const accountingLockSettingsApiRt = rt
  .Record({
    AccountingLockedAsOf: accountingLockDateApiRt,
    AccountingLockInterval: rt.Number,
    TaxDeclarationDate: taxDeclarationDateApiRt,
  })
  .asPartial();

type AccountingLockSettingsApi = rt.Static<typeof accountingLockSettingsApiRt>;

const oDataQueryOptionsCostCenterItemApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCostCenterItemApi = rt.Static<
  typeof oDataQueryOptionsCostCenterItemApiRt
>;

const costCenterItemApiRt = rt.Intersect(
  rt
    .Record({
      CostCenterId: rt.String,
      Name: rt.String,
      ShortName: rt.String,
      IsActive: rt.Boolean,
    })
    .asPartial(),
  rt.Record({ Id: rt.String, CreatedUtc: rt.String }).asPartial().asReadonly(),
);

type CostCenterItemApi = rt.Static<typeof costCenterItemApiRt>;

const oDataQueryOptionsCostCenterApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCostCenterApi = rt.Static<
  typeof oDataQueryOptionsCostCenterApiRt
>;

const costCenterApiRt = rt.Intersect(
  rt
    .Record({
      Name: rt.String,
      IsActive: rt.Boolean,
      Items: rt.Array(costCenterItemApiRt),
    })
    .asPartial(),
  rt.Record({ Number: rt.Number, Id: rt.String }).asPartial().asReadonly(),
);

type CostCenterApi = rt.Static<typeof costCenterApiRt>;

const paginatedResponseCostCenterApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(costCenterApiRt) })
  .asPartial();

type PaginatedResponseCostCenterApi = rt.Static<
  typeof paginatedResponseCostCenterApiRt
>;

const oDataQueryOptionsCountryApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCountryApi = rt.Static<
  typeof oDataQueryOptionsCountryApiRt
>;

const countryApiRt = rt
  .Record({ Name: rt.String, Code: rt.String, IsEuMember: rt.Boolean })
  .asPartial();

type CountryApi = rt.Static<typeof countryApiRt>;

const paginatedResponseCountryApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(countryApiRt) })
  .asPartial();

type PaginatedResponseCountryApi = rt.Static<
  typeof paginatedResponseCountryApiRt
>;

const oDataQueryOptionsCurrencyApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCurrencyApi = rt.Static<
  typeof oDataQueryOptionsCurrencyApiRt
>;

const currencyApiRt = rt.Record({ Code: rt.String }).asPartial();

type CurrencyApi = rt.Static<typeof currencyApiRt>;

const paginatedResponseCurrencyApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(currencyApiRt) })
  .asPartial();

type PaginatedResponseCurrencyApi = rt.Static<
  typeof paginatedResponseCurrencyApiRt
>;

const oDataQueryOptionsCustomerInvoiceDraftApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCustomerInvoiceDraftApi = rt.Static<
  typeof oDataQueryOptionsCustomerInvoiceDraftApiRt
>;

const customerInvoiceDraftRowApiRt = rt.Intersect(
  rt
    .Record({
      LineNumber: rt.Number,
      ArticleId: rt.String,
      ArticleNumber: rt.String,
      IsTextRow: rt.Boolean,
      Text: rt.String,
      UnitPrice: rt.Number,
      DiscountPercentage: rt.Number,
      Quantity: rt.Number,
      WorkCostType: rt.Number,
      IsWorkCost: rt.Boolean,
      WorkHours: rt.Number,
      MaterialCosts: rt.Number,
      ReversedConstructionServicesVatFree: rt.Boolean,
      CostCenterItemId1: rt.String,
      CostCenterItemId2: rt.String,
      CostCenterItemId3: rt.String,
      UnitAbbreviation: rt.String,
      UnitName: rt.String,
      ProjectId: rt.String,
      GreenTechnologyType: rt.Number,
    })
    .asPartial(),
  rt.Record({ Id: rt.String, VatRateId: rt.String }).asPartial().asReadonly(),
);

type CustomerInvoiceDraftRowApi = rt.Static<
  typeof customerInvoiceDraftRowApiRt
>;

const salesDocumentRotRutReductionPersonApiRt = rt
  .Record({ Ssn: rt.String, Amount: rt.Number })
  .asPartial();

type SalesDocumentRotRutReductionPersonApi = rt.Static<
  typeof salesDocumentRotRutReductionPersonApiRt
>;

const customerInvoiceDraftApiRt = rt.Intersect(
  rt
    .Record({
      CustomerId: rt.String,
      IsCreditInvoice: rt.Boolean,
      RotReducedInvoicingType: rt.Number,
      RotReducedInvoicingPropertyName: rt.String,
      RotReducedInvoicingOrgNumber: rt.String,
      RotReducedInvoicingAmount: rt.Number,
      RotReducedInvoicingAutomaticDistribution: rt.Boolean,
      RotPropertyType: rt.Number,
      HouseWorkOtherCosts: rt.Number,
      Rows: rt.Array(customerInvoiceDraftRowApiRt),
      Persons: rt.Array(salesDocumentRotRutReductionPersonApiRt),
      YourReference: rt.String,
      OurReference: rt.String,
      BuyersOrderReference: rt.String,
      ElectronicReference: rt.String,
      InvoiceAddress1: rt.String,
      InvoiceAddress2: rt.String,
      DeliveryCustomerName: rt.String,
      DeliveryAddress1: rt.String,
      DeliveryAddress2: rt.String,
      DeliveryPostalCode: rt.String,
      DeliveryCity: rt.String,
      DeliveryCountryCode: rt.String,
      DeliveryMethodName: rt.String,
      DeliveryTermName: rt.String,
      DeliveryMethodCode: rt.String,
      DeliveryTermCode: rt.String,
      EuThirdParty: rt.Boolean,
      InvoiceDate: rt.String,
      DeliveryDate: rt.String,
      ReplaceUnitPriceWhenZero: rt.Boolean,
      UsesGreenTechnology: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      CreatedUtc: rt.String,
      InvoiceCustomerName: rt.String,
      InvoicePostalCode: rt.String,
      InvoiceCity: rt.String,
      InvoiceCountryCode: rt.String,
      InvoiceCurrencyCode: rt.String,
      CustomerIsPrivatePerson: rt.Boolean,
      ReverseChargeOnConstructionServices: rt.Boolean,
      SalesDocumentAttachments: rt.Array(rt.String),
      TotalAmount: rt.Number,
      TotalVatAmount: rt.Number,
      TotalRoundings: rt.Number,
      TotalAmountBaseCurrency: rt.Number,
      TotalVatAmountBaseCurrency: rt.Number,
      CustomerNumber: rt.String,
      IncludesVat: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type CustomerInvoiceDraftApi = rt.Static<typeof customerInvoiceDraftApiRt>;

const paginatedResponseCustomerInvoiceDraftApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(customerInvoiceDraftApiRt),
  })
  .asPartial();

type PaginatedResponseCustomerInvoiceDraftApi = rt.Static<
  typeof paginatedResponseCustomerInvoiceDraftApiRt
>;

const customerInvoiceDraftValidationRowApiRt = rt
  .Record({
    LineNumber: rt.Number,
    TotalAmountNoVatInvoiceCurrency: rt.Number,
    TotalAmountIncVatInvoiceCurrency: rt.Number,
  })
  .asPartial();

type CustomerInvoiceDraftValidationRowApi = rt.Static<
  typeof customerInvoiceDraftValidationRowApiRt
>;

const customerInvoiceDraftValidationApiRt = rt
  .Record({
    TotalAmountInvoiceCurrency: rt.Number,
    TotalVatAmountInvoiceCurrency: rt.Number,
    TotalRoundingsInvoiceCurrency: rt.Number,
    Rows: rt.Array(customerInvoiceDraftValidationRowApiRt),
  })
  .asPartial();

type CustomerInvoiceDraftValidationApi = rt.Static<
  typeof customerInvoiceDraftValidationApiRt
>;

const customerInvoiceRowApiRt = rt.Intersect(
  rt
    .Record({
      ArticleId: rt.String,
      Text: rt.String,
      UnitPrice: rt.Number,
      DiscountPercentage: rt.Number,
      Quantity: rt.Number,
      IsVatFree: rt.Boolean,
      CostCenterItemId1: rt.String,
      CostCenterItemId2: rt.String,
      CostCenterItemId3: rt.String,
      ProjectId: rt.String,
      WorkCostType: rt.Number,
      WorkHours: rt.Number,
      MaterialCosts: rt.Number,
      GreenTechnologyType: rt.Number,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      ArticleNumber: rt.String,
      AmountNoVat: rt.Number,
      PercentVat: rt.Number,
      LineNumber: rt.Number,
      IsTextRow: rt.Boolean,
      UnitAbbreviation: rt.String,
      UnitAbbreviationEnglish: rt.String,
      IsWorkCost: rt.Boolean,
      UnitId: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type CustomerInvoiceRowApi = rt.Static<typeof customerInvoiceRowApiRt>;

const customerInvoiceVatApiRt = rt
  .Record({
    AmountInvoiceCurrency: rt.Number,
    VatAmountInvoiceCurrency: rt.Number,
    VatPercent: rt.Number,
  })
  .asPartial()
  .asReadonly();

type CustomerInvoiceVatApi = rt.Static<typeof customerInvoiceVatApiRt>;

const customerInvoiceApiRt = rt.Intersect(
  rt
    .Record({
      EuThirdParty: rt.Boolean,
      IsCreditInvoice: rt.Boolean,
      CurrencyRate: rt.Number,
      CustomerId: rt.String,
      Rows: rt.Array(customerInvoiceRowApiRt),
      InvoiceDate: rt.String,
      DueDate: rt.String,
      DeliveryDate: rt.String,
      RotReducedInvoicingType: rt.Number,
      RotReducedInvoicingAmount: rt.Number,
      RotReducedInvoicingPropertyName: rt.String,
      RotReducedInvoicingOrgNumber: rt.String,
      Persons: rt.Array(salesDocumentRotRutReductionPersonApiRt),
      ElectronicReference: rt.String,
      EdiServiceDelivererId: rt.String,
      OurReference: rt.String,
      YourReference: rt.String,
      BuyersOrderReference: rt.String,
      InvoiceAddress1: rt.String,
      InvoiceAddress2: rt.String,
      InvoicePostalCode: rt.String,
      InvoiceCity: rt.String,
      InvoiceCountryCode: rt.String,
      DeliveryCustomerName: rt.String,
      DeliveryAddress1: rt.String,
      DeliveryAddress2: rt.String,
      DeliveryPostalCode: rt.String,
      DeliveryCity: rt.String,
      DeliveryCountryCode: rt.String,
      TermsOfPaymentId: rt.String,
      RotPropertyType: rt.Number,
      WorkHouseOtherCosts: rt.Number,
      CreatedFromDraftId: rt.String,
      SendType: rt.Number,
      UsesGreenTechnology: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      CurrencyCode: rt.String,
      CreatedByUserId: rt.String,
      TotalAmount: rt.Number,
      TotalVatAmount: rt.Number,
      TotalRoundings: rt.Number,
      TotalAmountInvoiceCurrency: rt.Number,
      TotalVatAmountInvoiceCurrency: rt.Number,
      SetOffAmountInvoiceCurrency: rt.Number,
      VatSpecification: rt.Array(customerInvoiceVatApiRt),
      RotReducedInvoicingPercent: rt.Number,
      RotReducedInvoicingAutomaticDistribution: rt.Boolean,
      ElectronicAddress: rt.String,
      InvoiceCustomerName: rt.String,
      DeliveryMethodName: rt.String,
      DeliveryTermName: rt.String,
      DeliveryMethodCode: rt.String,
      DeliveryTermCode: rt.String,
      CustomerIsPrivatePerson: rt.Boolean,
      CustomerEmail: rt.String,
      InvoiceNumber: rt.Number,
      CustomerNumber: rt.String,
      PaymentReferenceNumber: rt.String,
      SalesDocumentAttachments: rt.Array(rt.String),
      MessageThreads: rt.Array(rt.String),
      Notes: rt.Array(rt.String),
      HasAutoInvoiceError: rt.Boolean,
      IsNotDelivered: rt.Boolean,
      ReverseChargeOnConstructionServices: rt.Boolean,
      RemainingAmount: rt.Number,
      RemainingAmountInvoiceCurrency: rt.Number,
      ReferringInvoiceId: rt.String,
      CreatedFromOrderId: rt.String,
      VoucherNumber: rt.String,
      VoucherId: rt.String,
      CreatedUtc: rt.String,
      ModifiedUtc: rt.String,
      ReversedConstructionVatInvoicing: rt.Boolean,
      IncludesVat: rt.Boolean,
      PaymentReminderIssued: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type CustomerInvoiceApi = rt.Static<typeof customerInvoiceApiRt>;

const oDataQueryOptionsCustomerInvoiceApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCustomerInvoiceApi = rt.Static<
  typeof oDataQueryOptionsCustomerInvoiceApiRt
>;

const paginatedResponseCustomerInvoiceApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(customerInvoiceApiRt) })
  .asPartial();

type PaginatedResponseCustomerInvoiceApi = rt.Static<
  typeof paginatedResponseCustomerInvoiceApiRt
>;

const invoiceUrlApiRt = rt.Record({ Url: rt.String }).asPartial();

type InvoiceUrlApi = rt.Static<typeof invoiceUrlApiRt>;

const invoicePaymentApiRt = rt.Intersect(
  rt
    .Record({
      CompanyBankAccountId: rt.String,
      PaymentDate: rt.String,
      Reference: rt.String,
      PaymentAmount: rt.Number,
      PaymentCurrency: rt.String,
      DomesticPaymentAmount: rt.Number,
      BankFeeAmount: rt.Number,
      PaymentType: rt.Number,
      FactoringFeeAmount: rt.Number,
      FactoringFeeAccountNumber: rt.Number,
    })
    .asPartial(),
  rt.Record({ BankTransactionId: rt.String }).asPartial().asReadonly(),
);

type InvoicePaymentApi = rt.Static<typeof invoicePaymentApiRt>;

const emailApiRt = rt
  .Record({
    Email: rt.String,
    CcRecipients: rt.Array(rt.String),
    Subject: rt.String,
    Message: rt.String,
  })
  .asPartial();

type EmailApi = rt.Static<typeof emailApiRt>;

const paymentReminderEmailApiRt = rt
  .Record({ LatePaymentFee: rt.Number, EmailDetails: emailApiRt })
  .asPartial();

type PaymentReminderEmailApi = rt.Static<typeof paymentReminderEmailApiRt>;

const oDataQueryOptionsCustomerLabelApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCustomerLabelApi = rt.Static<
  typeof oDataQueryOptionsCustomerLabelApiRt
>;

const customerLabelApiRt = rt.Intersect(
  rt.Record({ Name: rt.String, Description: rt.String }).asPartial(),
  rt.Record({ Id: rt.String }).asPartial().asReadonly(),
);

type CustomerLabelApi = rt.Static<typeof customerLabelApiRt>;

const paginatedResponseCustomerLabelApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(customerLabelApiRt) })
  .asPartial();

type PaginatedResponseCustomerLabelApi = rt.Static<
  typeof paginatedResponseCustomerLabelApiRt
>;

const oDataQueryOptionsCustomerLedgerItemApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCustomerLedgerItemApi = rt.Static<
  typeof oDataQueryOptionsCustomerLedgerItemApiRt
>;

const customerLedgerItemApiRt = rt.Intersect(
  rt
    .Record({
      CurrencyCode: rt.String,
      CurrencyRate: rt.Number,
      CurrencyRateUnit: rt.Number,
      CustomerId: rt.String,
      DueDate: rt.String,
      InvoiceDate: rt.String,
      InvoiceNumber: rt.Number,
      IsCreditInvoice: rt.Boolean,
      RemainingAmountInvoiceCurrency: rt.Number,
      RoundingsAmountInvoiceCurrency: rt.Number,
      TotalAmountInvoiceCurrency: rt.Number,
      VATAmountInvoiceCurrency: rt.Number,
      VoucherId: rt.String,
      ModifiedUtc: rt.String,
    })
    .asPartial(),
  rt
    .Record({ Id: rt.String, PaymentReferenceNumber: rt.String })
    .asPartial()
    .asReadonly(),
);

type CustomerLedgerItemApi = rt.Static<typeof customerLedgerItemApiRt>;

const paginatedResponseCustomerLedgerItemApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(customerLedgerItemApiRt),
  })
  .asPartial();

type PaginatedResponseCustomerLedgerItemApi = rt.Static<
  typeof paginatedResponseCustomerLedgerItemApiRt
>;

const voucherRowApiRt = rt.Intersect(
  rt
    .Record({
      AccountNumber: rt.Number,
      DebitAmount: rt.Number,
      CreditAmount: rt.Number,
      TransactionText: rt.String,
      CostCenterItemId1: rt.String,
      CostCenterItemId2: rt.String,
      CostCenterItemId3: rt.String,
      VatCodeId: rt.String,
      VatCodeAndPercent: rt.String,
      Quantity: rt.Number,
      Weight: rt.Number,
      DeliveryDate: rt.String,
      HarvestYear: rt.Number,
      ProjectId: rt.String,
    })
    .asPartial(),
  rt.Record({ AccountDescription: rt.String }).asPartial().asReadonly(),
);

type VoucherRowApi = rt.Static<typeof voucherRowApiRt>;

const voucherApiRt = rt.Intersect(
  rt
    .Record({
      VoucherDate: rt.String,
      VoucherText: rt.String,
      Rows: rt.Array(voucherRowApiRt),
      NumberSeries: rt.String,
      Attachments: attachmentLinkApiRt,
      ModifiedUtc: rt.String,
      VoucherType: rt.Number,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      NumberAndNumberSeries: rt.String,
      SourceId: rt.String,
      CreatedUtc: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type VoucherApi = rt.Static<typeof voucherApiRt>;

const customerLedgerItemWithVoucherApiRt = rt.Intersect(
  rt
    .Record({
      CurrencyCode: rt.String,
      CurrencyRate: rt.Number,
      CurrencyRateUnit: rt.Number,
      CustomerId: rt.String,
      DueDate: rt.String,
      InvoiceDate: rt.String,
      InvoiceNumber: rt.Number,
      IsCreditInvoice: rt.Boolean,
      PaymentReferenceNumber: rt.String,
      RemainingAmountInvoiceCurrency: rt.Number,
      RoundingsAmountInvoiceCurrency: rt.Number,
      TotalAmountInvoiceCurrency: rt.Number,
      VATAmountInvoiceCurrency: rt.Number,
      Voucher: voucherApiRt,
      ModifiedUtc: rt.String,
    })
    .asPartial(),
  rt.Record({ Id: rt.String }).asPartial().asReadonly(),
);

type CustomerLedgerItemWithVoucherApi = rt.Static<
  typeof customerLedgerItemWithVoucherApiRt
>;

const oDataQueryOptionsCustomerApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsCustomerApi = rt.Static<
  typeof oDataQueryOptionsCustomerApiRt
>;

const termsOfPaymentApiRt = rt.Intersect(
  rt
    .Record({
      Name: rt.String,
      NameEnglish: rt.String,
      NumberOfDays: rt.Number,
      TermsOfPaymentTypeId: rt.Number,
      TermsOfPaymentTypeText: rt.String,
      AvailableForSales: rt.Boolean,
      AvailableForPurchase: rt.Boolean,
    })
    .asPartial(),
  rt.Record({ Id: rt.String }).asPartial().asReadonly(),
);

type TermsOfPaymentApi = rt.Static<typeof termsOfPaymentApiRt>;

const customerApiRt = rt.Intersect(
  rt
    .Record({
      CustomerNumber: rt.String,
      CorporateIdentityNumber: rt.String,
      ContactPersonEmail: rt.String,
      ContactPersonMobile: rt.String,
      ContactPersonName: rt.String,
      ContactPersonPhone: rt.String,
      CurrencyCode: rt.String,
      GLN: rt.String,
      EmailAddress: rt.String,
      InvoiceAddress1: rt.String,
      InvoiceAddress2: rt.String,
      InvoiceCity: rt.String,
      InvoiceCountryCode: rt.String,
      InvoicePostalCode: rt.String,
      DeliveryCustomerName: rt.String,
      DeliveryAddress1: rt.String,
      DeliveryAddress2: rt.String,
      DeliveryCity: rt.String,
      DeliveryCountryCode: rt.String,
      DeliveryPostalCode: rt.String,
      DeliveryMethodId: rt.String,
      DeliveryTermId: rt.String,
      Name: rt.String,
      Note: rt.String,
      ReverseChargeOnConstructionServices: rt.Boolean,
      WebshopCustomerNumber: rt.Number,
      MobilePhone: rt.String,
      Telephone: rt.String,
      TermsOfPaymentId: rt.String,
      VatNumber: rt.String,
      WwwAddress: rt.String,
      IsPrivatePerson: rt.Boolean,
      IsNorthernIreland: rt.Boolean,
      DiscountPercentage: rt.Number,
      IsActive: rt.Boolean,
      ForceBookkeepVat: rt.Boolean,
      EdiGlnNumber: rt.String,
      SalesDocumentLanguage: rt.String,
      ElectronicAddress: rt.String,
      ElectronicReference: rt.String,
      EdiServiceDelivererId: rt.String,
      AutoInvoiceActivationEmailSentDate: rt.String,
      AutoInvoiceRegistrationRequestSentDate: rt.String,
      EmailAddresses: rt.Array(rt.String),
      CustomerLabels: rt.Array(customerLabelApiRt),
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      PayToAccountId: rt.String,
      TermsOfPayment: termsOfPaymentApiRt,
      LastInvoiceDate: rt.String,
      ChangedUtc: rt.String,
      IsFutureInvoiceDateAllowed: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type CustomerApi = rt.Static<typeof customerApiRt>;

const paginatedResponseCustomerApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(customerApiRt) })
  .asPartial();

type PaginatedResponseCustomerApi = rt.Static<
  typeof paginatedResponseCustomerApiRt
>;

const oDataQueryOptionsAutoInvoiceAddressApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsAutoInvoiceAddressApi = rt.Static<
  typeof oDataQueryOptionsAutoInvoiceAddressApiRt
>;

const autoInvoiceAddressApiRt = rt
  .Record({
    Name: rt.String,
    ElectronicAddress: rt.String,
    EdiServiceDelivererId: rt.String,
    Address1: rt.String,
    Address2: rt.String,
    CorporateIdentityNumber: rt.String,
    CountryCode: rt.String,
    City: rt.String,
    Gln: rt.String,
    PostalCode: rt.String,
    VatNumber: rt.String,
  })
  .asPartial();

type AutoInvoiceAddressApi = rt.Static<typeof autoInvoiceAddressApiRt>;

const paginatedResponseAutoInvoiceAddressApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(autoInvoiceAddressApiRt),
  })
  .asPartial();

type PaginatedResponseAutoInvoiceAddressApi = rt.Static<
  typeof paginatedResponseAutoInvoiceAddressApiRt
>;

const oDataQueryOptionsDeliveryMethodApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsDeliveryMethodApi = rt.Static<
  typeof oDataQueryOptionsDeliveryMethodApiRt
>;

const deliveryMethodApiRt = rt
  .Record({ Name: rt.String, Code: rt.String, Id: rt.String })
  .asPartial();

type DeliveryMethodApi = rt.Static<typeof deliveryMethodApiRt>;

const paginatedResponseDeliveryMethodApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(deliveryMethodApiRt) })
  .asPartial();

type PaginatedResponseDeliveryMethodApi = rt.Static<
  typeof paginatedResponseDeliveryMethodApiRt
>;

const oDataQueryOptionsDeliveryTermApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsDeliveryTermApi = rt.Static<
  typeof oDataQueryOptionsDeliveryTermApiRt
>;

const deliveryTermApiRt = rt
  .Record({ Name: rt.String, Code: rt.String, Id: rt.String })
  .asPartial();

type DeliveryTermApi = rt.Static<typeof deliveryTermApiRt>;

const paginatedResponseDeliveryTermApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(deliveryTermApiRt) })
  .asPartial();

type PaginatedResponseDeliveryTermApi = rt.Static<
  typeof paginatedResponseDeliveryTermApiRt
>;

const oDataQueryOptionsDocumentApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsDocumentApi = rt.Static<
  typeof oDataQueryOptionsDocumentApiRt
>;

const documentApiRt = rt
  .Record({
    Id: rt.String,
    ContentType: rt.String,
    CreatedUtc: rt.String,
    Name: rt.String,
    NameWithoutExtension: rt.String,
    Size: rt.Number,
    Type: rt.Number,
    TemporaryUrl: rt.String,
  })
  .asPartial();

type DocumentApi = rt.Static<typeof documentApiRt>;

const oDataQueryOptionsFiscalYearApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsFiscalYearApi = rt.Static<
  typeof oDataQueryOptionsFiscalYearApiRt
>;

const fiscalYearApiRt = rt.Intersect(
  rt.Record({ StartDate: rt.String, EndDate: rt.String }).asPartial(),
  rt
    .Record({
      Id: rt.String,
      IsLockedForAccounting: rt.Boolean,
      BookkeepingMethod: rt.Number,
    })
    .asPartial()
    .asReadonly(),
);

type FiscalYearApi = rt.Static<typeof fiscalYearApiRt>;

const paginatedResponseFiscalYearApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(fiscalYearApiRt) })
  .asPartial();

type PaginatedResponseFiscalYearApi = rt.Static<
  typeof paginatedResponseFiscalYearApiRt
>;

const oDataQueryOptionsOpeningBalancesApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsOpeningBalancesApi = rt.Static<
  typeof oDataQueryOptionsOpeningBalancesApiRt
>;

const openingBalancesApiRt = rt
  .Record({ Name: rt.String, Number: rt.Number, Balance: rt.Number })
  .asPartial();

type OpeningBalancesApi = rt.Static<typeof openingBalancesApiRt>;

const paginatedResponseOpeningBalancesApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(openingBalancesApiRt) })
  .asPartial();

type PaginatedResponseOpeningBalancesApi = rt.Static<
  typeof paginatedResponseOpeningBalancesApiRt
>;

const accountOpeningBalanceApiRt = rt
  .Record({ AccountNumber: rt.Number, Balance: rt.Number })
  .asPartial();

type AccountOpeningBalanceApi = rt.Static<typeof accountOpeningBalanceApiRt>;

const oDataQueryOptionsForeignPaymentCodesApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsForeignPaymentCodesApi = rt.Static<
  typeof oDataQueryOptionsForeignPaymentCodesApiRt
>;

const foreignPaymentCodesAPIRt = rt
  .Record({
    Code: rt.Number,
    Description: rt.String,
    Id: rt.String,
    CountryCode: rt.String,
  })
  .asPartial();

type ForeignPaymentCodesAPI = rt.Static<typeof foreignPaymentCodesAPIRt>;

const paginatedResponseForeignPaymentCodesApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(foreignPaymentCodesAPIRt),
  })
  .asPartial();

type PaginatedResponseForeignPaymentCodesApi = rt.Static<
  typeof paginatedResponseForeignPaymentCodesApiRt
>;

const oDataQueryOptionsMessageThreadApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsMessageThreadApi = rt.Static<
  typeof oDataQueryOptionsMessageThreadApiRt
>;

const messageReceiverApiRt = rt.Intersect(
  rt.Record({ UserId: rt.String }).asPartial(),
  rt
    .Record({ Status: rt.Number, IsCurrentUser: rt.Boolean })
    .asPartial()
    .asReadonly(),
);

type MessageReceiverApi = rt.Static<typeof messageReceiverApiRt>;

const messageApiRt = rt.Intersect(
  rt.Record({ Text: rt.String }).asPartial(),
  rt
    .Record({
      Id: rt.String,
      ModifiedUtc: rt.String,
      CreatedUtc: rt.String,
      CreatedByUserId: rt.String,
      ModifiedByUserId: rt.String,
      MessageThreadId: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type MessageApi = rt.Static<typeof messageApiRt>;

const messageThreadApiRt = rt.Intersect(
  rt
    .Record({
      DocumentType: rt.Number,
      DocumentId: rt.String,
      Subject: rt.String,
      MessageReceivers: rt.Array(messageReceiverApiRt),
      LastMessage: messageApiRt,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      DocumentNumber: rt.String,
      ModifiedUtc: rt.String,
      IsClosed: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type MessageThreadApi = rt.Static<typeof messageThreadApiRt>;

const messageStatusApiRt = rt.Record({ Status: rt.Number }).asPartial();

type MessageStatusApi = rt.Static<typeof messageStatusApiRt>;

const messageToPostApiRt = rt
  .Record({
    Message: rt.String,
    Subject: rt.String,
    DocumentType: rt.Number,
    DocumentId: rt.String,
    MessageReceivers: rt.Array(messageReceiverApiRt),
  })
  .asPartial();

type MessageToPostApi = rt.Static<typeof messageToPostApiRt>;

const oDataQueryOptionsMessageApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsMessageApi = rt.Static<
  typeof oDataQueryOptionsMessageApiRt
>;

const oDataQueryOptionsNoteApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsNoteApi = rt.Static<typeof oDataQueryOptionsNoteApiRt>;

const noteApiRt = rt.Intersect(
  rt
    .Record({
      AttachedTo: rt.String,
      Text: rt.String,
      Subject: rt.String,
      DocumentType: rt.Number,
      IsDone: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      UserId: rt.String,
      CreatedUtc: rt.String,
      ModifiedUtc: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type NoteApi = rt.Static<typeof noteApiRt>;

const oDataQueryOptionsOrderApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsOrderApi = rt.Static<typeof oDataQueryOptionsOrderApiRt>;

const orderRowApiRt = rt
  .Record({
    LineNumber: rt.Number,
    DeliveredQuantity: rt.Number,
    ArticleId: rt.String,
    ArticleNumber: rt.String,
    IsTextRow: rt.Boolean,
    Text: rt.String,
    UnitPrice: rt.Number,
    DiscountPercentage: rt.Number,
    Quantity: rt.Number,
    WorkCostType: rt.Number,
    IsWorkCost: rt.Boolean,
    EligibleForReverseChargeOnVat: rt.Boolean,
    CostCenterItemId1: rt.String,
    CostCenterItemId2: rt.String,
    CostCenterItemId3: rt.String,
    Id: rt.String,
    ProjectId: rt.String,
    GreenTechnologyType: rt.Number,
  })
  .asPartial();

type OrderRowApi = rt.Static<typeof orderRowApiRt>;

const orderApiRt = rt.Intersect(
  rt
    .Record({
      Amount: rt.Number,
      CustomerId: rt.String,
      CurrencyCode: rt.String,
      VatAmount: rt.Number,
      RoundingsAmount: rt.Number,
      DeliveredAmount: rt.Number,
      DeliveredVatAmount: rt.Number,
      DeliveredRoundingsAmount: rt.Number,
      DeliveryCustomerName: rt.String,
      DeliveryAddress1: rt.String,
      DeliveryAddress2: rt.String,
      DeliveryPostalCode: rt.String,
      DeliveryCity: rt.String,
      DeliveryCountryCode: rt.String,
      YourReference: rt.String,
      OurReference: rt.String,
      InvoiceAddress1: rt.String,
      InvoiceAddress2: rt.String,
      InvoiceCity: rt.String,
      InvoiceCountryCode: rt.String,
      InvoiceCustomerName: rt.String,
      InvoicePostalCode: rt.String,
      DeliveryMethodName: rt.String,
      DeliveryMethodCode: rt.String,
      DeliveryTermName: rt.String,
      DeliveryTermCode: rt.String,
      EuThirdParty: rt.Boolean,
      OrderDate: rt.String,
      Status: rt.Number,
      DeliveryDate: rt.String,
      HouseWorkAmount: rt.Number,
      HouseWorkAutomaticDistribution: rt.Boolean,
      HouseWorkCorporateIdentityNumber: rt.String,
      HouseWorkPropertyName: rt.String,
      Rows: rt.Array(orderRowApiRt),
      ShippedDateTime: rt.String,
      RotReducedInvoicingType: rt.Number,
      RotPropertyType: rt.Number,
      Persons: rt.Array(salesDocumentRotRutReductionPersonApiRt),
      ReverseChargeOnConstructionServices: rt.Boolean,
      UsesGreenTechnology: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      CreatedUtc: rt.String,
      CustomerIsPrivatePerson: rt.Boolean,
      Number: rt.Number,
      ModifiedUtc: rt.String,
      SalesDocumentAttachments: rt.Array(rt.String),
      MessageThreads: rt.Array(rt.String),
      Notes: rt.Array(rt.String),
      IsNotDelivered: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type OrderApi = rt.Static<typeof orderApiRt>;

const paginatedResponseOrderApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(orderApiRt) })
  .asPartial();

type PaginatedResponseOrderApi = rt.Static<typeof paginatedResponseOrderApiRt>;

const oDataQueryOptionsPartnerResourceLinkApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsPartnerResourceLinkApi = rt.Static<
  typeof oDataQueryOptionsPartnerResourceLinkApiRt
>;

const partnerResourceLinkApiRt = rt.Intersect(
  rt
    .Record({
      ResourceId: rt.String,
      ResourceType: rt.Number,
      Href: rt.String,
      PartnerCompanyName: rt.String,
      PartnerSystemName: rt.String,
    })
    .asPartial(),
  rt.Record({ Id: rt.String }).asPartial().asReadonly(),
);

type PartnerResourceLinkApi = rt.Static<typeof partnerResourceLinkApiRt>;

const paginatedResponsePartnerResourceLinkApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(partnerResourceLinkApiRt),
  })
  .asPartial();

type PaginatedResponsePartnerResourceLinkApi = rt.Static<
  typeof paginatedResponsePartnerResourceLinkApiRt
>;

const paymentVoucherRowApiRt = rt
  .Record({
    AccountNumber: rt.Number,
    DebitAmount: rt.Number,
    CreditAmount: rt.Number,
    TransactionText: rt.String,
    CostCenterItemId1: rt.String,
    CostCenterItemId2: rt.String,
    CostCenterItemId3: rt.String,
    VatCodeId: rt.String,
    ReceivableId: rt.String,
    PayableId: rt.String,
    ProjectId: rt.String,
    Quantity: rt.Number,
    Weight: rt.Number,
    DeliveryDate: rt.String,
    HarvestYear: rt.Number,
  })
  .asPartial();

type PaymentVoucherRowApi = rt.Static<typeof paymentVoucherRowApiRt>;

const paymentVoucherApiRt = rt
  .Record({
    VoucherDate: rt.String,
    VoucherText: rt.String,
    NumberSeries: rt.String,
    Rows: rt.Array(paymentVoucherRowApiRt),
  })
  .asPartial();

type PaymentVoucherApi = rt.Static<typeof paymentVoucherApiRt>;

const oDataQueryOptionsProjectApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsProjectApi = rt.Static<
  typeof oDataQueryOptionsProjectApiRt
>;

const projectApiRt = rt.Intersect(
  rt
    .Record({
      Number: rt.String,
      Name: rt.String,
      StartDate: rt.String,
      EndDate: rt.String,
      CustomerId: rt.String,
      Notes: rt.String,
      Status: rt.Number,
    })
    .asPartial(),
  rt
    .Record({ Id: rt.String, CustomerName: rt.String, ModifiedUtc: rt.String })
    .asPartial()
    .asReadonly(),
);

type ProjectApi = rt.Static<typeof projectApiRt>;

const paginatedResponseProjectApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(projectApiRt) })
  .asPartial();

type PaginatedResponseProjectApi = rt.Static<
  typeof paginatedResponseProjectApiRt
>;

const oDataQueryOptionsQuoteApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsQuoteApi = rt.Static<typeof oDataQueryOptionsQuoteApiRt>;

const quoteRowApiRt = rt.Intersect(
  rt
    .Record({
      ArticleId: rt.String,
      Text: rt.String,
      UnitPrice: rt.Number,
      DiscountPercentage: rt.Number,
      Quantity: rt.Number,
      WorkCostType: rt.Number,
      WorkHours: rt.Number,
      MaterialCosts: rt.Number,
      CostCenterItemId1: rt.String,
      CostCenterItemId2: rt.String,
      CostCenterItemId3: rt.String,
      ProjectId: rt.String,
      GreenTechnologyType: rt.Number,
    })
    .asPartial(),
  rt
    .Record({
      IsWorkCost: rt.Boolean,
      IsVatFree: rt.Boolean,
      LineNumber: rt.Number,
      IsTextRow: rt.Boolean,
      ArticleNumber: rt.String,
    })
    .asPartial()
    .asReadonly(),
);

type QuoteRowApi = rt.Static<typeof quoteRowApiRt>;

const quoteApiRt = rt.Intersect(
  rt
    .Record({
      CustomerId: rt.String,
      DueDate: rt.String,
      QuoteDate: rt.String,
      EuThirdParty: rt.Boolean,
      RotReducedInvoicingType: rt.Number,
      RotPropertyType: rt.Number,
      RotReducedInvoicingPropertyName: rt.String,
      RotReducedInvoicingOrgNumber: rt.String,
      RotReducedInvoicingAmount: rt.Number,
      Persons: rt.Array(salesDocumentRotRutReductionPersonApiRt),
      TermsOfPayment: termsOfPaymentApiRt,
      Rows: rt.Array(quoteRowApiRt),
      UsesGreenTechnology: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      Number: rt.Number,
      CreatedUtc: rt.String,
      ApprovedDate: rt.String,
      CurrencyCode: rt.String,
      Status: rt.Number,
      CurrencyRate: rt.Number,
      CompanyReference: rt.String,
      CustomerReference: rt.String,
      InvoiceCustomerName: rt.String,
      InvoiceAddress1: rt.String,
      InvoiceAddress2: rt.String,
      InvoicePostalCode: rt.String,
      InvoiceCity: rt.String,
      InvoiceCountryCode: rt.String,
      DeliveryCustomerName: rt.String,
      DeliveryAddress1: rt.String,
      DeliveryAddress2: rt.String,
      DeliveryPostalCode: rt.String,
      DeliveryCity: rt.String,
      DeliveryCountryCode: rt.String,
      DeliveryMethodName: rt.String,
      DeliveryMethodCode: rt.String,
      DeliveryTermCode: rt.String,
      DeliveryTermName: rt.String,
      CustomerIsPrivatePerson: rt.Boolean,
      IncludesVat: rt.Boolean,
      IsDomestic: rt.Boolean,
      RotReducedInvoicingAutomaticDistribution: rt.Boolean,
      SalesDocumentAttachments: rt.Array(rt.String),
      MessageThreads: rt.Array(rt.String),
      Notes: rt.Array(rt.String),
      TotalAmount: rt.Number,
      VatAmount: rt.Number,
      RoundingsAmount: rt.Number,
      IsNotDelivered: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type QuoteApi = rt.Static<typeof quoteApiRt>;

const paginatedResponseQuoteApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(quoteApiRt) })
  .asPartial();

type PaginatedResponseQuoteApi = rt.Static<typeof paginatedResponseQuoteApiRt>;

const quoteConversionApiRt = rt.Record({ Type: rt.Number }).asPartial();

type QuoteConversionApi = rt.Static<typeof quoteConversionApiRt>;

const salesDocumentAttachmentUploadApiRt = rt
  .Record({
    ContentType: rt.String,
    FileName: rt.String,
    DockumentId: rt.String,
    Data: rt.String,
    Url: rt.String,
  })
  .asPartial();

type SalesDocumentAttachmentUploadApi = rt.Static<
  typeof salesDocumentAttachmentUploadApiRt
>;

const salesDocumentAttachmentApiRt = rt
  .Record({
    Id: rt.String,
    DocumentId: rt.String,
    DocumentType: rt.Number,
    OriginalFilename: rt.String,
    DocumentSize: rt.Number,
    CreatedUtc: rt.String,
    Thumbnail: rt.String,
  })
  .asPartial();

type SalesDocumentAttachmentApi = rt.Static<
  typeof salesDocumentAttachmentApiRt
>;

const oDataQueryOptionsSupplierInvoiceDraftApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsSupplierInvoiceDraftApi = rt.Static<
  typeof oDataQueryOptionsSupplierInvoiceDraftApiRt
>;

const supplierInvoiceDraftRowApiRt = rt.Intersect(
  rt
    .Record({
      AccountNumber: rt.Number,
      AccountName: rt.String,
      VatCodeId: rt.String,
      CostCenterItemId1: rt.String,
      CostCenterItemId2: rt.String,
      CostCenterItemId3: rt.String,
      ProjectId: rt.String,
      DebitAmount: rt.Number,
      CreditAmount: rt.Number,
      TransactionText: rt.String,
      LineNumber: rt.Number,
      Quantity: rt.Number,
      Weight: rt.Number,
      DeliveryDate: rt.String,
      HarvestYear: rt.Number,
      VatAmount: rt.Number,
    })
    .asPartial(),
  rt.Record({ Id: rt.String }).asPartial().asReadonly(),
);

type SupplierInvoiceDraftRowApi = rt.Static<
  typeof supplierInvoiceDraftRowApiRt
>;

const supplierInvoiceDraftApiRt = rt.Intersect(
  rt
    .Record({
      SupplierId: rt.String,
      BankAccountId: rt.String,
      InvoiceDate: rt.String,
      PaymentDate: rt.String,
      DueDate: rt.String,
      InvoiceNumber: rt.String,
      TotalAmount: rt.Number,
      Vat: rt.Number,
      VatHigh: rt.Number,
      VatMedium: rt.Number,
      VatLow: rt.Number,
      IsCreditInvoice: rt.Boolean,
      CurrencyCode: rt.String,
      CurrencyRate: rt.Number,
      OcrNumber: rt.String,
      Message: rt.String,
      Rows: rt.Array(supplierInvoiceDraftRowApiRt),
      SupplierName: rt.String,
      SupplierNumber: rt.String,
      SelfEmployedWithoutFixedAddress: rt.Boolean,
      IsQuickInvoice: rt.Boolean,
      IsDomestic: rt.Boolean,
      Attachments: attachmentLinkApiRt,
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      CreatedUtc: rt.String,
      ModifiedUtc: rt.String,
      ApprovalStatus: rt.Number,
      SkipSendToBank: rt.Boolean,
      AllocationPeriods: rt.Array(allocationPeriodApiRt),
    })
    .asPartial()
    .asReadonly(),
);

type SupplierInvoiceDraftApi = rt.Static<typeof supplierInvoiceDraftApiRt>;

const paginatedResponseSupplierInvoiceDraftApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(supplierInvoiceDraftApiRt),
  })
  .asPartial();

type PaginatedResponseSupplierInvoiceDraftApi = rt.Static<
  typeof paginatedResponseSupplierInvoiceDraftApiRt
>;

const supplierInvoiceRowApiRt = rt.Intersect(
  rt
    .Record({
      AccountNumber: rt.Number,
      VatCodeId: rt.String,
      VatAmount: rt.Number,
      CostCenterItemId1: rt.String,
      CostCenterItemId2: rt.String,
      CostCenterItemId3: rt.String,
      Quantity: rt.Number,
      Weight: rt.Number,
      DeliveryDate: rt.String,
      HarvestYear: rt.Number,
      DebetAmount: rt.Number,
      CreditAmount: rt.Number,
      ProjectId: rt.String,
      TransactionText: rt.String,
    })
    .asPartial(),
  rt
    .Record({ Id: rt.String, AccountName: rt.String, LineNumber: rt.Number })
    .asPartial()
    .asReadonly(),
);

type SupplierInvoiceRowApi = rt.Static<typeof supplierInvoiceRowApiRt>;

const supplierInvoiceApiRt = rt.Intersect(
  rt
    .Record({
      SupplierId: rt.String,
      InvoiceDate: rt.String,
      DueDate: rt.String,
      InvoiceNumber: rt.String,
      TotalAmount: rt.Number,
      Vat: rt.Number,
      VatHigh: rt.Number,
      VatMedium: rt.Number,
      VatLow: rt.Number,
      IsCreditInvoice: rt.Boolean,
      CurrencyCode: rt.String,
      CurrencyRate: rt.Number,
      OcrNumber: rt.String,
      Message: rt.String,
      Rows: rt.Array(supplierInvoiceRowApiRt),
      AutoCreditDebitPairing: rt.Boolean,
      Attachments: rt.Array(rt.String),
    })
    .asPartial(),
  rt
    .Record({
      Id: rt.String,
      BankAccountId: rt.String,
      PaymentDate: rt.String,
      CreatedUtc: rt.String,
      ModifiedUtc: rt.String,
      PlusGiroNumber: rt.String,
      BankGiroNumber: rt.String,
      SupplierName: rt.String,
      SupplierNumber: rt.String,
      IsQuickInvoice: rt.Boolean,
      IsDomestic: rt.Boolean,
      RemainingAmount: rt.Number,
      RemainingAmountInvoiceCurrency: rt.Number,
      VoucherNumber: rt.String,
      VoucherId: rt.String,
      CreatedFromDraftId: rt.String,
      SelfEmployedWithoutFixedAddress: rt.Boolean,
      AllocationPeriods: rt.Array(allocationPeriodApiRt),
      SetOffAmountInvoiceCurrency: rt.Number,
      Status: rt.Number,
      PaymentStatus: rt.Number,
      SkipSendToBank: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

type SupplierInvoiceApi = rt.Static<typeof supplierInvoiceApiRt>;

const oDataQueryOptionsSupplierInvoiceApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsSupplierInvoiceApi = rt.Static<
  typeof oDataQueryOptionsSupplierInvoiceApiRt
>;

const paginatedResponseSupplierInvoiceApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(supplierInvoiceApiRt) })
  .asPartial();

type PaginatedResponseSupplierInvoiceApi = rt.Static<
  typeof paginatedResponseSupplierInvoiceApiRt
>;

const oDataQueryOptionsSupplierApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsSupplierApi = rt.Static<
  typeof oDataQueryOptionsSupplierApiRt
>;

const supplierApiRt = rt.Intersect(
  rt
    .Record({
      SupplierNumber: rt.String,
      Address1: rt.String,
      Address2: rt.String,
      AutomaticPaymentService: rt.Boolean,
      BankAccountNumber: rt.String,
      BankBban: rt.String,
      BankBic: rt.String,
      BankCode: rt.String,
      BankCountryCode: rt.String,
      BankgiroNumber: rt.String,
      BankIban: rt.String,
      BankName: rt.String,
      City: rt.String,
      ContactPersonEmail: rt.String,
      ContactPersonMobile: rt.String,
      ContactPersonName: rt.String,
      ContactPersonPhone: rt.String,
      CorporateIdentityNumber: rt.String,
      CountryCode: rt.String,
      CurrencyCode: rt.String,
      EmailAddress: rt.String,
      MobilePhone: rt.String,
      Name: rt.String,
      Note: rt.String,
      PlusgiroNumber: rt.String,
      PostalCode: rt.String,
      Telephone: rt.String,
      TermsOfPaymentId: rt.String,
      VatNumber: rt.String,
      WwwAddress: rt.String,
      BankFeeCode: rt.Number,
      PayFromBankAccountId: rt.String,
      ForeignPaymentCodeId: rt.String,
      UsesPaymentReferenceNumbers: rt.Boolean,
      IsActive: rt.Boolean,
      SelfEmployedWithoutFixedAddress: rt.Boolean,
    })
    .asPartial(),
  rt
    .Record({ Id: rt.String, CreatedUtc: rt.String, ModifiedUtc: rt.String })
    .asPartial()
    .asReadonly(),
);

type SupplierApi = rt.Static<typeof supplierApiRt>;

const paginatedResponseSupplierApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(supplierApiRt) })
  .asPartial();

type PaginatedResponseSupplierApi = rt.Static<
  typeof paginatedResponseSupplierApiRt
>;

const oDataQueryOptionsTermsOfPaymentApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsTermsOfPaymentApi = rt.Static<
  typeof oDataQueryOptionsTermsOfPaymentApiRt
>;

const paginatedResponseTermsOfPaymentApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(termsOfPaymentApiRt) })
  .asPartial();

type PaginatedResponseTermsOfPaymentApi = rt.Static<
  typeof paginatedResponseTermsOfPaymentApiRt
>;

const oDataQueryOptionsUnitApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsUnitApi = rt.Static<typeof oDataQueryOptionsUnitApiRt>;

const unitApiRt = rt
  .Record({
    Id: rt.String,
    Name: rt.String,
    Code: rt.String,
    Abbreviation: rt.String,
  })
  .asPartial();

type UnitApi = rt.Static<typeof unitApiRt>;

const paginatedResponseUnitApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(unitApiRt) })
  .asPartial();

type PaginatedResponseUnitApi = rt.Static<typeof paginatedResponseUnitApiRt>;

const oDataQueryOptionsUserApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsUserApi = rt.Static<typeof oDataQueryOptionsUserApiRt>;

const userApiRt = rt
  .Record({
    Id: rt.String,
    Email: rt.String,
    FirstName: rt.String,
    LastName: rt.String,
    IsActive: rt.Boolean,
    IsCurrentUser: rt.Boolean,
    IsConsultant: rt.Boolean,
  })
  .asPartial();

type UserApi = rt.Static<typeof userApiRt>;

const paginatedResponseUserApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(userApiRt) })
  .asPartial();

type PaginatedResponseUserApi = rt.Static<typeof paginatedResponseUserApiRt>;

const oDataQueryOptionsVatCodeApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsVatCodeApi = rt.Static<
  typeof oDataQueryOptionsVatCodeApiRt
>;

const relatedAccountsRt = rt
  .Record({
    AccountNumber1: rt.Number,
    AccountNumber2: rt.Number,
    AccountNumber3: rt.Number,
  })
  .asPartial();

type RelatedAccounts = rt.Static<typeof relatedAccountsRt>;

const vatCodeApiRt = rt
  .Record({
    Id: rt.String,
    Code: rt.String,
    Description: rt.String,
    VatRate: rt.Number,
    RelatedAccounts: relatedAccountsRt,
  })
  .asPartial();

type VatCodeApi = rt.Static<typeof vatCodeApiRt>;

const paginatedResponseVatCodeApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(vatCodeApiRt) })
  .asPartial();

type PaginatedResponseVatCodeApi = rt.Static<
  typeof paginatedResponseVatCodeApiRt
>;

const oDataQueryOptionsVatReportApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsVatReportApi = rt.Static<
  typeof oDataQueryOptionsVatReportApiRt
>;

const paginatedResponseVatReportApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(vatReportApiRt) })
  .asPartial();

type PaginatedResponseVatReportApi = rt.Static<
  typeof paginatedResponseVatReportApiRt
>;

const oDataQueryOptionsVoucherDraftApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsVoucherDraftApi = rt.Static<
  typeof oDataQueryOptionsVoucherDraftApiRt
>;

const voucherDraftRowApiRt = rt
  .Record({
    AccountNumber: rt.Number,
    DebitAmount: rt.Number,
    CreditAmount: rt.Number,
    VatCodeId: rt.String,
    CostCenterItemId1: rt.String,
    CostCenterItemId2: rt.String,
    CostCenterItemId3: rt.String,
    TransactionText: rt.String,
    ProjectId: rt.String,
    Quantity: rt.Number,
    Weight: rt.Number,
    DeliveryDate: rt.String,
    HarvestYear: rt.Number,
  })
  .asPartial();

type VoucherDraftRowApi = rt.Static<typeof voucherDraftRowApiRt>;

const voucherDraftApiRt = rt.Intersect(
  rt
    .Record({
      VoucherDate: rt.String,
      VoucherText: rt.String,
      NumberSeries: rt.String,
      Rows: rt.Array(voucherDraftRowApiRt),
    })
    .asPartial(),
  rt
    .Record({ Id: rt.String, CreatedUtc: rt.String, ModifiedUtc: rt.String })
    .asPartial()
    .asReadonly(),
);

type VoucherDraftApi = rt.Static<typeof voucherDraftApiRt>;

const paginatedResponseVoucherDraftApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(voucherDraftApiRt) })
  .asPartial();

type PaginatedResponseVoucherDraftApi = rt.Static<
  typeof paginatedResponseVoucherDraftApiRt
>;

const oDataQueryOptionsVoucherApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsVoucherApi = rt.Static<
  typeof oDataQueryOptionsVoucherApiRt
>;

const paginatedResponseVoucherApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(voucherApiRt) })
  .asPartial();

type PaginatedResponseVoucherApi = rt.Static<
  typeof paginatedResponseVoucherApiRt
>;

const oDataQueryOptionsLedgerVoucherRelationApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsLedgerVoucherRelationApi = rt.Static<
  typeof oDataQueryOptionsLedgerVoucherRelationApiRt
>;

const ledgerVoucherRelationApiRt = rt
  .Record({ Amount: rt.Number, CustomerId: rt.String, SupplierId: rt.String })
  .asPartial()
  .asReadonly();

type LedgerVoucherRelationApi = rt.Static<typeof ledgerVoucherRelationApiRt>;

const paginatedResponseLedgerVoucherRelationApiRt = rt
  .Record({
    Meta: paginationMetadataRt,
    Data: rt.Array(ledgerVoucherRelationApiRt),
  })
  .asPartial();

type PaginatedResponseLedgerVoucherRelationApi = rt.Static<
  typeof paginatedResponseLedgerVoucherRelationApiRt
>;

const voucherWithOverunderPaymentRowApiRt = rt
  .Record({
    AccountNumber: rt.Number,
    DebitAmount: rt.Number,
    CreditAmount: rt.Number,
    CostCenterItemId1: rt.String,
    CostCenterItemId2: rt.String,
    CostCenterItemId3: rt.String,
    VatCodeId: rt.String,
    Quantity: rt.Number,
    Weight: rt.Number,
    DeliveryDate: rt.String,
    HarvestYear: rt.Number,
    ProjectId: rt.String,
    CustomerId: rt.String,
    SupplierId: rt.String,
  })
  .asPartial();

type VoucherWithOverunderPaymentRowApi = rt.Static<
  typeof voucherWithOverunderPaymentRowApiRt
>;

const voucherWithOverunderPaymentApiRt = rt
  .Record({
    VoucherDate: rt.String,
    VoucherText: rt.String,
    Rows: rt.Array(voucherWithOverunderPaymentRowApiRt),
    Attachments: attachmentLinkApiRt,
  })
  .asPartial();

type VoucherWithOverunderPaymentApi = rt.Static<
  typeof voucherWithOverunderPaymentApiRt
>;

const oDataQueryOptionsWebHookApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsWebHookApi = rt.Static<
  typeof oDataQueryOptionsWebHookApiRt
>;

const webHookSubscriptionApiRt = rt.Intersect(
  rt.Record({ SubscriptionType: rt.Number }).asPartial(),
  rt.Record({ WebHookId: rt.String }).asPartial().asReadonly(),
);

type WebHookSubscriptionApi = rt.Static<typeof webHookSubscriptionApiRt>;

const webHookApiRt = rt.Intersect(
  rt
    .Record({
      Endpoint: rt.String,
      Description: rt.String,
      ClientId: rt.String,
      AuthenticationKey: rt.String,
      AuthenticationValue: rt.String,
      SigningKey: rt.String,
      Active: rt.Boolean,
      Subscriptions: rt.Array(webHookSubscriptionApiRt),
    })
    .asPartial(),
  rt
    .Record({ Id: rt.String, CreatedUtc: rt.String, ModifiedUtc: rt.String })
    .asPartial()
    .asReadonly(),
);

type WebHookApi = rt.Static<typeof webHookApiRt>;

const paginatedResponseWebHookApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(webHookApiRt) })
  .asPartial();

type PaginatedResponseWebHookApi = rt.Static<
  typeof paginatedResponseWebHookApiRt
>;

const oDataQueryOptionsWebshopOrderApiRt = rt.Intersect(
  rt.Record({ Validator: oDataQueryValidatorRt }).asPartial(),
  rt
    .Record({
      IfMatch: rt.Dictionary(rt.Unknown),
      IfNoneMatch: rt.Dictionary(rt.Unknown),
      Request: rt.Dictionary(rt.Unknown),
      Context: oDataQueryContextRt,
      RawValues: oDataRawQueryOptionsRt,
      SelectExpand: selectExpandQueryOptionRt,
      Apply: applyQueryOptionRt,
      Filter: filterQueryOptionRt,
      OrderBy: orderByQueryOptionRt,
      Skip: skipQueryOptionRt,
      Top: topQueryOptionRt,
      Count: countQueryOptionRt,
    })
    .asPartial()
    .asReadonly(),
);

type ODataQueryOptionsWebshopOrderApi = rt.Static<
  typeof oDataQueryOptionsWebshopOrderApiRt
>;

const webshopOrderRowApiRt = rt
  .Record({
    Id: rt.String,
    ArticleName: rt.String,
    ArticleNumber: rt.String,
    PricePerUnitInvoiceCurrency: rt.Number,
    Quantity: rt.Number,
    UnitAbbreviation: rt.String,
    Sum: rt.Number,
    PercentVat: rt.Number,
  })
  .asPartial();

type WebshopOrderRowApi = rt.Static<typeof webshopOrderRowApiRt>;

const webshopOrderApiRt = rt
  .Record({
    Id: rt.String,
    BaseCurrencyCode: rt.String,
    Name: rt.String,
    Number: rt.String,
    OrderCurrencyCode: rt.String,
    OrderDate: rt.String,
    OrderNumber: rt.String,
    Note: rt.String,
    TotalAmountBaseCurrency: rt.Number,
    TotalAmountOrderCurrency: rt.Number,
    CustomerIsPrivatePerson: rt.Boolean,
    Rows: rt.Array(webshopOrderRowApiRt),
  })
  .asPartial();

type WebshopOrderApi = rt.Static<typeof webshopOrderApiRt>;

const paginatedResponseWebshopOrderApiRt = rt
  .Record({ Meta: paginationMetadataRt, Data: rt.Array(webshopOrderApiRt) })
  .asPartial();

type PaginatedResponseWebshopOrderApi = rt.Static<
  typeof paginatedResponseWebshopOrderApiRt
>;

// Operation: AccountBalanceV2_Get

const accountBalanceV2_GetArgsRt = rt.Record({ date: rt.String }).asReadonly();

/**
 * operation ID: AccountBalanceV2_Get
 * `GET: /v2/accountbalances/{date}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const AccountBalanceV2_Get = buildCall() //
  .args<rt.Static<typeof accountBalanceV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/accountbalances/${args.date}`)
  .parseJson(withRuntype(paginatedResponseAccountBalanceAPIRt))
  .build();

// Operation: AccountBalanceV2_Get

const accountBalanceV2_GetArgsRt = rt
  .Record({ accountNumber: rt.Number, date: rt.String })
  .asReadonly();

/**
 * operation ID: AccountBalanceV2_Get
 * `GET: /v2/accountbalances/{accountNumber}/{date}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const AccountBalanceV2_Get = buildCall() //
  .args<rt.Static<typeof accountBalanceV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/accountbalances/${args.accountNumber}/${args.date}`)
  .parseJson(withRuntype(accountBalanceAPIRt))
  .build();

// Operation: AccountsV2_Get

/**
 * operation ID: AccountsV2_Get
 * `GET: /v2/accounts`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const AccountsV2_Get = buildCall() //
  .method('get')
  .path('/v2/accounts')
  .parseJson(withRuntype(paginatedResponseAccountApiRt))
  .build();

// Operation: AccountsV2_Post

const accountsV2_PostArgsRt = rt.Intersect(
  rt.Record({ apiAccount: accountApiRt }).asReadonly(),
  rt.Record({ useDefaultAccountType: rt.Boolean }).asPartial().asReadonly(),
);

/**
 * operation ID: AccountsV2_Post
 * `POST: /v2/accounts`
 * Add a account to a given fiscalyear. Use the required
 * FiscalYearId property to specify the fiscal year.<p>Requires
 * any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const AccountsV2_Post = buildCall() //
  .args<rt.Static<typeof accountsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/accounts')
  .query(
    (args) =>
      new URLSearchParams(pickQueryValues(args, 'useDefaultAccountType')),
  )
  .body((args) => args.apiAccount)
  .build();

// Operation: AccountsV2_Get

/**
 * operation ID: AccountsV2_Get
 * `GET: /v2/accounts/standardaccounts`
 * Predefined standard accounts are for dutch companies
 * only.<p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const AccountsV2_Get = buildCall() //
  .method('get')
  .path('/v2/accounts/standardaccounts')
  .parseJson(withRuntype(paginatedResponseStandardAccountApiRt))
  .build();

// Operation: AccountsV2_Get

const accountsV2_GetArgsRt = rt
  .Record({ fiscalyearId: rt.String })
  .asReadonly();

/**
 * operation ID: AccountsV2_Get
 * `GET: /v2/accounts/{fiscalyearId}`
 * Get a list of accounts for a given fiscalyear.<p>Requires
 * any of the following scopes: <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const AccountsV2_Get = buildCall() //
  .args<rt.Static<typeof accountsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/accounts/${args.fiscalyearId}`)
  .parseJson(withRuntype(paginatedResponseAccountApiRt))
  .build();

// Operation: AccountsV2_Get

const accountsV2_GetArgsRt = rt
  .Record({ fiscalyearId: rt.String, accountNumber: rt.Number })
  .asReadonly();

/**
 * operation ID: AccountsV2_Get
 * `GET: /v2/accounts/{fiscalyearId}/{accountNumber}`
 * Get a account from a given fiscalyear by specifying the
 * account number.<p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const AccountsV2_Get = buildCall() //
  .args<rt.Static<typeof accountsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/accounts/${args.fiscalyearId}/${args.accountNumber}`)
  .parseJson(withRuntype(accountApiRt))
  .build();

// Operation: AccountsV2_Put

const accountsV2_PutArgsRt = rt
  .Record({
    fiscalyearId: rt.String,
    accountNumber: rt.Number,
    replacedAccount: accountApiRt,
  })
  .asReadonly();

/**
 * operation ID: AccountsV2_Put
 * `PUT: /v2/accounts/{fiscalyearId}/{accountNumber}`
 * Replace a account in a given fiscal year. Will only replace
 * the account in that fiscal year.<p>Requires any of the
 * following scopes: <br><b>ea:accounting</b></p><p>Available
 * in any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const AccountsV2_Put = buildCall() //
  .args<rt.Static<typeof accountsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/accounts/${args.fiscalyearId}/${args.accountNumber}`)
  .body((args) => args.replacedAccount)
  .parseJson(withRuntype(accountApiRt))
  .build();

// Operation: AccountTypesV2_GetDefaultAccountTypes

/**
 * operation ID: AccountTypesV2_GetDefaultAccountTypes
 * `GET: /v2/accountTypes`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const AccountTypesV2_GetDefaultAccountTypes = buildCall() //
  .method('get')
  .path('/v2/accountTypes')
  .parseJson(withRuntype(paginatedResponseAccountTypesAPIRt))
  .build();

// Operation: AllocationPeriodsV2_Get

/**
 * operation ID: AllocationPeriodsV2_Get
 * `GET: /v2/allocationperiods`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard,
 * Bookkeeping</b></p>
 */
export const AllocationPeriodsV2_Get = buildCall() //
  .method('get')
  .path('/v2/allocationperiods')
  .parseJson(withRuntype(paginatedResponseAllocationPeriodApiRt))
  .build();

// Operation: AllocationPeriodsV2_Post

const allocationPeriodsV2_PostArgsRt = rt
  .Record({ allocationPlans: rt.Array(allocationPlanRt) })
  .asReadonly();

/**
 * operation ID: AllocationPeriodsV2_Post
 * `POST: /v2/allocationperiods`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard,
 * Bookkeeping</b></p>
 */
export const AllocationPeriodsV2_Post = buildCall() //
  .args<rt.Static<typeof allocationPeriodsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/allocationperiods')
  .body((args) => args.allocationPlans)
  .build();

// Operation: AllocationPeriodsV2_Get

const allocationPeriodsV2_GetArgsRt = rt
  .Record({ allocationPeriodId: rt.String })
  .asReadonly();

/**
 * operation ID: AllocationPeriodsV2_Get
 * `GET: /v2/allocationperiods/{allocationPeriodId}`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard,
 * Bookkeeping</b></p>
 */
export const AllocationPeriodsV2_Get = buildCall() //
  .args<rt.Static<typeof allocationPeriodsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/allocationperiods/${args.allocationPeriodId}`)
  .parseJson(withRuntype(allocationPeriodApiRt))
  .build();

// Operation: ApprovalV2_ApproveVatReport

const approvalV2_ApproveVatReportArgsRt = rt
  .Record({ approvalModel: approvalApiRt, id: rt.String })
  .asReadonly();

/**
 * operation ID: ApprovalV2_ApproveVatReport
 * `PUT: /v2/approval/vatreport/{id}`
 * Make sure you have the correct approval settings in company
 * settings and permissions on user level.<p>Requires any of
 * the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const ApprovalV2_ApproveVatReport = buildCall() //
  .args<rt.Static<typeof approvalV2_ApproveVatReportArgsRt>>()
  .method('put')
  .path((args) => `/v2/approval/vatreport/${args.id}`)
  .body((args) => args.approvalModel)
  .parseJson(withRuntype(vatReportApiRt))
  .build();

// Operation: ApprovalV2_ApproveInvoice

const approvalV2_ApproveInvoiceArgsRt = rt
  .Record({ approvalModel: approvalApiRt, id: rt.String })
  .asReadonly();

const approvalV2_ApproveInvoiceResponseBodyRt = rt.String;

/**
 * operation ID: ApprovalV2_ApproveInvoice
 * `PUT: /v2/approval/supplierinvoice/{id}`
 * Make sure you have the correct approval settings in company
 * settings and permissions on user level.<p>Requires any of
 * the following scopes: <br><b>ea:purchase</b></p><p>Available
 * in any of the following variants: <br><b>Pro, Standard,
 * Bookkeeping, Solo</b></p>
 */
export const ApprovalV2_ApproveInvoice = buildCall() //
  .args<rt.Static<typeof approvalV2_ApproveInvoiceArgsRt>>()
  .method('put')
  .path((args) => `/v2/approval/supplierinvoice/${args.id}`)
  .body((args) => args.approvalModel)
  .parseJson(withRuntype(approvalV2_ApproveInvoiceResponseBodyRt))
  .build();

// Operation: AppStoreActivationStatusV2_Get

/**
 * operation ID: AppStoreActivationStatusV2_Get
 * `GET: /v2/appstore/status`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const AppStoreActivationStatusV2_Get = buildCall() //
  .method('get')
  .path('/v2/appstore/status')
  .parseJson(withRuntype(paginatedResponseAppStoreActivationStatusApiRt))
  .build();

// Operation: AppStoreActivationStatusV2_Put

const appStoreActivationStatusV2_PutArgsRt = rt
  .Record({ statusDto: appStoreActivationStatusApiRt })
  .asReadonly();

/**
 * operation ID: AppStoreActivationStatusV2_Put
 * `PUT: /v2/appstore/status`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const AppStoreActivationStatusV2_Put = buildCall() //
  .args<rt.Static<typeof appStoreActivationStatusV2_PutArgsRt>>()
  .method('put')
  .path('/v2/appstore/status')
  .body((args) => args.statusDto)
  .parseJson(withRuntype(appStoreActivationStatusApiRt))
  .build();

// Operation: ArticleAccountCodingsV2_Get

const articleAccountCodingsV2_GetArgsRt = rt
  .Record({ vatRateDate: rt.String })
  .asPartial()
  .asReadonly();

/**
 * operation ID: ArticleAccountCodingsV2_Get
 * `GET: /v2/articleaccountcodings`
 * Vat rates are on present UTC time. Specify date (yyyy-MM-dd)
 * to get for specific date.<p>Requires any of the following
 * scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const ArticleAccountCodingsV2_Get = buildCall() //
  .args<rt.Static<typeof articleAccountCodingsV2_GetArgsRt>>()
  .method('get')
  .path('/v2/articleaccountcodings')
  .query((args) => new URLSearchParams(pickQueryValues(args, 'vatRateDate')))
  .parseJson(withRuntype(paginatedResponseArticleAccountCodingApiRt))
  .build();

// Operation: ArticleAccountCodingsV2_Get

const articleAccountCodingsV2_GetArgsRt = rt.Intersect(
  rt.Record({ articleAccountCodingId: rt.String }).asReadonly(),
  rt.Record({ vatRateDate: rt.String }).asPartial().asReadonly(),
);

/**
 * operation ID: ArticleAccountCodingsV2_Get
 * `GET: /v2/articleaccountcodings/{articleAccountCodingId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const ArticleAccountCodingsV2_Get = buildCall() //
  .args<rt.Static<typeof articleAccountCodingsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/articleaccountcodings/${args.articleAccountCodingId}`)
  .query((args) => new URLSearchParams(pickQueryValues(args, 'vatRateDate')))
  .parseJson(withRuntype(articleAccountCodingAPIRt))
  .build();

// Operation: ArticleLabelsV2_Get

/**
 * operation ID: ArticleLabelsV2_Get
 * `GET: /v2/articlelabels`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const ArticleLabelsV2_Get = buildCall() //
  .method('get')
  .path('/v2/articlelabels')
  .parseJson(withRuntype(paginatedResponseArticleLabelApiRt))
  .build();

// Operation: ArticleLabelsV2_Post

const articleLabelsV2_PostArgsRt = rt
  .Record({ fromArticleLabel: articleLabelApiRt })
  .asReadonly();

/**
 * operation ID: ArticleLabelsV2_Post
 * `POST: /v2/articlelabels`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const ArticleLabelsV2_Post = buildCall() //
  .args<rt.Static<typeof articleLabelsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/articlelabels')
  .body((args) => args.fromArticleLabel)
  .build();

// Operation: ArticleLabelsV2_Get

const articleLabelsV2_GetArgsRt = rt
  .Record({ articleLabelId: rt.String })
  .asReadonly();

/**
 * operation ID: ArticleLabelsV2_Get
 * `GET: /v2/articlelabels/{articleLabelId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const ArticleLabelsV2_Get = buildCall() //
  .args<rt.Static<typeof articleLabelsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/articlelabels/${args.articleLabelId}`)
  .parseJson(withRuntype(articleLabelApiRt))
  .build();

// Operation: ArticleLabelsV2_Put

const articleLabelsV2_PutArgsRt = rt
  .Record({ articleLabelId: rt.String, fromArticleLabel: articleLabelApiRt })
  .asReadonly();

/**
 * operation ID: ArticleLabelsV2_Put
 * `PUT: /v2/articlelabels/{articleLabelId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const ArticleLabelsV2_Put = buildCall() //
  .args<rt.Static<typeof articleLabelsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/articlelabels/${args.articleLabelId}`)
  .body((args) => args.fromArticleLabel)
  .parseJson(withRuntype(articleLabelApiRt))
  .build();

// Operation: ArticleLabelsV2_Delete

const articleLabelsV2_DeleteArgsRt = rt
  .Record({ articleLabelId: rt.String })
  .asReadonly();

/**
 * operation ID: ArticleLabelsV2_Delete
 * `DELETE: /v2/articlelabels/{articleLabelId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const ArticleLabelsV2_Delete = buildCall() //
  .args<rt.Static<typeof articleLabelsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/articlelabels/${args.articleLabelId}`)
  .parseJson(withRuntype(articleLabelApiRt))
  .build();

// Operation: ArticlesV2_Get

const articlesV2_GetArgsRt = rt
  .Record({ showPricesWithTwoDecimals: rt.Boolean })
  .asPartial()
  .asReadonly();

/**
 * operation ID: ArticlesV2_Get
 * `GET: /v2/articles`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const ArticlesV2_Get = buildCall() //
  .args<rt.Static<typeof articlesV2_GetArgsRt>>()
  .method('get')
  .path('/v2/articles')
  .query(
    (args) =>
      new URLSearchParams(pickQueryValues(args, 'showPricesWithTwoDecimals')),
  )
  .parseJson(withRuntype(paginatedResponseArticleApiRt))
  .build();

// Operation: ArticlesV2_Post

const articlesV2_PostArgsRt = rt.Record({ article: articleApiRt }).asReadonly();

/**
 * operation ID: ArticlesV2_Post
 * `POST: /v2/articles`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const ArticlesV2_Post = buildCall() //
  .args<rt.Static<typeof articlesV2_PostArgsRt>>()
  .method('post')
  .path('/v2/articles')
  .body((args) => args.article)
  .build();

// Operation: ArticlesV2_Get

const articlesV2_GetArgsRt = rt.Intersect(
  rt.Record({ articleId: rt.String }).asReadonly(),
  rt.Record({ showPricesWithTwoDecimals: rt.Boolean }).asPartial().asReadonly(),
);

/**
 * operation ID: ArticlesV2_Get
 * `GET: /v2/articles/{articleId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const ArticlesV2_Get = buildCall() //
  .args<rt.Static<typeof articlesV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/articles/${args.articleId}`)
  .query(
    (args) =>
      new URLSearchParams(pickQueryValues(args, 'showPricesWithTwoDecimals')),
  )
  .parseJson(withRuntype(articleApiRt))
  .build();

// Operation: ArticlesV2_Put

const articlesV2_PutArgsRt = rt
  .Record({ articleId: rt.String, article: articleApiRt })
  .asReadonly();

/**
 * operation ID: ArticlesV2_Put
 * `PUT: /v2/articles/{articleId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const ArticlesV2_Put = buildCall() //
  .args<rt.Static<typeof articlesV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/articles/${args.articleId}`)
  .body((args) => args.article)
  .parseJson(withRuntype(articleApiRt))
  .build();

// Operation: AttachmentLinksV2_Post

const attachmentLinksV2_PostArgsRt = rt
  .Record({ attachmentLinks: attachmentLinkApiRt })
  .asReadonly();

/**
 * operation ID: AttachmentLinksV2_Post
 * `POST: /v2/attachmentlinks`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:purchase</b></p><p>Available in any
 * of the following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const AttachmentLinksV2_Post = buildCall() //
  .args<rt.Static<typeof attachmentLinksV2_PostArgsRt>>()
  .method('post')
  .path('/v2/attachmentlinks')
  .body((args) => args.attachmentLinks)
  .parseJson(withRuntype(attachmentLinkApiRt))
  .build();

// Operation: AttachmentLinksV2_Delete

const attachmentLinksV2_DeleteArgsRt = rt
  .Record({ attachmentId: rt.String })
  .asReadonly();

const attachmentLinksV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: AttachmentLinksV2_Delete
 * `DELETE: /v2/attachmentlinks/{attachmentId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:purchase</b></p><p>Available in any
 * of the following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const AttachmentLinksV2_Delete = buildCall() //
  .args<rt.Static<typeof attachmentLinksV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/attachmentlinks/${args.attachmentId}`)
  .parseJson(withRuntype(attachmentLinksV2_DeleteResponseBodyRt))
  .build();

// Operation: AttachmentsV2_Get

const attachmentsV2_GetArgsRt = rt
  .Record({ includeMatched: rt.Boolean, includeTemporaryUrl: rt.Boolean })
  .asPartial()
  .asReadonly();

/**
 * operation ID: AttachmentsV2_Get
 * `GET: /v2/attachments`
 * If you don't need to download the attachment we advise using
 * the includeTemporaryUrl parameter set to false in order to
 * increase performance.<p>Requires any of the following
 * scopes: <br><b>ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const AttachmentsV2_Get = buildCall() //
  .args<rt.Static<typeof attachmentsV2_GetArgsRt>>()
  .method('get')
  .path('/v2/attachments')
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(args, 'includeMatched', 'includeTemporaryUrl'),
      ),
  )
  .parseJson(withRuntype(paginatedResponseAttachmentResultApiRt))
  .build();

// Operation: AttachmentsV2_Post

const attachmentsV2_PostArgsRt = rt
  .Record({ postedAttachment: attachmentUploadApiRt })
  .asReadonly();

/**
 * operation ID: AttachmentsV2_Post
 * `POST: /v2/attachments`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:accounting</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo</b></p>
 */
export const AttachmentsV2_Post = buildCall() //
  .args<rt.Static<typeof attachmentsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/attachments')
  .body((args) => args.postedAttachment)
  .build();

// Operation: AttachmentsV2_Get

const attachmentsV2_GetArgsRt = rt
  .Record({ attachmentId: rt.String })
  .asReadonly();

/**
 * operation ID: AttachmentsV2_Get
 * `GET: /v2/attachments/{attachmentId}`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly, ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const AttachmentsV2_Get = buildCall() //
  .args<rt.Static<typeof attachmentsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/attachments/${args.attachmentId}`)
  .parseJson(withRuntype(attachmentResultApiRt))
  .build();

// Operation: AttachmentsV2_Delete

const attachmentsV2_DeleteArgsRt = rt
  .Record({ attachmentId: rt.String })
  .asReadonly();

const attachmentsV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: AttachmentsV2_Delete
 * `DELETE: /v2/attachments/{attachmentId}`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:accounting</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo</b></p>
 */
export const AttachmentsV2_Delete = buildCall() //
  .args<rt.Static<typeof attachmentsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/attachments/${args.attachmentId}`)
  .parseJson(withRuntype(attachmentsV2_DeleteResponseBodyRt))
  .build();

// Operation: BankAccountsV2_Get

/**
 * operation ID: BankAccountsV2_Get
 * `GET: /v2/bankaccounts`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Visma Lön Smart</b></p>
 */
export const BankAccountsV2_Get = buildCall() //
  .method('get')
  .path('/v2/bankaccounts')
  .parseJson(withRuntype(paginatedResponseBankAccountApiRt))
  .build();

// Operation: BankAccountsV2_Post

const bankAccountsV2_PostArgsRt = rt
  .Record({ bankAccount: bankAccountApiRt })
  .asReadonly();

/**
 * operation ID: BankAccountsV2_Post
 * `POST: /v2/bankaccounts`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Visma Lön Smart</b></p>
 */
export const BankAccountsV2_Post = buildCall() //
  .args<rt.Static<typeof bankAccountsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/bankaccounts')
  .body((args) => args.bankAccount)
  .build();

// Operation: BankAccountsV2_Get

const bankAccountsV2_GetArgsRt = rt
  .Record({ bankAccountId: rt.String })
  .asReadonly();

/**
 * operation ID: BankAccountsV2_Get
 * `GET: /v2/bankaccounts/{bankAccountId}`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Visma Lön Smart</b></p>
 */
export const BankAccountsV2_Get = buildCall() //
  .args<rt.Static<typeof bankAccountsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/bankaccounts/${args.bankAccountId}`)
  .parseJson(withRuntype(bankAccountApiRt))
  .build();

// Operation: BankAccountsV2_Put

const bankAccountsV2_PutArgsRt = rt
  .Record({ bankAccountId: rt.String, bankAccountChanges: bankAccountApiRt })
  .asReadonly();

/**
 * operation ID: BankAccountsV2_Put
 * `PUT: /v2/bankaccounts/{bankAccountId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Visma Lön Smart</b></p>
 */
export const BankAccountsV2_Put = buildCall() //
  .args<rt.Static<typeof bankAccountsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/bankaccounts/${args.bankAccountId}`)
  .body((args) => args.bankAccountChanges)
  .parseJson(withRuntype(bankAccountApiRt))
  .build();

// Operation: BankAccountsV2_Delete

const bankAccountsV2_DeleteArgsRt = rt
  .Record({ bankAccountId: rt.String })
  .asReadonly();

const bankAccountsV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: BankAccountsV2_Delete
 * `DELETE: /v2/bankaccounts/{bankAccountId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Visma Lön Smart</b></p>
 */
export const BankAccountsV2_Delete = buildCall() //
  .args<rt.Static<typeof bankAccountsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/bankaccounts/${args.bankAccountId}`)
  .parseJson(withRuntype(bankAccountsV2_DeleteResponseBodyRt))
  .build();

// Operation: BankTransactionsV2_Get

const bankTransactionsV2_GetArgsRt = rt.Intersect(
  rt.Record({ bankAccountId: rt.String }).asReadonly(),
  rt
    .Record({ fromDate: rt.String, toDate: rt.String })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: BankTransactionsV2_Get
 * `GET: /v2/banktransactions/{bankAccountId}/matched`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard,
 * Bookkeeping</b></p>
 */
export const BankTransactionsV2_Get = buildCall() //
  .args<rt.Static<typeof bankTransactionsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/banktransactions/${args.bankAccountId}/matched`)
  .query(
    (args) => new URLSearchParams(pickQueryValues(args, 'fromDate', 'toDate')),
  )
  .parseJson(withRuntype(paginatedResponseBankTransactionApiRt))
  .build();

// Operation: BankTransactionsV2_GetUnmatched

const bankTransactionsV2_GetUnmatchedArgsRt = rt.Intersect(
  rt.Record({ bankAccountId: rt.String }).asReadonly(),
  rt
    .Record({ fromDate: rt.String, toDate: rt.String })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: BankTransactionsV2_GetUnmatched
 * `GET: /v2/banktransactions/{bankAccountId}/unmatched`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard,
 * Bookkeeping</b></p>
 */
export const BankTransactionsV2_GetUnmatched = buildCall() //
  .args<rt.Static<typeof bankTransactionsV2_GetUnmatchedArgsRt>>()
  .method('get')
  .path((args) => `/v2/banktransactions/${args.bankAccountId}/unmatched`)
  .query(
    (args) => new URLSearchParams(pickQueryValues(args, 'fromDate', 'toDate')),
  )
  .parseJson(withRuntype(paginatedResponseBankTransactionApiRt))
  .build();

// Operation: BankTransactionsV2_GetMatchedById

const bankTransactionsV2_GetMatchedByIdArgsRt = rt
  .Record({ bankAccountId: rt.String, bankTransactionId: rt.String })
  .asReadonly();

/**
 * operation ID: BankTransactionsV2_GetMatchedById
 * `GET:
 * /v2/banktransactions/{bankAccountId}/{bankTransactionId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard,
 * Bookkeeping</b></p>
 */
export const BankTransactionsV2_GetMatchedById = buildCall() //
  .args<rt.Static<typeof bankTransactionsV2_GetMatchedByIdArgsRt>>()
  .method('get')
  .path(
    (args) =>
      `/v2/banktransactions/${args.bankAccountId}/${args.bankTransactionId}`,
  )
  .parseJson(withRuntype(bankTransactionApiRt))
  .build();

// Operation: BankV2_Get

/**
 * operation ID: BankV2_Get
 * `GET: /v2/banks`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const BankV2_Get = buildCall() //
  .method('get')
  .path('/v2/banks')
  .parseJson(withRuntype(paginatedResponseBankApiRt))
  .build();

// Operation: CompanySettingsV2_Get

/**
 * operation ID: CompanySettingsV2_Get
 * `GET: /v2/companysettings`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const CompanySettingsV2_Get = buildCall() //
  .method('get')
  .path('/v2/companysettings')
  .parseJson(withRuntype(companySettingsApiRt))
  .build();

// Operation: CompanySettingsV2_Put

const companySettingsV2_PutArgsRt = rt
  .Record({ companySettings: companySettingsApiRt })
  .asReadonly();

/**
 * operation ID: CompanySettingsV2_Put
 * `PUT: /v2/companysettings`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo, Visma Lön Smart</b></p>
 */
export const CompanySettingsV2_Put = buildCall() //
  .args<rt.Static<typeof companySettingsV2_PutArgsRt>>()
  .method('put')
  .path('/v2/companysettings')
  .body((args) => args.companySettings)
  .parseJson(withRuntype(companySettingsApiRt))
  .build();

// Operation: CompanySettingsV2_UpdateAccountingLockSettings

const companySettingsV2_UpdateAccountingLockSettingsArgsRt = rt
  .Record({ accountingLockSettingsApi: accountingLockSettingsApiRt })
  .asReadonly();

/**
 * operation ID: CompanySettingsV2_UpdateAccountingLockSettings
 * `PUT: /v2/companysettings/accountinglocksettings`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo, Visma Lön Smart</b></p>
 */
export const CompanySettingsV2_UpdateAccountingLockSettings = buildCall() //
  .args<
    rt.Static<typeof companySettingsV2_UpdateAccountingLockSettingsArgsRt>
  >()
  .method('put')
  .path('/v2/companysettings/accountinglocksettings')
  .body((args) => args.accountingLockSettingsApi)
  .parseJson(withRuntype(companySettingsApiRt))
  .build();

// Operation: CompanySettingsV2_UpdateRotRutSettings

const companySettingsV2_UpdateRotRutSettingsArgsRt = rt
  .Record({ rotRutSettingsApi: companyRotRutSettingsApiRt })
  .asReadonly();

/**
 * operation ID: CompanySettingsV2_UpdateRotRutSettings
 * `PUT: /v2/companysettings/rotrut`
 * Only for swedish companies and if the company uses rot
 * reduced invoicing. Use PUT v2/companysettings to change
 * that.<p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo, Visma Lön Smart</b></p>
 */
export const CompanySettingsV2_UpdateRotRutSettings = buildCall() //
  .args<rt.Static<typeof companySettingsV2_UpdateRotRutSettingsArgsRt>>()
  .method('put')
  .path('/v2/companysettings/rotrut')
  .body((args) => args.rotRutSettingsApi)
  .parseJson(withRuntype(companySettingsApiRt))
  .build();

// Operation: CostCenterItemsV2_Get

const costCenterItemsV2_GetArgsRt = rt
  .Record({ itemId: rt.String })
  .asReadonly();

/**
 * operation ID: CostCenterItemsV2_Get
 * `GET: /v2/costcenteritems/{itemId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const CostCenterItemsV2_Get = buildCall() //
  .args<rt.Static<typeof costCenterItemsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/costcenteritems/${args.itemId}`)
  .parseJson(withRuntype(costCenterItemApiRt))
  .build();

// Operation: CostCenterItemsV2_Post

const costCenterItemsV2_PostArgsRt = rt
  .Record({ costCenterItem: costCenterItemApiRt })
  .asReadonly();

/**
 * operation ID: CostCenterItemsV2_Post
 * `POST: /v2/costcenteritems`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:sales</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const CostCenterItemsV2_Post = buildCall() //
  .args<rt.Static<typeof costCenterItemsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/costcenteritems')
  .body((args) => args.costCenterItem)
  .build();

// Operation: CostCenterItemsV2_Put

const costCenterItemsV2_PutArgsRt = rt
  .Record({ costCenterItemId: rt.String, costCenterItem: costCenterItemApiRt })
  .asReadonly();

/**
 * operation ID: CostCenterItemsV2_Put
 * `PUT: /v2/costcenteritems/{costCenterItemId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:sales</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const CostCenterItemsV2_Put = buildCall() //
  .args<rt.Static<typeof costCenterItemsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/costcenteritems/${args.costCenterItemId}`)
  .body((args) => args.costCenterItem)
  .parseJson(withRuntype(costCenterItemApiRt))
  .build();

// Operation: CostCentersV2_Get

/**
 * operation ID: CostCentersV2_Get
 * `GET: /v2/costcenters`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const CostCentersV2_Get = buildCall() //
  .method('get')
  .path('/v2/costcenters')
  .parseJson(withRuntype(paginatedResponseCostCenterApiRt))
  .build();

// Operation: CostCentersV2_Get

const costCentersV2_GetArgsRt = rt
  .Record({ id: rt.String, costCenter: costCenterApiRt })
  .asReadonly();

/**
 * operation ID: CostCentersV2_Get
 * `PUT: /v2/costcenters/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:sales</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const CostCentersV2_Get = buildCall() //
  .args<rt.Static<typeof costCentersV2_GetArgsRt>>()
  .method('put')
  .path((args) => `/v2/costcenters/${args.id}`)
  .body((args) => args.costCenter)
  .parseJson(withRuntype(costCenterApiRt))
  .build();

// Operation: CountriesV2_Get

/**
 * operation ID: CountriesV2_Get
 * `GET: /v2/countries`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing, Solo,
 * Bookkeeping</b></p>
 */
export const CountriesV2_Get = buildCall() //
  .method('get')
  .path('/v2/countries')
  .parseJson(withRuntype(paginatedResponseCountryApiRt))
  .build();

// Operation: CountriesV2_Get

const countriesV2_GetArgsRt = rt
  .Record({ countrycode: rt.String })
  .asReadonly();

/**
 * operation ID: CountriesV2_Get
 * `GET: /v2/countries/{countrycode}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing, Solo,
 * Bookkeeping</b></p>
 */
export const CountriesV2_Get = buildCall() //
  .args<rt.Static<typeof countriesV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/countries/${args.countrycode}`)
  .parseJson(withRuntype(countryApiRt))
  .build();

// Operation: CurrenciesV2_Get

/**
 * operation ID: CurrenciesV2_Get
 * `GET: /v2/currencies`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping</b></p>
 */
export const CurrenciesV2_Get = buildCall() //
  .method('get')
  .path('/v2/currencies')
  .parseJson(withRuntype(paginatedResponseCurrencyApiRt))
  .build();

// Operation: CustomerInvoiceDraftsV2_Get

/**
 * operation ID: CustomerInvoiceDraftsV2_Get
 * `GET: /v2/customerinvoicedrafts`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoiceDraftsV2_Get = buildCall() //
  .method('get')
  .path('/v2/customerinvoicedrafts')
  .parseJson(withRuntype(paginatedResponseCustomerInvoiceDraftApiRt))
  .build();

// Operation: CustomerInvoiceDraftsV2_Post

const customerInvoiceDraftsV2_PostArgsRt = rt
  .Record({ customerInvoiceDraft: customerInvoiceDraftApiRt })
  .asReadonly();

/**
 * operation ID: CustomerInvoiceDraftsV2_Post
 * `POST: /v2/customerinvoicedrafts`
 * ReversedConstructionServicesVatFree attribute on a
 * CustomerInvoiceDraftRow shall only be used for articels with
 * reverse VAT charge.
 * For other VAT free articles
 * ReversedConstructionServicesVatFree shall be set to
 * 'false'.<p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomerInvoiceDraftsV2_Post = buildCall() //
  .args<rt.Static<typeof customerInvoiceDraftsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/customerinvoicedrafts')
  .body((args) => args.customerInvoiceDraft)
  .build();

// Operation: CustomerInvoiceDraftsV2_Get

const customerInvoiceDraftsV2_GetArgsRt = rt
  .Record({ invoiceDraftId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomerInvoiceDraftsV2_Get
 * `GET: /v2/customerinvoicedrafts/{invoiceDraftId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoiceDraftsV2_Get = buildCall() //
  .args<rt.Static<typeof customerInvoiceDraftsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/customerinvoicedrafts/${args.invoiceDraftId}`)
  .parseJson(withRuntype(customerInvoiceDraftApiRt))
  .build();

// Operation: CustomerInvoiceDraftsV2_Put

const customerInvoiceDraftsV2_PutArgsRt = rt
  .Record({
    customerInvoiceDraftId: rt.String,
    customerInvoiceDraft: customerInvoiceDraftApiRt,
  })
  .asReadonly();

/**
 * operation ID: CustomerInvoiceDraftsV2_Put
 * `PUT: /v2/customerinvoicedrafts/{customerInvoiceDraftId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomerInvoiceDraftsV2_Put = buildCall() //
  .args<rt.Static<typeof customerInvoiceDraftsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/customerinvoicedrafts/${args.customerInvoiceDraftId}`)
  .body((args) => args.customerInvoiceDraft)
  .parseJson(withRuntype(customerInvoiceDraftApiRt))
  .build();

// Operation: CustomerInvoiceDraftsV2_Delete

const customerInvoiceDraftsV2_DeleteArgsRt = rt
  .Record({ customerInvoiceDraftId: rt.String })
  .asReadonly();

const customerInvoiceDraftsV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: CustomerInvoiceDraftsV2_Delete
 * `DELETE: /v2/customerinvoicedrafts/{customerInvoiceDraftId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomerInvoiceDraftsV2_Delete = buildCall() //
  .args<rt.Static<typeof customerInvoiceDraftsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/customerinvoicedrafts/${args.customerInvoiceDraftId}`)
  .parseJson(withRuntype(customerInvoiceDraftsV2_DeleteResponseBodyRt))
  .build();

// Operation: CustomerInvoiceDraftsV2_ConvertToInvoice

const customerInvoiceDraftsV2_ConvertToInvoiceArgsRt = rt.Intersect(
  rt
    .Record({
      customerInvoiceDraftId: rt.String,
      invoiceValidations: customerInvoiceDraftValidationApiRt,
    })
    .asReadonly(),
  rt
    .Record({
      keepOriginalDraftDate: rt.Boolean,
      overrideCompanyKeepOriginalDraftDate: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: CustomerInvoiceDraftsV2_ConvertToInvoice
 * `POST:
 * /v2/customerinvoicedrafts/{customerInvoiceDraftId}/convert`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomerInvoiceDraftsV2_ConvertToInvoice = buildCall() //
  .args<rt.Static<typeof customerInvoiceDraftsV2_ConvertToInvoiceArgsRt>>()
  .method('post')
  .path(
    (args) =>
      `/v2/customerinvoicedrafts/${args.customerInvoiceDraftId}/convert`,
  )
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(
          args,
          'keepOriginalDraftDate',
          'overrideCompanyKeepOriginalDraftDate',
        ),
      ),
  )
  .body((args) => args.invoiceValidations)
  .build();

// Operation: CustomerInvoicesV2_Get

const customerInvoicesV2_GetArgsRt = rt
  .Record({ modifiedSinceUtc: rt.String })
  .asPartial()
  .asReadonly();

/**
 * operation ID: CustomerInvoicesV2_Get
 * `GET: /v2/customerinvoices`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoicesV2_Get = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_GetArgsRt>>()
  .method('get')
  .path('/v2/customerinvoices')
  .query(
    (args) => new URLSearchParams(pickQueryValues(args, 'modifiedSinceUtc')),
  )
  .parseJson(withRuntype(paginatedResponseCustomerInvoiceApiRt))
  .build();

// Operation: CustomerInvoicesV2_Post

const customerInvoicesV2_PostArgsRt = rt.Intersect(
  rt.Record({ invoiceApi: customerInvoiceApiRt }).asReadonly(),
  rt
    .Record({ rotReducedAutomaticDistribution: rt.Boolean })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: CustomerInvoicesV2_Post
 * `POST: /v2/customerinvoices`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoicesV2_Post = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_PostArgsRt>>()
  .method('post')
  .path('/v2/customerinvoices')
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(args, 'rotReducedAutomaticDistribution'),
      ),
  )
  .body((args) => args.invoiceApi)
  .build();

// Operation: CustomerInvoicesV2_Get

const customerInvoicesV2_GetArgsRt = rt
  .Record({ invoiceId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomerInvoicesV2_Get
 * `GET: /v2/customerinvoices/{invoiceId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoicesV2_Get = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/customerinvoices/${args.invoiceId}`)
  .parseJson(withRuntype(customerInvoiceApiRt))
  .build();

// Operation: CustomerInvoicesV2_GetPdfReplacement

const customerInvoicesV2_GetPdfReplacementArgsRt = rt
  .Record({ invoiceId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomerInvoicesV2_GetPdfReplacement
 * `GET: /v2/customerinvoices/{invoiceId}/pdf`
 * As invoices are generated at request time, if not generated
 * before, this endpoint sometimes has higher than average
 * response time.<p>Requires any of the following scopes:
 * <br><b>ea:sales, ea:sales_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Solo</b></p>
 */
export const CustomerInvoicesV2_GetPdfReplacement = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_GetPdfReplacementArgsRt>>()
  .method('get')
  .path((args) => `/v2/customerinvoices/${args.invoiceId}/pdf`)
  .parseJson(withRuntype(invoiceUrlApiRt))
  .build();

// Operation: CustomerInvoicesV2_Post

const customerInvoicesV2_PostArgsRt = rt
  .Record({ customerInvoicePayment: invoicePaymentApiRt, invoiceId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomerInvoicesV2_Post
 * `POST: /v2/customerinvoices/{invoiceId}/payments`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomerInvoicesV2_Post = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_PostArgsRt>>()
  .method('post')
  .path((args) => `/v2/customerinvoices/${args.invoiceId}/payments`)
  .body((args) => args.customerInvoicePayment)
  .build();

// Operation: CustomerInvoicesV2_SendEmail

const customerInvoicesV2_SendEmailArgsRt = rt
  .Record({ invoiceId: rt.String, emailApi: emailApiRt })
  .asReadonly();

const customerInvoicesV2_SendEmailResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: CustomerInvoicesV2_SendEmail
 * `POST: /v2/customerinvoices/{invoiceId}/email`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoicesV2_SendEmail = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_SendEmailArgsRt>>()
  .method('post')
  .path((args) => `/v2/customerinvoices/${args.invoiceId}/email`)
  .body((args) => args.emailApi)
  .parseJson(withRuntype(customerInvoicesV2_SendEmailResponseBodyRt))
  .build();

// Operation: CustomerInvoicesV2_SendPaymentReminderEmail

const customerInvoicesV2_SendPaymentReminderEmailArgsRt = rt
  .Record({ invoiceId: rt.String, emailApi: paymentReminderEmailApiRt })
  .asReadonly();

const customerInvoicesV2_SendPaymentReminderEmailResponseBodyRt = rt.Dictionary(
  rt.Unknown,
);

/**
 * operation ID: CustomerInvoicesV2_SendPaymentReminderEmail
 * `POST: /v2/customerinvoices/{invoiceId}/paymentreminders`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoicesV2_SendPaymentReminderEmail = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_SendPaymentReminderEmailArgsRt>>()
  .method('post')
  .path((args) => `/v2/customerinvoices/${args.invoiceId}/paymentreminders`)
  .body((args) => args.emailApi)
  .parseJson(
    withRuntype(customerInvoicesV2_SendPaymentReminderEmailResponseBodyRt),
  )
  .build();

// Operation: CustomerInvoicesV2_Print

const customerInvoicesV2_PrintArgsRt = rt
  .Record({ invoiceId: rt.String })
  .asReadonly();

const customerInvoicesV2_PrintResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: CustomerInvoicesV2_Print
 * `GET: /v2/customerinvoices/{invoiceId}/print`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerInvoicesV2_Print = buildCall() //
  .args<rt.Static<typeof customerInvoicesV2_PrintArgsRt>>()
  .method('get')
  .path((args) => `/v2/customerinvoices/${args.invoiceId}/print`)
  .parseJson(withRuntype(customerInvoicesV2_PrintResponseBodyRt))
  .build();

// Operation: CustomerLabelsV2_Get

/**
 * operation ID: CustomerLabelsV2_Get
 * `GET: /v2/customerlabels`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const CustomerLabelsV2_Get = buildCall() //
  .method('get')
  .path('/v2/customerlabels')
  .parseJson(withRuntype(paginatedResponseCustomerLabelApiRt))
  .build();

// Operation: CustomerLabelsV2_Post

const customerLabelsV2_PostArgsRt = rt
  .Record({ fromCustomerLabel: customerLabelApiRt })
  .asReadonly();

/**
 * operation ID: CustomerLabelsV2_Post
 * `POST: /v2/customerlabels`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const CustomerLabelsV2_Post = buildCall() //
  .args<rt.Static<typeof customerLabelsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/customerlabels')
  .body((args) => args.fromCustomerLabel)
  .build();

// Operation: CustomerLabelsV2_Get

const customerLabelsV2_GetArgsRt = rt
  .Record({ customerLabelId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomerLabelsV2_Get
 * `GET: /v2/customerlabels/{customerLabelId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const CustomerLabelsV2_Get = buildCall() //
  .args<rt.Static<typeof customerLabelsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/customerlabels/${args.customerLabelId}`)
  .parseJson(withRuntype(customerLabelApiRt))
  .build();

// Operation: CustomerLabelsV2_Put

const customerLabelsV2_PutArgsRt = rt
  .Record({ customerLabelId: rt.String, fromCustomerLabel: customerLabelApiRt })
  .asReadonly();

/**
 * operation ID: CustomerLabelsV2_Put
 * `PUT: /v2/customerlabels/{customerLabelId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const CustomerLabelsV2_Put = buildCall() //
  .args<rt.Static<typeof customerLabelsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/customerlabels/${args.customerLabelId}`)
  .body((args) => args.fromCustomerLabel)
  .parseJson(withRuntype(customerLabelApiRt))
  .build();

// Operation: CustomerLabelsV2_Delete

const customerLabelsV2_DeleteArgsRt = rt
  .Record({ customerLabelId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomerLabelsV2_Delete
 * `DELETE: /v2/customerlabels/{customerLabelId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const CustomerLabelsV2_Delete = buildCall() //
  .args<rt.Static<typeof customerLabelsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/customerlabels/${args.customerLabelId}`)
  .parseJson(withRuntype(customerLabelApiRt))
  .build();

// Operation: CustomerLedgerItemsV2_Get

/**
 * operation ID: CustomerLedgerItemsV2_Get
 * `GET: /v2/customerledgeritems`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerLedgerItemsV2_Get = buildCall() //
  .method('get')
  .path('/v2/customerledgeritems')
  .parseJson(withRuntype(paginatedResponseCustomerLedgerItemApiRt))
  .build();

// Operation: CustomerLedgerItemsV2_Post

const customerLedgerItemsV2_PostArgsRt = rt
  .Record({ customerLedgerItem: customerLedgerItemApiRt })
  .asReadonly();

/**
 * operation ID: CustomerLedgerItemsV2_Post
 * `POST: /v2/customerledgeritems`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomerLedgerItemsV2_Post = buildCall() //
  .args<rt.Static<typeof customerLedgerItemsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/customerledgeritems')
  .body((args) => args.customerLedgerItem)
  .build();

// Operation: CustomerLedgerItemsV2_Get

const customerLedgerItemsV2_GetArgsRt = rt
  .Record({ customerLedgerItemId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomerLedgerItemsV2_Get
 * `GET: /v2/customerledgeritems/{customerLedgerItemId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomerLedgerItemsV2_Get = buildCall() //
  .args<rt.Static<typeof customerLedgerItemsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/customerledgeritems/${args.customerLedgerItemId}`)
  .parseJson(withRuntype(customerLedgerItemApiRt))
  .build();

// Operation: CustomerLedgerItemsV2_Post

const customerLedgerItemsV2_PostArgsRt = rt.Intersect(
  rt
    .Record({ customerLedgerItem: customerLedgerItemWithVoucherApiRt })
    .asReadonly(),
  rt
    .Record({
      useAutomaticVatCalculation: rt.Boolean,
      useDefaultVatCodes: rt.Boolean,
      useDefaultVoucherSeries: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: CustomerLedgerItemsV2_Post
 * `POST:
 * /v2/customerledgeritems/customerledgeritemswithvoucher`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomerLedgerItemsV2_Post = buildCall() //
  .args<rt.Static<typeof customerLedgerItemsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/customerledgeritems/customerledgeritemswithvoucher')
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(
          args,
          'useAutomaticVatCalculation',
          'useDefaultVatCodes',
          'useDefaultVoucherSeries',
        ),
      ),
  )
  .body((args) => args.customerLedgerItem)
  .build();

// Operation: CustomersV2_Get

/**
 * operation ID: CustomersV2_Get
 * `GET: /v2/customers`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomersV2_Get = buildCall() //
  .method('get')
  .path('/v2/customers')
  .parseJson(withRuntype(paginatedResponseCustomerApiRt))
  .build();

// Operation: CustomersV2_Post

const customersV2_PostArgsRt = rt
  .Record({ customer: customerApiRt })
  .asReadonly();

/**
 * operation ID: CustomersV2_Post
 * `POST: /v2/customers`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomersV2_Post = buildCall() //
  .args<rt.Static<typeof customersV2_PostArgsRt>>()
  .method('post')
  .path('/v2/customers')
  .body((args) => args.customer)
  .build();

// Operation: CustomersV2_Get

const customersV2_GetArgsRt = rt.Record({ customerId: rt.String }).asReadonly();

const customersV2_GetResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: CustomersV2_Get
 * `GET: /v2/customers/{customerId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomersV2_Get = buildCall() //
  .args<rt.Static<typeof customersV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/customers/${args.customerId}`)
  .parseJson(withRuntype(customersV2_GetResponseBodyRt))
  .build();

// Operation: CustomersV2_Put

const customersV2_PutArgsRt = rt
  .Record({ customerId: rt.String, updatedCustomer: customerApiRt })
  .asReadonly();

/**
 * operation ID: CustomersV2_Put
 * `PUT: /v2/customers/{customerId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomersV2_Put = buildCall() //
  .args<rt.Static<typeof customersV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/customers/${args.customerId}`)
  .body((args) => args.updatedCustomer)
  .parseJson(withRuntype(customerApiRt))
  .build();

// Operation: CustomersV2_Delete

const customersV2_DeleteArgsRt = rt
  .Record({ customerId: rt.String })
  .asReadonly();

const customersV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: CustomersV2_Delete
 * `DELETE: /v2/customers/{customerId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const CustomersV2_Delete = buildCall() //
  .args<rt.Static<typeof customersV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/customers/${args.customerId}`)
  .parseJson(withRuntype(customersV2_DeleteResponseBodyRt))
  .build();

// Operation: CustomersV2_GetAutoInvoiceRecipients

const customersV2_GetAutoInvoiceRecipientsArgsRt = rt
  .Record({ customerId: rt.String })
  .asReadonly();

/**
 * operation ID: CustomersV2_GetAutoInvoiceRecipients
 * `GET: /v2/customers/{customerId}/autoinvoicerecipients`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const CustomersV2_GetAutoInvoiceRecipients = buildCall() //
  .args<rt.Static<typeof customersV2_GetAutoInvoiceRecipientsArgsRt>>()
  .method('get')
  .path((args) => `/v2/customers/${args.customerId}/autoinvoicerecipients`)
  .parseJson(withRuntype(paginatedResponseAutoInvoiceAddressApiRt))
  .build();

// Operation: DeliveryMethodsV2_Get

/**
 * operation ID: DeliveryMethodsV2_Get
 * `GET: /v2/deliverymethods`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const DeliveryMethodsV2_Get = buildCall() //
  .method('get')
  .path('/v2/deliverymethods')
  .parseJson(withRuntype(paginatedResponseDeliveryMethodApiRt))
  .build();

// Operation: DeliveryMethodsV2_Get

const deliveryMethodsV2_GetArgsRt = rt
  .Record({ deliveryMethodId: rt.String })
  .asReadonly();

/**
 * operation ID: DeliveryMethodsV2_Get
 * `GET: /v2/deliverymethods/{deliveryMethodId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const DeliveryMethodsV2_Get = buildCall() //
  .args<rt.Static<typeof deliveryMethodsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/deliverymethods/${args.deliveryMethodId}`)
  .parseJson(withRuntype(deliveryMethodApiRt))
  .build();

// Operation: DeliveryTermsV2_Get

/**
 * operation ID: DeliveryTermsV2_Get
 * `GET: /v2/deliveryterms`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const DeliveryTermsV2_Get = buildCall() //
  .method('get')
  .path('/v2/deliveryterms')
  .parseJson(withRuntype(paginatedResponseDeliveryTermApiRt))
  .build();

// Operation: DeliveryTermsV2_Get

const deliveryTermsV2_GetArgsRt = rt
  .Record({ deliveryTermId: rt.String })
  .asReadonly();

/**
 * operation ID: DeliveryTermsV2_Get
 * `GET: /v2/deliveryterms/{deliveryTermId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const DeliveryTermsV2_Get = buildCall() //
  .args<rt.Static<typeof deliveryTermsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/deliveryterms/${args.deliveryTermId}`)
  .parseJson(withRuntype(deliveryTermApiRt))
  .build();

// Operation: DocumentsV2_Get

const documentsV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: DocumentsV2_Get
 * `GET: /v2/documents/{id}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo</b></p>
 */
export const DocumentsV2_Get = buildCall() //
  .args<rt.Static<typeof documentsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/documents/${args.id}`)
  .parseJson(withRuntype(documentApiRt))
  .build();

// Operation: FiscalYearsV2_Get

/**
 * operation ID: FiscalYearsV2_Get
 * `GET: /v2/fiscalyears`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const FiscalYearsV2_Get = buildCall() //
  .method('get')
  .path('/v2/fiscalyears')
  .parseJson(withRuntype(paginatedResponseFiscalYearApiRt))
  .build();

// Operation: FiscalYearsV2_Post

const fiscalYearsV2_PostArgsRt = rt
  .Record({ fiscalYear: fiscalYearApiRt })
  .asReadonly();

/**
 * operation ID: FiscalYearsV2_Post
 * `POST: /v2/fiscalyears`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:accounting</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo, Visma Lön Smart</b></p>
 */
export const FiscalYearsV2_Post = buildCall() //
  .args<rt.Static<typeof fiscalYearsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/fiscalyears')
  .body((args) => args.fiscalYear)
  .build();

// Operation: FiscalYearsV2_Get

const fiscalYearsV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: FiscalYearsV2_Get
 * `GET: /v2/fiscalyears/{id}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const FiscalYearsV2_Get = buildCall() //
  .args<rt.Static<typeof fiscalYearsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/fiscalyears/${args.id}`)
  .parseJson(withRuntype(fiscalYearApiRt))
  .build();

// Operation: FiscalYearsV2_Get

/**
 * operation ID: FiscalYearsV2_Get
 * `GET: /v2/fiscalyears/openingbalances`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const FiscalYearsV2_Get = buildCall() //
  .method('get')
  .path('/v2/fiscalyears/openingbalances')
  .parseJson(withRuntype(paginatedResponseOpeningBalancesApiRt))
  .build();

// Operation: FiscalYearsV2_UpdateAccountOpeningBalance

const fiscalYearsV2_UpdateAccountOpeningBalanceArgsRt = rt.Intersect(
  rt
    .Record({
      accountBalancesToUpdateApi: rt.Array(accountOpeningBalanceApiRt),
    })
    .asReadonly(),
  rt.Record({ enableInactiveAccounts: rt.Boolean }).asPartial().asReadonly(),
);

const fiscalYearsV2_UpdateAccountOpeningBalanceResponseBodyRt =
  rt.Array(openingBalancesApiRt);

/**
 * operation ID: FiscalYearsV2_UpdateAccountOpeningBalance
 * `PUT: /v2/fiscalyears/openingbalances`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const FiscalYearsV2_UpdateAccountOpeningBalance = buildCall() //
  .args<rt.Static<typeof fiscalYearsV2_UpdateAccountOpeningBalanceArgsRt>>()
  .method('put')
  .path('/v2/fiscalyears/openingbalances')
  .query(
    (args) =>
      new URLSearchParams(pickQueryValues(args, 'enableInactiveAccounts')),
  )
  .body((args) => args.accountBalancesToUpdateApi)
  .parseJson(
    withRuntype(fiscalYearsV2_UpdateAccountOpeningBalanceResponseBodyRt),
  )
  .build();

// Operation: ForeignPaymentCodesV2_Get

/**
 * operation ID: ForeignPaymentCodesV2_Get
 * `GET: /v2/foreignpaymentcodes`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard,
 * Bookkeeping</b></p>
 */
export const ForeignPaymentCodesV2_Get = buildCall() //
  .method('get')
  .path('/v2/foreignpaymentcodes')
  .parseJson(withRuntype(paginatedResponseForeignPaymentCodesApiRt))
  .build();

// Operation: MessageThreadsV2_Get

const messageThreadsV2_GetArgsRt = rt
  .Record({ messageThreadId: rt.String })
  .asReadonly();

/**
 * operation ID: MessageThreadsV2_Get
 * `GET: /v2/messagethreads/{messageThreadId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const MessageThreadsV2_Get = buildCall() //
  .args<rt.Static<typeof messageThreadsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/messagethreads/${args.messageThreadId}`)
  .parseJson(withRuntype(messageThreadApiRt))
  .build();

// Operation: MessageThreadsV2_MarkThread

const messageThreadsV2_MarkThreadArgsRt = rt
  .Record({ options: messageStatusApiRt, messageThreadId: rt.String })
  .asReadonly();

/**
 * operation ID: MessageThreadsV2_MarkThread
 * `PUT: /v2/messagethreads/{messageThreadId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const MessageThreadsV2_MarkThread = buildCall() //
  .args<rt.Static<typeof messageThreadsV2_MarkThreadArgsRt>>()
  .method('put')
  .path((args) => `/v2/messagethreads/${args.messageThreadId}`)
  .body((args) => args.options)
  .parseJson(withRuntype(messageThreadApiRt))
  .build();

// Operation: MessageThreadsV2_ReplyToMessage

const messageThreadsV2_ReplyToMessageArgsRt = rt
  .Record({ messageReplyApi: messageApiRt, messageThreadId: rt.String })
  .asReadonly();

/**
 * operation ID: MessageThreadsV2_ReplyToMessage
 * `POST: /v2/messagethreads/{messageThreadId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const MessageThreadsV2_ReplyToMessage = buildCall() //
  .args<rt.Static<typeof messageThreadsV2_ReplyToMessageArgsRt>>()
  .method('post')
  .path((args) => `/v2/messagethreads/${args.messageThreadId}`)
  .body((args) => args.messageReplyApi)
  .build();

// Operation: MessageThreadsV2_Get

const messageThreadsV2_GetArgsRt = rt
  .Record({ excludeClosed: rt.Boolean })
  .asPartial()
  .asReadonly();

/**
 * operation ID: MessageThreadsV2_Get
 * `GET: /v2/messagethreads`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const MessageThreadsV2_Get = buildCall() //
  .args<rt.Static<typeof messageThreadsV2_GetArgsRt>>()
  .method('get')
  .path('/v2/messagethreads')
  .query((args) => new URLSearchParams(pickQueryValues(args, 'excludeClosed')))
  .parseJson(withRuntype(messageThreadApiRt))
  .build();

// Operation: MessageThreadsV2_Post

const messageThreadsV2_PostArgsRt = rt
  .Record({ messageToPostApi: messageToPostApiRt })
  .asReadonly();

/**
 * operation ID: MessageThreadsV2_Post
 * `POST: /v2/messagethreads`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const MessageThreadsV2_Post = buildCall() //
  .args<rt.Static<typeof messageThreadsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/messagethreads')
  .body((args) => args.messageToPostApi)
  .build();

// Operation: MessageThreadsV2_GetMessages

const messageThreadsV2_GetMessagesArgsRt = rt
  .Record({ messageThreadId: rt.String })
  .asReadonly();

/**
 * operation ID: MessageThreadsV2_GetMessages
 * `GET: /v2/messagethreads/{messageThreadId}/messages`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const MessageThreadsV2_GetMessages = buildCall() //
  .args<rt.Static<typeof messageThreadsV2_GetMessagesArgsRt>>()
  .method('get')
  .path((args) => `/v2/messagethreads/${args.messageThreadId}/messages`)
  .parseJson(withRuntype(messageApiRt))
  .build();

// Operation: MessageThreadsV2_GetMessages

/**
 * operation ID: MessageThreadsV2_GetMessages
 * `GET: /v2/messagethreads/messages`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const MessageThreadsV2_GetMessages = buildCall() //
  .method('get')
  .path('/v2/messagethreads/messages')
  .parseJson(withRuntype(messageApiRt))
  .build();

// Operation: NotesV2_Get

/**
 * operation ID: NotesV2_Get
 * `GET: /v2/notes`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const NotesV2_Get = buildCall() //
  .method('get')
  .path('/v2/notes')
  .parseJson(withRuntype(noteApiRt))
  .build();

// Operation: NotesV2_Post

const notesV2_PostArgsRt = rt.Record({ note: noteApiRt }).asReadonly();

/**
 * operation ID: NotesV2_Post
 * `POST: /v2/notes`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const NotesV2_Post = buildCall() //
  .args<rt.Static<typeof notesV2_PostArgsRt>>()
  .method('post')
  .path('/v2/notes')
  .body((args) => args.note)
  .parseJson(withRuntype(noteApiRt))
  .build();

// Operation: NotesV2_Get

const notesV2_GetArgsRt = rt.Record({ noteId: rt.String }).asReadonly();

/**
 * operation ID: NotesV2_Get
 * `GET: /v2/notes/{noteId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const NotesV2_Get = buildCall() //
  .args<rt.Static<typeof notesV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/notes/${args.noteId}`)
  .parseJson(withRuntype(noteApiRt))
  .build();

// Operation: NotesV2_Put

const notesV2_PutArgsRt = rt
  .Record({ note: noteApiRt, noteId: rt.String })
  .asReadonly();

/**
 * operation ID: NotesV2_Put
 * `PUT: /v2/notes/{noteId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Standard,
 * Invoicing, Bookkeeping, Solo</b></p>
 */
export const NotesV2_Put = buildCall() //
  .args<rt.Static<typeof notesV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/notes/${args.noteId}`)
  .body((args) => args.note)
  .parseJson(withRuntype(noteApiRt))
  .build();

// Operation: OrdersV2_Get

/**
 * operation ID: OrdersV2_Get
 * `GET: /v2/orders`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_Get = buildCall() //
  .method('get')
  .path('/v2/orders')
  .parseJson(withRuntype(paginatedResponseOrderApiRt))
  .build();

// Operation: OrdersV2_Post

const ordersV2_PostArgsRt = rt.Record({ order: orderApiRt }).asReadonly();

/**
 * operation ID: OrdersV2_Post
 * `POST: /v2/orders`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_Post = buildCall() //
  .args<rt.Static<typeof ordersV2_PostArgsRt>>()
  .method('post')
  .path('/v2/orders')
  .body((args) => args.order)
  .build();

// Operation: OrdersV2_Get

const ordersV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: OrdersV2_Get
 * `GET: /v2/orders/{id}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_Get = buildCall() //
  .args<rt.Static<typeof ordersV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/orders/${args.id}`)
  .parseJson(withRuntype(orderApiRt))
  .build();

// Operation: OrdersV2_Put

const ordersV2_PutArgsRt = rt
  .Record({ id: rt.String, order: orderApiRt })
  .asReadonly();

const ordersV2_PutResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: OrdersV2_Put
 * `PUT: /v2/orders/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_Put = buildCall() //
  .args<rt.Static<typeof ordersV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/orders/${args.id}`)
  .body((args) => args.order)
  .parseJson(withRuntype(ordersV2_PutResponseBodyRt))
  .build();

// Operation: OrdersV2_Delete

const ordersV2_DeleteArgsRt = rt.Record({ id: rt.String }).asReadonly();

const ordersV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: OrdersV2_Delete
 * `DELETE: /v2/orders/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_Delete = buildCall() //
  .args<rt.Static<typeof ordersV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/orders/${args.id}`)
  .parseJson(withRuntype(ordersV2_DeleteResponseBodyRt))
  .build();

// Operation: OrdersV2_BackOrder

const ordersV2_BackOrderArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: OrdersV2_BackOrder
 * `POST: /v2/orders/{id}/backorder`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_BackOrder = buildCall() //
  .args<rt.Static<typeof ordersV2_BackOrderArgsRt>>()
  .method('post')
  .path((args) => `/v2/orders/${args.id}/backorder`)
  .parseJson(withRuntype(orderApiRt))
  .build();

// Operation: OrdersV2_Convert

const ordersV2_ConvertArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: OrdersV2_Convert
 * `POST: /v2/orders/{id}/convert`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_Convert = buildCall() //
  .args<rt.Static<typeof ordersV2_ConvertArgsRt>>()
  .method('post')
  .path((args) => `/v2/orders/${args.id}/convert`)
  .parseJson(withRuntype(customerInvoiceApiRt))
  .build();

// Operation: OrdersV2_Print

const ordersV2_PrintArgsRt = rt.Record({ id: rt.String }).asReadonly();

const ordersV2_PrintResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: OrdersV2_Print
 * `GET: /v2/orders/{id}/print`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_Print = buildCall() //
  .args<rt.Static<typeof ordersV2_PrintArgsRt>>()
  .method('get')
  .path((args) => `/v2/orders/${args.id}/print`)
  .parseJson(withRuntype(ordersV2_PrintResponseBodyRt))
  .build();

// Operation: OrdersV2_DeliveryNotePrint

const ordersV2_DeliveryNotePrintArgsRt = rt
  .Record({ id: rt.String })
  .asReadonly();

const ordersV2_DeliveryNotePrintResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: OrdersV2_DeliveryNotePrint
 * `GET: /v2/orders/{id}/deliverynote/print`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>order_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const OrdersV2_DeliveryNotePrint = buildCall() //
  .args<rt.Static<typeof ordersV2_DeliveryNotePrintArgsRt>>()
  .method('get')
  .path((args) => `/v2/orders/${args.id}/deliverynote/print`)
  .parseJson(withRuntype(ordersV2_DeliveryNotePrintResponseBodyRt))
  .build();

// Operation: PartnerResourceLinksV2_Get

/**
 * operation ID: PartnerResourceLinksV2_Get
 * `GET: /v2/partnerresourcelinks`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const PartnerResourceLinksV2_Get = buildCall() //
  .method('get')
  .path('/v2/partnerresourcelinks')
  .parseJson(withRuntype(paginatedResponsePartnerResourceLinkApiRt))
  .build();

// Operation: PartnerResourceLinksV2_Post

const partnerResourceLinksV2_PostArgsRt = rt
  .Record({ partnerResourceLink: partnerResourceLinkApiRt })
  .asReadonly();

/**
 * operation ID: PartnerResourceLinksV2_Post
 * `POST: /v2/partnerresourcelinks`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:purchase</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo</b></p>
 */
export const PartnerResourceLinksV2_Post = buildCall() //
  .args<rt.Static<typeof partnerResourceLinksV2_PostArgsRt>>()
  .method('post')
  .path('/v2/partnerresourcelinks')
  .body((args) => args.partnerResourceLink)
  .build();

// Operation: PartnerResourceLinksV2_Get

const partnerResourceLinksV2_GetArgsRt = rt
  .Record({ partnerResourceLinkId: rt.String })
  .asReadonly();

/**
 * operation ID: PartnerResourceLinksV2_Get
 * `GET: /v2/partnerresourcelinks/{partnerResourceLinkId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const PartnerResourceLinksV2_Get = buildCall() //
  .args<rt.Static<typeof partnerResourceLinksV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/partnerresourcelinks/${args.partnerResourceLinkId}`)
  .parseJson(withRuntype(partnerResourceLinkApiRt))
  .build();

// Operation: PartnerResourceLinksV2_Put

const partnerResourceLinksV2_PutArgsRt = rt
  .Record({
    partnerResourceLinkId: rt.String,
    partnerResourceLink: partnerResourceLinkApiRt,
  })
  .asReadonly();

/**
 * operation ID: PartnerResourceLinksV2_Put
 * `PUT: /v2/partnerresourcelinks/{partnerResourceLinkId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:purchase</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo</b></p>
 */
export const PartnerResourceLinksV2_Put = buildCall() //
  .args<rt.Static<typeof partnerResourceLinksV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/partnerresourcelinks/${args.partnerResourceLinkId}`)
  .body((args) => args.partnerResourceLink)
  .parseJson(withRuntype(partnerResourceLinkApiRt))
  .build();

// Operation: PartnerResourceLinksV2_Delete

const partnerResourceLinksV2_DeleteArgsRt = rt
  .Record({ partnerResourceLinkId: rt.String })
  .asReadonly();

const partnerResourceLinksV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: PartnerResourceLinksV2_Delete
 * `DELETE: /v2/partnerresourcelinks/{partnerResourceLinkId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:purchase</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Bookkeeping,
 * Solo</b></p>
 */
export const PartnerResourceLinksV2_Delete = buildCall() //
  .args<rt.Static<typeof partnerResourceLinksV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/partnerresourcelinks/${args.partnerResourceLinkId}`)
  .parseJson(withRuntype(partnerResourceLinksV2_DeleteResponseBodyRt))
  .build();

// Operation: PaymentVoucherV2_PostPayment

const paymentVoucherV2_PostPaymentArgsRt = rt.Intersect(
  rt.Record({ paymentVoucherApi: paymentVoucherApiRt }).asReadonly(),
  rt
    .Record({
      useAutomaticVatCalculation: rt.Boolean,
      useDefaultVatCodes: rt.Boolean,
      useDefaultVoucherSeries: rt.Boolean,
      checkExistingBankTransaction: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: PaymentVoucherV2_PostPayment
 * `POST: /v2/paymentvoucher`
 * Action available for norwegian and dutch companies
 * only.<p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const PaymentVoucherV2_PostPayment = buildCall() //
  .args<rt.Static<typeof paymentVoucherV2_PostPaymentArgsRt>>()
  .method('post')
  .path('/v2/paymentvoucher')
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(
          args,
          'useAutomaticVatCalculation',
          'useDefaultVatCodes',
          'useDefaultVoucherSeries',
          'checkExistingBankTransaction',
        ),
      ),
  )
  .body((args) => args.paymentVoucherApi)
  .build();

// Operation: ProjectsV2_Get

/**
 * operation ID: ProjectsV2_Get
 * `GET: /v2/projects`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const ProjectsV2_Get = buildCall() //
  .method('get')
  .path('/v2/projects')
  .parseJson(withRuntype(paginatedResponseProjectApiRt))
  .build();

// Operation: ProjectsV2_Post

const projectsV2_PostArgsRt = rt.Record({ project: projectApiRt }).asReadonly();

/**
 * operation ID: ProjectsV2_Post
 * `POST: /v2/projects`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const ProjectsV2_Post = buildCall() //
  .args<rt.Static<typeof projectsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/projects')
  .body((args) => args.project)
  .build();

// Operation: ProjectsV2_Get

const projectsV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: ProjectsV2_Get
 * `GET: /v2/projects/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:accounting_readonly, ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const ProjectsV2_Get = buildCall() //
  .args<rt.Static<typeof projectsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/projects/${args.id}`)
  .parseJson(withRuntype(projectApiRt))
  .build();

// Operation: ProjectsV2_Put

const projectsV2_PutArgsRt = rt
  .Record({ id: rt.String, project: projectApiRt })
  .asReadonly();

/**
 * operation ID: ProjectsV2_Put
 * `PUT: /v2/projects/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Visma Lön Smart</b></p>
 */
export const ProjectsV2_Put = buildCall() //
  .args<rt.Static<typeof projectsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/projects/${args.id}`)
  .body((args) => args.project)
  .parseJson(withRuntype(projectApiRt))
  .build();

// Operation: QuoteDraftsV2_Get

/**
 * operation ID: QuoteDraftsV2_Get
 * `GET: /v2/quotedrafts`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuoteDraftsV2_Get = buildCall() //
  .method('get')
  .path('/v2/quotedrafts')
  .parseJson(withRuntype(paginatedResponseQuoteApiRt))
  .build();

// Operation: QuoteDraftsV2_Post

const quoteDraftsV2_PostArgsRt = rt
  .Record({ quoteDraftApi: quoteApiRt })
  .asReadonly();

/**
 * operation ID: QuoteDraftsV2_Post
 * `POST: /v2/quotedrafts`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuoteDraftsV2_Post = buildCall() //
  .args<rt.Static<typeof quoteDraftsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/quotedrafts')
  .body((args) => args.quoteDraftApi)
  .build();

// Operation: QuoteDraftsV2_Get

const quoteDraftsV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: QuoteDraftsV2_Get
 * `GET: /v2/quotedrafts/{id}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuoteDraftsV2_Get = buildCall() //
  .args<rt.Static<typeof quoteDraftsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/quotedrafts/${args.id}`)
  .parseJson(withRuntype(quoteApiRt))
  .build();

// Operation: QuoteDraftsV2_Put

const quoteDraftsV2_PutArgsRt = rt
  .Record({ id: rt.String, quoteApi: quoteApiRt })
  .asReadonly();

const quoteDraftsV2_PutResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: QuoteDraftsV2_Put
 * `PUT: /v2/quotedrafts/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuoteDraftsV2_Put = buildCall() //
  .args<rt.Static<typeof quoteDraftsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/quotedrafts/${args.id}`)
  .body((args) => args.quoteApi)
  .parseJson(withRuntype(quoteDraftsV2_PutResponseBodyRt))
  .build();

// Operation: QuoteDraftsV2_Delete

const quoteDraftsV2_DeleteArgsRt = rt.Record({ id: rt.String }).asReadonly();

const quoteDraftsV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: QuoteDraftsV2_Delete
 * `DELETE: /v2/quotedrafts/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuoteDraftsV2_Delete = buildCall() //
  .args<rt.Static<typeof quoteDraftsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/quotedrafts/${args.id}`)
  .parseJson(withRuntype(quoteDraftsV2_DeleteResponseBodyRt))
  .build();

// Operation: QuoteDraftsV2_ConvertToQuote

const quoteDraftsV2_ConvertToQuoteArgsRt = rt
  .Record({ id: rt.String })
  .asReadonly();

/**
 * operation ID: QuoteDraftsV2_ConvertToQuote
 * `PUT: /v2/quotedrafts/{id}/convert`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuoteDraftsV2_ConvertToQuote = buildCall() //
  .args<rt.Static<typeof quoteDraftsV2_ConvertToQuoteArgsRt>>()
  .method('put')
  .path((args) => `/v2/quotedrafts/${args.id}/convert`)
  .parseJson(withRuntype(quoteApiRt))
  .build();

// Operation: QuotesV2_Get

/**
 * operation ID: QuotesV2_Get
 * `GET: /v2/quotes`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_Get = buildCall() //
  .method('get')
  .path('/v2/quotes')
  .parseJson(withRuntype(paginatedResponseQuoteApiRt))
  .build();

// Operation: QuotesV2_Post

const quotesV2_PostArgsRt = rt.Record({ quoteApi: quoteApiRt }).asReadonly();

/**
 * operation ID: QuotesV2_Post
 * `POST: /v2/quotes`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_Post = buildCall() //
  .args<rt.Static<typeof quotesV2_PostArgsRt>>()
  .method('post')
  .path('/v2/quotes')
  .body((args) => args.quoteApi)
  .build();

// Operation: QuotesV2_Get

const quotesV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: QuotesV2_Get
 * `GET: /v2/quotes/{id}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_Get = buildCall() //
  .args<rt.Static<typeof quotesV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/quotes/${args.id}`)
  .parseJson(withRuntype(quoteApiRt))
  .build();

// Operation: QuotesV2_Put

const quotesV2_PutArgsRt = rt
  .Record({ id: rt.String, quoteApi: quoteApiRt })
  .asReadonly();

const quotesV2_PutResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: QuotesV2_Put
 * `PUT: /v2/quotes/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_Put = buildCall() //
  .args<rt.Static<typeof quotesV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/quotes/${args.id}`)
  .body((args) => args.quoteApi)
  .parseJson(withRuntype(quotesV2_PutResponseBodyRt))
  .build();

// Operation: QuotesV2_Delete

const quotesV2_DeleteArgsRt = rt.Record({ id: rt.String }).asReadonly();

const quotesV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: QuotesV2_Delete
 * `DELETE: /v2/quotes/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_Delete = buildCall() //
  .args<rt.Static<typeof quotesV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/quotes/${args.id}`)
  .parseJson(withRuntype(quotesV2_DeleteResponseBodyRt))
  .build();

// Operation: QuotesV2_Put

const quotesV2_PutArgsRt = rt.Record({ id: rt.String }).asReadonly();

const quotesV2_PutResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: QuotesV2_Put
 * `PUT: /v2/quotes/{id}/accept`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_Put = buildCall() //
  .args<rt.Static<typeof quotesV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/quotes/${args.id}/accept`)
  .parseJson(withRuntype(quotesV2_PutResponseBodyRt))
  .build();

// Operation: QuotesV2_ConvertToOrder

const quotesV2_ConvertToOrderArgsRt = rt
  .Record({ id: rt.String, conversionType: quoteConversionApiRt })
  .asReadonly();

/**
 * operation ID: QuotesV2_ConvertToOrder
 * `POST: /v2/quotes/{id}/converttoorder`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_ConvertToOrder = buildCall() //
  .args<rt.Static<typeof quotesV2_ConvertToOrderArgsRt>>()
  .method('post')
  .path((args) => `/v2/quotes/${args.id}/converttoorder`)
  .body((args) => args.conversionType)
  .parseJson(withRuntype(orderApiRt))
  .build();

// Operation: QuotesV2_ConvertToInvoice

const quotesV2_ConvertToInvoiceArgsRt = rt
  .Record({ id: rt.String })
  .asReadonly();

/**
 * operation ID: QuotesV2_ConvertToInvoice
 * `POST: /v2/quotes/{id}/converttocustomerinvoice`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_ConvertToInvoice = buildCall() //
  .args<rt.Static<typeof quotesV2_ConvertToInvoiceArgsRt>>()
  .method('post')
  .path((args) => `/v2/quotes/${args.id}/converttocustomerinvoice`)
  .parseJson(withRuntype(customerInvoiceApiRt))
  .build();

// Operation: QuotesV2_Print

const quotesV2_PrintArgsRt = rt.Record({ id: rt.String }).asReadonly();

const quotesV2_PrintResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: QuotesV2_Print
 * `GET: /v2/quotes/{id}/print`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Requires any of the following
 * modules: <br><b>quote_standard</b></p><p>Available in any of
 * the following variants: <br><b>Pro, Standard,
 * Invoicing</b></p>
 */
export const QuotesV2_Print = buildCall() //
  .args<rt.Static<typeof quotesV2_PrintArgsRt>>()
  .method('get')
  .path((args) => `/v2/quotes/${args.id}/print`)
  .parseJson(withRuntype(quotesV2_PrintResponseBodyRt))
  .build();

// Operation: SalesDocumentAttachmentsV2_Get

const salesDocumentAttachmentsV2_GetArgsRt = rt
  .Record({ attachmentId: rt.String })
  .asReadonly();

const salesDocumentAttachmentsV2_GetResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: SalesDocumentAttachmentsV2_Get
 * `GET: /v2/salesdocumentattachments/{attachmentId}.pdf`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const SalesDocumentAttachmentsV2_Get = buildCall() //
  .args<rt.Static<typeof salesDocumentAttachmentsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/salesdocumentattachments/${args.attachmentId}.pdf`)
  .parseJson(withRuntype(salesDocumentAttachmentsV2_GetResponseBodyRt))
  .build();

// Operation: SalesDocumentAttachmentsV2_Post

const salesDocumentAttachmentsV2_PostArgsRt = rt
  .Record({ attachment: salesDocumentAttachmentUploadApiRt })
  .asReadonly();

/**
 * operation ID: SalesDocumentAttachmentsV2_Post
 * `POST: /v2/salesdocumentattachments`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const SalesDocumentAttachmentsV2_Post = buildCall() //
  .args<rt.Static<typeof salesDocumentAttachmentsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/salesdocumentattachments')
  .body((args) => args.attachment)
  .parseJson(withRuntype(salesDocumentAttachmentApiRt))
  .build();

// Operation: SalesDocumentAttachmentsV2_PostCustomerInvoiceDraft

const salesDocumentAttachmentsV2_PostCustomerInvoiceDraftArgsRt = rt
  .Record({ attachment: salesDocumentAttachmentUploadApiRt })
  .asReadonly();

/**
 * operation ID:
 * SalesDocumentAttachmentsV2_PostCustomerInvoiceDraft
 * `POST: /v2/salesdocumentattachments/customerinvoicedraft`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const SalesDocumentAttachmentsV2_PostCustomerInvoiceDraft = buildCall() //
  .args<
    rt.Static<typeof salesDocumentAttachmentsV2_PostCustomerInvoiceDraftArgsRt>
  >()
  .method('post')
  .path('/v2/salesdocumentattachments/customerinvoicedraft')
  .body((args) => args.attachment)
  .parseJson(withRuntype(salesDocumentAttachmentApiRt))
  .build();

// Operation: SalesDocumentAttachmentsV2_PostCustomerInvoice

const salesDocumentAttachmentsV2_PostCustomerInvoiceArgsRt = rt
  .Record({ attachment: salesDocumentAttachmentUploadApiRt })
  .asReadonly();

/**
 * operation ID: SalesDocumentAttachmentsV2_PostCustomerInvoice
 * `POST: /v2/salesdocumentattachments/customerinvoice`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const SalesDocumentAttachmentsV2_PostCustomerInvoice = buildCall() //
  .args<
    rt.Static<typeof salesDocumentAttachmentsV2_PostCustomerInvoiceArgsRt>
  >()
  .method('post')
  .path('/v2/salesdocumentattachments/customerinvoice')
  .body((args) => args.attachment)
  .build();

// Operation: SalesDocumentAttachmentsV2_Delete

const salesDocumentAttachmentsV2_DeleteArgsRt = rt
  .Record({ customerInvoiceDraftId: rt.String, attachmentId: rt.String })
  .asReadonly();

const salesDocumentAttachmentsV2_DeleteResponseBodyRt = rt.Dictionary(
  rt.Unknown,
);

/**
 * operation ID: SalesDocumentAttachmentsV2_Delete
 * `DELETE:
 * /v2/salesdocumentattachments/{customerInvoiceDraftId}/{attachmentId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const SalesDocumentAttachmentsV2_Delete = buildCall() //
  .args<rt.Static<typeof salesDocumentAttachmentsV2_DeleteArgsRt>>()
  .method('delete')
  .path(
    (args) =>
      `/v2/salesdocumentattachments/${args.customerInvoiceDraftId}/${args.attachmentId}`,
  )
  .parseJson(withRuntype(salesDocumentAttachmentsV2_DeleteResponseBodyRt))
  .build();

// Operation: SalesDocumentAttachmentsV2_DeleteCustomerInvoiceDraft

const salesDocumentAttachmentsV2_DeleteCustomerInvoiceDraftArgsRt = rt
  .Record({ customerInvoiceDraftId: rt.String, attachmentId: rt.String })
  .asReadonly();

const salesDocumentAttachmentsV2_DeleteCustomerInvoiceDraftResponseBodyRt =
  rt.Dictionary(rt.Unknown);

/**
 * operation ID:
 * SalesDocumentAttachmentsV2_DeleteCustomerInvoiceDraft
 * `DELETE:
 * /v2/salesdocumentattachments/customerinvoicedraft/{customerInvoiceDraftId}/{attachmentId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const SalesDocumentAttachmentsV2_DeleteCustomerInvoiceDraft = buildCall() //
  .args<
    rt.Static<
      typeof salesDocumentAttachmentsV2_DeleteCustomerInvoiceDraftArgsRt
    >
  >()
  .method('delete')
  .path(
    (args) =>
      `/v2/salesdocumentattachments/customerinvoicedraft/${args.customerInvoiceDraftId}/${args.attachmentId}`,
  )
  .parseJson(
    withRuntype(
      salesDocumentAttachmentsV2_DeleteCustomerInvoiceDraftResponseBodyRt,
    ),
  )
  .build();

// Operation: SalesDocumentAttachmentsV2_DeleteCustomerInvoice

const salesDocumentAttachmentsV2_DeleteCustomerInvoiceArgsRt = rt
  .Record({ customerInvoiceId: rt.String, attachmentId: rt.String })
  .asReadonly();

const salesDocumentAttachmentsV2_DeleteCustomerInvoiceResponseBodyRt =
  rt.Dictionary(rt.Unknown);

/**
 * operation ID:
 * SalesDocumentAttachmentsV2_DeleteCustomerInvoice
 * `DELETE:
 * /v2/salesdocumentattachments/customerinvoice/{customerInvoiceId}/{attachmentId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
 */
export const SalesDocumentAttachmentsV2_DeleteCustomerInvoice = buildCall() //
  .args<
    rt.Static<typeof salesDocumentAttachmentsV2_DeleteCustomerInvoiceArgsRt>
  >()
  .method('delete')
  .path(
    (args) =>
      `/v2/salesdocumentattachments/customerinvoice/${args.customerInvoiceId}/${args.attachmentId}`,
  )
  .parseJson(
    withRuntype(salesDocumentAttachmentsV2_DeleteCustomerInvoiceResponseBodyRt),
  )
  .build();

// Operation: SupplierInvoiceDraftsV2_Get

/**
 * operation ID: SupplierInvoiceDraftsV2_Get
 * `GET: /v2/supplierinvoicedrafts`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SupplierInvoiceDraftsV2_Get = buildCall() //
  .method('get')
  .path('/v2/supplierinvoicedrafts')
  .parseJson(withRuntype(paginatedResponseSupplierInvoiceDraftApiRt))
  .build();

// Operation: SupplierInvoiceDraftsV2_Post

const supplierInvoiceDraftsV2_PostArgsRt = rt.Intersect(
  rt.Record({ supplierInvoiceDraft: supplierInvoiceDraftApiRt }).asReadonly(),
  rt
    .Record({
      useDefaultVatCodes: rt.Boolean,
      calculateVatOnCostAccounts: rt.Boolean,
      batchProcessExtendedValidation: rt.Boolean,
      duplicateCheckExtendedValidation: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: SupplierInvoiceDraftsV2_Post
 * `POST: /v2/supplierinvoicedrafts`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SupplierInvoiceDraftsV2_Post = buildCall() //
  .args<rt.Static<typeof supplierInvoiceDraftsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/supplierinvoicedrafts')
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(
          args,
          'useDefaultVatCodes',
          'calculateVatOnCostAccounts',
          'batchProcessExtendedValidation',
          'duplicateCheckExtendedValidation',
        ),
      ),
  )
  .body((args) => args.supplierInvoiceDraft)
  .build();

// Operation: SupplierInvoiceDraftsV2_Get

const supplierInvoiceDraftsV2_GetArgsRt = rt
  .Record({ supplierInvoiceDraftId: rt.String })
  .asReadonly();

/**
 * operation ID: SupplierInvoiceDraftsV2_Get
 * `GET: /v2/supplierinvoicedrafts/{supplierInvoiceDraftId}`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SupplierInvoiceDraftsV2_Get = buildCall() //
  .args<rt.Static<typeof supplierInvoiceDraftsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/supplierinvoicedrafts/${args.supplierInvoiceDraftId}`)
  .parseJson(withRuntype(supplierInvoiceDraftApiRt))
  .build();

// Operation: SupplierInvoiceDraftsV2_Put

const supplierInvoiceDraftsV2_PutArgsRt = rt
  .Record({
    supplierInvoiceDraftId: rt.String,
    supplierInvoiceDraft: supplierInvoiceDraftApiRt,
  })
  .asReadonly();

/**
 * operation ID: SupplierInvoiceDraftsV2_Put
 * `PUT: /v2/supplierinvoicedrafts/{supplierInvoiceDraftId}`
 * To update attachments us the attachment endpoint.<p>Requires
 * any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SupplierInvoiceDraftsV2_Put = buildCall() //
  .args<rt.Static<typeof supplierInvoiceDraftsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/supplierinvoicedrafts/${args.supplierInvoiceDraftId}`)
  .body((args) => args.supplierInvoiceDraft)
  .parseJson(withRuntype(supplierInvoiceDraftApiRt))
  .build();

// Operation: SupplierInvoiceDraftsV2_Delete

const supplierInvoiceDraftsV2_DeleteArgsRt = rt
  .Record({ supplierInvoiceDraftId: rt.String })
  .asReadonly();

const supplierInvoiceDraftsV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: SupplierInvoiceDraftsV2_Delete
 * `DELETE: /v2/supplierinvoicedrafts/{supplierInvoiceDraftId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SupplierInvoiceDraftsV2_Delete = buildCall() //
  .args<rt.Static<typeof supplierInvoiceDraftsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/supplierinvoicedrafts/${args.supplierInvoiceDraftId}`)
  .parseJson(withRuntype(supplierInvoiceDraftsV2_DeleteResponseBodyRt))
  .build();

// Operation: SupplierInvoiceDraftsV2_Convert

const supplierInvoiceDraftsV2_ConvertArgsRt = rt
  .Record({ supplierInvoiceDraftId: rt.String })
  .asReadonly();

/**
 * operation ID: SupplierInvoiceDraftsV2_Convert
 * `POST:
 * /v2/supplierinvoicedrafts/{supplierInvoiceDraftId}/convert`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SupplierInvoiceDraftsV2_Convert = buildCall() //
  .args<rt.Static<typeof supplierInvoiceDraftsV2_ConvertArgsRt>>()
  .method('post')
  .path(
    (args) =>
      `/v2/supplierinvoicedrafts/${args.supplierInvoiceDraftId}/convert`,
  )
  .build();

// Operation: SupplierInvoicesV2_Get

/**
 * operation ID: SupplierInvoicesV2_Get
 * `GET: /v2/supplierinvoices`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const SupplierInvoicesV2_Get = buildCall() //
  .method('get')
  .path('/v2/supplierinvoices')
  .parseJson(withRuntype(paginatedResponseSupplierInvoiceApiRt))
  .build();

// Operation: SupplierInvoicesV2_Post

const supplierInvoicesV2_PostArgsRt = rt.Intersect(
  rt.Record({ supplierInvoice: supplierInvoiceApiRt }).asReadonly(),
  rt
    .Record({
      useDefaultVatCodes: rt.Boolean,
      calculateVatOnCostAccounts: rt.Boolean,
      duplicateCheckExtendedValidation: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: SupplierInvoicesV2_Post
 * `POST: /v2/supplierinvoices`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const SupplierInvoicesV2_Post = buildCall() //
  .args<rt.Static<typeof supplierInvoicesV2_PostArgsRt>>()
  .method('post')
  .path('/v2/supplierinvoices')
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(
          args,
          'useDefaultVatCodes',
          'calculateVatOnCostAccounts',
          'duplicateCheckExtendedValidation',
        ),
      ),
  )
  .body((args) => args.supplierInvoice)
  .build();

// Operation: SupplierInvoicesV2_Get

const supplierInvoicesV2_GetArgsRt = rt
  .Record({ supplierInvoiceId: rt.String })
  .asReadonly();

/**
 * operation ID: SupplierInvoicesV2_Get
 * `GET: /v2/supplierinvoices/{supplierInvoiceId}`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const SupplierInvoicesV2_Get = buildCall() //
  .args<rt.Static<typeof supplierInvoicesV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/supplierinvoices/${args.supplierInvoiceId}`)
  .parseJson(withRuntype(supplierInvoiceApiRt))
  .build();

// Operation: SupplierInvoicesV2_Post

const supplierInvoicesV2_PostArgsRt = rt
  .Record({ supplierInvoicePayment: invoicePaymentApiRt, invoiceId: rt.String })
  .asReadonly();

/**
 * operation ID: SupplierInvoicesV2_Post
 * `POST: /v2/supplierinvoices/{invoiceId}/payments`
 * <p>Requires any of the following scopes:
 * <br><b>ea:sales</b></p><p>Available in any of the following
 * variants: <br><b>Pro, Standard, Bookkeeping, Solo</b></p>
 */
export const SupplierInvoicesV2_Post = buildCall() //
  .args<rt.Static<typeof supplierInvoicesV2_PostArgsRt>>()
  .method('post')
  .path((args) => `/v2/supplierinvoices/${args.invoiceId}/payments`)
  .body((args) => args.supplierInvoicePayment)
  .build();

// Operation: SuppliersV2_Get

/**
 * operation ID: SuppliersV2_Get
 * `GET: /v2/suppliers`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SuppliersV2_Get = buildCall() //
  .method('get')
  .path('/v2/suppliers')
  .parseJson(withRuntype(paginatedResponseSupplierApiRt))
  .build();

// Operation: SuppliersV2_Post

const suppliersV2_PostArgsRt = rt
  .Record({ supplier: supplierApiRt })
  .asReadonly();

/**
 * operation ID: SuppliersV2_Post
 * `POST: /v2/suppliers`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SuppliersV2_Post = buildCall() //
  .args<rt.Static<typeof suppliersV2_PostArgsRt>>()
  .method('post')
  .path('/v2/suppliers')
  .body((args) => args.supplier)
  .build();

// Operation: SuppliersV2_Get

const suppliersV2_GetArgsRt = rt.Record({ supplierId: rt.String }).asReadonly();

/**
 * operation ID: SuppliersV2_Get
 * `GET: /v2/suppliers/{supplierId}`
 * <p>Requires any of the following scopes: <br><b>ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SuppliersV2_Get = buildCall() //
  .args<rt.Static<typeof suppliersV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/suppliers/${args.supplierId}`)
  .parseJson(withRuntype(supplierApiRt))
  .build();

// Operation: SuppliersV2_Put

const suppliersV2_PutArgsRt = rt
  .Record({ supplierId: rt.String, apiSupplier: supplierApiRt })
  .asReadonly();

/**
 * operation ID: SuppliersV2_Put
 * `PUT: /v2/suppliers/{supplierId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SuppliersV2_Put = buildCall() //
  .args<rt.Static<typeof suppliersV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/suppliers/${args.supplierId}`)
  .body((args) => args.apiSupplier)
  .parseJson(withRuntype(supplierApiRt))
  .build();

// Operation: SuppliersV2_Delete

const suppliersV2_DeleteArgsRt = rt
  .Record({ supplierId: rt.String })
  .asReadonly();

const suppliersV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: SuppliersV2_Delete
 * `DELETE: /v2/suppliers/{supplierId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:purchase</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const SuppliersV2_Delete = buildCall() //
  .args<rt.Static<typeof suppliersV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/suppliers/${args.supplierId}`)
  .parseJson(withRuntype(suppliersV2_DeleteResponseBodyRt))
  .build();

// Operation: TermsOfPaymentV2_Get

/**
 * operation ID: TermsOfPaymentV2_Get
 * `GET: /v2/termsofpayments`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing, Solo,
 * Bookkeeping</b></p>
 */
export const TermsOfPaymentV2_Get = buildCall() //
  .method('get')
  .path('/v2/termsofpayments')
  .parseJson(withRuntype(paginatedResponseTermsOfPaymentApiRt))
  .build();

// Operation: TermsOfPaymentV2_Get

const termsOfPaymentV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: TermsOfPaymentV2_Get
 * `GET: /v2/termsofpayments/{id}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase,
 * ea:purchase_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing, Solo,
 * Bookkeeping</b></p>
 */
export const TermsOfPaymentV2_Get = buildCall() //
  .args<rt.Static<typeof termsOfPaymentV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/termsofpayments/${args.id}`)
  .parseJson(withRuntype(termsOfPaymentApiRt))
  .build();

// Operation: UnitsV2_Get

/**
 * operation ID: UnitsV2_Get
 * `GET: /v2/units`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const UnitsV2_Get = buildCall() //
  .method('get')
  .path('/v2/units')
  .parseJson(withRuntype(paginatedResponseUnitApiRt))
  .build();

// Operation: UnitsV2_Get

const unitsV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: UnitsV2_Get
 * `GET: /v2/units/{id}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Solo</b></p>
 */
export const UnitsV2_Get = buildCall() //
  .args<rt.Static<typeof unitsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/units/${args.id}`)
  .parseJson(withRuntype(unitApiRt))
  .build();

// Operation: UsersV2_Get

/**
 * operation ID: UsersV2_Get
 * `GET: /v2/users`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly, ea:purchase, ea:purchase_readonly,
 * ea:accounting, ea:accounting_readonly</b></p><p>Available in
 * any of the following variants: <br><b>Pro, Invoicing,
 * Standard, Bookkeeping, Solo, Visma Lön Smart</b></p>
 */
export const UsersV2_Get = buildCall() //
  .method('get')
  .path('/v2/users')
  .parseJson(withRuntype(paginatedResponseUserApiRt))
  .build();

// Operation: VatCodeV2_Get

const vatCodeV2_GetArgsRt = rt
  .Record({ vatRateDate: rt.String })
  .asPartial()
  .asReadonly();

/**
 * operation ID: VatCodeV2_Get
 * `GET: /v2/vatcodes`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo</b></p>
 */
export const VatCodeV2_Get = buildCall() //
  .args<rt.Static<typeof vatCodeV2_GetArgsRt>>()
  .method('get')
  .path('/v2/vatcodes')
  .query((args) => new URLSearchParams(pickQueryValues(args, 'vatRateDate')))
  .parseJson(withRuntype(paginatedResponseVatCodeApiRt))
  .build();

// Operation: VatCodeV2_Get

const vatCodeV2_GetArgsRt = rt.Intersect(
  rt.Record({ id: rt.String }).asReadonly(),
  rt.Record({ vatRateDate: rt.String }).asPartial().asReadonly(),
);

/**
 * operation ID: VatCodeV2_Get
 * `GET: /v2/vatcodes/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo</b></p>
 */
export const VatCodeV2_Get = buildCall() //
  .args<rt.Static<typeof vatCodeV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/vatcodes/${args.id}`)
  .query((args) => new URLSearchParams(pickQueryValues(args, 'vatRateDate')))
  .parseJson(withRuntype(paginatedResponseVatCodeApiRt))
  .build();

// Operation: VatReportV2_Get

/**
 * operation ID: VatReportV2_Get
 * `GET: /v2/vatreports`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const VatReportV2_Get = buildCall() //
  .method('get')
  .path('/v2/vatreports')
  .parseJson(withRuntype(paginatedResponseVatReportApiRt))
  .build();

// Operation: VatReportV2_Get

const vatReportV2_GetArgsRt = rt.Record({ id: rt.String }).asReadonly();

/**
 * operation ID: VatReportV2_Get
 * `GET: /v2/vatreports/{id}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Solo</b></p>
 */
export const VatReportV2_Get = buildCall() //
  .args<rt.Static<typeof vatReportV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/vatreports/${args.id}`)
  .parseJson(withRuntype(vatReportApiRt))
  .build();

// Operation: VoucherDraftsV2_Get

/**
 * operation ID: VoucherDraftsV2_Get
 * `GET: /v2/voucherdrafts`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const VoucherDraftsV2_Get = buildCall() //
  .method('get')
  .path('/v2/voucherdrafts')
  .parseJson(withRuntype(paginatedResponseVoucherDraftApiRt))
  .build();

// Operation: VoucherDraftsV2_Post

const voucherDraftsV2_PostArgsRt = rt.Intersect(
  rt.Record({ voucherDraft: voucherDraftApiRt }).asReadonly(),
  rt.Record({ amountIncludesVat: rt.Boolean }).asPartial().asReadonly(),
);

/**
 * operation ID: VoucherDraftsV2_Post
 * `POST: /v2/voucherdrafts`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const VoucherDraftsV2_Post = buildCall() //
  .args<rt.Static<typeof voucherDraftsV2_PostArgsRt>>()
  .method('post')
  .path('/v2/voucherdrafts')
  .query(
    (args) => new URLSearchParams(pickQueryValues(args, 'amountIncludesVat')),
  )
  .body((args) => args.voucherDraft)
  .build();

// Operation: VoucherDraftsV2_Get

const voucherDraftsV2_GetArgsRt = rt
  .Record({ voucherDraftId: rt.String })
  .asReadonly();

/**
 * operation ID: VoucherDraftsV2_Get
 * `GET: /v2/voucherdrafts/{voucherDraftId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const VoucherDraftsV2_Get = buildCall() //
  .args<rt.Static<typeof voucherDraftsV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/voucherdrafts/${args.voucherDraftId}`)
  .parseJson(withRuntype(voucherDraftApiRt))
  .build();

// Operation: VoucherDraftsV2_Put

const voucherDraftsV2_PutArgsRt = rt
  .Record({ voucherDraftId: rt.String, voucherDraft: voucherDraftApiRt })
  .asReadonly();

/**
 * operation ID: VoucherDraftsV2_Put
 * `PUT: /v2/voucherdrafts/{voucherDraftId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const VoucherDraftsV2_Put = buildCall() //
  .args<rt.Static<typeof voucherDraftsV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/voucherdrafts/${args.voucherDraftId}`)
  .body((args) => args.voucherDraft)
  .parseJson(withRuntype(voucherDraftApiRt))
  .build();

// Operation: VoucherDraftsV2_Delete

const voucherDraftsV2_DeleteArgsRt = rt
  .Record({ voucherDraftId: rt.String })
  .asReadonly();

const voucherDraftsV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: VoucherDraftsV2_Delete
 * `DELETE: /v2/voucherdrafts/{voucherDraftId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const VoucherDraftsV2_Delete = buildCall() //
  .args<rt.Static<typeof voucherDraftsV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/voucherdrafts/${args.voucherDraftId}`)
  .parseJson(withRuntype(voucherDraftsV2_DeleteResponseBodyRt))
  .build();

// Operation: VoucherDraftsV2_Convert

const voucherDraftsV2_ConvertArgsRt = rt
  .Record({ voucherDraftId: rt.String })
  .asReadonly();

/**
 * operation ID: VoucherDraftsV2_Convert
 * `POST: /v2/voucherdrafts/{voucherDraftId}/convert`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Solo,
 * Bookkeeping</b></p>
 */
export const VoucherDraftsV2_Convert = buildCall() //
  .args<rt.Static<typeof voucherDraftsV2_ConvertArgsRt>>()
  .method('post')
  .path((args) => `/v2/voucherdrafts/${args.voucherDraftId}/convert`)
  .build();

// Operation: VouchersV2_Get

/**
 * operation ID: VouchersV2_Get
 * `GET: /v2/vouchers`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Pro, Standard, Bookkeeping, Invoicing,
 * Solo</b></p>
 */
export const VouchersV2_Get = buildCall() //
  .method('get')
  .path('/v2/vouchers')
  .parseJson(withRuntype(paginatedResponseVoucherApiRt))
  .build();

// Operation: VouchersV2_Post

const vouchersV2_PostArgsRt = rt.Intersect(
  rt.Record({ apiVoucher: voucherApiRt }).asReadonly(),
  rt
    .Record({
      useAutomaticVatCalculation: rt.Boolean,
      useDefaultVatCodes: rt.Boolean,
      useDefaultVoucherSeries: rt.Boolean,
    })
    .asPartial()
    .asReadonly(),
);

/**
 * operation ID: VouchersV2_Post
 * `POST: /v2/vouchers`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Pro, Standard, Bookkeeping, Solo</b></p>
 */
export const VouchersV2_Post = buildCall() //
  .args<rt.Static<typeof vouchersV2_PostArgsRt>>()
  .method('post')
  .path('/v2/vouchers')
  .query(
    (args) =>
      new URLSearchParams(
        pickQueryValues(
          args,
          'useAutomaticVatCalculation',
          'useDefaultVatCodes',
          'useDefaultVoucherSeries',
        ),
      ),
  )
  .body((args) => args.apiVoucher)
  .build();

// Operation: VouchersV2_Get

const vouchersV2_GetArgsRt = rt
  .Record({ fiscalyearId: rt.String })
  .asReadonly();

/**
 * operation ID: VouchersV2_Get
 * `GET: /v2/vouchers/{fiscalyearId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Pro, Standard, Bookkeeping, Invoicing,
 * Solo</b></p>
 */
export const VouchersV2_Get = buildCall() //
  .args<rt.Static<typeof vouchersV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/vouchers/${args.fiscalyearId}`)
  .parseJson(withRuntype(paginatedResponseVoucherApiRt))
  .build();

// Operation: VouchersV2_Get

const vouchersV2_GetArgsRt = rt
  .Record({ fiscalyearId: rt.String, voucherId: rt.String })
  .asReadonly();

/**
 * operation ID: VouchersV2_Get
 * `GET: /v2/vouchers/{fiscalyearId}/{voucherId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Pro, Standard, Bookkeeping, Invoicing,
 * Solo</b></p>
 */
export const VouchersV2_Get = buildCall() //
  .args<rt.Static<typeof vouchersV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/vouchers/${args.fiscalyearId}/${args.voucherId}`)
  .parseJson(withRuntype(voucherApiRt))
  .build();

// Operation: VoucherWithOverunderPaymentV2_Get

const voucherWithOverunderPaymentV2_GetArgsRt = rt
  .Record({ voucherId: rt.String })
  .asReadonly();

/**
 * operation ID: VoucherWithOverunderPaymentV2_Get
 * `GET: /v2/voucherwithoverunderpayment/{voucherId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Pro, Standard, Invoicing, Solo</b></p>
 */
export const VoucherWithOverunderPaymentV2_Get = buildCall() //
  .args<rt.Static<typeof voucherWithOverunderPaymentV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/voucherwithoverunderpayment/${args.voucherId}`)
  .parseJson(withRuntype(paginatedResponseLedgerVoucherRelationApiRt))
  .build();

// Operation: VoucherWithOverunderPaymentV2_Post

const voucherWithOverunderPaymentV2_PostArgsRt = rt
  .Record({ overunderPaymentVoucherApi: voucherWithOverunderPaymentApiRt })
  .asReadonly();

/**
 * operation ID: VoucherWithOverunderPaymentV2_Post
 * `POST: /v2/voucherwithoverunderpayment`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting,
 * ea:accounting_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Bookkeeping,
 * Invoicing, Solo, Pro, Standard, Invoicing, Solo</b></p>
 */
export const VoucherWithOverunderPaymentV2_Post = buildCall() //
  .args<rt.Static<typeof voucherWithOverunderPaymentV2_PostArgsRt>>()
  .method('post')
  .path('/v2/voucherwithoverunderpayment')
  .body((args) => args.overunderPaymentVoucherApi)
  .build();

// Operation: WebHooksV2_Get

/**
 * operation ID: WebHooksV2_Get
 * `GET: /v2/webhooks`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:purchase, ea:sales, ea:accounting,
 * ea:purchase, ea:sales</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const WebHooksV2_Get = buildCall() //
  .method('get')
  .path('/v2/webhooks')
  .parseJson(withRuntype(paginatedResponseWebHookApiRt))
  .build();

// Operation: WebHooksV2_Post

const webHooksV2_PostArgsRt = rt.Record({ webHook: webHookApiRt }).asReadonly();

/**
 * operation ID: WebHooksV2_Post
 * `POST: /v2/webhooks`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:purchase, ea:sales, ea:accounting,
 * ea:purchase, ea:sales</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const WebHooksV2_Post = buildCall() //
  .args<rt.Static<typeof webHooksV2_PostArgsRt>>()
  .method('post')
  .path('/v2/webhooks')
  .body((args) => args.webHook)
  .build();

// Operation: WebHooksV2_Get

const webHooksV2_GetArgsRt = rt.Record({ webHookId: rt.String }).asReadonly();

/**
 * operation ID: WebHooksV2_Get
 * `GET: /v2/webhooks/{webHookId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:purchase, ea:sales, ea:accounting,
 * ea:purchase, ea:sales</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const WebHooksV2_Get = buildCall() //
  .args<rt.Static<typeof webHooksV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/webhooks/${args.webHookId}`)
  .parseJson(withRuntype(webHookApiRt))
  .build();

// Operation: WebHooksV2_Put

const webHooksV2_PutArgsRt = rt
  .Record({ webHookApi: webHookApiRt, webHookId: rt.String })
  .asReadonly();

/**
 * operation ID: WebHooksV2_Put
 * `PUT: /v2/webhooks/{webHookId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:purchase, ea:sales, ea:accounting,
 * ea:purchase, ea:sales</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const WebHooksV2_Put = buildCall() //
  .args<rt.Static<typeof webHooksV2_PutArgsRt>>()
  .method('put')
  .path((args) => `/v2/webhooks/${args.webHookId}`)
  .body((args) => args.webHookApi)
  .parseJson(withRuntype(webHookApiRt))
  .build();

// Operation: WebHooksV2_Delete

const webHooksV2_DeleteArgsRt = rt
  .Record({ webHookId: rt.String })
  .asReadonly();

const webHooksV2_DeleteResponseBodyRt = rt.Dictionary(rt.Unknown);

/**
 * operation ID: WebHooksV2_Delete
 * `DELETE: /v2/webhooks/{webHookId}`
 * <p>Requires any of the following scopes:
 * <br><b>ea:accounting, ea:purchase, ea:sales, ea:accounting,
 * ea:purchase, ea:sales</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing,
 * Bookkeeping, Solo</b></p>
 */
export const WebHooksV2_Delete = buildCall() //
  .args<rt.Static<typeof webHooksV2_DeleteArgsRt>>()
  .method('delete')
  .path((args) => `/v2/webhooks/${args.webHookId}`)
  .parseJson(withRuntype(webHooksV2_DeleteResponseBodyRt))
  .build();

// Operation: WebshopOrdersV2_Get

/**
 * operation ID: WebshopOrdersV2_Get
 * `GET: /v2/webshoporders`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const WebshopOrdersV2_Get = buildCall() //
  .method('get')
  .path('/v2/webshoporders')
  .parseJson(withRuntype(paginatedResponseWebshopOrderApiRt))
  .build();

// Operation: WebshopOrdersV2_Get

const webshopOrdersV2_GetArgsRt = rt
  .Record({ webshopOrderId: rt.String })
  .asReadonly();

/**
 * operation ID: WebshopOrdersV2_Get
 * `GET: /v2/webshoporders/{webshopOrderId}`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const WebshopOrdersV2_Get = buildCall() //
  .args<rt.Static<typeof webshopOrdersV2_GetArgsRt>>()
  .method('get')
  .path((args) => `/v2/webshoporders/${args.webshopOrderId}`)
  .parseJson(withRuntype(webshopOrderApiRt))
  .build();

// Operation: WebshopOrdersV2_ConvertToInvoice

const webshopOrdersV2_ConvertToInvoiceArgsRt = rt
  .Record({ webshopOrderId: rt.String })
  .asReadonly();

/**
 * operation ID: WebshopOrdersV2_ConvertToInvoice
 * `POST: /v2/webshoporders/{webshopOrderId}/convert`
 * <p>Requires any of the following scopes: <br><b>ea:sales,
 * ea:sales_readonly</b></p><p>Available in any of the
 * following variants: <br><b>Pro, Standard, Invoicing</b></p>
 */
export const WebshopOrdersV2_ConvertToInvoice = buildCall() //
  .args<rt.Static<typeof webshopOrdersV2_ConvertToInvoiceArgsRt>>()
  .method('post')
  .path((args) => `/v2/webshoporders/${args.webshopOrderId}/convert`)
  .build();
