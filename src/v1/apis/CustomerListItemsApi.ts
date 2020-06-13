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
    CustomerListItem,
    CustomerListItemFromJSON,
    CustomerListItemToJSON,
} from '../models';

export interface CustomerListItemsGetRequest {
    changedFromDate?: string;
    includeInactive?: boolean;
    customerNumber?: string;
    customerEmail?: string;
}

/**
 * 
 */
export class CustomerListItemsApi extends runtime.BaseAPI {

    /**
     * <p>Requires any of the following scopes: <br><b>ea:sales, ea:sales_readonly</b></p><p>Available in any of the following variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
     * Get a list of all customers. Filter by using the filter parameters.
     */
    async customerListItemsGetRaw(requestParameters: CustomerListItemsGetRequest): Promise<runtime.ApiResponse<Array<CustomerListItem>>> {
        const queryParameters: runtime.HTTPQuery = {};

        if (requestParameters.changedFromDate !== undefined) {
            queryParameters['changedFromDate'] = requestParameters.changedFromDate;
        }

        if (requestParameters.includeInactive !== undefined) {
            queryParameters['includeInactive'] = requestParameters.includeInactive;
        }

        if (requestParameters.customerNumber !== undefined) {
            queryParameters['customerNumber'] = requestParameters.customerNumber;
        }

        if (requestParameters.customerEmail !== undefined) {
            queryParameters['customerEmail'] = requestParameters.customerEmail;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/customerlistitems`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CustomerListItemFromJSON));
    }

    /**
     * <p>Requires any of the following scopes: <br><b>ea:sales, ea:sales_readonly</b></p><p>Available in any of the following variants: <br><b>Pro, Standard, Invoicing, Solo</b></p>
     * Get a list of all customers. Filter by using the filter parameters.
     */
    async customerListItemsGet(requestParameters: CustomerListItemsGetRequest): Promise<Array<CustomerListItem>> {
        const response = await this.customerListItemsGetRaw(requestParameters);
        return await response.value();
    }

}
