import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { ModelsAbsenceRequest } from '../models/ModelsAbsenceRequest';
import { ModelsAbsenceResponse } from '../models/ModelsAbsenceResponse';
import { ModelsAbsenceType } from '../models/ModelsAbsenceType';
import { ModelsAuditLog } from '../models/ModelsAuditLog';
import { ModelsAuditLogListResponse } from '../models/ModelsAuditLogListResponse';
import { ModelsBatchApproveRequest } from '../models/ModelsBatchApproveRequest';
import { ModelsBatchApproveResponse } from '../models/ModelsBatchApproveResponse';
import { ModelsBulkLocationRequest } from '../models/ModelsBulkLocationRequest';
import { ModelsBulkLocationResponse } from '../models/ModelsBulkLocationResponse';
import { ModelsCheckinConfigRequest } from '../models/ModelsCheckinConfigRequest';
import { ModelsCheckinLocation } from '../models/ModelsCheckinLocation';
import { ModelsCheckinRequest } from '../models/ModelsCheckinRequest';
import { ModelsCheckinResponse } from '../models/ModelsCheckinResponse';
import { ModelsCheckoutRequest } from '../models/ModelsCheckoutRequest';
import { ModelsCheckoutResponse } from '../models/ModelsCheckoutResponse';
import { ModelsCheckoutUpdateRequest } from '../models/ModelsCheckoutUpdateRequest';
import { ModelsConvertAbsenceRequest } from '../models/ModelsConvertAbsenceRequest';
import { ModelsDailySummary } from '../models/ModelsDailySummary';
import { ModelsErrorResponse } from '../models/ModelsErrorResponse';
import { ModelsIndividualAttendanceResponse } from '../models/ModelsIndividualAttendanceResponse';
import { ModelsLocation } from '../models/ModelsLocation';
import { ModelsLocationCatalogRequest } from '../models/ModelsLocationCatalogRequest';
import { ModelsLocationCatalogResponse } from '../models/ModelsLocationCatalogResponse';
import { ModelsLocationRequest } from '../models/ModelsLocationRequest';
import { ModelsLocationType } from '../models/ModelsLocationType';
import { ModelsLockAbsenceRequest } from '../models/ModelsLockAbsenceRequest';
import { ModelsLoginRequest } from '../models/ModelsLoginRequest';
import { ModelsLoginResponse } from '../models/ModelsLoginResponse';
import { ModelsLogoutRequest } from '../models/ModelsLogoutRequest';
import { ModelsRefreshRequest } from '../models/ModelsRefreshRequest';
import { ModelsRegisterRequest } from '../models/ModelsRegisterRequest';
import { ModelsResendConfirmationRequest } from '../models/ModelsResendConfirmationRequest';
import { ModelsSimpleResponse } from '../models/ModelsSimpleResponse';
import { ModelsUpdateLocationsRequest } from '../models/ModelsUpdateLocationsRequest';
import { ModelsUser } from '../models/ModelsUser';
import { ModelsUserHRDetailsRequest } from '../models/ModelsUserHRDetailsRequest';
import { ModelsUserResponse } from '../models/ModelsUserResponse';

import { ObservableAbsenceApi } from "./ObservableAPI";
import { AbsenceApiRequestFactory, AbsenceApiResponseProcessor} from "../apis/AbsenceApi";

export interface AbsenceApiApiAbsencesAllGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesAllGet
     */
    page?: number
    /**
     * Page size (default 20)
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesAllGet
     */
    pageSize?: number
    /**
     * Filter by user ID
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesAllGet
     */
    userId?: number
    /**
     * Filter by date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof AbsenceApiapiAbsencesAllGet
     */
    date?: string
    /**
     * Filter by type (absence/late/medical)
     * Defaults to: undefined
     * @type string
     * @memberof AbsenceApiapiAbsencesAllGet
     */
    type?: string
}

export interface AbsenceApiApiAbsencesGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesGet
     */
    page?: number
    /**
     * Page size (default 20, max 100)
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesGet
     */
    pageSize?: number
}

export interface AbsenceApiApiAbsencesIdDeleteRequest {
    /**
     * Absence ID
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesIdDelete
     */
    id: number
}

export interface AbsenceApiApiAbsencesIdDocumentsPostRequest {
    /**
     * Absence ID
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesIdDocumentsPost
     */
    id: number
    /**
     * Medical certificate file
     * Defaults to: undefined
     * @type HttpFile
     * @memberof AbsenceApiapiAbsencesIdDocumentsPost
     */
    file: HttpFile
}

export interface AbsenceApiApiAbsencesIdLockPatchRequest {
    /**
     * Absence ID
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesIdLockPatch
     */
    id: number
    /**
     * Lock state
     * @type ModelsLockAbsenceRequest
     * @memberof AbsenceApiapiAbsencesIdLockPatch
     */
    lock: ModelsLockAbsenceRequest
}

export interface AbsenceApiApiAbsencesIdPutRequest {
    /**
     * Absence ID
     * Defaults to: undefined
     * @type number
     * @memberof AbsenceApiapiAbsencesIdPut
     */
    id: number
    /**
     * Absence data
     * @type ModelsAbsenceRequest
     * @memberof AbsenceApiapiAbsencesIdPut
     */
    absence: ModelsAbsenceRequest
}

export interface AbsenceApiApiAbsencesPostRequest {
    /**
     * Absence data
     * @type ModelsAbsenceRequest
     * @memberof AbsenceApiapiAbsencesPost
     */
    absence: ModelsAbsenceRequest
}

export class ObjectAbsenceApi {
    private api: ObservableAbsenceApi

    public constructor(configuration: Configuration, requestFactory?: AbsenceApiRequestFactory, responseProcessor?: AbsenceApiResponseProcessor) {
        this.api = new ObservableAbsenceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * HR/admin only. Returns paginated list of all absences. Query params: page, page_size, user_id, date, type
     * List all absences (HR/admin)
     * @param param the request object
     */
    public apiAbsencesAllGetWithHttpInfo(param: AbsenceApiApiAbsencesAllGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<ModelsAbsenceResponse>>> {
        return this.api.apiAbsencesAllGetWithHttpInfo(param.page, param.pageSize, param.userId, param.date, param.type,  options).toPromise();
    }

    /**
     * HR/admin only. Returns paginated list of all absences. Query params: page, page_size, user_id, date, type
     * List all absences (HR/admin)
     * @param param the request object
     */
    public apiAbsencesAllGet(param: AbsenceApiApiAbsencesAllGetRequest = {}, options?: ConfigurationOptions): Promise<Array<ModelsAbsenceResponse>> {
        return this.api.apiAbsencesAllGet(param.page, param.pageSize, param.userId, param.date, param.type,  options).toPromise();
    }

    /**
     * Returns all absences for the authenticated user, newest first. JWT required.
     * Get user\'s absence history
     * @param param the request object
     */
    public apiAbsencesGetWithHttpInfo(param: AbsenceApiApiAbsencesGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiAbsencesGetWithHttpInfo(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns all absences for the authenticated user, newest first. JWT required.
     * Get user\'s absence history
     * @param param the request object
     */
    public apiAbsencesGet(param: AbsenceApiApiAbsencesGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiAbsencesGet(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * HR/admin only. Soft delete an absence by setting deleted=true.
     * Soft delete absence (HR/admin)
     * @param param the request object
     */
    public apiAbsencesIdDeleteWithHttpInfo(param: AbsenceApiApiAbsencesIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        return this.api.apiAbsencesIdDeleteWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * HR/admin only. Soft delete an absence by setting deleted=true.
     * Soft delete absence (HR/admin)
     * @param param the request object
     */
    public apiAbsencesIdDelete(param: AbsenceApiApiAbsencesIdDeleteRequest, options?: ConfigurationOptions): Promise<ModelsSimpleResponse> {
        return this.api.apiAbsencesIdDelete(param.id,  options).toPromise();
    }

    /**
     * User uploads a file for their own absence if not locked. Only PDF/JPG/PNG, max 5MB. JWT required.
     * Upload medical certificate
     * @param param the request object
     */
    public apiAbsencesIdDocumentsPostWithHttpInfo(param: AbsenceApiApiAbsencesIdDocumentsPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        return this.api.apiAbsencesIdDocumentsPostWithHttpInfo(param.id, param.file,  options).toPromise();
    }

    /**
     * User uploads a file for their own absence if not locked. Only PDF/JPG/PNG, max 5MB. JWT required.
     * Upload medical certificate
     * @param param the request object
     */
    public apiAbsencesIdDocumentsPost(param: AbsenceApiApiAbsencesIdDocumentsPostRequest, options?: ConfigurationOptions): Promise<ModelsAbsenceResponse> {
        return this.api.apiAbsencesIdDocumentsPost(param.id, param.file,  options).toPromise();
    }

    /**
     * HR/admin can lock or unlock an absence to prevent user edits. JWT with hr/admin required.
     * Lock or unlock an absence
     * @param param the request object
     */
    public apiAbsencesIdLockPatchWithHttpInfo(param: AbsenceApiApiAbsencesIdLockPatchRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        return this.api.apiAbsencesIdLockPatchWithHttpInfo(param.id, param.lock,  options).toPromise();
    }

    /**
     * HR/admin can lock or unlock an absence to prevent user edits. JWT with hr/admin required.
     * Lock or unlock an absence
     * @param param the request object
     */
    public apiAbsencesIdLockPatch(param: AbsenceApiApiAbsencesIdLockPatchRequest, options?: ConfigurationOptions): Promise<ModelsAbsenceResponse> {
        return this.api.apiAbsencesIdLockPatch(param.id, param.lock,  options).toPromise();
    }

    /**
     * User can update their own absence if not locked. HR/admin can update any. JWT required.
     * Update absence/late/medical
     * @param param the request object
     */
    public apiAbsencesIdPutWithHttpInfo(param: AbsenceApiApiAbsencesIdPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        return this.api.apiAbsencesIdPutWithHttpInfo(param.id, param.absence,  options).toPromise();
    }

    /**
     * User can update their own absence if not locked. HR/admin can update any. JWT required.
     * Update absence/late/medical
     * @param param the request object
     */
    public apiAbsencesIdPut(param: AbsenceApiApiAbsencesIdPutRequest, options?: ConfigurationOptions): Promise<ModelsAbsenceResponse> {
        return this.api.apiAbsencesIdPut(param.id, param.absence,  options).toPromise();
    }

    /**
     * User reports absence, late arrival, or medical leave. JWT required.
     * Report absence/late/medical
     * @param param the request object
     */
    public apiAbsencesPostWithHttpInfo(param: AbsenceApiApiAbsencesPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        return this.api.apiAbsencesPostWithHttpInfo(param.absence,  options).toPromise();
    }

    /**
     * User reports absence, late arrival, or medical leave. JWT required.
     * Report absence/late/medical
     * @param param the request object
     */
    public apiAbsencesPost(param: AbsenceApiApiAbsencesPostRequest, options?: ConfigurationOptions): Promise<ModelsAbsenceResponse> {
        return this.api.apiAbsencesPost(param.absence,  options).toPromise();
    }

}

import { ObservableAuthApi } from "./ObservableAPI";
import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";

export interface AuthApiAuthLoginPostRequest {
    /**
     * Login credentials
     * @type ModelsLoginRequest
     * @memberof AuthApiauthLoginPost
     */
    credentials: ModelsLoginRequest
}

export interface AuthApiAuthLogoutPostRequest {
    /**
     * Logout request
     * @type ModelsLogoutRequest
     * @memberof AuthApiauthLogoutPost
     */
    logout: ModelsLogoutRequest
}

export interface AuthApiAuthRefreshPostRequest {
    /**
     * Refresh token request
     * @type ModelsRefreshRequest
     * @memberof AuthApiauthRefreshPost
     */
    refresh: ModelsRefreshRequest
}

export interface AuthApiAuthRegisterPostRequest {
    /**
     * Registration data
     * @type ModelsRegisterRequest
     * @memberof AuthApiauthRegisterPost
     */
    registration: ModelsRegisterRequest
}

export interface AuthApiAuthResendConfirmationPostRequest {
    /**
     * Resend confirmation request
     * @type ModelsResendConfirmationRequest
     * @memberof AuthApiauthResendConfirmationPost
     */
    resend: ModelsResendConfirmationRequest
}

export class ObjectAuthApi {
    private api: ObservableAuthApi

    public constructor(configuration: Configuration, requestFactory?: AuthApiRequestFactory, responseProcessor?: AuthApiResponseProcessor) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Authenticate with email and password. Returns JWT on success.
     * Login
     * @param param the request object
     */
    public authLoginPostWithHttpInfo(param: AuthApiAuthLoginPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsLoginResponse>> {
        return this.api.authLoginPostWithHttpInfo(param.credentials,  options).toPromise();
    }

    /**
     * Authenticate with email and password. Returns JWT on success.
     * Login
     * @param param the request object
     */
    public authLoginPost(param: AuthApiAuthLoginPostRequest, options?: ConfigurationOptions): Promise<ModelsLoginResponse> {
        return this.api.authLoginPost(param.credentials,  options).toPromise();
    }

    /**
     * Revoke a refresh token (logout from device/session)
     * Logout (revoke refresh token)
     * @param param the request object
     */
    public authLogoutPostWithHttpInfo(param: AuthApiAuthLogoutPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        return this.api.authLogoutPostWithHttpInfo(param.logout,  options).toPromise();
    }

    /**
     * Revoke a refresh token (logout from device/session)
     * Logout (revoke refresh token)
     * @param param the request object
     */
    public authLogoutPost(param: AuthApiAuthLogoutPostRequest, options?: ConfigurationOptions): Promise<{ [key: string]: string; }> {
        return this.api.authLogoutPost(param.logout,  options).toPromise();
    }

    /**
     * Exchange a valid refresh token for a new access token. Rotates refresh token.
     * Refresh JWT access token
     * @param param the request object
     */
    public authRefreshPostWithHttpInfo(param: AuthApiAuthRefreshPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        return this.api.authRefreshPostWithHttpInfo(param.refresh,  options).toPromise();
    }

    /**
     * Exchange a valid refresh token for a new access token. Rotates refresh token.
     * Refresh JWT access token
     * @param param the request object
     */
    public authRefreshPost(param: AuthApiAuthRefreshPostRequest, options?: ConfigurationOptions): Promise<{ [key: string]: string; }> {
        return this.api.authRefreshPost(param.refresh,  options).toPromise();
    }

    /**
     * Register with name, surname, email, phone, and password. Sends confirmation email.
     * Register a new user
     * @param param the request object
     */
    public authRegisterPostWithHttpInfo(param: AuthApiAuthRegisterPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        return this.api.authRegisterPostWithHttpInfo(param.registration,  options).toPromise();
    }

    /**
     * Register with name, surname, email, phone, and password. Sends confirmation email.
     * Register a new user
     * @param param the request object
     */
    public authRegisterPost(param: AuthApiAuthRegisterPostRequest, options?: ConfigurationOptions): Promise<{ [key: string]: string; }> {
        return this.api.authRegisterPost(param.registration,  options).toPromise();
    }

    /**
     * Resend the email confirmation link to a user who hasn\'t confirmed yet.
     * Resend confirmation email
     * @param param the request object
     */
    public authResendConfirmationPostWithHttpInfo(param: AuthApiAuthResendConfirmationPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        return this.api.authResendConfirmationPostWithHttpInfo(param.resend,  options).toPromise();
    }

    /**
     * Resend the email confirmation link to a user who hasn\'t confirmed yet.
     * Resend confirmation email
     * @param param the request object
     */
    public authResendConfirmationPost(param: AuthApiAuthResendConfirmationPostRequest, options?: ConfigurationOptions): Promise<{ [key: string]: string; }> {
        return this.api.authResendConfirmationPost(param.resend,  options).toPromise();
    }

}

import { ObservableCatalogApi } from "./ObservableAPI";
import { CatalogApiRequestFactory, CatalogApiResponseProcessor} from "../apis/CatalogApi";

export interface CatalogApiApiCatalogLocationsActiveGetRequest {
    /**
     * Location type filter
     * Defaults to: undefined
     * @type string
     * @memberof CatalogApiapiCatalogLocationsActiveGet
     */
    type?: string
}

export interface CatalogApiApiCatalogLocationsBulkPostRequest {
    /**
     * Locations to create
     * @type ModelsBulkLocationRequest
     * @memberof CatalogApiapiCatalogLocationsBulkPost
     */
    locations: ModelsBulkLocationRequest
}

export interface CatalogApiApiCatalogLocationsGetRequest {
    /**
     * Location type filter
     * Defaults to: undefined
     * @type string
     * @memberof CatalogApiapiCatalogLocationsGet
     */
    type?: string
    /**
     * Active status filter
     * Defaults to: undefined
     * @type boolean
     * @memberof CatalogApiapiCatalogLocationsGet
     */
    isActive?: boolean
    /**
     * Search in name and description
     * Defaults to: undefined
     * @type string
     * @memberof CatalogApiapiCatalogLocationsGet
     */
    search?: string
}

export interface CatalogApiApiCatalogLocationsIdDeleteRequest {
    /**
     * Location ID
     * Defaults to: undefined
     * @type number
     * @memberof CatalogApiapiCatalogLocationsIdDelete
     */
    id: number
}

export interface CatalogApiApiCatalogLocationsIdGetRequest {
    /**
     * Location ID
     * Defaults to: undefined
     * @type number
     * @memberof CatalogApiapiCatalogLocationsIdGet
     */
    id: number
}

export interface CatalogApiApiCatalogLocationsIdPutRequest {
    /**
     * Location ID
     * Defaults to: undefined
     * @type number
     * @memberof CatalogApiapiCatalogLocationsIdPut
     */
    id: number
    /**
     * Updated location data
     * @type ModelsLocationCatalogRequest
     * @memberof CatalogApiapiCatalogLocationsIdPut
     */
    location: ModelsLocationCatalogRequest
}

export interface CatalogApiApiCatalogLocationsPostRequest {
    /**
     * Location data
     * @type ModelsLocationCatalogRequest
     * @memberof CatalogApiapiCatalogLocationsPost
     */
    location: ModelsLocationCatalogRequest
}

export class ObjectCatalogApi {
    private api: ObservableCatalogApi

    public constructor(configuration: Configuration, requestFactory?: CatalogApiRequestFactory, responseProcessor?: CatalogApiResponseProcessor) {
        this.api = new ObservableCatalogApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get all active locations for dropdowns and forms.
     * Get active locations
     * @param param the request object
     */
    public apiCatalogLocationsActiveGetWithHttpInfo(param: CatalogApiApiCatalogLocationsActiveGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<ModelsLocationCatalogResponse>>> {
        return this.api.apiCatalogLocationsActiveGetWithHttpInfo(param.type,  options).toPromise();
    }

    /**
     * Get all active locations for dropdowns and forms.
     * Get active locations
     * @param param the request object
     */
    public apiCatalogLocationsActiveGet(param: CatalogApiApiCatalogLocationsActiveGetRequest = {}, options?: ConfigurationOptions): Promise<Array<ModelsLocationCatalogResponse>> {
        return this.api.apiCatalogLocationsActiveGet(param.type,  options).toPromise();
    }

    /**
     * Create multiple locations at once. HR/Admin only.
     * Bulk create locations
     * @param param the request object
     */
    public apiCatalogLocationsBulkPostWithHttpInfo(param: CatalogApiApiCatalogLocationsBulkPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsBulkLocationResponse>> {
        return this.api.apiCatalogLocationsBulkPostWithHttpInfo(param.locations,  options).toPromise();
    }

    /**
     * Create multiple locations at once. HR/Admin only.
     * Bulk create locations
     * @param param the request object
     */
    public apiCatalogLocationsBulkPost(param: CatalogApiApiCatalogLocationsBulkPostRequest, options?: ConfigurationOptions): Promise<ModelsBulkLocationResponse> {
        return this.api.apiCatalogLocationsBulkPost(param.locations,  options).toPromise();
    }

    /**
     * Get locations with optional filtering.
     * Get locations with filters
     * @param param the request object
     */
    public apiCatalogLocationsGetWithHttpInfo(param: CatalogApiApiCatalogLocationsGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<ModelsLocationCatalogResponse>>> {
        return this.api.apiCatalogLocationsGetWithHttpInfo(param.type, param.isActive, param.search,  options).toPromise();
    }

    /**
     * Get locations with optional filtering.
     * Get locations with filters
     * @param param the request object
     */
    public apiCatalogLocationsGet(param: CatalogApiApiCatalogLocationsGetRequest = {}, options?: ConfigurationOptions): Promise<Array<ModelsLocationCatalogResponse>> {
        return this.api.apiCatalogLocationsGet(param.type, param.isActive, param.search,  options).toPromise();
    }

    /**
     * Soft delete a location. HR/Admin only.
     * Delete a location
     * @param param the request object
     */
    public apiCatalogLocationsIdDeleteWithHttpInfo(param: CatalogApiApiCatalogLocationsIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        return this.api.apiCatalogLocationsIdDeleteWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * Soft delete a location. HR/Admin only.
     * Delete a location
     * @param param the request object
     */
    public apiCatalogLocationsIdDelete(param: CatalogApiApiCatalogLocationsIdDeleteRequest, options?: ConfigurationOptions): Promise<ModelsSimpleResponse> {
        return this.api.apiCatalogLocationsIdDelete(param.id,  options).toPromise();
    }

    /**
     * Get a specific location by ID. HR/Admin only.
     * Get a specific location
     * @param param the request object
     */
    public apiCatalogLocationsIdGetWithHttpInfo(param: CatalogApiApiCatalogLocationsIdGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsLocationCatalogResponse>> {
        return this.api.apiCatalogLocationsIdGetWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * Get a specific location by ID. HR/Admin only.
     * Get a specific location
     * @param param the request object
     */
    public apiCatalogLocationsIdGet(param: CatalogApiApiCatalogLocationsIdGetRequest, options?: ConfigurationOptions): Promise<ModelsLocationCatalogResponse> {
        return this.api.apiCatalogLocationsIdGet(param.id,  options).toPromise();
    }

    /**
     * Update an existing location. HR/Admin only.
     * Update a location
     * @param param the request object
     */
    public apiCatalogLocationsIdPutWithHttpInfo(param: CatalogApiApiCatalogLocationsIdPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsLocationCatalogResponse>> {
        return this.api.apiCatalogLocationsIdPutWithHttpInfo(param.id, param.location,  options).toPromise();
    }

    /**
     * Update an existing location. HR/Admin only.
     * Update a location
     * @param param the request object
     */
    public apiCatalogLocationsIdPut(param: CatalogApiApiCatalogLocationsIdPutRequest, options?: ConfigurationOptions): Promise<ModelsLocationCatalogResponse> {
        return this.api.apiCatalogLocationsIdPut(param.id, param.location,  options).toPromise();
    }

    /**
     * Create a new location in the catalog. HR/Admin only.
     * Create a new location
     * @param param the request object
     */
    public apiCatalogLocationsPostWithHttpInfo(param: CatalogApiApiCatalogLocationsPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsLocationCatalogResponse>> {
        return this.api.apiCatalogLocationsPostWithHttpInfo(param.location,  options).toPromise();
    }

    /**
     * Create a new location in the catalog. HR/Admin only.
     * Create a new location
     * @param param the request object
     */
    public apiCatalogLocationsPost(param: CatalogApiApiCatalogLocationsPostRequest, options?: ConfigurationOptions): Promise<ModelsLocationCatalogResponse> {
        return this.api.apiCatalogLocationsPost(param.location,  options).toPromise();
    }

}

import { ObservableCheckinApi } from "./ObservableAPI";
import { CheckinApiRequestFactory, CheckinApiResponseProcessor} from "../apis/CheckinApi";

export interface CheckinApiApiCheckinsAllGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsAllGet
     */
    page?: number
    /**
     * Page size (default 20)
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsAllGet
     */
    pageSize?: number
    /**
     * Filter by user ID
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsAllGet
     */
    userId?: number
    /**
     * Filter by date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof CheckinApiapiCheckinsAllGet
     */
    date?: string
}

export interface CheckinApiApiCheckinsBatchApprovePostRequest {
    /**
     * Batch approve request
     * @type ModelsBatchApproveRequest
     * @memberof CheckinApiapiCheckinsBatchApprovePost
     */
    body: ModelsBatchApproveRequest
}

export interface CheckinApiApiCheckinsCheckoutIdPutRequest {
    /**
     * Check-in ID
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsCheckoutIdPut
     */
    id: number
    /**
     * Checkout update data
     * @type ModelsCheckoutUpdateRequest
     * @memberof CheckinApiapiCheckinsCheckoutIdPut
     */
    checkout: ModelsCheckoutUpdateRequest
}

export interface CheckinApiApiCheckinsCheckoutPostRequest {
    /**
     * Checkout data
     * @type ModelsCheckoutRequest
     * @memberof CheckinApiapiCheckinsCheckoutPost
     */
    checkout: ModelsCheckoutRequest
}

export interface CheckinApiApiCheckinsGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsGet
     */
    page?: number
    /**
     * Page size (default 20, max 100)
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsGet
     */
    pageSize?: number
}

export interface CheckinApiApiCheckinsIdDeleteRequest {
    /**
     * Check-in ID
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsIdDelete
     */
    id: number
}

export interface CheckinApiApiCheckinsLocationsGetRequest {
}

export interface CheckinApiApiCheckinsLocationsIdDeleteRequest {
    /**
     * Location ID
     * Defaults to: undefined
     * @type number
     * @memberof CheckinApiapiCheckinsLocationsIdDelete
     */
    id: number
}

export interface CheckinApiApiCheckinsLocationsPutRequest {
    /**
     * Updated locations
     * @type ModelsUpdateLocationsRequest
     * @memberof CheckinApiapiCheckinsLocationsPut
     */
    locations: ModelsUpdateLocationsRequest
}

export interface CheckinApiApiCheckinsPostRequest {
    /**
     * Check-in data
     * @type ModelsCheckinRequest
     * @memberof CheckinApiapiCheckinsPost
     */
    checkin: ModelsCheckinRequest
}

export interface CheckinApiApiCheckinsTodayGetRequest {
}

export class ObjectCheckinApi {
    private api: ObservableCheckinApi

    public constructor(configuration: Configuration, requestFactory?: CheckinApiRequestFactory, responseProcessor?: CheckinApiResponseProcessor) {
        this.api = new ObservableCheckinApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * HR/admin only. Returns paginated list of all check-ins. Query params: page, page_size, user_id, date
     * List all check-ins (HR/admin)
     * @param param the request object
     */
    public apiCheckinsAllGetWithHttpInfo(param: CheckinApiApiCheckinsAllGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<ModelsCheckinResponse>>> {
        return this.api.apiCheckinsAllGetWithHttpInfo(param.page, param.pageSize, param.userId, param.date,  options).toPromise();
    }

    /**
     * HR/admin only. Returns paginated list of all check-ins. Query params: page, page_size, user_id, date
     * List all check-ins (HR/admin)
     * @param param the request object
     */
    public apiCheckinsAllGet(param: CheckinApiApiCheckinsAllGetRequest = {}, options?: ConfigurationOptions): Promise<Array<ModelsCheckinResponse>> {
        return this.api.apiCheckinsAllGet(param.page, param.pageSize, param.userId, param.date,  options).toPromise();
    }

    /**
     * HR/admin can approve or reject multiple check-ins in one API call.
     * Batch approve check-ins (HR/admin)
     * @param param the request object
     */
    public apiCheckinsBatchApprovePostWithHttpInfo(param: CheckinApiApiCheckinsBatchApprovePostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsBatchApproveResponse>> {
        return this.api.apiCheckinsBatchApprovePostWithHttpInfo(param.body,  options).toPromise();
    }

    /**
     * HR/admin can approve or reject multiple check-ins in one API call.
     * Batch approve check-ins (HR/admin)
     * @param param the request object
     */
    public apiCheckinsBatchApprovePost(param: CheckinApiApiCheckinsBatchApprovePostRequest, options?: ConfigurationOptions): Promise<ModelsBatchApproveResponse> {
        return this.api.apiCheckinsBatchApprovePost(param.body,  options).toPromise();
    }

    /**
     * HR or admin can update any user\'s checkout info (time, status, overtime). JWT with hr/admin role required.
     * Admin/HR update checkout
     * @param param the request object
     */
    public apiCheckinsCheckoutIdPutWithHttpInfo(param: CheckinApiApiCheckinsCheckoutIdPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiCheckinsCheckoutIdPutWithHttpInfo(param.id, param.checkout,  options).toPromise();
    }

    /**
     * HR or admin can update any user\'s checkout info (time, status, overtime). JWT with hr/admin role required.
     * Admin/HR update checkout
     * @param param the request object
     */
    public apiCheckinsCheckoutIdPut(param: CheckinApiApiCheckinsCheckoutIdPutRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiCheckinsCheckoutIdPut(param.id, param.checkout,  options).toPromise();
    }

    /**
     * User submits daily checkout (end-of-day). Only one per day. JWT required. Must have checked in first. Records checkout time, status, and overtime.
     * Submit daily checkout
     * @param param the request object
     */
    public apiCheckinsCheckoutPostWithHttpInfo(param: CheckinApiApiCheckinsCheckoutPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiCheckinsCheckoutPostWithHttpInfo(param.checkout,  options).toPromise();
    }

    /**
     * User submits daily checkout (end-of-day). Only one per day. JWT required. Must have checked in first. Records checkout time, status, and overtime.
     * Submit daily checkout
     * @param param the request object
     */
    public apiCheckinsCheckoutPost(param: CheckinApiApiCheckinsCheckoutPostRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiCheckinsCheckoutPost(param.checkout,  options).toPromise();
    }

    /**
     * Returns all check-ins for the authenticated user, newest first. JWT required.
     * Get user\'s check-in history
     * @param param the request object
     */
    public apiCheckinsGetWithHttpInfo(param: CheckinApiApiCheckinsGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiCheckinsGetWithHttpInfo(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns all check-ins for the authenticated user, newest first. JWT required.
     * Get user\'s check-in history
     * @param param the request object
     */
    public apiCheckinsGet(param: CheckinApiApiCheckinsGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiCheckinsGet(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * HR/admin only. Soft delete a check-in by setting deleted=true.
     * Soft delete check-in (HR/admin)
     * @param param the request object
     */
    public apiCheckinsIdDeleteWithHttpInfo(param: CheckinApiApiCheckinsIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsErrorResponse>> {
        return this.api.apiCheckinsIdDeleteWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * HR/admin only. Soft delete a check-in by setting deleted=true.
     * Soft delete check-in (HR/admin)
     * @param param the request object
     */
    public apiCheckinsIdDelete(param: CheckinApiApiCheckinsIdDeleteRequest, options?: ConfigurationOptions): Promise<ModelsErrorResponse> {
        return this.api.apiCheckinsIdDelete(param.id,  options).toPromise();
    }

    /**
     * Get all locations for today\'s check-in. JWT required.
     * Get today\'s locations
     * @param param the request object
     */
    public apiCheckinsLocationsGetWithHttpInfo(param: CheckinApiApiCheckinsLocationsGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Array<ModelsCheckinLocation>>> {
        return this.api.apiCheckinsLocationsGetWithHttpInfo( options).toPromise();
    }

    /**
     * Get all locations for today\'s check-in. JWT required.
     * Get today\'s locations
     * @param param the request object
     */
    public apiCheckinsLocationsGet(param: CheckinApiApiCheckinsLocationsGetRequest = {}, options?: ConfigurationOptions): Promise<Array<ModelsCheckinLocation>> {
        return this.api.apiCheckinsLocationsGet( options).toPromise();
    }

    /**
     * Delete a specific location from today\'s check-in. JWT required.
     * Delete a specific location
     * @param param the request object
     */
    public apiCheckinsLocationsIdDeleteWithHttpInfo(param: CheckinApiApiCheckinsLocationsIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        return this.api.apiCheckinsLocationsIdDeleteWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * Delete a specific location from today\'s check-in. JWT required.
     * Delete a specific location
     * @param param the request object
     */
    public apiCheckinsLocationsIdDelete(param: CheckinApiApiCheckinsLocationsIdDeleteRequest, options?: ConfigurationOptions): Promise<ModelsSimpleResponse> {
        return this.api.apiCheckinsLocationsIdDelete(param.id,  options).toPromise();
    }

    /**
     * User can update their work locations during the day. Only works if they have already checked in today. JWT required.
     * Update locations during the day
     * @param param the request object
     */
    public apiCheckinsLocationsPutWithHttpInfo(param: CheckinApiApiCheckinsLocationsPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiCheckinsLocationsPutWithHttpInfo(param.locations,  options).toPromise();
    }

    /**
     * User can update their work locations during the day. Only works if they have already checked in today. JWT required.
     * Update locations during the day
     * @param param the request object
     */
    public apiCheckinsLocationsPut(param: CheckinApiApiCheckinsLocationsPutRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiCheckinsLocationsPut(param.locations,  options).toPromise();
    }

    /**
     * User submits daily check-in with location. Only one per day. JWT required. If late, must provide reason.
     * Submit daily check-in
     * @param param the request object
     */
    public apiCheckinsPostWithHttpInfo(param: CheckinApiApiCheckinsPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiCheckinsPostWithHttpInfo(param.checkin,  options).toPromise();
    }

    /**
     * User submits daily check-in with location. Only one per day. JWT required. If late, must provide reason.
     * Submit daily check-in
     * @param param the request object
     */
    public apiCheckinsPost(param: CheckinApiApiCheckinsPostRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiCheckinsPost(param.checkin,  options).toPromise();
    }

    /**
     * Returns today\'s check-in for the authenticated user, or 404 if none. JWT required.
     * Get today\'s check-in
     * @param param the request object
     */
    public apiCheckinsTodayGetWithHttpInfo(param: CheckinApiApiCheckinsTodayGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiCheckinsTodayGetWithHttpInfo( options).toPromise();
    }

    /**
     * Returns today\'s check-in for the authenticated user, or 404 if none. JWT required.
     * Get today\'s check-in
     * @param param the request object
     */
    public apiCheckinsTodayGet(param: CheckinApiApiCheckinsTodayGetRequest = {}, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiCheckinsTodayGet( options).toPromise();
    }

}

import { ObservableDashboardApi } from "./ObservableAPI";
import { DashboardApiRequestFactory, DashboardApiResponseProcessor} from "../apis/DashboardApi";

export interface DashboardApiApiDashboardAnalyticsHeatmapGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAnalyticsHeatmapGet
     */
    page?: number
    /**
     * Page size (default 30, max 365)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAnalyticsHeatmapGet
     */
    pageSize?: number
}

export interface DashboardApiApiDashboardAnalyticsMonthlyGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAnalyticsMonthlyGet
     */
    page?: number
    /**
     * Page size (default 12, max 60)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAnalyticsMonthlyGet
     */
    pageSize?: number
}

export interface DashboardApiApiDashboardAnalyticsPredictionLateCheckinsGetRequest {
}

export interface DashboardApiApiDashboardAttendanceDailySummaryGetRequest {
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAttendanceDailySummaryGet
     */
    date: string
}

export interface DashboardApiApiDashboardAttendanceIndividualGetRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAttendanceIndividualGet
     */
    userId: number
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAttendanceIndividualGet
     */
    date: string
}

export interface DashboardApiApiDashboardAttendanceLiveStatsGetRequest {
    /**
     * Date (YYYY-MM-DD). Defaults to today if not provided
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAttendanceLiveStatsGet
     */
    date?: string
}

export interface DashboardApiApiDashboardAttendanceSummaryGetRequest {
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAttendanceSummaryGet
     */
    date: string
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAttendanceSummaryGet
     */
    page?: number
    /**
     * Page size (default 50, max 200)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAttendanceSummaryGet
     */
    pageSize?: number
}

export interface DashboardApiApiDashboardAuditLogsGetRequest {
    /**
     * User email
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    userEmail?: string
    /**
     * Action
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    action?: string
    /**
     * Entity type
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    entityType?: string
    /**
     * Entity ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    entityId?: number
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    date?: string
    /**
     * Start date (YYYY-MM-DD) for date range
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    startDate?: string
    /**
     * End date (YYYY-MM-DD) for date range
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    endDate?: string
    /**
     * Show only HR/admin actions (default: false)
     * Defaults to: undefined
     * @type boolean
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    hrOnly?: boolean
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    page?: number
    /**
     * Page size (default 20)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardAuditLogsGet
     */
    pageSize?: number
}

export interface DashboardApiApiDashboardCheckinsIdPutRequest {
    /**
     * Check-in ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardCheckinsIdPut
     */
    id: number
    /**
     * Check-in data
     * @type ModelsCheckinRequest
     * @memberof DashboardApiapiDashboardCheckinsIdPut
     */
    checkin: ModelsCheckinRequest
}

export interface DashboardApiApiDashboardCheckinsUserIdDatePostRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardCheckinsUserIdDatePost
     */
    userId: number
    /**
     * Date (YYYY-MM-DD). Defaults to today if not provided
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckinsUserIdDatePost
     */
    date: string
    /**
     * Work locations for the day
     * @type Array&lt;ModelsLocationRequest&gt;
     * @memberof DashboardApiapiDashboardCheckinsUserIdDatePost
     */
    locations: Array<ModelsLocationRequest>
    /**
     * Check-in time (HH:MM, RFC3339, or YYYY-MM-DDTHH:MM:SS)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckinsUserIdDatePost
     */
    time?: string
    /**
     * Notes for the check-in
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckinsUserIdDatePost
     */
    notes?: string
    /**
     * Reason if late
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckinsUserIdDatePost
     */
    lateReason?: string
}

export interface DashboardApiApiDashboardCheckinsViewGetRequest {
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckinsViewGet
     */
    date: string
}

export interface DashboardApiApiDashboardCheckoutsUserIdDatePostRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardCheckoutsUserIdDatePost
     */
    userId: number
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckoutsUserIdDatePost
     */
    date: string
    /**
     * Checkout time (HH:MM, RFC3339, or YYYY-MM-DDTHH:MM:SS)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckoutsUserIdDatePost
     */
    checkoutTime: string
    /**
     * Status/reason for early checkout
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCheckoutsUserIdDatePost
     */
    status?: string
    /**
     * Whether overtime was worked
     * Defaults to: undefined
     * @type boolean
     * @memberof DashboardApiapiDashboardCheckoutsUserIdDatePost
     */
    overtime?: boolean
}

export interface DashboardApiApiDashboardConvertAbsenceToCheckinPostRequest {
    /**
     * Conversion request
     * @type ModelsConvertAbsenceRequest
     * @memberof DashboardApiapiDashboardConvertAbsenceToCheckinPost
     */
    request: ModelsConvertAbsenceRequest
}

export interface DashboardApiApiDashboardCreateAbsenceUserIdDatePostRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardCreateAbsenceUserIdDatePost
     */
    userId: number
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCreateAbsenceUserIdDatePost
     */
    date: string
    /**
     * Absence type (1&#x3D;sick, 2&#x3D;vacation, 3&#x3D;personal, 4&#x3D;unauthorized, 5&#x3D;other)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardCreateAbsenceUserIdDatePost
     */
    type: number
    /**
     * Reason for absence
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardCreateAbsenceUserIdDatePost
     */
    reason: string
}

export interface DashboardApiApiDashboardExportAttendanceGetRequest {
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardExportAttendanceGet
     */
    date: string
}

export interface DashboardApiApiDashboardExportCheckinsGetRequest {
    /**
     * Date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardExportCheckinsGet
     */
    date: string
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardExportCheckinsGet
     */
    userId?: number
}

export interface DashboardApiApiDashboardHrActivityGetRequest {
    /**
     * Number of days to look back (default: 7)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardHrActivityGet
     */
    days?: number
    /**
     * Filter by activity type (user_activity, hr_management, location_management, absence_management, system_access)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardHrActivityGet
     */
    activityType?: string
}

export interface DashboardApiApiDashboardLocationsCheckinIdGetRequest {
    /**
     * Check-in ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardLocationsCheckinIdGet
     */
    checkinId: number
}

export interface DashboardApiApiDashboardLocationsCheckinIdPutRequest {
    /**
     * Check-in ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardLocationsCheckinIdPut
     */
    checkinId: number
    /**
     * Locations to add
     * @type ModelsUpdateLocationsRequest
     * @memberof DashboardApiapiDashboardLocationsCheckinIdPut
     */
    locations: ModelsUpdateLocationsRequest
}

export interface DashboardApiApiDashboardLocationsLocationIdDeleteRequest {
    /**
     * Location ID
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardLocationsLocationIdDelete
     */
    locationId: number
}

export interface DashboardApiApiDashboardStatsAbsencesGetRequest {
    /**
     * Start date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardStatsAbsencesGet
     */
    startDate?: string
    /**
     * End date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardStatsAbsencesGet
     */
    endDate?: string
}

export interface DashboardApiApiDashboardStatsAttendanceGetRequest {
    /**
     * Start date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardStatsAttendanceGet
     */
    startDate?: string
    /**
     * End date (YYYY-MM-DD)
     * Defaults to: undefined
     * @type string
     * @memberof DashboardApiapiDashboardStatsAttendanceGet
     */
    endDate?: string
}

export interface DashboardApiApiDashboardStatsOvertimeGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardStatsOvertimeGet
     */
    page?: number
    /**
     * Page size (default 30, max 365)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardStatsOvertimeGet
     */
    pageSize?: number
}

export interface DashboardApiApiDashboardStatsUsersGetRequest {
}

export interface DashboardApiApiDashboardUsersByTeamGetRequest {
    /**
     * Page number (default 1)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardUsersByTeamGet
     */
    page?: number
    /**
     * Page size (default 20, max 100)
     * Defaults to: undefined
     * @type number
     * @memberof DashboardApiapiDashboardUsersByTeamGet
     */
    pageSize?: number
}

export class ObjectDashboardApi {
    private api: ObservableDashboardApi

    public constructor(configuration: Configuration, requestFactory?: DashboardApiRequestFactory, responseProcessor?: DashboardApiResponseProcessor) {
        this.api = new ObservableDashboardApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Returns a list of dates with counts of absences. HR/admin only.
     * Get absence heatmap
     * @param param the request object
     */
    public apiDashboardAnalyticsHeatmapGetWithHttpInfo(param: DashboardApiApiDashboardAnalyticsHeatmapGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardAnalyticsHeatmapGetWithHttpInfo(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns a list of dates with counts of absences. HR/admin only.
     * Get absence heatmap
     * @param param the request object
     */
    public apiDashboardAnalyticsHeatmapGet(param: DashboardApiApiDashboardAnalyticsHeatmapGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardAnalyticsHeatmapGet(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns monthly attendance analytics. HR/admin only.
     * Get monthly analytics
     * @param param the request object
     */
    public apiDashboardAnalyticsMonthlyGetWithHttpInfo(param: DashboardApiApiDashboardAnalyticsMonthlyGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardAnalyticsMonthlyGetWithHttpInfo(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns monthly attendance analytics. HR/admin only.
     * Get monthly analytics
     * @param param the request object
     */
    public apiDashboardAnalyticsMonthlyGet(param: DashboardApiApiDashboardAnalyticsMonthlyGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardAnalyticsMonthlyGet(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns a list of late check-in predictions for the next 7 days. HR/admin only.
     * Get late check-in prediction
     * @param param the request object
     */
    public apiDashboardAnalyticsPredictionLateCheckinsGetWithHttpInfo(param: DashboardApiApiDashboardAnalyticsPredictionLateCheckinsGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardAnalyticsPredictionLateCheckinsGetWithHttpInfo( options).toPromise();
    }

    /**
     * Returns a list of late check-in predictions for the next 7 days. HR/admin only.
     * Get late check-in prediction
     * @param param the request object
     */
    public apiDashboardAnalyticsPredictionLateCheckinsGet(param: DashboardApiApiDashboardAnalyticsPredictionLateCheckinsGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardAnalyticsPredictionLateCheckinsGet( options).toPromise();
    }

    /**
     * Returns the daily_summary row for a given date. HR/admin only.
     * Get daily summary
     * @param param the request object
     */
    public apiDashboardAttendanceDailySummaryGetWithHttpInfo(param: DashboardApiApiDashboardAttendanceDailySummaryGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsDailySummary>> {
        return this.api.apiDashboardAttendanceDailySummaryGetWithHttpInfo(param.date,  options).toPromise();
    }

    /**
     * Returns the daily_summary row for a given date. HR/admin only.
     * Get daily summary
     * @param param the request object
     */
    public apiDashboardAttendanceDailySummaryGet(param: DashboardApiApiDashboardAttendanceDailySummaryGetRequest, options?: ConfigurationOptions): Promise<ModelsDailySummary> {
        return this.api.apiDashboardAttendanceDailySummaryGet(param.date,  options).toPromise();
    }

    /**
     * Returns checkin, absence, and user info for a given user/date. HR/admin only.
     * Get individual attendance (checkin + absence + user)
     * @param param the request object
     */
    public apiDashboardAttendanceIndividualGetWithHttpInfo(param: DashboardApiApiDashboardAttendanceIndividualGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsIndividualAttendanceResponse>> {
        return this.api.apiDashboardAttendanceIndividualGetWithHttpInfo(param.userId, param.date,  options).toPromise();
    }

    /**
     * Returns checkin, absence, and user info for a given user/date. HR/admin only.
     * Get individual attendance (checkin + absence + user)
     * @param param the request object
     */
    public apiDashboardAttendanceIndividualGet(param: DashboardApiApiDashboardAttendanceIndividualGetRequest, options?: ConfigurationOptions): Promise<ModelsIndividualAttendanceResponse> {
        return this.api.apiDashboardAttendanceIndividualGet(param.userId, param.date,  options).toPromise();
    }

    /**
     * Returns live attendance statistics for today or a specific date. HR/admin only.
     * Get live attendance statistics
     * @param param the request object
     */
    public apiDashboardAttendanceLiveStatsGetWithHttpInfo(param: DashboardApiApiDashboardAttendanceLiveStatsGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardAttendanceLiveStatsGetWithHttpInfo(param.date,  options).toPromise();
    }

    /**
     * Returns live attendance statistics for today or a specific date. HR/admin only.
     * Get live attendance statistics
     * @param param the request object
     */
    public apiDashboardAttendanceLiveStatsGet(param: DashboardApiApiDashboardAttendanceLiveStatsGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardAttendanceLiveStatsGet(param.date,  options).toPromise();
    }

    /**
     * Returns a list of all active employees with their status for a given date. HR/admin only.
     * Get attendance roll call
     * @param param the request object
     */
    public apiDashboardAttendanceSummaryGetWithHttpInfo(param: DashboardApiApiDashboardAttendanceSummaryGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardAttendanceSummaryGetWithHttpInfo(param.date, param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns a list of all active employees with their status for a given date. HR/admin only.
     * Get attendance roll call
     * @param param the request object
     */
    public apiDashboardAttendanceSummaryGet(param: DashboardApiApiDashboardAttendanceSummaryGetRequest, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardAttendanceSummaryGet(param.date, param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns audit log entries. HR/admin only. Supports filtering by user_email, action, entity_type, entity_id, date. Paginated.
     * Get audit logs
     * @param param the request object
     */
    public apiDashboardAuditLogsGetWithHttpInfo(param: DashboardApiApiDashboardAuditLogsGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<ModelsAuditLogListResponse>> {
        return this.api.apiDashboardAuditLogsGetWithHttpInfo(param.userEmail, param.action, param.entityType, param.entityId, param.date, param.startDate, param.endDate, param.hrOnly, param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns audit log entries. HR/admin only. Supports filtering by user_email, action, entity_type, entity_id, date. Paginated.
     * Get audit logs
     * @param param the request object
     */
    public apiDashboardAuditLogsGet(param: DashboardApiApiDashboardAuditLogsGetRequest = {}, options?: ConfigurationOptions): Promise<ModelsAuditLogListResponse> {
        return this.api.apiDashboardAuditLogsGet(param.userEmail, param.action, param.entityType, param.entityId, param.date, param.startDate, param.endDate, param.hrOnly, param.page, param.pageSize,  options).toPromise();
    }

    /**
     * HR or admin can update any user\'s check-in. Audit log is written. JWT with hr/admin role required.
     * HR/admin update check-in
     * @param param the request object
     */
    public apiDashboardCheckinsIdPutWithHttpInfo(param: DashboardApiApiDashboardCheckinsIdPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiDashboardCheckinsIdPutWithHttpInfo(param.id, param.checkin,  options).toPromise();
    }

    /**
     * HR or admin can update any user\'s check-in. Audit log is written. JWT with hr/admin role required.
     * HR/admin update check-in
     * @param param the request object
     */
    public apiDashboardCheckinsIdPut(param: DashboardApiApiDashboardCheckinsIdPutRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiDashboardCheckinsIdPut(param.id, param.checkin,  options).toPromise();
    }

    /**
     * Create a check-in for any user/date, even if a soft-deleted one exists. If a deleted check-in exists, restore and update it.
     * HR/Admin create check-in for any user/date
     * @param param the request object
     */
    public apiDashboardCheckinsUserIdDatePostWithHttpInfo(param: DashboardApiApiDashboardCheckinsUserIdDatePostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiDashboardCheckinsUserIdDatePostWithHttpInfo(param.userId, param.date, param.locations, param.time, param.notes, param.lateReason,  options).toPromise();
    }

    /**
     * Create a check-in for any user/date, even if a soft-deleted one exists. If a deleted check-in exists, restore and update it.
     * HR/Admin create check-in for any user/date
     * @param param the request object
     */
    public apiDashboardCheckinsUserIdDatePost(param: DashboardApiApiDashboardCheckinsUserIdDatePostRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiDashboardCheckinsUserIdDatePost(param.userId, param.date, param.locations, param.time, param.notes, param.lateReason,  options).toPromise();
    }

    /**
     * Returns all checkins for a given date from daily_checkins_view. HR/admin only.
     * Get all checkins for a date (view)
     * @param param the request object
     */
    public apiDashboardCheckinsViewGetWithHttpInfo(param: DashboardApiApiDashboardCheckinsViewGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<{ [key: string]: any; }>>> {
        return this.api.apiDashboardCheckinsViewGetWithHttpInfo(param.date,  options).toPromise();
    }

    /**
     * Returns all checkins for a given date from daily_checkins_view. HR/admin only.
     * Get all checkins for a date (view)
     * @param param the request object
     */
    public apiDashboardCheckinsViewGet(param: DashboardApiApiDashboardCheckinsViewGetRequest, options?: ConfigurationOptions): Promise<Array<{ [key: string]: any; }>> {
        return this.api.apiDashboardCheckinsViewGet(param.date,  options).toPromise();
    }

    /**
     * HR/admin can create a checkout for any user/date, even if no check-in exists. Useful for end-of-day processing or when HR needs to record checkout times. JWT with hr/admin role required.
     * Create checkout for any user/date (HR/Admin)
     * @param param the request object
     */
    public apiDashboardCheckoutsUserIdDatePostWithHttpInfo(param: DashboardApiApiDashboardCheckoutsUserIdDatePostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiDashboardCheckoutsUserIdDatePostWithHttpInfo(param.userId, param.date, param.checkoutTime, param.status, param.overtime,  options).toPromise();
    }

    /**
     * HR/admin can create a checkout for any user/date, even if no check-in exists. Useful for end-of-day processing or when HR needs to record checkout times. JWT with hr/admin role required.
     * Create checkout for any user/date (HR/Admin)
     * @param param the request object
     */
    public apiDashboardCheckoutsUserIdDatePost(param: DashboardApiApiDashboardCheckoutsUserIdDatePostRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiDashboardCheckoutsUserIdDatePost(param.userId, param.date, param.checkoutTime, param.status, param.overtime,  options).toPromise();
    }

    /**
     * HR/admin can convert an absence record to a checkin record. Useful when someone was marked absent but actually arrived late. JWT with hr/admin role required.
     * Convert absence to checkin (HR/admin)
     * @param param the request object
     */
    public apiDashboardConvertAbsenceToCheckinPostWithHttpInfo(param: DashboardApiApiDashboardConvertAbsenceToCheckinPostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiDashboardConvertAbsenceToCheckinPostWithHttpInfo(param.request,  options).toPromise();
    }

    /**
     * HR/admin can convert an absence record to a checkin record. Useful when someone was marked absent but actually arrived late. JWT with hr/admin role required.
     * Convert absence to checkin (HR/admin)
     * @param param the request object
     */
    public apiDashboardConvertAbsenceToCheckinPost(param: DashboardApiApiDashboardConvertAbsenceToCheckinPostRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiDashboardConvertAbsenceToCheckinPost(param.request,  options).toPromise();
    }

    /**
     * HR/admin can create an absence record for a user who didn\'t show up. Useful for end-of-day processing or when HR contacts user and they confirm they won\'t be coming. JWT with hr/admin role required.
     * Create absence for user (HR/admin)
     * @param param the request object
     */
    public apiDashboardCreateAbsenceUserIdDatePostWithHttpInfo(param: DashboardApiApiDashboardCreateAbsenceUserIdDatePostRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        return this.api.apiDashboardCreateAbsenceUserIdDatePostWithHttpInfo(param.userId, param.date, param.type, param.reason,  options).toPromise();
    }

    /**
     * HR/admin can create an absence record for a user who didn\'t show up. Useful for end-of-day processing or when HR contacts user and they confirm they won\'t be coming. JWT with hr/admin role required.
     * Create absence for user (HR/admin)
     * @param param the request object
     */
    public apiDashboardCreateAbsenceUserIdDatePost(param: DashboardApiApiDashboardCreateAbsenceUserIdDatePostRequest, options?: ConfigurationOptions): Promise<ModelsAbsenceResponse> {
        return this.api.apiDashboardCreateAbsenceUserIdDatePost(param.userId, param.date, param.type, param.reason,  options).toPromise();
    }

    /**
     * HR/admin only. Export attendance roll call data as Excel file in ART format with all HR fields. Filters: date
     * Export attendance roll call to Excel (ART format)
     * @param param the request object
     */
    public apiDashboardExportAttendanceGetWithHttpInfo(param: DashboardApiApiDashboardExportAttendanceGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<HttpFile>> {
        return this.api.apiDashboardExportAttendanceGetWithHttpInfo(param.date,  options).toPromise();
    }

    /**
     * HR/admin only. Export attendance roll call data as Excel file in ART format with all HR fields. Filters: date
     * Export attendance roll call to Excel (ART format)
     * @param param the request object
     */
    public apiDashboardExportAttendanceGet(param: DashboardApiApiDashboardExportAttendanceGetRequest, options?: ConfigurationOptions): Promise<HttpFile> {
        return this.api.apiDashboardExportAttendanceGet(param.date,  options).toPromise();
    }

    /**
     * HR/admin only. Export check-in data as Excel file in ART format with all HR fields for a specific date. Filters: date, userId
     * Export check-ins to Excel (ART format)
     * @param param the request object
     */
    public apiDashboardExportCheckinsGetWithHttpInfo(param: DashboardApiApiDashboardExportCheckinsGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<HttpFile>> {
        return this.api.apiDashboardExportCheckinsGetWithHttpInfo(param.date, param.userId,  options).toPromise();
    }

    /**
     * HR/admin only. Export check-in data as Excel file in ART format with all HR fields for a specific date. Filters: date, userId
     * Export check-ins to Excel (ART format)
     * @param param the request object
     */
    public apiDashboardExportCheckinsGet(param: DashboardApiApiDashboardExportCheckinsGetRequest, options?: ConfigurationOptions): Promise<HttpFile> {
        return this.api.apiDashboardExportCheckinsGet(param.date, param.userId,  options).toPromise();
    }

    /**
     * Returns a summary of system activities for HR monitoring and alerts. HR/admin only. Shows recent user actions, system changes, and activity patterns that HR should be aware of.
     * Get system activity summary for HR monitoring
     * @param param the request object
     */
    public apiDashboardHrActivityGetWithHttpInfo(param: DashboardApiApiDashboardHrActivityGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardHrActivityGetWithHttpInfo(param.days, param.activityType,  options).toPromise();
    }

    /**
     * Returns a summary of system activities for HR monitoring and alerts. HR/admin only. Shows recent user actions, system changes, and activity patterns that HR should be aware of.
     * Get system activity summary for HR monitoring
     * @param param the request object
     */
    public apiDashboardHrActivityGet(param: DashboardApiApiDashboardHrActivityGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardHrActivityGet(param.days, param.activityType,  options).toPromise();
    }

    /**
     * Get all locations for a specific check-in. HR/Admin only.
     * Get locations for any check-in (HR/Admin)
     * @param param the request object
     */
    public apiDashboardLocationsCheckinIdGetWithHttpInfo(param: DashboardApiApiDashboardLocationsCheckinIdGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<Array<ModelsCheckinLocation>>> {
        return this.api.apiDashboardLocationsCheckinIdGetWithHttpInfo(param.checkinId,  options).toPromise();
    }

    /**
     * Get all locations for a specific check-in. HR/Admin only.
     * Get locations for any check-in (HR/Admin)
     * @param param the request object
     */
    public apiDashboardLocationsCheckinIdGet(param: DashboardApiApiDashboardLocationsCheckinIdGetRequest, options?: ConfigurationOptions): Promise<Array<ModelsCheckinLocation>> {
        return this.api.apiDashboardLocationsCheckinIdGet(param.checkinId,  options).toPromise();
    }

    /**
     * Add new locations to a specific check-in. HR/Admin only.
     * Add locations to any check-in (HR/Admin)
     * @param param the request object
     */
    public apiDashboardLocationsCheckinIdPutWithHttpInfo(param: DashboardApiApiDashboardLocationsCheckinIdPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        return this.api.apiDashboardLocationsCheckinIdPutWithHttpInfo(param.checkinId, param.locations,  options).toPromise();
    }

    /**
     * Add new locations to a specific check-in. HR/Admin only.
     * Add locations to any check-in (HR/Admin)
     * @param param the request object
     */
    public apiDashboardLocationsCheckinIdPut(param: DashboardApiApiDashboardLocationsCheckinIdPutRequest, options?: ConfigurationOptions): Promise<ModelsCheckinResponse> {
        return this.api.apiDashboardLocationsCheckinIdPut(param.checkinId, param.locations,  options).toPromise();
    }

    /**
     * Delete a specific location from any check-in. HR/Admin only.
     * Delete any location (HR/Admin)
     * @param param the request object
     */
    public apiDashboardLocationsLocationIdDeleteWithHttpInfo(param: DashboardApiApiDashboardLocationsLocationIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        return this.api.apiDashboardLocationsLocationIdDeleteWithHttpInfo(param.locationId,  options).toPromise();
    }

    /**
     * Delete a specific location from any check-in. HR/Admin only.
     * Delete any location (HR/Admin)
     * @param param the request object
     */
    public apiDashboardLocationsLocationIdDelete(param: DashboardApiApiDashboardLocationsLocationIdDeleteRequest, options?: ConfigurationOptions): Promise<ModelsSimpleResponse> {
        return this.api.apiDashboardLocationsLocationIdDelete(param.locationId,  options).toPromise();
    }

    /**
     * Returns absence stats (total absences, by type) for date range. HR/admin only.
     * Get absence statistics
     * @param param the request object
     */
    public apiDashboardStatsAbsencesGetWithHttpInfo(param: DashboardApiApiDashboardStatsAbsencesGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardStatsAbsencesGetWithHttpInfo(param.startDate, param.endDate,  options).toPromise();
    }

    /**
     * Returns absence stats (total absences, by type) for date range. HR/admin only.
     * Get absence statistics
     * @param param the request object
     */
    public apiDashboardStatsAbsencesGet(param: DashboardApiApiDashboardStatsAbsencesGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardStatsAbsencesGet(param.startDate, param.endDate,  options).toPromise();
    }

    /**
     * Returns attendance stats (total check-ins, on-time %, late %) for date range. HR/admin only.
     * Get attendance statistics
     * @param param the request object
     */
    public apiDashboardStatsAttendanceGetWithHttpInfo(param: DashboardApiApiDashboardStatsAttendanceGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardStatsAttendanceGetWithHttpInfo(param.startDate, param.endDate,  options).toPromise();
    }

    /**
     * Returns attendance stats (total check-ins, on-time %, late %) for date range. HR/admin only.
     * Get attendance statistics
     * @param param the request object
     */
    public apiDashboardStatsAttendanceGet(param: DashboardApiApiDashboardStatsAttendanceGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardStatsAttendanceGet(param.startDate, param.endDate,  options).toPromise();
    }

    /**
     * Returns a list of dates with counts of overtime. HR/admin only.
     * Get overtime stats
     * @param param the request object
     */
    public apiDashboardStatsOvertimeGetWithHttpInfo(param: DashboardApiApiDashboardStatsOvertimeGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardStatsOvertimeGetWithHttpInfo(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns a list of dates with counts of overtime. HR/admin only.
     * Get overtime stats
     * @param param the request object
     */
    public apiDashboardStatsOvertimeGet(param: DashboardApiApiDashboardStatsOvertimeGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardStatsOvertimeGet(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns user stats (total, by role, by team). HR/admin only.
     * Get user statistics
     * @param param the request object
     */
    public apiDashboardStatsUsersGetWithHttpInfo(param: DashboardApiApiDashboardStatsUsersGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardStatsUsersGetWithHttpInfo( options).toPromise();
    }

    /**
     * Returns user stats (total, by role, by team). HR/admin only.
     * Get user statistics
     * @param param the request object
     */
    public apiDashboardStatsUsersGet(param: DashboardApiApiDashboardStatsUsersGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardStatsUsersGet( options).toPromise();
    }

    /**
     * Returns users grouped by team. HR/admin only.
     * Get users by team
     * @param param the request object
     */
    public apiDashboardUsersByTeamGetWithHttpInfo(param: DashboardApiApiDashboardUsersByTeamGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiDashboardUsersByTeamGetWithHttpInfo(param.page, param.pageSize,  options).toPromise();
    }

    /**
     * Returns users grouped by team. HR/admin only.
     * Get users by team
     * @param param the request object
     */
    public apiDashboardUsersByTeamGet(param: DashboardApiApiDashboardUsersByTeamGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiDashboardUsersByTeamGet(param.page, param.pageSize,  options).toPromise();
    }

}

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiApiUsersGetRequest {
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public apiUsersGetWithHttpInfo(param: DefaultApiApiUsersGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        return this.api.apiUsersGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public apiUsersGet(param: DefaultApiApiUsersGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: any; }> {
        return this.api.apiUsersGet( options).toPromise();
    }

}

import { ObservableHealthApi } from "./ObservableAPI";
import { HealthApiRequestFactory, HealthApiResponseProcessor} from "../apis/HealthApi";

export interface HealthApiHealthzGetRequest {
}

export class ObjectHealthApi {
    private api: ObservableHealthApi

    public constructor(configuration: Configuration, requestFactory?: HealthApiRequestFactory, responseProcessor?: HealthApiResponseProcessor) {
        this.api = new ObservableHealthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Check if the server is running
     * Health check
     * @param param the request object
     */
    public healthzGetWithHttpInfo(param: HealthApiHealthzGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        return this.api.healthzGetWithHttpInfo( options).toPromise();
    }

    /**
     * Check if the server is running
     * Health check
     * @param param the request object
     */
    public healthzGet(param: HealthApiHealthzGetRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: string; }> {
        return this.api.healthzGet( options).toPromise();
    }

}

import { ObservableUsersApi } from "./ObservableAPI";
import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";

export interface UsersApiApiUsersIdActivateEmailPutRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof UsersApiapiUsersIdActivateEmailPut
     */
    id: number
}

export interface UsersApiApiUsersIdApprovePutRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof UsersApiapiUsersIdApprovePut
     */
    id: number
}

export interface UsersApiApiUsersIdCheckinConfigPutRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof UsersApiapiUsersIdCheckinConfigPut
     */
    id: number
    /**
     * Check-in config
     * @type ModelsCheckinConfigRequest
     * @memberof UsersApiapiUsersIdCheckinConfigPut
     */
    config: ModelsCheckinConfigRequest
}

export interface UsersApiApiUsersIdDeleteRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof UsersApiapiUsersIdDelete
     */
    id: number
}

export interface UsersApiApiUsersIdGetRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof UsersApiapiUsersIdGet
     */
    id: number
}

export interface UsersApiApiUsersIdHrDetailsPutRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof UsersApiapiUsersIdHrDetailsPut
     */
    id: number
    /**
     * HR details (set \&#39;approve\&#39;: true to approve and activate user in same call)
     * @type ModelsUserHRDetailsRequest
     * @memberof UsersApiapiUsersIdHrDetailsPut
     */
    details: ModelsUserHRDetailsRequest
}

export interface UsersApiApiUsersIdPutRequest {
    /**
     * User ID
     * Defaults to: undefined
     * @type number
     * @memberof UsersApiapiUsersIdPut
     */
    id: number
    /**
     * User data
     * @type ModelsUser
     * @memberof UsersApiapiUsersIdPut
     */
    user: ModelsUser
}

export interface UsersApiApiUsersMeGetRequest {
}

export class ObjectUsersApi {
    private api: ObservableUsersApi

    public constructor(configuration: Configuration, requestFactory?: UsersApiRequestFactory, responseProcessor?: UsersApiResponseProcessor) {
        this.api = new ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * HR/admin can set email_confirmed=true for a user
     * Activate user email
     * @param param the request object
     */
    public apiUsersIdActivateEmailPutWithHttpInfo(param: UsersApiApiUsersIdActivateEmailPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        return this.api.apiUsersIdActivateEmailPutWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * HR/admin can set email_confirmed=true for a user
     * Activate user email
     * @param param the request object
     */
    public apiUsersIdActivateEmailPut(param: UsersApiApiUsersIdActivateEmailPutRequest, options?: ConfigurationOptions): Promise<ModelsSimpleResponse> {
        return this.api.apiUsersIdActivateEmailPut(param.id,  options).toPromise();
    }

    /**
     * HR/admin can approve a user by setting pending_approval=false and deactivated=false.
     * Approve user
     * @param param the request object
     */
    public apiUsersIdApprovePutWithHttpInfo(param: UsersApiApiUsersIdApprovePutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        return this.api.apiUsersIdApprovePutWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * HR/admin can approve a user by setting pending_approval=false and deactivated=false.
     * Approve user
     * @param param the request object
     */
    public apiUsersIdApprovePut(param: UsersApiApiUsersIdApprovePutRequest, options?: ConfigurationOptions): Promise<ModelsSimpleResponse> {
        return this.api.apiUsersIdApprovePut(param.id,  options).toPromise();
    }

    /**
     * HR/admin can set per-user check-in start time and timezone. JWT with hr/admin required.
     * Update user\'s check-in config
     * @param param the request object
     */
    public apiUsersIdCheckinConfigPutWithHttpInfo(param: UsersApiApiUsersIdCheckinConfigPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        return this.api.apiUsersIdCheckinConfigPutWithHttpInfo(param.id, param.config,  options).toPromise();
    }

    /**
     * HR/admin can set per-user check-in start time and timezone. JWT with hr/admin required.
     * Update user\'s check-in config
     * @param param the request object
     */
    public apiUsersIdCheckinConfigPut(param: UsersApiApiUsersIdCheckinConfigPutRequest, options?: ConfigurationOptions): Promise<ModelsUser> {
        return this.api.apiUsersIdCheckinConfigPut(param.id, param.config,  options).toPromise();
    }

    /**
     * Admin only. Soft delete user by setting deactivated=true.
     * Deactivate (soft delete) user
     * @param param the request object
     */
    public apiUsersIdDeleteWithHttpInfo(param: UsersApiApiUsersIdDeleteRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        return this.api.apiUsersIdDeleteWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * Admin only. Soft delete user by setting deactivated=true.
     * Deactivate (soft delete) user
     * @param param the request object
     */
    public apiUsersIdDelete(param: UsersApiApiUsersIdDeleteRequest, options?: ConfigurationOptions): Promise<ModelsSimpleResponse> {
        return this.api.apiUsersIdDelete(param.id,  options).toPromise();
    }

    /**
     * Admin only. Get user details by ID.
     * Get user by ID
     * @param param the request object
     */
    public apiUsersIdGetWithHttpInfo(param: UsersApiApiUsersIdGetRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        return this.api.apiUsersIdGetWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * Admin only. Get user details by ID.
     * Get user by ID
     * @param param the request object
     */
    public apiUsersIdGet(param: UsersApiApiUsersIdGetRequest, options?: ConfigurationOptions): Promise<ModelsUser> {
        return this.api.apiUsersIdGet(param.id,  options).toPromise();
    }

    /**
     * HR/admin can update additional user fields from Excel files (DNI, CUIL, birth date, hire date, location, etc.). JWT with hr/admin required.
     * Update user HR details
     * @param param the request object
     */
    public apiUsersIdHrDetailsPutWithHttpInfo(param: UsersApiApiUsersIdHrDetailsPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        return this.api.apiUsersIdHrDetailsPutWithHttpInfo(param.id, param.details,  options).toPromise();
    }

    /**
     * HR/admin can update additional user fields from Excel files (DNI, CUIL, birth date, hire date, location, etc.). JWT with hr/admin required.
     * Update user HR details
     * @param param the request object
     */
    public apiUsersIdHrDetailsPut(param: UsersApiApiUsersIdHrDetailsPutRequest, options?: ConfigurationOptions): Promise<ModelsUser> {
        return this.api.apiUsersIdHrDetailsPut(param.id, param.details,  options).toPromise();
    }

    /**
     * Admin only. Update user details by ID.
     * Update user
     * @param param the request object
     */
    public apiUsersIdPutWithHttpInfo(param: UsersApiApiUsersIdPutRequest, options?: ConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        return this.api.apiUsersIdPutWithHttpInfo(param.id, param.user,  options).toPromise();
    }

    /**
     * Admin only. Update user details by ID.
     * Update user
     * @param param the request object
     */
    public apiUsersIdPut(param: UsersApiApiUsersIdPutRequest, options?: ConfigurationOptions): Promise<ModelsUser> {
        return this.api.apiUsersIdPut(param.id, param.user,  options).toPromise();
    }

    /**
     * Returns the authenticated user\'s profile info
     * Get current user\'s profile
     * @param param the request object
     */
    public apiUsersMeGetWithHttpInfo(param: UsersApiApiUsersMeGetRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        return this.api.apiUsersMeGetWithHttpInfo( options).toPromise();
    }

    /**
     * Returns the authenticated user\'s profile info
     * Get current user\'s profile
     * @param param the request object
     */
    public apiUsersMeGet(param: UsersApiApiUsersMeGetRequest = {}, options?: ConfigurationOptions): Promise<ModelsUser> {
        return this.api.apiUsersMeGet( options).toPromise();
    }

}
