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
    RelatedAccounts,
    RelatedAccountsFromJSON,
    RelatedAccountsFromJSONTyped,
    RelatedAccountsToJSON,
} from './';

/**
 * 
 * @export
 * @interface VatCode
 */
export interface VatCode {
    /**
     * Purpose: Unique Id provided by eAccounting
     * @type {string}
     * @memberof VatCode
     */
    readonly id?: string;
    /**
     * Returns the VAT code
     * @type {string}
     * @memberof VatCode
     */
    code?: string;
    /**
     * 
     * @type {string}
     * @memberof VatCode
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof VatCode
     */
    vatRate?: number;
    /**
     * 
     * @type {RelatedAccounts}
     * @memberof VatCode
     */
    relatedAccounts?: RelatedAccounts;
}

export function VatCodeFromJSON(json: any): VatCode {
    return VatCodeFromJSONTyped(json, false);
}

export function VatCodeFromJSONTyped(json: any, ignoreDiscriminator: boolean): VatCode {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'Id') ? undefined : json['Id'],
        'code': !exists(json, 'Code') ? undefined : json['Code'],
        'description': !exists(json, 'Description') ? undefined : json['Description'],
        'vatRate': !exists(json, 'VatRate') ? undefined : json['VatRate'],
        'relatedAccounts': !exists(json, 'RelatedAccounts') ? undefined : RelatedAccountsFromJSON(json['RelatedAccounts']),
    };
}

export function VatCodeToJSON(value?: VatCode | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'Code': value.code,
        'Description': value.description,
        'VatRate': value.vatRate,
        'RelatedAccounts': RelatedAccountsToJSON(value.relatedAccounts),
    };
}

