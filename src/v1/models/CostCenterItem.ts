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
/**
 * 
 * @export
 * @interface CostCenterItem
 */
export interface CostCenterItem {
    /**
     * Source: Get from /v1/costcenters
     * @type {string}
     * @memberof CostCenterItem
     */
    costCenterId: string;
    /**
     * Purpose: Unique Id provided by eAccounting
     * @type {string}
     * @memberof CostCenterItem
     */
    readonly id?: string;
    /**
     * Max length: 50 characters
     * @type {string}
     * @memberof CostCenterItem
     */
    name: string;
    /**
     * Max length: 9 characters
     * @type {string}
     * @memberof CostCenterItem
     */
    shortName: string;
    /**
     * 
     * @type {boolean}
     * @memberof CostCenterItem
     */
    isActive: boolean;
}

export function CostCenterItemFromJSON(json: any): CostCenterItem {
    return CostCenterItemFromJSONTyped(json, false);
}

export function CostCenterItemFromJSONTyped(json: any, ignoreDiscriminator: boolean): CostCenterItem {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'costCenterId': json['CostCenterId'],
        'id': !exists(json, 'Id') ? undefined : json['Id'],
        'name': json['Name'],
        'shortName': json['ShortName'],
        'isActive': json['IsActive'],
    };
}

export function CostCenterItemToJSON(value?: CostCenterItem | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'CostCenterId': value.costCenterId,
        'Name': value.name,
        'ShortName': value.shortName,
        'IsActive': value.isActive,
    };
}


