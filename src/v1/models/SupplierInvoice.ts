/* tslint:disable */
/* eslint-disable */
/**
 * Visma eAccounting API V1
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    AllocationPeriod,
    AllocationPeriodFromJSON,
    AllocationPeriodFromJSONTyped,
    AllocationPeriodToJSON,
    SupplierInvoiceRow,
    SupplierInvoiceRowFromJSON,
    SupplierInvoiceRowFromJSONTyped,
    SupplierInvoiceRowToJSON,
} from './';

/**
 * 
 * @export
 * @interface SupplierInvoice
 */
export interface SupplierInvoice {
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    supplierId: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    bankAccountId?: string;
    /**
     * 
     * @type {Date}
     * @memberof SupplierInvoice
     */
    invoiceDate?: Date;
    /**
     * 
     * @type {Date}
     * @memberof SupplierInvoice
     */
    paymentDate?: Date;
    /**
     * 
     * @type {Date}
     * @memberof SupplierInvoice
     */
    dueDate?: Date;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    invoiceNumber?: string;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    totalAmount?: number;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    vat?: number;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    vatHigh?: number;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    vatMedium?: number;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    vatLow?: number;
    /**
     * 
     * @type {boolean}
     * @memberof SupplierInvoice
     */
    isCreditInvoice?: boolean;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    currencyCode?: string;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    currencyRate?: number;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    ocrNumber?: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    message?: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    plusGiroNumber?: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    bankGiroNumber?: string;
    /**
     * 
     * @type {Array<SupplierInvoiceRow>}
     * @memberof SupplierInvoice
     */
    rows?: Array<SupplierInvoiceRow>;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    supplierName?: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    supplierNumber?: string;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    remainingAmount?: number;
    /**
     * 
     * @type {number}
     * @memberof SupplierInvoice
     */
    remainingAmountInvoiceCurrency?: number;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    voucherNumber?: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    voucherId?: string;
    /**
     * 
     * @type {string}
     * @memberof SupplierInvoice
     */
    createdFromDraftId?: string;
    /**
     * 
     * @type {boolean}
     * @memberof SupplierInvoice
     */
    selfEmployedWithoutFixedAddress?: boolean;
    /**
     * Coming soon.
     * @type {Array<AllocationPeriod>}
     * @memberof SupplierInvoice
     */
    allocationPeriods?: Array<AllocationPeriod>;
    /**
     * 
     * @type {Array<string>}
     * @memberof SupplierInvoice
     */
    attachments?: Array<string>;
}

export function SupplierInvoiceFromJSON(json: any): SupplierInvoice {
    return SupplierInvoiceFromJSONTyped(json, false);
}

export function SupplierInvoiceFromJSONTyped(json: any, ignoreDiscriminator: boolean): SupplierInvoice {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'Id') ? undefined : json['Id'],
        'supplierId': json['SupplierId'],
        'bankAccountId': !exists(json, 'BankAccountId') ? undefined : json['BankAccountId'],
        'invoiceDate': !exists(json, 'InvoiceDate') ? undefined : (new Date(json['InvoiceDate'])),
        'paymentDate': !exists(json, 'PaymentDate') ? undefined : (new Date(json['PaymentDate'])),
        'dueDate': !exists(json, 'DueDate') ? undefined : (new Date(json['DueDate'])),
        'invoiceNumber': !exists(json, 'InvoiceNumber') ? undefined : json['InvoiceNumber'],
        'totalAmount': !exists(json, 'TotalAmount') ? undefined : json['TotalAmount'],
        'vat': !exists(json, 'Vat') ? undefined : json['Vat'],
        'vatHigh': !exists(json, 'VatHigh') ? undefined : json['VatHigh'],
        'vatMedium': !exists(json, 'VatMedium') ? undefined : json['VatMedium'],
        'vatLow': !exists(json, 'VatLow') ? undefined : json['VatLow'],
        'isCreditInvoice': !exists(json, 'IsCreditInvoice') ? undefined : json['IsCreditInvoice'],
        'currencyCode': !exists(json, 'CurrencyCode') ? undefined : json['CurrencyCode'],
        'currencyRate': !exists(json, 'CurrencyRate') ? undefined : json['CurrencyRate'],
        'ocrNumber': !exists(json, 'OcrNumber') ? undefined : json['OcrNumber'],
        'message': !exists(json, 'Message') ? undefined : json['Message'],
        'plusGiroNumber': !exists(json, 'PlusGiroNumber') ? undefined : json['PlusGiroNumber'],
        'bankGiroNumber': !exists(json, 'BankGiroNumber') ? undefined : json['BankGiroNumber'],
        'rows': !exists(json, 'Rows') ? undefined : ((json['Rows'] as Array<any>).map(SupplierInvoiceRowFromJSON)),
        'supplierName': !exists(json, 'SupplierName') ? undefined : json['SupplierName'],
        'supplierNumber': !exists(json, 'SupplierNumber') ? undefined : json['SupplierNumber'],
        'remainingAmount': !exists(json, 'RemainingAmount') ? undefined : json['RemainingAmount'],
        'remainingAmountInvoiceCurrency': !exists(json, 'RemainingAmountInvoiceCurrency') ? undefined : json['RemainingAmountInvoiceCurrency'],
        'voucherNumber': !exists(json, 'VoucherNumber') ? undefined : json['VoucherNumber'],
        'voucherId': !exists(json, 'VoucherId') ? undefined : json['VoucherId'],
        'createdFromDraftId': !exists(json, 'CreatedFromDraftId') ? undefined : json['CreatedFromDraftId'],
        'selfEmployedWithoutFixedAddress': !exists(json, 'SelfEmployedWithoutFixedAddress') ? undefined : json['SelfEmployedWithoutFixedAddress'],
        'allocationPeriods': !exists(json, 'AllocationPeriods') ? undefined : ((json['AllocationPeriods'] as Array<any>).map(AllocationPeriodFromJSON)),
        'attachments': !exists(json, 'Attachments') ? undefined : json['Attachments'],
    };
}

export function SupplierInvoiceToJSON(value?: SupplierInvoice | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'Id': value.id,
        'SupplierId': value.supplierId,
        'BankAccountId': value.bankAccountId,
        'InvoiceDate': value.invoiceDate === undefined ? undefined : (value.invoiceDate.toISOString()),
        'PaymentDate': value.paymentDate === undefined ? undefined : (value.paymentDate.toISOString()),
        'DueDate': value.dueDate === undefined ? undefined : (value.dueDate.toISOString()),
        'InvoiceNumber': value.invoiceNumber,
        'TotalAmount': value.totalAmount,
        'Vat': value.vat,
        'VatHigh': value.vatHigh,
        'VatMedium': value.vatMedium,
        'VatLow': value.vatLow,
        'IsCreditInvoice': value.isCreditInvoice,
        'CurrencyCode': value.currencyCode,
        'CurrencyRate': value.currencyRate,
        'OcrNumber': value.ocrNumber,
        'Message': value.message,
        'PlusGiroNumber': value.plusGiroNumber,
        'BankGiroNumber': value.bankGiroNumber,
        'Rows': value.rows === undefined ? undefined : ((value.rows as Array<any>).map(SupplierInvoiceRowToJSON)),
        'SupplierName': value.supplierName,
        'SupplierNumber': value.supplierNumber,
        'RemainingAmount': value.remainingAmount,
        'RemainingAmountInvoiceCurrency': value.remainingAmountInvoiceCurrency,
        'VoucherNumber': value.voucherNumber,
        'VoucherId': value.voucherId,
        'CreatedFromDraftId': value.createdFromDraftId,
        'SelfEmployedWithoutFixedAddress': value.selfEmployedWithoutFixedAddress,
        'AllocationPeriods': value.allocationPeriods === undefined ? undefined : ((value.allocationPeriods as Array<any>).map(AllocationPeriodToJSON)),
        'Attachments': value.attachments,
    };
}


