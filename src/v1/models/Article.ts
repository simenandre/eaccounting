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
    ArticleLabel,
    ArticleLabelFromJSON,
    ArticleLabelFromJSONTyped,
    ArticleLabelToJSON,
} from './';

/**
 * 
 * @export
 * @interface Article
 */
export interface Article {
    /**
     * Purpose: Unique Id provided by eAccounting
     * @type {string}
     * @memberof Article
     */
    readonly id?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Article
     */
    isActive: boolean;
    /**
     * Max length: 40 characters
     * @type {string}
     * @memberof Article
     */
    number: string;
    /**
     * Max length: 50 characters
     * @type {string}
     * @memberof Article
     */
    name: string;
    /**
     * Max length: 50 characters
     * @type {string}
     * @memberof Article
     */
    nameEnglish?: string;
    /**
     * Format: Max 2 decimals
     * @type {number}
     * @memberof Article
     */
    netPrice?: number;
    /**
     * Format: Max 2 decimals
     * @type {number}
     * @memberof Article
     */
    grossPrice?: number;
    /**
     * Source: Get from /v1/articleaccountcodings
     * @type {string}
     * @memberof Article
     */
    codingId: string;
    /**
     * Source: Get from /v1/units
     * @type {string}
     * @memberof Article
     */
    unitId: string;
    /**
     * Purpose: Returns the unit name entered from UnitId
     * @type {string}
     * @memberof Article
     */
    unitName?: string;
    /**
     * Default: 0. Purpose: Sets the stock balance for this article
     * @type {number}
     * @memberof Article
     */
    stockBalance?: number;
    /**
     * Purpose: Returns the reserved stock balance for this article
     * @type {number}
     * @memberof Article
     */
    stockBalanceReserved?: number;
    /**
     * Purpose: Returns the available stock balance for this article
     * @type {number}
     * @memberof Article
     */
    stockBalanceAvailable?: number;
    /**
     * Purpose: Returns the last date and time from when a change was made on the article
     * @type {Date}
     * @memberof Article
     */
    changedUtc?: Date;
    /**
     * 
     * @type {number}
     * @memberof Article
     */
    houseWorkType?: number;
    /**
     * 
     * @type {number}
     * @memberof Article
     */
    purchasePrice?: number;
    /**
     * 
     * @type {Array<ArticleLabel>}
     * @memberof Article
     */
    articleLabels?: Array<ArticleLabel>;
}

export function ArticleFromJSON(json: any): Article {
    return ArticleFromJSONTyped(json, false);
}

export function ArticleFromJSONTyped(json: any, ignoreDiscriminator: boolean): Article {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'Id') ? undefined : json['Id'],
        'isActive': json['IsActive'],
        'number': json['Number'],
        'name': json['Name'],
        'nameEnglish': !exists(json, 'NameEnglish') ? undefined : json['NameEnglish'],
        'netPrice': !exists(json, 'NetPrice') ? undefined : json['NetPrice'],
        'grossPrice': !exists(json, 'GrossPrice') ? undefined : json['GrossPrice'],
        'codingId': json['CodingId'],
        'unitId': json['UnitId'],
        'unitName': !exists(json, 'UnitName') ? undefined : json['UnitName'],
        'stockBalance': !exists(json, 'StockBalance') ? undefined : json['StockBalance'],
        'stockBalanceReserved': !exists(json, 'StockBalanceReserved') ? undefined : json['StockBalanceReserved'],
        'stockBalanceAvailable': !exists(json, 'StockBalanceAvailable') ? undefined : json['StockBalanceAvailable'],
        'changedUtc': !exists(json, 'ChangedUtc') ? undefined : (new Date(json['ChangedUtc'])),
        'houseWorkType': !exists(json, 'HouseWorkType') ? undefined : json['HouseWorkType'],
        'purchasePrice': !exists(json, 'PurchasePrice') ? undefined : json['PurchasePrice'],
        'articleLabels': !exists(json, 'ArticleLabels') ? undefined : ((json['ArticleLabels'] as Array<any>).map(ArticleLabelFromJSON)),
    };
}

export function ArticleToJSON(value?: Article | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'IsActive': value.isActive,
        'Number': value.number,
        'Name': value.name,
        'NameEnglish': value.nameEnglish,
        'NetPrice': value.netPrice,
        'GrossPrice': value.grossPrice,
        'CodingId': value.codingId,
        'UnitId': value.unitId,
        'UnitName': value.unitName,
        'StockBalance': value.stockBalance,
        'StockBalanceReserved': value.stockBalanceReserved,
        'StockBalanceAvailable': value.stockBalanceAvailable,
        'ChangedUtc': value.changedUtc === undefined ? undefined : (value.changedUtc.toISOString()),
        'HouseWorkType': value.houseWorkType,
        'PurchasePrice': value.purchasePrice,
        'ArticleLabels': value.articleLabels === undefined ? undefined : ((value.articleLabels as Array<any>).map(ArticleLabelToJSON)),
    };
}


