const fs = require('fs')
const camelCase = require('camelcase')

const fixes = [
  {
    url: '/v1/partnerresourcelinks/{partnerResourceLinkId}',
    method: 'get',
    operationId: 'PartnerResourceLinks_List',
  },
  {
    url: '/v1/accounts/{fiscalyearId}',
    method: 'get',
    operationId: 'Accounts_ListByFiscalYear',
  },
  {
    url: '/v1/customerinvoicelistitems',
    method: 'get',
    operationId: 'CustomerInvoiceListItems_List',
  },
  { url: '/v1/articles', method: 'get', operationId: 'Articles_List' },
  {
    url: '/v1/articlelabels',
    method: 'get',
    operationId: 'ArticleLabels_List',
  },
  {
    url: '/v1/customerledgeritems',
    method: 'get',
    operationId: 'CustomerLedgerItems_List',
  },
  {
    url: '/v1/vouchers/{fiscalyearId}',
    method: 'get',
    operationId: 'Vouchers_ListByFiscalYear',
  },
  {
    url: '/v1/customerinvoicedrafts',
    method: 'get',
    operationId: 'CustomerInvoiceDrafts_List',
  },
  { url: '/v1/projects', method: 'get', operationId: 'Projects_List' },
  {
    url: '/v1/articleaccountcodings',
    method: 'get',
    operationId: 'ArticleAccountCodings_List',
  },
  { url: '/v1/units', method: 'get', operationId: 'Units_List' },
  { url: '/v1/fiscalyears', method: 'get', operationId: 'FiscalYears_List' },
  {
    url: '/v1/orderlistitems',
    method: 'get',
    operationId: 'OrderListItems_List',
  },
  {
    url: '/v1/accountbalances/{date}',
    method: 'get',
    operationId: 'AccountBalance_List',
  },
  {
    url: '/v1/supplierinvoicedrafts',
    method: 'get',
    operationId: 'SupplierInvoiceDrafts_List',
  },
  {
    url: '/v1/termsofpayment',
    method: 'get',
    operationId: 'TermsOfPayment_List',
  },
  {
    url: '/v1/customerledgeritems',
    method: 'post',
    operationId: 'CustomerLedgerItems_Create',
  },
  {
    url: '/v1/supplierinvoices',
    method: 'get',
    operationId: 'SupplierInvoices_List',
  },
  { url: '/v1/vatcodes', method: 'get', operationId: 'VatCode_List' },
]

;(async () => {
  const swaggerFilePath = `${__dirname}/../openapi/v1.json`;
  const rawSwaggerFile = fs.readFileSync(swaggerFilePath)
  const swaggerFile = JSON.parse(rawSwaggerFile)

  swaggerFile.host = `${swaggerFile.host}/v1`;

  // Replace operationIds at `fixes`
  fixes.forEach((fix) => {
    swaggerFile.paths[fix.url][fix.method].operationId = fix.operationId
  })

  // Remove `v1` prefix
  Object.keys(swaggerFile.paths).forEach((url) => {
    const formattedUrl = url.replace('/v1', '')
    swaggerFile.paths[formattedUrl] = swaggerFile.paths[url]
    delete swaggerFile.paths[url]
  })

  fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerFile, null, 2))
})()
