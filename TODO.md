# Todos

### Find a solution for operationId for v2

The current issues are repeated operationIds. A very typical issue.
It is very much solveable, and already solved manually with `v1`.
However, since there are so many issues, it might be useful to look
for a way to fix them automatically. There looks to be a rule here;

* operationId that should be suffixed `_List` are in fact suffixed `_Get`.

Single resources have the same suffix. With `v1` API, there are not that
many times this happends, so I added it manually. This time, maybe not do it?

```shell
-attribute paths.'/v2/articles/{articleId}'(get).operationId is repeated
-attribute paths.'/v2/attachments/{attachmentId}'(get).operationId is repeated
-attribute paths.'/v2/articlelabels/{articleLabelId}'(get).operationId is repeated
-attribute paths.'/v2/termsofpayments/{id}'(get).operationId is repeated
-attribute paths.'/v2/supplierinvoices/{supplierInvoiceId}'(get).operationId is repeated
-attribute paths.'/v2/customerinvoicedrafts/{invoiceDraftId}'(get).operationId is repeated
-attribute paths.'/v2/customerinvoices/{invoiceId}/payments'(post).operationId is repeated
-attribute paths.'/v2/notes/{noteId}'(get).operationId is repeated
-attribute paths.'/v2/customers/{customerId}'(get).operationId is repeated
-attribute paths.'/v2/deliverymethods/{deliveryMethodId}'(get).operationId is repeated
-attribute paths.'/v2/articleaccountcodings/{articleAccountCodingId}'(get).operationId is repeated
-attribute paths.'/v2/customerledgeritems/{customerLedgerItemId}'(get).operationId is repeated
-attribute paths.'/v2/accountbalances/{accountNumber}/{date}'(get).operationId is repeated
-attribute paths.'/v2/quotes/{id}'(get).operationId is repeated
-attribute paths.'/v2/customerledgeritems/customerledgeritemswithvoucher'(post).operationId is repeated
-attribute paths.'/v2/messagethreads/messages'(get).operationId is repeated
-attribute paths.'/v2/vatcodes/{id}'(get).operationId is repeated
-attribute paths.'/v2/countries/{countrycode}'(get).operationId is repeated
-attribute paths.'/v2/webshoporders/{webshopOrderId}'(get).operationId is repeated
-attribute paths.'/v2/costcenters/{id}'(put).operationId is repeated
-attribute paths.'/v2/customerinvoices/{invoiceId}'(get).operationId is repeated
-attribute paths.'/v2/fiscalyears/openingbalances'(get).operationId is repeated
-attribute paths.'/v2/projects/{id}'(get).operationId is repeated
-attribute paths.'/v2/accounts/standardaccounts'(get).operationId is repeated
-attribute paths.'/v2/partnerresourcelinks/{partnerResourceLinkId}'(get).operationId is repeated
-attribute paths.'/v2/vouchers/{fiscalyearId}/{voucherId}'(get).operationId is repeated
-attribute paths.'/v2/bankaccounts/{bankAccountId}'(get).operationId is repeated
-attribute paths.'/v2/quotedrafts/{id}'(get).operationId is repeated
-attribute paths.'/v2/fiscalyears/{id}'(get).operationId is repeated
-attribute paths.'/v2/suppliers/{supplierId}'(get).operationId is repeated
-attribute paths.'/v2/units/{id}'(get).operationId is repeated
-attribute paths.'/v2/customerlabels/{customerLabelId}'(get).operationId is repeated
-attribute paths.'/v2/deliveryterms/{deliveryTermId}'(get).operationId is repeated
-attribute paths.'/v2/orders/{id}'(get).operationId is repeated
-attribute paths.'/v2/supplierinvoices/{invoiceId}/payments'(post).operationId is repeated
-attribute paths.'/v2/allocationperiods/{allocationPeriodId}'(get).operationId is repeated
-attribute paths.'/v2/supplierinvoicedrafts/{supplierInvoiceDraftId}'(get).operationId is repeated
-attribute paths.'/v2/accounts/{fiscalyearId}'(get).operationId is repeated
-attribute paths.'/v2/messagethreads'(get).operationId is repeated
-attribute paths.'/v2/vatreports/{id}'(get).operationId is repeated
-attribute paths.'/v2/accounts/{fiscalyearId}/{accountNumber}'(get).operationId is repeated
-attribute paths.'/v2/vouchers/{fiscalyearId}'(get).operationId is repeated
Warnings: 
-attribute paths.'/v2/articles/{articleId}'(get).operationId is repeated
-attribute paths.'/v2/attachments/{attachmentId}'(get).operationId is repeated
-attribute paths.'/v2/articlelabels/{articleLabelId}'(get).operationId is repeated
-attribute paths.'/v2/termsofpayments/{id}'(get).operationId is repeated
-attribute paths.'/v2/supplierinvoices/{supplierInvoiceId}'(get).operationId is repeated
-attribute paths.'/v2/customerinvoicedrafts/{invoiceDraftId}'(get).operationId is repeated
-attribute paths.'/v2/customerinvoices/{invoiceId}/payments'(post).operationId is repeated
-attribute paths.'/v2/notes/{noteId}'(get).operationId is repeated
-attribute paths.'/v2/customers/{customerId}'(get).operationId is repeated
-attribute paths.'/v2/deliverymethods/{deliveryMethodId}'(get).operationId is repeated
-attribute paths.'/v2/articleaccountcodings/{articleAccountCodingId}'(get).operationId is repeated
-attribute paths.'/v2/customerledgeritems/{customerLedgerItemId}'(get).operationId is repeated
-attribute paths.'/v2/accountbalances/{accountNumber}/{date}'(get).operationId is repeated
-attribute paths.'/v2/quotes/{id}'(get).operationId is repeated
-attribute paths.'/v2/customerledgeritems/customerledgeritemswithvoucher'(post).operationId is repeated
-attribute paths.'/v2/messagethreads/messages'(get).operationId is repeated
-attribute paths.'/v2/vatcodes/{id}'(get).operationId is repeated
-attribute paths.'/v2/countries/{countrycode}'(get).operationId is repeated
-attribute paths.'/v2/webshoporders/{webshopOrderId}'(get).operationId is repeated
-attribute paths.'/v2/costcenters/{id}'(put).operationId is repeated
-attribute paths.'/v2/customerinvoices/{invoiceId}'(get).operationId is repeated
-attribute paths.'/v2/fiscalyears/openingbalances'(get).operationId is repeated
-attribute paths.'/v2/projects/{id}'(get).operationId is repeated
-attribute paths.'/v2/accounts/standardaccounts'(get).operationId is repeated
-attribute paths.'/v2/partnerresourcelinks/{partnerResourceLinkId}'(get).operationId is repeated
-attribute paths.'/v2/vouchers/{fiscalyearId}/{voucherId}'(get).operationId is repeated
-attribute paths.'/v2/bankaccounts/{bankAccountId}'(get).operationId is repeated
-attribute paths.'/v2/quotedrafts/{id}'(get).operationId is repeated
-attribute paths.'/v2/fiscalyears/{id}'(get).operationId is repeated
-attribute paths.'/v2/suppliers/{supplierId}'(get).operationId is repeated
-attribute paths.'/v2/units/{id}'(get).operationId is repeated
-attribute paths.'/v2/customerlabels/{customerLabelId}'(get).operationId is repeated
-attribute paths.'/v2/deliveryterms/{deliveryTermId}'(get).operationId is repeated
-attribute paths.'/v2/orders/{id}'(get).operationId is repeated
-attribute paths.'/v2/supplierinvoices/{invoiceId}/payments'(post).operationId is repeated
-attribute paths.'/v2/allocationperiods/{allocationPeriodId}'(get).operationId is repeated
-attribute paths.'/v2/supplierinvoicedrafts/{supplierInvoiceDraftId}'(get).operationId is repeated
-attribute paths.'/v2/accounts/{fiscalyearId}'(get).operationId is repeated
-attribute paths.'/v2/messagethreads'(get).operationId is repeated
-attribute paths.'/v2/vatreports/{id}'(get).operationId is repeated
-attribute paths.'/v2/accounts/{fiscalyearId}/{accountNumber}'(get).operationId is repeated
-attribute paths.'/v2/vouchers/{fiscalyearId}'(get).operationId is repeated
```