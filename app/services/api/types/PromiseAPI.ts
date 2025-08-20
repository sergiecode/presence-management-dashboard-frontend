import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

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
import { ObservableAbsenceApi } from './ObservableAPI';

import { AbsenceApiRequestFactory, AbsenceApiResponseProcessor} from "../apis/AbsenceApi";
export class PromiseAbsenceApi {
    private api: ObservableAbsenceApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AbsenceApiRequestFactory,
        responseProcessor?: AbsenceApiResponseProcessor
    ) {
        this.api = new ObservableAbsenceApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * HR/admin only. Returns paginated list of all absences. Query params: page, page_size, user_id, date, type
     * List all absences (HR/admin)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     * @param [userId] Filter by user ID
     * @param [date] Filter by date (YYYY-MM-DD)
     * @param [type] Filter by type (absence/late/medical)
     */
    public apiAbsencesAllGetWithHttpInfo(page?: number, pageSize?: number, userId?: number, date?: string, type?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<ModelsAbsenceResponse>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesAllGetWithHttpInfo(page, pageSize, userId, date, type, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Returns paginated list of all absences. Query params: page, page_size, user_id, date, type
     * List all absences (HR/admin)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     * @param [userId] Filter by user ID
     * @param [date] Filter by date (YYYY-MM-DD)
     * @param [type] Filter by type (absence/late/medical)
     */
    public apiAbsencesAllGet(page?: number, pageSize?: number, userId?: number, date?: string, type?: string, _options?: PromiseConfigurationOptions): Promise<Array<ModelsAbsenceResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesAllGet(page, pageSize, userId, date, type, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns all absences for the authenticated user, newest first. JWT required.
     * Get user\'s absence history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiAbsencesGetWithHttpInfo(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesGetWithHttpInfo(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns all absences for the authenticated user, newest first. JWT required.
     * Get user\'s absence history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiAbsencesGet(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesGet(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Soft delete an absence by setting deleted=true.
     * Soft delete absence (HR/admin)
     * @param id Absence ID
     */
    public apiAbsencesIdDeleteWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdDeleteWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Soft delete an absence by setting deleted=true.
     * Soft delete absence (HR/admin)
     * @param id Absence ID
     */
    public apiAbsencesIdDelete(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsSimpleResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdDelete(id, observableOptions);
        return result.toPromise();
    }

    /**
     * User uploads a file for their own absence if not locked. Only PDF/JPG/PNG, max 5MB. JWT required.
     * Upload medical certificate
     * @param id Absence ID
     * @param file Medical certificate file
     */
    public apiAbsencesIdDocumentsPostWithHttpInfo(id: number, file: HttpFile, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdDocumentsPostWithHttpInfo(id, file, observableOptions);
        return result.toPromise();
    }

    /**
     * User uploads a file for their own absence if not locked. Only PDF/JPG/PNG, max 5MB. JWT required.
     * Upload medical certificate
     * @param id Absence ID
     * @param file Medical certificate file
     */
    public apiAbsencesIdDocumentsPost(id: number, file: HttpFile, _options?: PromiseConfigurationOptions): Promise<ModelsAbsenceResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdDocumentsPost(id, file, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can lock or unlock an absence to prevent user edits. JWT with hr/admin required.
     * Lock or unlock an absence
     * @param id Absence ID
     * @param lock Lock state
     */
    public apiAbsencesIdLockPatchWithHttpInfo(id: number, lock: ModelsLockAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdLockPatchWithHttpInfo(id, lock, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can lock or unlock an absence to prevent user edits. JWT with hr/admin required.
     * Lock or unlock an absence
     * @param id Absence ID
     * @param lock Lock state
     */
    public apiAbsencesIdLockPatch(id: number, lock: ModelsLockAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<ModelsAbsenceResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdLockPatch(id, lock, observableOptions);
        return result.toPromise();
    }

    /**
     * User can update their own absence if not locked. HR/admin can update any. JWT required.
     * Update absence/late/medical
     * @param id Absence ID
     * @param absence Absence data
     */
    public apiAbsencesIdPutWithHttpInfo(id: number, absence: ModelsAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdPutWithHttpInfo(id, absence, observableOptions);
        return result.toPromise();
    }

    /**
     * User can update their own absence if not locked. HR/admin can update any. JWT required.
     * Update absence/late/medical
     * @param id Absence ID
     * @param absence Absence data
     */
    public apiAbsencesIdPut(id: number, absence: ModelsAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<ModelsAbsenceResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesIdPut(id, absence, observableOptions);
        return result.toPromise();
    }

    /**
     * User reports absence, late arrival, or medical leave. JWT required.
     * Report absence/late/medical
     * @param absence Absence data
     */
    public apiAbsencesPostWithHttpInfo(absence: ModelsAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesPostWithHttpInfo(absence, observableOptions);
        return result.toPromise();
    }

    /**
     * User reports absence, late arrival, or medical leave. JWT required.
     * Report absence/late/medical
     * @param absence Absence data
     */
    public apiAbsencesPost(absence: ModelsAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<ModelsAbsenceResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiAbsencesPost(absence, observableOptions);
        return result.toPromise();
    }


}



import { ObservableAuthApi } from './ObservableAPI';

import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";
export class PromiseAuthApi {
    private api: ObservableAuthApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthApiRequestFactory,
        responseProcessor?: AuthApiResponseProcessor
    ) {
        this.api = new ObservableAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Authenticate with email and password. Returns JWT on success.
     * Login
     * @param credentials Login credentials
     */
    public authLoginPostWithHttpInfo(credentials: ModelsLoginRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsLoginResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authLoginPostWithHttpInfo(credentials, observableOptions);
        return result.toPromise();
    }

    /**
     * Authenticate with email and password. Returns JWT on success.
     * Login
     * @param credentials Login credentials
     */
    public authLoginPost(credentials: ModelsLoginRequest, _options?: PromiseConfigurationOptions): Promise<ModelsLoginResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authLoginPost(credentials, observableOptions);
        return result.toPromise();
    }

    /**
     * Revoke a refresh token (logout from device/session)
     * Logout (revoke refresh token)
     * @param logout Logout request
     */
    public authLogoutPostWithHttpInfo(logout: ModelsLogoutRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authLogoutPostWithHttpInfo(logout, observableOptions);
        return result.toPromise();
    }

    /**
     * Revoke a refresh token (logout from device/session)
     * Logout (revoke refresh token)
     * @param logout Logout request
     */
    public authLogoutPost(logout: ModelsLogoutRequest, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: string; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authLogoutPost(logout, observableOptions);
        return result.toPromise();
    }

    /**
     * Exchange a valid refresh token for a new access token. Rotates refresh token.
     * Refresh JWT access token
     * @param refresh Refresh token request
     */
    public authRefreshPostWithHttpInfo(refresh: ModelsRefreshRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authRefreshPostWithHttpInfo(refresh, observableOptions);
        return result.toPromise();
    }

    /**
     * Exchange a valid refresh token for a new access token. Rotates refresh token.
     * Refresh JWT access token
     * @param refresh Refresh token request
     */
    public authRefreshPost(refresh: ModelsRefreshRequest, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: string; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authRefreshPost(refresh, observableOptions);
        return result.toPromise();
    }

    /**
     * Register with name, surname, email, phone, and password. Sends confirmation email.
     * Register a new user
     * @param registration Registration data
     */
    public authRegisterPostWithHttpInfo(registration: ModelsRegisterRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authRegisterPostWithHttpInfo(registration, observableOptions);
        return result.toPromise();
    }

    /**
     * Register with name, surname, email, phone, and password. Sends confirmation email.
     * Register a new user
     * @param registration Registration data
     */
    public authRegisterPost(registration: ModelsRegisterRequest, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: string; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authRegisterPost(registration, observableOptions);
        return result.toPromise();
    }

    /**
     * Resend the email confirmation link to a user who hasn\'t confirmed yet.
     * Resend confirmation email
     * @param resend Resend confirmation request
     */
    public authResendConfirmationPostWithHttpInfo(resend: ModelsResendConfirmationRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authResendConfirmationPostWithHttpInfo(resend, observableOptions);
        return result.toPromise();
    }

    /**
     * Resend the email confirmation link to a user who hasn\'t confirmed yet.
     * Resend confirmation email
     * @param resend Resend confirmation request
     */
    public authResendConfirmationPost(resend: ModelsResendConfirmationRequest, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: string; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.authResendConfirmationPost(resend, observableOptions);
        return result.toPromise();
    }


}



import { ObservableCatalogApi } from './ObservableAPI';

import { CatalogApiRequestFactory, CatalogApiResponseProcessor} from "../apis/CatalogApi";
export class PromiseCatalogApi {
    private api: ObservableCatalogApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CatalogApiRequestFactory,
        responseProcessor?: CatalogApiResponseProcessor
    ) {
        this.api = new ObservableCatalogApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Get all active locations for dropdowns and forms.
     * Get active locations
     * @param [type] Location type filter
     */
    public apiCatalogLocationsActiveGetWithHttpInfo(type?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<ModelsLocationCatalogResponse>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsActiveGetWithHttpInfo(type, observableOptions);
        return result.toPromise();
    }

    /**
     * Get all active locations for dropdowns and forms.
     * Get active locations
     * @param [type] Location type filter
     */
    public apiCatalogLocationsActiveGet(type?: string, _options?: PromiseConfigurationOptions): Promise<Array<ModelsLocationCatalogResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsActiveGet(type, observableOptions);
        return result.toPromise();
    }

    /**
     * Create multiple locations at once. HR/Admin only.
     * Bulk create locations
     * @param locations Locations to create
     */
    public apiCatalogLocationsBulkPostWithHttpInfo(locations: ModelsBulkLocationRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsBulkLocationResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsBulkPostWithHttpInfo(locations, observableOptions);
        return result.toPromise();
    }

    /**
     * Create multiple locations at once. HR/Admin only.
     * Bulk create locations
     * @param locations Locations to create
     */
    public apiCatalogLocationsBulkPost(locations: ModelsBulkLocationRequest, _options?: PromiseConfigurationOptions): Promise<ModelsBulkLocationResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsBulkPost(locations, observableOptions);
        return result.toPromise();
    }

    /**
     * Get locations with optional filtering.
     * Get locations with filters
     * @param [type] Location type filter
     * @param [isActive] Active status filter
     * @param [search] Search in name and description
     */
    public apiCatalogLocationsGetWithHttpInfo(type?: string, isActive?: boolean, search?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<ModelsLocationCatalogResponse>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsGetWithHttpInfo(type, isActive, search, observableOptions);
        return result.toPromise();
    }

    /**
     * Get locations with optional filtering.
     * Get locations with filters
     * @param [type] Location type filter
     * @param [isActive] Active status filter
     * @param [search] Search in name and description
     */
    public apiCatalogLocationsGet(type?: string, isActive?: boolean, search?: string, _options?: PromiseConfigurationOptions): Promise<Array<ModelsLocationCatalogResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsGet(type, isActive, search, observableOptions);
        return result.toPromise();
    }

    /**
     * Soft delete a location. HR/Admin only.
     * Delete a location
     * @param id Location ID
     */
    public apiCatalogLocationsIdDeleteWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsIdDeleteWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Soft delete a location. HR/Admin only.
     * Delete a location
     * @param id Location ID
     */
    public apiCatalogLocationsIdDelete(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsSimpleResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsIdDelete(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Get a specific location by ID. HR/Admin only.
     * Get a specific location
     * @param id Location ID
     */
    public apiCatalogLocationsIdGetWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsLocationCatalogResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsIdGetWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Get a specific location by ID. HR/Admin only.
     * Get a specific location
     * @param id Location ID
     */
    public apiCatalogLocationsIdGet(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsLocationCatalogResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsIdGet(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Update an existing location. HR/Admin only.
     * Update a location
     * @param id Location ID
     * @param location Updated location data
     */
    public apiCatalogLocationsIdPutWithHttpInfo(id: number, location: ModelsLocationCatalogRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsLocationCatalogResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsIdPutWithHttpInfo(id, location, observableOptions);
        return result.toPromise();
    }

    /**
     * Update an existing location. HR/Admin only.
     * Update a location
     * @param id Location ID
     * @param location Updated location data
     */
    public apiCatalogLocationsIdPut(id: number, location: ModelsLocationCatalogRequest, _options?: PromiseConfigurationOptions): Promise<ModelsLocationCatalogResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsIdPut(id, location, observableOptions);
        return result.toPromise();
    }

    /**
     * Create a new location in the catalog. HR/Admin only.
     * Create a new location
     * @param location Location data
     */
    public apiCatalogLocationsPostWithHttpInfo(location: ModelsLocationCatalogRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsLocationCatalogResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsPostWithHttpInfo(location, observableOptions);
        return result.toPromise();
    }

    /**
     * Create a new location in the catalog. HR/Admin only.
     * Create a new location
     * @param location Location data
     */
    public apiCatalogLocationsPost(location: ModelsLocationCatalogRequest, _options?: PromiseConfigurationOptions): Promise<ModelsLocationCatalogResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCatalogLocationsPost(location, observableOptions);
        return result.toPromise();
    }


}



import { ObservableCheckinApi } from './ObservableAPI';

import { CheckinApiRequestFactory, CheckinApiResponseProcessor} from "../apis/CheckinApi";
export class PromiseCheckinApi {
    private api: ObservableCheckinApi

    public constructor(
        configuration: Configuration,
        requestFactory?: CheckinApiRequestFactory,
        responseProcessor?: CheckinApiResponseProcessor
    ) {
        this.api = new ObservableCheckinApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * HR/admin only. Returns paginated list of all check-ins. Query params: page, page_size, user_id, date
     * List all check-ins (HR/admin)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     * @param [userId] Filter by user ID
     * @param [date] Filter by date (YYYY-MM-DD)
     */
    public apiCheckinsAllGetWithHttpInfo(page?: number, pageSize?: number, userId?: number, date?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<ModelsCheckinResponse>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsAllGetWithHttpInfo(page, pageSize, userId, date, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Returns paginated list of all check-ins. Query params: page, page_size, user_id, date
     * List all check-ins (HR/admin)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     * @param [userId] Filter by user ID
     * @param [date] Filter by date (YYYY-MM-DD)
     */
    public apiCheckinsAllGet(page?: number, pageSize?: number, userId?: number, date?: string, _options?: PromiseConfigurationOptions): Promise<Array<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsAllGet(page, pageSize, userId, date, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can approve or reject multiple check-ins in one API call.
     * Batch approve check-ins (HR/admin)
     * @param body Batch approve request
     */
    public apiCheckinsBatchApprovePostWithHttpInfo(body: ModelsBatchApproveRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsBatchApproveResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsBatchApprovePostWithHttpInfo(body, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can approve or reject multiple check-ins in one API call.
     * Batch approve check-ins (HR/admin)
     * @param body Batch approve request
     */
    public apiCheckinsBatchApprovePost(body: ModelsBatchApproveRequest, _options?: PromiseConfigurationOptions): Promise<ModelsBatchApproveResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsBatchApprovePost(body, observableOptions);
        return result.toPromise();
    }

    /**
     * HR or admin can update any user\'s checkout info (time, status, overtime). JWT with hr/admin role required.
     * Admin/HR update checkout
     * @param id Check-in ID
     * @param checkout Checkout update data
     */
    public apiCheckinsCheckoutIdPutWithHttpInfo(id: number, checkout: ModelsCheckoutUpdateRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsCheckoutIdPutWithHttpInfo(id, checkout, observableOptions);
        return result.toPromise();
    }

    /**
     * HR or admin can update any user\'s checkout info (time, status, overtime). JWT with hr/admin role required.
     * Admin/HR update checkout
     * @param id Check-in ID
     * @param checkout Checkout update data
     */
    public apiCheckinsCheckoutIdPut(id: number, checkout: ModelsCheckoutUpdateRequest, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsCheckoutIdPut(id, checkout, observableOptions);
        return result.toPromise();
    }

    /**
     * User submits daily checkout (end-of-day). Only one per day. JWT required. Must have checked in first. Records checkout time, status, and overtime.
     * Submit daily checkout
     * @param checkout Checkout data
     */
    public apiCheckinsCheckoutPostWithHttpInfo(checkout: ModelsCheckoutRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsCheckoutPostWithHttpInfo(checkout, observableOptions);
        return result.toPromise();
    }

    /**
     * User submits daily checkout (end-of-day). Only one per day. JWT required. Must have checked in first. Records checkout time, status, and overtime.
     * Submit daily checkout
     * @param checkout Checkout data
     */
    public apiCheckinsCheckoutPost(checkout: ModelsCheckoutRequest, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsCheckoutPost(checkout, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns all check-ins for the authenticated user, newest first. JWT required.
     * Get user\'s check-in history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiCheckinsGetWithHttpInfo(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsGetWithHttpInfo(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns all check-ins for the authenticated user, newest first. JWT required.
     * Get user\'s check-in history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiCheckinsGet(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsGet(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Soft delete a check-in by setting deleted=true.
     * Soft delete check-in (HR/admin)
     * @param id Check-in ID
     */
    public apiCheckinsIdDeleteWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsErrorResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsIdDeleteWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Soft delete a check-in by setting deleted=true.
     * Soft delete check-in (HR/admin)
     * @param id Check-in ID
     */
    public apiCheckinsIdDelete(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsErrorResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsIdDelete(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Get all locations for today\'s check-in. JWT required.
     * Get today\'s locations
     */
    public apiCheckinsLocationsGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<ModelsCheckinLocation>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsLocationsGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Get all locations for today\'s check-in. JWT required.
     * Get today\'s locations
     */
    public apiCheckinsLocationsGet(_options?: PromiseConfigurationOptions): Promise<Array<ModelsCheckinLocation>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsLocationsGet(observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a specific location from today\'s check-in. JWT required.
     * Delete a specific location
     * @param id Location ID
     */
    public apiCheckinsLocationsIdDeleteWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsLocationsIdDeleteWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a specific location from today\'s check-in. JWT required.
     * Delete a specific location
     * @param id Location ID
     */
    public apiCheckinsLocationsIdDelete(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsSimpleResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsLocationsIdDelete(id, observableOptions);
        return result.toPromise();
    }

    /**
     * User can update their work locations during the day. Only works if they have already checked in today. JWT required.
     * Update locations during the day
     * @param locations Updated locations
     */
    public apiCheckinsLocationsPutWithHttpInfo(locations: ModelsUpdateLocationsRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsLocationsPutWithHttpInfo(locations, observableOptions);
        return result.toPromise();
    }

    /**
     * User can update their work locations during the day. Only works if they have already checked in today. JWT required.
     * Update locations during the day
     * @param locations Updated locations
     */
    public apiCheckinsLocationsPut(locations: ModelsUpdateLocationsRequest, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsLocationsPut(locations, observableOptions);
        return result.toPromise();
    }

    /**
     * User submits daily check-in with location. Only one per day. JWT required. If late, must provide reason.
     * Submit daily check-in
     * @param checkin Check-in data
     */
    public apiCheckinsPostWithHttpInfo(checkin: ModelsCheckinRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsPostWithHttpInfo(checkin, observableOptions);
        return result.toPromise();
    }

    /**
     * User submits daily check-in with location. Only one per day. JWT required. If late, must provide reason.
     * Submit daily check-in
     * @param checkin Check-in data
     */
    public apiCheckinsPost(checkin: ModelsCheckinRequest, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsPost(checkin, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns today\'s check-in for the authenticated user, or 404 if none. JWT required.
     * Get today\'s check-in
     */
    public apiCheckinsTodayGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsTodayGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns today\'s check-in for the authenticated user, or 404 if none. JWT required.
     * Get today\'s check-in
     */
    public apiCheckinsTodayGet(_options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiCheckinsTodayGet(observableOptions);
        return result.toPromise();
    }


}



import { ObservableDashboardApi } from './ObservableAPI';

import { DashboardApiRequestFactory, DashboardApiResponseProcessor} from "../apis/DashboardApi";
export class PromiseDashboardApi {
    private api: ObservableDashboardApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DashboardApiRequestFactory,
        responseProcessor?: DashboardApiResponseProcessor
    ) {
        this.api = new ObservableDashboardApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Returns a list of dates with counts of absences. HR/admin only.
     * Get absence heatmap
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardAnalyticsHeatmapGetWithHttpInfo(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAnalyticsHeatmapGetWithHttpInfo(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a list of dates with counts of absences. HR/admin only.
     * Get absence heatmap
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardAnalyticsHeatmapGet(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAnalyticsHeatmapGet(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns monthly attendance analytics. HR/admin only.
     * Get monthly analytics
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 12, max 60)
     */
    public apiDashboardAnalyticsMonthlyGetWithHttpInfo(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAnalyticsMonthlyGetWithHttpInfo(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns monthly attendance analytics. HR/admin only.
     * Get monthly analytics
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 12, max 60)
     */
    public apiDashboardAnalyticsMonthlyGet(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAnalyticsMonthlyGet(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a list of late check-in predictions for the next 7 days. HR/admin only.
     * Get late check-in prediction
     */
    public apiDashboardAnalyticsPredictionLateCheckinsGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAnalyticsPredictionLateCheckinsGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a list of late check-in predictions for the next 7 days. HR/admin only.
     * Get late check-in prediction
     */
    public apiDashboardAnalyticsPredictionLateCheckinsGet(_options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAnalyticsPredictionLateCheckinsGet(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns the daily_summary row for a given date. HR/admin only.
     * Get daily summary
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceDailySummaryGetWithHttpInfo(date: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsDailySummary>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceDailySummaryGetWithHttpInfo(date, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns the daily_summary row for a given date. HR/admin only.
     * Get daily summary
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceDailySummaryGet(date: string, _options?: PromiseConfigurationOptions): Promise<ModelsDailySummary> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceDailySummaryGet(date, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns checkin, absence, and user info for a given user/date. HR/admin only.
     * Get individual attendance (checkin + absence + user)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceIndividualGetWithHttpInfo(userId: number, date: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsIndividualAttendanceResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceIndividualGetWithHttpInfo(userId, date, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns checkin, absence, and user info for a given user/date. HR/admin only.
     * Get individual attendance (checkin + absence + user)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceIndividualGet(userId: number, date: string, _options?: PromiseConfigurationOptions): Promise<ModelsIndividualAttendanceResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceIndividualGet(userId, date, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns live attendance statistics for today or a specific date. HR/admin only.
     * Get live attendance statistics
     * @param [date] Date (YYYY-MM-DD). Defaults to today if not provided
     */
    public apiDashboardAttendanceLiveStatsGetWithHttpInfo(date?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceLiveStatsGetWithHttpInfo(date, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns live attendance statistics for today or a specific date. HR/admin only.
     * Get live attendance statistics
     * @param [date] Date (YYYY-MM-DD). Defaults to today if not provided
     */
    public apiDashboardAttendanceLiveStatsGet(date?: string, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceLiveStatsGet(date, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a list of all active employees with their status for a given date. HR/admin only.
     * Get attendance roll call
     * @param date Date (YYYY-MM-DD)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 50, max 200)
     */
    public apiDashboardAttendanceSummaryGetWithHttpInfo(date: string, page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceSummaryGetWithHttpInfo(date, page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a list of all active employees with their status for a given date. HR/admin only.
     * Get attendance roll call
     * @param date Date (YYYY-MM-DD)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 50, max 200)
     */
    public apiDashboardAttendanceSummaryGet(date: string, page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAttendanceSummaryGet(date, page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns audit log entries. HR/admin only. Supports filtering by user_email, action, entity_type, entity_id, date. Paginated.
     * Get audit logs
     * @param [userEmail] User email
     * @param [action] Action
     * @param [entityType] Entity type
     * @param [entityId] Entity ID
     * @param [date] Date (YYYY-MM-DD)
     * @param [startDate] Start date (YYYY-MM-DD) for date range
     * @param [endDate] End date (YYYY-MM-DD) for date range
     * @param [hrOnly] Show only HR/admin actions (default: false)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     */
    public apiDashboardAuditLogsGetWithHttpInfo(userEmail?: string, action?: string, entityType?: string, entityId?: number, date?: string, startDate?: string, endDate?: string, hrOnly?: boolean, page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsAuditLogListResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAuditLogsGetWithHttpInfo(userEmail, action, entityType, entityId, date, startDate, endDate, hrOnly, page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns audit log entries. HR/admin only. Supports filtering by user_email, action, entity_type, entity_id, date. Paginated.
     * Get audit logs
     * @param [userEmail] User email
     * @param [action] Action
     * @param [entityType] Entity type
     * @param [entityId] Entity ID
     * @param [date] Date (YYYY-MM-DD)
     * @param [startDate] Start date (YYYY-MM-DD) for date range
     * @param [endDate] End date (YYYY-MM-DD) for date range
     * @param [hrOnly] Show only HR/admin actions (default: false)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     */
    public apiDashboardAuditLogsGet(userEmail?: string, action?: string, entityType?: string, entityId?: number, date?: string, startDate?: string, endDate?: string, hrOnly?: boolean, page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<ModelsAuditLogListResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardAuditLogsGet(userEmail, action, entityType, entityId, date, startDate, endDate, hrOnly, page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * HR or admin can update any user\'s check-in. Audit log is written. JWT with hr/admin role required.
     * HR/admin update check-in
     * @param id Check-in ID
     * @param checkin Check-in data
     */
    public apiDashboardCheckinsIdPutWithHttpInfo(id: number, checkin: ModelsCheckinRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckinsIdPutWithHttpInfo(id, checkin, observableOptions);
        return result.toPromise();
    }

    /**
     * HR or admin can update any user\'s check-in. Audit log is written. JWT with hr/admin role required.
     * HR/admin update check-in
     * @param id Check-in ID
     * @param checkin Check-in data
     */
    public apiDashboardCheckinsIdPut(id: number, checkin: ModelsCheckinRequest, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckinsIdPut(id, checkin, observableOptions);
        return result.toPromise();
    }

    /**
     * Create a check-in for any user/date, even if a soft-deleted one exists. If a deleted check-in exists, restore and update it.
     * HR/Admin create check-in for any user/date
     * @param userId User ID
     * @param date Date (YYYY-MM-DD). Defaults to today if not provided
     * @param locations Work locations for the day
     * @param [time] Check-in time (HH:MM, RFC3339, or YYYY-MM-DDTHH:MM:SS)
     * @param [notes] Notes for the check-in
     * @param [lateReason] Reason if late
     */
    public apiDashboardCheckinsUserIdDatePostWithHttpInfo(userId: number, date: string, locations: Array<ModelsLocationRequest>, time?: string, notes?: string, lateReason?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckinsUserIdDatePostWithHttpInfo(userId, date, locations, time, notes, lateReason, observableOptions);
        return result.toPromise();
    }

    /**
     * Create a check-in for any user/date, even if a soft-deleted one exists. If a deleted check-in exists, restore and update it.
     * HR/Admin create check-in for any user/date
     * @param userId User ID
     * @param date Date (YYYY-MM-DD). Defaults to today if not provided
     * @param locations Work locations for the day
     * @param [time] Check-in time (HH:MM, RFC3339, or YYYY-MM-DDTHH:MM:SS)
     * @param [notes] Notes for the check-in
     * @param [lateReason] Reason if late
     */
    public apiDashboardCheckinsUserIdDatePost(userId: number, date: string, locations: Array<ModelsLocationRequest>, time?: string, notes?: string, lateReason?: string, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckinsUserIdDatePost(userId, date, locations, time, notes, lateReason, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns all checkins for a given date from daily_checkins_view. HR/admin only.
     * Get all checkins for a date (view)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardCheckinsViewGetWithHttpInfo(date: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<{ [key: string]: any; }>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckinsViewGetWithHttpInfo(date, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns all checkins for a given date from daily_checkins_view. HR/admin only.
     * Get all checkins for a date (view)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardCheckinsViewGet(date: string, _options?: PromiseConfigurationOptions): Promise<Array<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckinsViewGet(date, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can create a checkout for any user/date, even if no check-in exists. Useful for end-of-day processing or when HR needs to record checkout times. JWT with hr/admin role required.
     * Create checkout for any user/date (HR/Admin)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     * @param checkoutTime Checkout time (HH:MM, RFC3339, or YYYY-MM-DDTHH:MM:SS)
     * @param [status] Status/reason for early checkout
     * @param [overtime] Whether overtime was worked
     */
    public apiDashboardCheckoutsUserIdDatePostWithHttpInfo(userId: number, date: string, checkoutTime: string, status?: string, overtime?: boolean, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckoutsUserIdDatePostWithHttpInfo(userId, date, checkoutTime, status, overtime, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can create a checkout for any user/date, even if no check-in exists. Useful for end-of-day processing or when HR needs to record checkout times. JWT with hr/admin role required.
     * Create checkout for any user/date (HR/Admin)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     * @param checkoutTime Checkout time (HH:MM, RFC3339, or YYYY-MM-DDTHH:MM:SS)
     * @param [status] Status/reason for early checkout
     * @param [overtime] Whether overtime was worked
     */
    public apiDashboardCheckoutsUserIdDatePost(userId: number, date: string, checkoutTime: string, status?: string, overtime?: boolean, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCheckoutsUserIdDatePost(userId, date, checkoutTime, status, overtime, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can convert an absence record to a checkin record. Useful when someone was marked absent but actually arrived late. JWT with hr/admin role required.
     * Convert absence to checkin (HR/admin)
     * @param request Conversion request
     */
    public apiDashboardConvertAbsenceToCheckinPostWithHttpInfo(request: ModelsConvertAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardConvertAbsenceToCheckinPostWithHttpInfo(request, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can convert an absence record to a checkin record. Useful when someone was marked absent but actually arrived late. JWT with hr/admin role required.
     * Convert absence to checkin (HR/admin)
     * @param request Conversion request
     */
    public apiDashboardConvertAbsenceToCheckinPost(request: ModelsConvertAbsenceRequest, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardConvertAbsenceToCheckinPost(request, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can create an absence record for a user who didn\'t show up. Useful for end-of-day processing or when HR contacts user and they confirm they won\'t be coming. JWT with hr/admin role required.
     * Create absence for user (HR/admin)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     * @param type Absence type (1&#x3D;sick, 2&#x3D;vacation, 3&#x3D;personal, 4&#x3D;unauthorized, 5&#x3D;other)
     * @param reason Reason for absence
     */
    public apiDashboardCreateAbsenceUserIdDatePostWithHttpInfo(userId: number, date: string, type: number, reason: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsAbsenceResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCreateAbsenceUserIdDatePostWithHttpInfo(userId, date, type, reason, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can create an absence record for a user who didn\'t show up. Useful for end-of-day processing or when HR contacts user and they confirm they won\'t be coming. JWT with hr/admin role required.
     * Create absence for user (HR/admin)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     * @param type Absence type (1&#x3D;sick, 2&#x3D;vacation, 3&#x3D;personal, 4&#x3D;unauthorized, 5&#x3D;other)
     * @param reason Reason for absence
     */
    public apiDashboardCreateAbsenceUserIdDatePost(userId: number, date: string, type: number, reason: string, _options?: PromiseConfigurationOptions): Promise<ModelsAbsenceResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardCreateAbsenceUserIdDatePost(userId, date, type, reason, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Export attendance roll call data as Excel file in ART format with all HR fields. Filters: date
     * Export attendance roll call to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardExportAttendanceGetWithHttpInfo(date: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<HttpFile>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardExportAttendanceGetWithHttpInfo(date, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Export attendance roll call data as Excel file in ART format with all HR fields. Filters: date
     * Export attendance roll call to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardExportAttendanceGet(date: string, _options?: PromiseConfigurationOptions): Promise<HttpFile> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardExportAttendanceGet(date, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Export check-in data as Excel file in ART format with all HR fields for a specific date. Filters: date, userId
     * Export check-ins to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     * @param [userId] User ID
     */
    public apiDashboardExportCheckinsGetWithHttpInfo(date: string, userId?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<HttpFile>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardExportCheckinsGetWithHttpInfo(date, userId, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin only. Export check-in data as Excel file in ART format with all HR fields for a specific date. Filters: date, userId
     * Export check-ins to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     * @param [userId] User ID
     */
    public apiDashboardExportCheckinsGet(date: string, userId?: number, _options?: PromiseConfigurationOptions): Promise<HttpFile> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardExportCheckinsGet(date, userId, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a summary of system activities for HR monitoring and alerts. HR/admin only. Shows recent user actions, system changes, and activity patterns that HR should be aware of.
     * Get system activity summary for HR monitoring
     * @param [days] Number of days to look back (default: 7)
     * @param [activityType] Filter by activity type (user_activity, hr_management, location_management, absence_management, system_access)
     */
    public apiDashboardHrActivityGetWithHttpInfo(days?: number, activityType?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardHrActivityGetWithHttpInfo(days, activityType, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a summary of system activities for HR monitoring and alerts. HR/admin only. Shows recent user actions, system changes, and activity patterns that HR should be aware of.
     * Get system activity summary for HR monitoring
     * @param [days] Number of days to look back (default: 7)
     * @param [activityType] Filter by activity type (user_activity, hr_management, location_management, absence_management, system_access)
     */
    public apiDashboardHrActivityGet(days?: number, activityType?: string, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardHrActivityGet(days, activityType, observableOptions);
        return result.toPromise();
    }

    /**
     * Get all locations for a specific check-in. HR/Admin only.
     * Get locations for any check-in (HR/Admin)
     * @param checkinId Check-in ID
     */
    public apiDashboardLocationsCheckinIdGetWithHttpInfo(checkinId: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Array<ModelsCheckinLocation>>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardLocationsCheckinIdGetWithHttpInfo(checkinId, observableOptions);
        return result.toPromise();
    }

    /**
     * Get all locations for a specific check-in. HR/Admin only.
     * Get locations for any check-in (HR/Admin)
     * @param checkinId Check-in ID
     */
    public apiDashboardLocationsCheckinIdGet(checkinId: number, _options?: PromiseConfigurationOptions): Promise<Array<ModelsCheckinLocation>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardLocationsCheckinIdGet(checkinId, observableOptions);
        return result.toPromise();
    }

    /**
     * Add new locations to a specific check-in. HR/Admin only.
     * Add locations to any check-in (HR/Admin)
     * @param checkinId Check-in ID
     * @param locations Locations to add
     */
    public apiDashboardLocationsCheckinIdPutWithHttpInfo(checkinId: number, locations: ModelsUpdateLocationsRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsCheckinResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardLocationsCheckinIdPutWithHttpInfo(checkinId, locations, observableOptions);
        return result.toPromise();
    }

    /**
     * Add new locations to a specific check-in. HR/Admin only.
     * Add locations to any check-in (HR/Admin)
     * @param checkinId Check-in ID
     * @param locations Locations to add
     */
    public apiDashboardLocationsCheckinIdPut(checkinId: number, locations: ModelsUpdateLocationsRequest, _options?: PromiseConfigurationOptions): Promise<ModelsCheckinResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardLocationsCheckinIdPut(checkinId, locations, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a specific location from any check-in. HR/Admin only.
     * Delete any location (HR/Admin)
     * @param locationId Location ID
     */
    public apiDashboardLocationsLocationIdDeleteWithHttpInfo(locationId: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardLocationsLocationIdDeleteWithHttpInfo(locationId, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a specific location from any check-in. HR/Admin only.
     * Delete any location (HR/Admin)
     * @param locationId Location ID
     */
    public apiDashboardLocationsLocationIdDelete(locationId: number, _options?: PromiseConfigurationOptions): Promise<ModelsSimpleResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardLocationsLocationIdDelete(locationId, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns absence stats (total absences, by type) for date range. HR/admin only.
     * Get absence statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAbsencesGetWithHttpInfo(startDate?: string, endDate?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsAbsencesGetWithHttpInfo(startDate, endDate, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns absence stats (total absences, by type) for date range. HR/admin only.
     * Get absence statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAbsencesGet(startDate?: string, endDate?: string, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsAbsencesGet(startDate, endDate, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns attendance stats (total check-ins, on-time %, late %) for date range. HR/admin only.
     * Get attendance statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAttendanceGetWithHttpInfo(startDate?: string, endDate?: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsAttendanceGetWithHttpInfo(startDate, endDate, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns attendance stats (total check-ins, on-time %, late %) for date range. HR/admin only.
     * Get attendance statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAttendanceGet(startDate?: string, endDate?: string, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsAttendanceGet(startDate, endDate, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a list of dates with counts of overtime. HR/admin only.
     * Get overtime stats
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardStatsOvertimeGetWithHttpInfo(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsOvertimeGetWithHttpInfo(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns a list of dates with counts of overtime. HR/admin only.
     * Get overtime stats
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardStatsOvertimeGet(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsOvertimeGet(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns user stats (total, by role, by team). HR/admin only.
     * Get user statistics
     */
    public apiDashboardStatsUsersGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsUsersGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns user stats (total, by role, by team). HR/admin only.
     * Get user statistics
     */
    public apiDashboardStatsUsersGet(_options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardStatsUsersGet(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns users grouped by team. HR/admin only.
     * Get users by team
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiDashboardUsersByTeamGetWithHttpInfo(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardUsersByTeamGetWithHttpInfo(page, pageSize, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns users grouped by team. HR/admin only.
     * Get users by team
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiDashboardUsersByTeamGet(page?: number, pageSize?: number, _options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiDashboardUsersByTeamGet(page, pageSize, observableOptions);
        return result.toPromise();
    }


}



import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public apiUsersGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: any; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public apiUsersGet(_options?: PromiseConfigurationOptions): Promise<{ [key: string]: any; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersGet(observableOptions);
        return result.toPromise();
    }


}



import { ObservableHealthApi } from './ObservableAPI';

import { HealthApiRequestFactory, HealthApiResponseProcessor} from "../apis/HealthApi";
export class PromiseHealthApi {
    private api: ObservableHealthApi

    public constructor(
        configuration: Configuration,
        requestFactory?: HealthApiRequestFactory,
        responseProcessor?: HealthApiResponseProcessor
    ) {
        this.api = new ObservableHealthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Check if the server is running
     * Health check
     */
    public healthzGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: string; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.healthzGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Check if the server is running
     * Health check
     */
    public healthzGet(_options?: PromiseConfigurationOptions): Promise<{ [key: string]: string; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.healthzGet(observableOptions);
        return result.toPromise();
    }


}



import { ObservableUsersApi } from './ObservableAPI';

import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";
export class PromiseUsersApi {
    private api: ObservableUsersApi

    public constructor(
        configuration: Configuration,
        requestFactory?: UsersApiRequestFactory,
        responseProcessor?: UsersApiResponseProcessor
    ) {
        this.api = new ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * HR/admin can set email_confirmed=true for a user
     * Activate user email
     * @param id User ID
     */
    public apiUsersIdActivateEmailPutWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdActivateEmailPutWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can set email_confirmed=true for a user
     * Activate user email
     * @param id User ID
     */
    public apiUsersIdActivateEmailPut(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsSimpleResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdActivateEmailPut(id, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can approve a user by setting pending_approval=false and deactivated=false.
     * Approve user
     * @param id User ID
     */
    public apiUsersIdApprovePutWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdApprovePutWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can approve a user by setting pending_approval=false and deactivated=false.
     * Approve user
     * @param id User ID
     */
    public apiUsersIdApprovePut(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsSimpleResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdApprovePut(id, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can set per-user check-in start time and timezone. JWT with hr/admin required.
     * Update user\'s check-in config
     * @param id User ID
     * @param config Check-in config
     */
    public apiUsersIdCheckinConfigPutWithHttpInfo(id: number, config: ModelsCheckinConfigRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdCheckinConfigPutWithHttpInfo(id, config, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can set per-user check-in start time and timezone. JWT with hr/admin required.
     * Update user\'s check-in config
     * @param id User ID
     * @param config Check-in config
     */
    public apiUsersIdCheckinConfigPut(id: number, config: ModelsCheckinConfigRequest, _options?: PromiseConfigurationOptions): Promise<ModelsUser> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdCheckinConfigPut(id, config, observableOptions);
        return result.toPromise();
    }

    /**
     * Admin only. Soft delete user by setting deactivated=true.
     * Deactivate (soft delete) user
     * @param id User ID
     */
    public apiUsersIdDeleteWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsSimpleResponse>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdDeleteWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Admin only. Soft delete user by setting deactivated=true.
     * Deactivate (soft delete) user
     * @param id User ID
     */
    public apiUsersIdDelete(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsSimpleResponse> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdDelete(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Admin only. Get user details by ID.
     * Get user by ID
     * @param id User ID
     */
    public apiUsersIdGetWithHttpInfo(id: number, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdGetWithHttpInfo(id, observableOptions);
        return result.toPromise();
    }

    /**
     * Admin only. Get user details by ID.
     * Get user by ID
     * @param id User ID
     */
    public apiUsersIdGet(id: number, _options?: PromiseConfigurationOptions): Promise<ModelsUser> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdGet(id, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can update additional user fields from Excel files (DNI, CUIL, birth date, hire date, location, etc.). JWT with hr/admin required.
     * Update user HR details
     * @param id User ID
     * @param details HR details (set \&#39;approve\&#39;: true to approve and activate user in same call)
     */
    public apiUsersIdHrDetailsPutWithHttpInfo(id: number, details: ModelsUserHRDetailsRequest, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdHrDetailsPutWithHttpInfo(id, details, observableOptions);
        return result.toPromise();
    }

    /**
     * HR/admin can update additional user fields from Excel files (DNI, CUIL, birth date, hire date, location, etc.). JWT with hr/admin required.
     * Update user HR details
     * @param id User ID
     * @param details HR details (set \&#39;approve\&#39;: true to approve and activate user in same call)
     */
    public apiUsersIdHrDetailsPut(id: number, details: ModelsUserHRDetailsRequest, _options?: PromiseConfigurationOptions): Promise<ModelsUser> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdHrDetailsPut(id, details, observableOptions);
        return result.toPromise();
    }

    /**
     * Admin only. Update user details by ID.
     * Update user
     * @param id User ID
     * @param user User data
     */
    public apiUsersIdPutWithHttpInfo(id: number, user: ModelsUser, _options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdPutWithHttpInfo(id, user, observableOptions);
        return result.toPromise();
    }

    /**
     * Admin only. Update user details by ID.
     * Update user
     * @param id User ID
     * @param user User data
     */
    public apiUsersIdPut(id: number, user: ModelsUser, _options?: PromiseConfigurationOptions): Promise<ModelsUser> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersIdPut(id, user, observableOptions);
        return result.toPromise();
    }

    /**
     * Returns the authenticated user\'s profile info
     * Get current user\'s profile
     */
    public apiUsersMeGetWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<ModelsUser>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersMeGetWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns the authenticated user\'s profile info
     * Get current user\'s profile
     */
    public apiUsersMeGet(_options?: PromiseConfigurationOptions): Promise<ModelsUser> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.apiUsersMeGet(observableOptions);
        return result.toPromise();
    }


}



