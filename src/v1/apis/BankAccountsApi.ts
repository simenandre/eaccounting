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


import * as runtime from '../runtime';
import {
    BankAccount,
    BankAccountFromJSON,
    BankAccountToJSON,
} from '../models';

/**
 * 
 */
export class BankAccountsApi extends runtime.BaseAPI {

    /**
     * <p>Requires any of the following scopes: <br><b>ea:purchase, ea:purchase_readonly</b></p><p>Available in any of the following variants: <br><b>Pro, Standard, Solo</b></p>
     */
    async bankAccountsGetRaw(): Promise<runtime.ApiResponse<Array<BankAccount>>> {
        const queryParameters: runtime.HTTPQuery = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/bankaccounts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(BankAccountFromJSON));
    }

    /**
     * <p>Requires any of the following scopes: <br><b>ea:purchase, ea:purchase_readonly</b></p><p>Available in any of the following variants: <br><b>Pro, Standard, Solo</b></p>
     */
    async bankAccountsGet(): Promise<Array<BankAccount>> {
        const response = await this.bankAccountsGetRaw();
        return await response.value();
    }

}
