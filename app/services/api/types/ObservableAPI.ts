import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, mergeConfiguration } from '../configuration'
import type { Middleware } from '../middleware';
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { AbsenceApiRequestFactory, AbsenceApiResponseProcessor} from "../apis/AbsenceApi";
export class ObservableAbsenceApi {
    private requestFactory: AbsenceApiRequestFactory;
    private responseProcessor: AbsenceApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AbsenceApiRequestFactory,
        responseProcessor?: AbsenceApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AbsenceApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AbsenceApiResponseProcessor();
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
    public apiAbsencesAllGetWithHttpInfo(page?: number, pageSize?: number, userId?: number, date?: string, type?: string, _options?: ConfigurationOptions): Observable<HttpInfo<Array<ModelsAbsenceResponse>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiAbsencesAllGet(page, pageSize, userId, date, type, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiAbsencesAllGetWithHttpInfo(rsp)));
            }));
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
    public apiAbsencesAllGet(page?: number, pageSize?: number, userId?: number, date?: string, type?: string, _options?: ConfigurationOptions): Observable<Array<ModelsAbsenceResponse>> {
        return this.apiAbsencesAllGetWithHttpInfo(page, pageSize, userId, date, type, _options).pipe(map((apiResponse: HttpInfo<Array<ModelsAbsenceResponse>>) => apiResponse.data));
    }

    /**
     * Returns all absences for the authenticated user, newest first. JWT required.
     * Get user\'s absence history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiAbsencesGetWithHttpInfo(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiAbsencesGet(page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiAbsencesGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns all absences for the authenticated user, newest first. JWT required.
     * Get user\'s absence history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiAbsencesGet(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiAbsencesGetWithHttpInfo(page, pageSize, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * HR/admin only. Soft delete an absence by setting deleted=true.
     * Soft delete absence (HR/admin)
     * @param id Absence ID
     */
    public apiAbsencesIdDeleteWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsSimpleResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiAbsencesIdDelete(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiAbsencesIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin only. Soft delete an absence by setting deleted=true.
     * Soft delete absence (HR/admin)
     * @param id Absence ID
     */
    public apiAbsencesIdDelete(id: number, _options?: ConfigurationOptions): Observable<ModelsSimpleResponse> {
        return this.apiAbsencesIdDeleteWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsSimpleResponse>) => apiResponse.data));
    }

    /**
     * User uploads a file for their own absence if not locked. Only PDF/JPG/PNG, max 5MB. JWT required.
     * Upload medical certificate
     * @param id Absence ID
     * @param file Medical certificate file
     */
    public apiAbsencesIdDocumentsPostWithHttpInfo(id: number, file: HttpFile, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsAbsenceResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiAbsencesIdDocumentsPost(id, file, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiAbsencesIdDocumentsPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * User uploads a file for their own absence if not locked. Only PDF/JPG/PNG, max 5MB. JWT required.
     * Upload medical certificate
     * @param id Absence ID
     * @param file Medical certificate file
     */
    public apiAbsencesIdDocumentsPost(id: number, file: HttpFile, _options?: ConfigurationOptions): Observable<ModelsAbsenceResponse> {
        return this.apiAbsencesIdDocumentsPostWithHttpInfo(id, file, _options).pipe(map((apiResponse: HttpInfo<ModelsAbsenceResponse>) => apiResponse.data));
    }

    /**
     * HR/admin can lock or unlock an absence to prevent user edits. JWT with hr/admin required.
     * Lock or unlock an absence
     * @param id Absence ID
     * @param lock Lock state
     */
    public apiAbsencesIdLockPatchWithHttpInfo(id: number, lock: ModelsLockAbsenceRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsAbsenceResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiAbsencesIdLockPatch(id, lock, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiAbsencesIdLockPatchWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can lock or unlock an absence to prevent user edits. JWT with hr/admin required.
     * Lock or unlock an absence
     * @param id Absence ID
     * @param lock Lock state
     */
    public apiAbsencesIdLockPatch(id: number, lock: ModelsLockAbsenceRequest, _options?: ConfigurationOptions): Observable<ModelsAbsenceResponse> {
        return this.apiAbsencesIdLockPatchWithHttpInfo(id, lock, _options).pipe(map((apiResponse: HttpInfo<ModelsAbsenceResponse>) => apiResponse.data));
    }

    /**
     * User can update their own absence if not locked. HR/admin can update any. JWT required.
     * Update absence/late/medical
     * @param id Absence ID
     * @param absence Absence data
     */
    public apiAbsencesIdPutWithHttpInfo(id: number, absence: ModelsAbsenceRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsAbsenceResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiAbsencesIdPut(id, absence, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiAbsencesIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * User can update their own absence if not locked. HR/admin can update any. JWT required.
     * Update absence/late/medical
     * @param id Absence ID
     * @param absence Absence data
     */
    public apiAbsencesIdPut(id: number, absence: ModelsAbsenceRequest, _options?: ConfigurationOptions): Observable<ModelsAbsenceResponse> {
        return this.apiAbsencesIdPutWithHttpInfo(id, absence, _options).pipe(map((apiResponse: HttpInfo<ModelsAbsenceResponse>) => apiResponse.data));
    }

    /**
     * User reports absence, late arrival, or medical leave. JWT required.
     * Report absence/late/medical
     * @param absence Absence data
     */
    public apiAbsencesPostWithHttpInfo(absence: ModelsAbsenceRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsAbsenceResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiAbsencesPost(absence, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiAbsencesPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * User reports absence, late arrival, or medical leave. JWT required.
     * Report absence/late/medical
     * @param absence Absence data
     */
    public apiAbsencesPost(absence: ModelsAbsenceRequest, _options?: ConfigurationOptions): Observable<ModelsAbsenceResponse> {
        return this.apiAbsencesPostWithHttpInfo(absence, _options).pipe(map((apiResponse: HttpInfo<ModelsAbsenceResponse>) => apiResponse.data));
    }

}

import { AuthApiRequestFactory, AuthApiResponseProcessor} from "../apis/AuthApi";
export class ObservableAuthApi {
    private requestFactory: AuthApiRequestFactory;
    private responseProcessor: AuthApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AuthApiRequestFactory,
        responseProcessor?: AuthApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AuthApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AuthApiResponseProcessor();
    }

    /**
     * Authenticate with email and password. Returns JWT on success.
     * Login
     * @param credentials Login credentials
     */
    public authLoginPostWithHttpInfo(credentials: ModelsLoginRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsLoginResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.authLoginPost(credentials, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.authLoginPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Authenticate with email and password. Returns JWT on success.
     * Login
     * @param credentials Login credentials
     */
    public authLoginPost(credentials: ModelsLoginRequest, _options?: ConfigurationOptions): Observable<ModelsLoginResponse> {
        return this.authLoginPostWithHttpInfo(credentials, _options).pipe(map((apiResponse: HttpInfo<ModelsLoginResponse>) => apiResponse.data));
    }

    /**
     * Revoke a refresh token (logout from device/session)
     * Logout (revoke refresh token)
     * @param logout Logout request
     */
    public authLogoutPostWithHttpInfo(logout: ModelsLogoutRequest, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: string; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.authLogoutPost(logout, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.authLogoutPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Revoke a refresh token (logout from device/session)
     * Logout (revoke refresh token)
     * @param logout Logout request
     */
    public authLogoutPost(logout: ModelsLogoutRequest, _options?: ConfigurationOptions): Observable<{ [key: string]: string; }> {
        return this.authLogoutPostWithHttpInfo(logout, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: string; }>) => apiResponse.data));
    }

    /**
     * Exchange a valid refresh token for a new access token. Rotates refresh token.
     * Refresh JWT access token
     * @param refresh Refresh token request
     */
    public authRefreshPostWithHttpInfo(refresh: ModelsRefreshRequest, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: string; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.authRefreshPost(refresh, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.authRefreshPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Exchange a valid refresh token for a new access token. Rotates refresh token.
     * Refresh JWT access token
     * @param refresh Refresh token request
     */
    public authRefreshPost(refresh: ModelsRefreshRequest, _options?: ConfigurationOptions): Observable<{ [key: string]: string; }> {
        return this.authRefreshPostWithHttpInfo(refresh, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: string; }>) => apiResponse.data));
    }

    /**
     * Register with name, surname, email, phone, and password. Sends confirmation email.
     * Register a new user
     * @param registration Registration data
     */
    public authRegisterPostWithHttpInfo(registration: ModelsRegisterRequest, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: string; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.authRegisterPost(registration, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.authRegisterPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Register with name, surname, email, phone, and password. Sends confirmation email.
     * Register a new user
     * @param registration Registration data
     */
    public authRegisterPost(registration: ModelsRegisterRequest, _options?: ConfigurationOptions): Observable<{ [key: string]: string; }> {
        return this.authRegisterPostWithHttpInfo(registration, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: string; }>) => apiResponse.data));
    }

    /**
     * Resend the email confirmation link to a user who hasn\'t confirmed yet.
     * Resend confirmation email
     * @param resend Resend confirmation request
     */
    public authResendConfirmationPostWithHttpInfo(resend: ModelsResendConfirmationRequest, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: string; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.authResendConfirmationPost(resend, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.authResendConfirmationPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Resend the email confirmation link to a user who hasn\'t confirmed yet.
     * Resend confirmation email
     * @param resend Resend confirmation request
     */
    public authResendConfirmationPost(resend: ModelsResendConfirmationRequest, _options?: ConfigurationOptions): Observable<{ [key: string]: string; }> {
        return this.authResendConfirmationPostWithHttpInfo(resend, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: string; }>) => apiResponse.data));
    }

}

import { CatalogApiRequestFactory, CatalogApiResponseProcessor} from "../apis/CatalogApi";
export class ObservableCatalogApi {
    private requestFactory: CatalogApiRequestFactory;
    private responseProcessor: CatalogApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: CatalogApiRequestFactory,
        responseProcessor?: CatalogApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new CatalogApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new CatalogApiResponseProcessor();
    }

    /**
     * Get all active locations for dropdowns and forms.
     * Get active locations
     * @param [type] Location type filter
     */
    public apiCatalogLocationsActiveGetWithHttpInfo(type?: string, _options?: ConfigurationOptions): Observable<HttpInfo<Array<ModelsLocationCatalogResponse>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCatalogLocationsActiveGet(type, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCatalogLocationsActiveGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get all active locations for dropdowns and forms.
     * Get active locations
     * @param [type] Location type filter
     */
    public apiCatalogLocationsActiveGet(type?: string, _options?: ConfigurationOptions): Observable<Array<ModelsLocationCatalogResponse>> {
        return this.apiCatalogLocationsActiveGetWithHttpInfo(type, _options).pipe(map((apiResponse: HttpInfo<Array<ModelsLocationCatalogResponse>>) => apiResponse.data));
    }

    /**
     * Create multiple locations at once. HR/Admin only.
     * Bulk create locations
     * @param locations Locations to create
     */
    public apiCatalogLocationsBulkPostWithHttpInfo(locations: ModelsBulkLocationRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsBulkLocationResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCatalogLocationsBulkPost(locations, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCatalogLocationsBulkPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create multiple locations at once. HR/Admin only.
     * Bulk create locations
     * @param locations Locations to create
     */
    public apiCatalogLocationsBulkPost(locations: ModelsBulkLocationRequest, _options?: ConfigurationOptions): Observable<ModelsBulkLocationResponse> {
        return this.apiCatalogLocationsBulkPostWithHttpInfo(locations, _options).pipe(map((apiResponse: HttpInfo<ModelsBulkLocationResponse>) => apiResponse.data));
    }

    /**
     * Get locations with optional filtering.
     * Get locations with filters
     * @param [type] Location type filter
     * @param [isActive] Active status filter
     * @param [search] Search in name and description
     */
    public apiCatalogLocationsGetWithHttpInfo(type?: string, isActive?: boolean, search?: string, _options?: ConfigurationOptions): Observable<HttpInfo<Array<ModelsLocationCatalogResponse>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCatalogLocationsGet(type, isActive, search, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCatalogLocationsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get locations with optional filtering.
     * Get locations with filters
     * @param [type] Location type filter
     * @param [isActive] Active status filter
     * @param [search] Search in name and description
     */
    public apiCatalogLocationsGet(type?: string, isActive?: boolean, search?: string, _options?: ConfigurationOptions): Observable<Array<ModelsLocationCatalogResponse>> {
        return this.apiCatalogLocationsGetWithHttpInfo(type, isActive, search, _options).pipe(map((apiResponse: HttpInfo<Array<ModelsLocationCatalogResponse>>) => apiResponse.data));
    }

    /**
     * Soft delete a location. HR/Admin only.
     * Delete a location
     * @param id Location ID
     */
    public apiCatalogLocationsIdDeleteWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsSimpleResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCatalogLocationsIdDelete(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCatalogLocationsIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Soft delete a location. HR/Admin only.
     * Delete a location
     * @param id Location ID
     */
    public apiCatalogLocationsIdDelete(id: number, _options?: ConfigurationOptions): Observable<ModelsSimpleResponse> {
        return this.apiCatalogLocationsIdDeleteWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsSimpleResponse>) => apiResponse.data));
    }

    /**
     * Get a specific location by ID. HR/Admin only.
     * Get a specific location
     * @param id Location ID
     */
    public apiCatalogLocationsIdGetWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsLocationCatalogResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCatalogLocationsIdGet(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCatalogLocationsIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get a specific location by ID. HR/Admin only.
     * Get a specific location
     * @param id Location ID
     */
    public apiCatalogLocationsIdGet(id: number, _options?: ConfigurationOptions): Observable<ModelsLocationCatalogResponse> {
        return this.apiCatalogLocationsIdGetWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsLocationCatalogResponse>) => apiResponse.data));
    }

    /**
     * Update an existing location. HR/Admin only.
     * Update a location
     * @param id Location ID
     * @param location Updated location data
     */
    public apiCatalogLocationsIdPutWithHttpInfo(id: number, location: ModelsLocationCatalogRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsLocationCatalogResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCatalogLocationsIdPut(id, location, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCatalogLocationsIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update an existing location. HR/Admin only.
     * Update a location
     * @param id Location ID
     * @param location Updated location data
     */
    public apiCatalogLocationsIdPut(id: number, location: ModelsLocationCatalogRequest, _options?: ConfigurationOptions): Observable<ModelsLocationCatalogResponse> {
        return this.apiCatalogLocationsIdPutWithHttpInfo(id, location, _options).pipe(map((apiResponse: HttpInfo<ModelsLocationCatalogResponse>) => apiResponse.data));
    }

    /**
     * Create a new location in the catalog. HR/Admin only.
     * Create a new location
     * @param location Location data
     */
    public apiCatalogLocationsPostWithHttpInfo(location: ModelsLocationCatalogRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsLocationCatalogResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCatalogLocationsPost(location, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCatalogLocationsPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create a new location in the catalog. HR/Admin only.
     * Create a new location
     * @param location Location data
     */
    public apiCatalogLocationsPost(location: ModelsLocationCatalogRequest, _options?: ConfigurationOptions): Observable<ModelsLocationCatalogResponse> {
        return this.apiCatalogLocationsPostWithHttpInfo(location, _options).pipe(map((apiResponse: HttpInfo<ModelsLocationCatalogResponse>) => apiResponse.data));
    }

}

import { CheckinApiRequestFactory, CheckinApiResponseProcessor} from "../apis/CheckinApi";
export class ObservableCheckinApi {
    private requestFactory: CheckinApiRequestFactory;
    private responseProcessor: CheckinApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: CheckinApiRequestFactory,
        responseProcessor?: CheckinApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new CheckinApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new CheckinApiResponseProcessor();
    }

    /**
     * HR/admin only. Returns paginated list of all check-ins. Query params: page, page_size, user_id, date
     * List all check-ins (HR/admin)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     * @param [userId] Filter by user ID
     * @param [date] Filter by date (YYYY-MM-DD)
     */
    public apiCheckinsAllGetWithHttpInfo(page?: number, pageSize?: number, userId?: number, date?: string, _options?: ConfigurationOptions): Observable<HttpInfo<Array<ModelsCheckinResponse>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsAllGet(page, pageSize, userId, date, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsAllGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin only. Returns paginated list of all check-ins. Query params: page, page_size, user_id, date
     * List all check-ins (HR/admin)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20)
     * @param [userId] Filter by user ID
     * @param [date] Filter by date (YYYY-MM-DD)
     */
    public apiCheckinsAllGet(page?: number, pageSize?: number, userId?: number, date?: string, _options?: ConfigurationOptions): Observable<Array<ModelsCheckinResponse>> {
        return this.apiCheckinsAllGetWithHttpInfo(page, pageSize, userId, date, _options).pipe(map((apiResponse: HttpInfo<Array<ModelsCheckinResponse>>) => apiResponse.data));
    }

    /**
     * HR/admin can approve or reject multiple check-ins in one API call.
     * Batch approve check-ins (HR/admin)
     * @param body Batch approve request
     */
    public apiCheckinsBatchApprovePostWithHttpInfo(body: ModelsBatchApproveRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsBatchApproveResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsBatchApprovePost(body, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsBatchApprovePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can approve or reject multiple check-ins in one API call.
     * Batch approve check-ins (HR/admin)
     * @param body Batch approve request
     */
    public apiCheckinsBatchApprovePost(body: ModelsBatchApproveRequest, _options?: ConfigurationOptions): Observable<ModelsBatchApproveResponse> {
        return this.apiCheckinsBatchApprovePostWithHttpInfo(body, _options).pipe(map((apiResponse: HttpInfo<ModelsBatchApproveResponse>) => apiResponse.data));
    }

    /**
     * HR or admin can update any user\'s checkout info (time, status, overtime). JWT with hr/admin role required.
     * Admin/HR update checkout
     * @param id Check-in ID
     * @param checkout Checkout update data
     */
    public apiCheckinsCheckoutIdPutWithHttpInfo(id: number, checkout: ModelsCheckoutUpdateRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsCheckoutIdPut(id, checkout, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsCheckoutIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR or admin can update any user\'s checkout info (time, status, overtime). JWT with hr/admin role required.
     * Admin/HR update checkout
     * @param id Check-in ID
     * @param checkout Checkout update data
     */
    public apiCheckinsCheckoutIdPut(id: number, checkout: ModelsCheckoutUpdateRequest, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiCheckinsCheckoutIdPutWithHttpInfo(id, checkout, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * User submits daily checkout (end-of-day). Only one per day. JWT required. Must have checked in first. Records checkout time, status, and overtime.
     * Submit daily checkout
     * @param checkout Checkout data
     */
    public apiCheckinsCheckoutPostWithHttpInfo(checkout: ModelsCheckoutRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsCheckoutPost(checkout, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsCheckoutPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * User submits daily checkout (end-of-day). Only one per day. JWT required. Must have checked in first. Records checkout time, status, and overtime.
     * Submit daily checkout
     * @param checkout Checkout data
     */
    public apiCheckinsCheckoutPost(checkout: ModelsCheckoutRequest, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiCheckinsCheckoutPostWithHttpInfo(checkout, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * Returns all check-ins for the authenticated user, newest first. JWT required.
     * Get user\'s check-in history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiCheckinsGetWithHttpInfo(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsGet(page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns all check-ins for the authenticated user, newest first. JWT required.
     * Get user\'s check-in history
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiCheckinsGet(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiCheckinsGetWithHttpInfo(page, pageSize, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * HR/admin only. Soft delete a check-in by setting deleted=true.
     * Soft delete check-in (HR/admin)
     * @param id Check-in ID
     */
    public apiCheckinsIdDeleteWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsErrorResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsIdDelete(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin only. Soft delete a check-in by setting deleted=true.
     * Soft delete check-in (HR/admin)
     * @param id Check-in ID
     */
    public apiCheckinsIdDelete(id: number, _options?: ConfigurationOptions): Observable<ModelsErrorResponse> {
        return this.apiCheckinsIdDeleteWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsErrorResponse>) => apiResponse.data));
    }

    /**
     * Get all locations for today\'s check-in. JWT required.
     * Get today\'s locations
     */
    public apiCheckinsLocationsGetWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<Array<ModelsCheckinLocation>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsLocationsGet(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsLocationsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get all locations for today\'s check-in. JWT required.
     * Get today\'s locations
     */
    public apiCheckinsLocationsGet(_options?: ConfigurationOptions): Observable<Array<ModelsCheckinLocation>> {
        return this.apiCheckinsLocationsGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<ModelsCheckinLocation>>) => apiResponse.data));
    }

    /**
     * Delete a specific location from today\'s check-in. JWT required.
     * Delete a specific location
     * @param id Location ID
     */
    public apiCheckinsLocationsIdDeleteWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsSimpleResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsLocationsIdDelete(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsLocationsIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete a specific location from today\'s check-in. JWT required.
     * Delete a specific location
     * @param id Location ID
     */
    public apiCheckinsLocationsIdDelete(id: number, _options?: ConfigurationOptions): Observable<ModelsSimpleResponse> {
        return this.apiCheckinsLocationsIdDeleteWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsSimpleResponse>) => apiResponse.data));
    }

    /**
     * User can update their work locations during the day. Only works if they have already checked in today. JWT required.
     * Update locations during the day
     * @param locations Updated locations
     */
    public apiCheckinsLocationsPutWithHttpInfo(locations: ModelsUpdateLocationsRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsLocationsPut(locations, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsLocationsPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * User can update their work locations during the day. Only works if they have already checked in today. JWT required.
     * Update locations during the day
     * @param locations Updated locations
     */
    public apiCheckinsLocationsPut(locations: ModelsUpdateLocationsRequest, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiCheckinsLocationsPutWithHttpInfo(locations, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * User submits daily check-in with location. Only one per day. JWT required. If late, must provide reason.
     * Submit daily check-in
     * @param checkin Check-in data
     */
    public apiCheckinsPostWithHttpInfo(checkin: ModelsCheckinRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsPost(checkin, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * User submits daily check-in with location. Only one per day. JWT required. If late, must provide reason.
     * Submit daily check-in
     * @param checkin Check-in data
     */
    public apiCheckinsPost(checkin: ModelsCheckinRequest, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiCheckinsPostWithHttpInfo(checkin, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * Returns today\'s check-in for the authenticated user, or 404 if none. JWT required.
     * Get today\'s check-in
     */
    public apiCheckinsTodayGetWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiCheckinsTodayGet(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiCheckinsTodayGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns today\'s check-in for the authenticated user, or 404 if none. JWT required.
     * Get today\'s check-in
     */
    public apiCheckinsTodayGet(_options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiCheckinsTodayGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

}

import { DashboardApiRequestFactory, DashboardApiResponseProcessor} from "../apis/DashboardApi";
export class ObservableDashboardApi {
    private requestFactory: DashboardApiRequestFactory;
    private responseProcessor: DashboardApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DashboardApiRequestFactory,
        responseProcessor?: DashboardApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DashboardApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DashboardApiResponseProcessor();
    }

    /**
     * Returns a list of dates with counts of absences. HR/admin only.
     * Get absence heatmap
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardAnalyticsHeatmapGetWithHttpInfo(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAnalyticsHeatmapGet(page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAnalyticsHeatmapGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns a list of dates with counts of absences. HR/admin only.
     * Get absence heatmap
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardAnalyticsHeatmapGet(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardAnalyticsHeatmapGetWithHttpInfo(page, pageSize, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns monthly attendance analytics. HR/admin only.
     * Get monthly analytics
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 12, max 60)
     */
    public apiDashboardAnalyticsMonthlyGetWithHttpInfo(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAnalyticsMonthlyGet(page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAnalyticsMonthlyGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns monthly attendance analytics. HR/admin only.
     * Get monthly analytics
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 12, max 60)
     */
    public apiDashboardAnalyticsMonthlyGet(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardAnalyticsMonthlyGetWithHttpInfo(page, pageSize, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns a list of late check-in predictions for the next 7 days. HR/admin only.
     * Get late check-in prediction
     */
    public apiDashboardAnalyticsPredictionLateCheckinsGetWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAnalyticsPredictionLateCheckinsGet(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAnalyticsPredictionLateCheckinsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns a list of late check-in predictions for the next 7 days. HR/admin only.
     * Get late check-in prediction
     */
    public apiDashboardAnalyticsPredictionLateCheckinsGet(_options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardAnalyticsPredictionLateCheckinsGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns the daily_summary row for a given date. HR/admin only.
     * Get daily summary
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceDailySummaryGetWithHttpInfo(date: string, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsDailySummary>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAttendanceDailySummaryGet(date, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAttendanceDailySummaryGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns the daily_summary row for a given date. HR/admin only.
     * Get daily summary
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceDailySummaryGet(date: string, _options?: ConfigurationOptions): Observable<ModelsDailySummary> {
        return this.apiDashboardAttendanceDailySummaryGetWithHttpInfo(date, _options).pipe(map((apiResponse: HttpInfo<ModelsDailySummary>) => apiResponse.data));
    }

    /**
     * Returns checkin, absence, and user info for a given user/date. HR/admin only.
     * Get individual attendance (checkin + absence + user)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceIndividualGetWithHttpInfo(userId: number, date: string, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsIndividualAttendanceResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAttendanceIndividualGet(userId, date, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAttendanceIndividualGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns checkin, absence, and user info for a given user/date. HR/admin only.
     * Get individual attendance (checkin + absence + user)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardAttendanceIndividualGet(userId: number, date: string, _options?: ConfigurationOptions): Observable<ModelsIndividualAttendanceResponse> {
        return this.apiDashboardAttendanceIndividualGetWithHttpInfo(userId, date, _options).pipe(map((apiResponse: HttpInfo<ModelsIndividualAttendanceResponse>) => apiResponse.data));
    }

    /**
     * Returns live attendance statistics for today or a specific date. HR/admin only.
     * Get live attendance statistics
     * @param [date] Date (YYYY-MM-DD). Defaults to today if not provided
     */
    public apiDashboardAttendanceLiveStatsGetWithHttpInfo(date?: string, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAttendanceLiveStatsGet(date, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAttendanceLiveStatsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns live attendance statistics for today or a specific date. HR/admin only.
     * Get live attendance statistics
     * @param [date] Date (YYYY-MM-DD). Defaults to today if not provided
     */
    public apiDashboardAttendanceLiveStatsGet(date?: string, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardAttendanceLiveStatsGetWithHttpInfo(date, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns a list of all active employees with their status for a given date. HR/admin only.
     * Get attendance roll call
     * @param date Date (YYYY-MM-DD)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 50, max 200)
     */
    public apiDashboardAttendanceSummaryGetWithHttpInfo(date: string, page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAttendanceSummaryGet(date, page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAttendanceSummaryGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns a list of all active employees with their status for a given date. HR/admin only.
     * Get attendance roll call
     * @param date Date (YYYY-MM-DD)
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 50, max 200)
     */
    public apiDashboardAttendanceSummaryGet(date: string, page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardAttendanceSummaryGetWithHttpInfo(date, page, pageSize, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
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
    public apiDashboardAuditLogsGetWithHttpInfo(userEmail?: string, action?: string, entityType?: string, entityId?: number, date?: string, startDate?: string, endDate?: string, hrOnly?: boolean, page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsAuditLogListResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardAuditLogsGet(userEmail, action, entityType, entityId, date, startDate, endDate, hrOnly, page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardAuditLogsGetWithHttpInfo(rsp)));
            }));
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
    public apiDashboardAuditLogsGet(userEmail?: string, action?: string, entityType?: string, entityId?: number, date?: string, startDate?: string, endDate?: string, hrOnly?: boolean, page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<ModelsAuditLogListResponse> {
        return this.apiDashboardAuditLogsGetWithHttpInfo(userEmail, action, entityType, entityId, date, startDate, endDate, hrOnly, page, pageSize, _options).pipe(map((apiResponse: HttpInfo<ModelsAuditLogListResponse>) => apiResponse.data));
    }

    /**
     * HR or admin can update any user\'s check-in. Audit log is written. JWT with hr/admin role required.
     * HR/admin update check-in
     * @param id Check-in ID
     * @param checkin Check-in data
     */
    public apiDashboardCheckinsIdPutWithHttpInfo(id: number, checkin: ModelsCheckinRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardCheckinsIdPut(id, checkin, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardCheckinsIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR or admin can update any user\'s check-in. Audit log is written. JWT with hr/admin role required.
     * HR/admin update check-in
     * @param id Check-in ID
     * @param checkin Check-in data
     */
    public apiDashboardCheckinsIdPut(id: number, checkin: ModelsCheckinRequest, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiDashboardCheckinsIdPutWithHttpInfo(id, checkin, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
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
    public apiDashboardCheckinsUserIdDatePostWithHttpInfo(userId: number, date: string, locations: Array<ModelsLocationRequest>, time?: string, notes?: string, lateReason?: string, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardCheckinsUserIdDatePost(userId, date, locations, time, notes, lateReason, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardCheckinsUserIdDatePostWithHttpInfo(rsp)));
            }));
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
    public apiDashboardCheckinsUserIdDatePost(userId: number, date: string, locations: Array<ModelsLocationRequest>, time?: string, notes?: string, lateReason?: string, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiDashboardCheckinsUserIdDatePostWithHttpInfo(userId, date, locations, time, notes, lateReason, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * Returns all checkins for a given date from daily_checkins_view. HR/admin only.
     * Get all checkins for a date (view)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardCheckinsViewGetWithHttpInfo(date: string, _options?: ConfigurationOptions): Observable<HttpInfo<Array<{ [key: string]: any; }>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardCheckinsViewGet(date, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardCheckinsViewGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns all checkins for a given date from daily_checkins_view. HR/admin only.
     * Get all checkins for a date (view)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardCheckinsViewGet(date: string, _options?: ConfigurationOptions): Observable<Array<{ [key: string]: any; }>> {
        return this.apiDashboardCheckinsViewGetWithHttpInfo(date, _options).pipe(map((apiResponse: HttpInfo<Array<{ [key: string]: any; }>>) => apiResponse.data));
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
    public apiDashboardCheckoutsUserIdDatePostWithHttpInfo(userId: number, date: string, checkoutTime: string, status?: string, overtime?: boolean, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardCheckoutsUserIdDatePost(userId, date, checkoutTime, status, overtime, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardCheckoutsUserIdDatePostWithHttpInfo(rsp)));
            }));
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
    public apiDashboardCheckoutsUserIdDatePost(userId: number, date: string, checkoutTime: string, status?: string, overtime?: boolean, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiDashboardCheckoutsUserIdDatePostWithHttpInfo(userId, date, checkoutTime, status, overtime, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * HR/admin can convert an absence record to a checkin record. Useful when someone was marked absent but actually arrived late. JWT with hr/admin role required.
     * Convert absence to checkin (HR/admin)
     * @param request Conversion request
     */
    public apiDashboardConvertAbsenceToCheckinPostWithHttpInfo(request: ModelsConvertAbsenceRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardConvertAbsenceToCheckinPost(request, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardConvertAbsenceToCheckinPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can convert an absence record to a checkin record. Useful when someone was marked absent but actually arrived late. JWT with hr/admin role required.
     * Convert absence to checkin (HR/admin)
     * @param request Conversion request
     */
    public apiDashboardConvertAbsenceToCheckinPost(request: ModelsConvertAbsenceRequest, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiDashboardConvertAbsenceToCheckinPostWithHttpInfo(request, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * HR/admin can create an absence record for a user who didn\'t show up. Useful for end-of-day processing or when HR contacts user and they confirm they won\'t be coming. JWT with hr/admin role required.
     * Create absence for user (HR/admin)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     * @param type Absence type (1&#x3D;sick, 2&#x3D;vacation, 3&#x3D;personal, 4&#x3D;unauthorized, 5&#x3D;other)
     * @param reason Reason for absence
     */
    public apiDashboardCreateAbsenceUserIdDatePostWithHttpInfo(userId: number, date: string, type: number, reason: string, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsAbsenceResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardCreateAbsenceUserIdDatePost(userId, date, type, reason, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardCreateAbsenceUserIdDatePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can create an absence record for a user who didn\'t show up. Useful for end-of-day processing or when HR contacts user and they confirm they won\'t be coming. JWT with hr/admin role required.
     * Create absence for user (HR/admin)
     * @param userId User ID
     * @param date Date (YYYY-MM-DD)
     * @param type Absence type (1&#x3D;sick, 2&#x3D;vacation, 3&#x3D;personal, 4&#x3D;unauthorized, 5&#x3D;other)
     * @param reason Reason for absence
     */
    public apiDashboardCreateAbsenceUserIdDatePost(userId: number, date: string, type: number, reason: string, _options?: ConfigurationOptions): Observable<ModelsAbsenceResponse> {
        return this.apiDashboardCreateAbsenceUserIdDatePostWithHttpInfo(userId, date, type, reason, _options).pipe(map((apiResponse: HttpInfo<ModelsAbsenceResponse>) => apiResponse.data));
    }

    /**
     * HR/admin only. Export attendance roll call data as Excel file in ART format with all HR fields. Filters: date
     * Export attendance roll call to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardExportAttendanceGetWithHttpInfo(date: string, _options?: ConfigurationOptions): Observable<HttpInfo<HttpFile>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardExportAttendanceGet(date, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardExportAttendanceGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin only. Export attendance roll call data as Excel file in ART format with all HR fields. Filters: date
     * Export attendance roll call to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     */
    public apiDashboardExportAttendanceGet(date: string, _options?: ConfigurationOptions): Observable<HttpFile> {
        return this.apiDashboardExportAttendanceGetWithHttpInfo(date, _options).pipe(map((apiResponse: HttpInfo<HttpFile>) => apiResponse.data));
    }

    /**
     * HR/admin only. Export check-in data as Excel file in ART format with all HR fields for a specific date. Filters: date, userId
     * Export check-ins to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     * @param [userId] User ID
     */
    public apiDashboardExportCheckinsGetWithHttpInfo(date: string, userId?: number, _options?: ConfigurationOptions): Observable<HttpInfo<HttpFile>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardExportCheckinsGet(date, userId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardExportCheckinsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin only. Export check-in data as Excel file in ART format with all HR fields for a specific date. Filters: date, userId
     * Export check-ins to Excel (ART format)
     * @param date Date (YYYY-MM-DD)
     * @param [userId] User ID
     */
    public apiDashboardExportCheckinsGet(date: string, userId?: number, _options?: ConfigurationOptions): Observable<HttpFile> {
        return this.apiDashboardExportCheckinsGetWithHttpInfo(date, userId, _options).pipe(map((apiResponse: HttpInfo<HttpFile>) => apiResponse.data));
    }

    /**
     * Returns a summary of system activities for HR monitoring and alerts. HR/admin only. Shows recent user actions, system changes, and activity patterns that HR should be aware of.
     * Get system activity summary for HR monitoring
     * @param [days] Number of days to look back (default: 7)
     * @param [activityType] Filter by activity type (user_activity, hr_management, location_management, absence_management, system_access)
     */
    public apiDashboardHrActivityGetWithHttpInfo(days?: number, activityType?: string, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardHrActivityGet(days, activityType, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardHrActivityGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns a summary of system activities for HR monitoring and alerts. HR/admin only. Shows recent user actions, system changes, and activity patterns that HR should be aware of.
     * Get system activity summary for HR monitoring
     * @param [days] Number of days to look back (default: 7)
     * @param [activityType] Filter by activity type (user_activity, hr_management, location_management, absence_management, system_access)
     */
    public apiDashboardHrActivityGet(days?: number, activityType?: string, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardHrActivityGetWithHttpInfo(days, activityType, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Get all locations for a specific check-in. HR/Admin only.
     * Get locations for any check-in (HR/Admin)
     * @param checkinId Check-in ID
     */
    public apiDashboardLocationsCheckinIdGetWithHttpInfo(checkinId: number, _options?: ConfigurationOptions): Observable<HttpInfo<Array<ModelsCheckinLocation>>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardLocationsCheckinIdGet(checkinId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardLocationsCheckinIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get all locations for a specific check-in. HR/Admin only.
     * Get locations for any check-in (HR/Admin)
     * @param checkinId Check-in ID
     */
    public apiDashboardLocationsCheckinIdGet(checkinId: number, _options?: ConfigurationOptions): Observable<Array<ModelsCheckinLocation>> {
        return this.apiDashboardLocationsCheckinIdGetWithHttpInfo(checkinId, _options).pipe(map((apiResponse: HttpInfo<Array<ModelsCheckinLocation>>) => apiResponse.data));
    }

    /**
     * Add new locations to a specific check-in. HR/Admin only.
     * Add locations to any check-in (HR/Admin)
     * @param checkinId Check-in ID
     * @param locations Locations to add
     */
    public apiDashboardLocationsCheckinIdPutWithHttpInfo(checkinId: number, locations: ModelsUpdateLocationsRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsCheckinResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardLocationsCheckinIdPut(checkinId, locations, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardLocationsCheckinIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Add new locations to a specific check-in. HR/Admin only.
     * Add locations to any check-in (HR/Admin)
     * @param checkinId Check-in ID
     * @param locations Locations to add
     */
    public apiDashboardLocationsCheckinIdPut(checkinId: number, locations: ModelsUpdateLocationsRequest, _options?: ConfigurationOptions): Observable<ModelsCheckinResponse> {
        return this.apiDashboardLocationsCheckinIdPutWithHttpInfo(checkinId, locations, _options).pipe(map((apiResponse: HttpInfo<ModelsCheckinResponse>) => apiResponse.data));
    }

    /**
     * Delete a specific location from any check-in. HR/Admin only.
     * Delete any location (HR/Admin)
     * @param locationId Location ID
     */
    public apiDashboardLocationsLocationIdDeleteWithHttpInfo(locationId: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsSimpleResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardLocationsLocationIdDelete(locationId, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardLocationsLocationIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete a specific location from any check-in. HR/Admin only.
     * Delete any location (HR/Admin)
     * @param locationId Location ID
     */
    public apiDashboardLocationsLocationIdDelete(locationId: number, _options?: ConfigurationOptions): Observable<ModelsSimpleResponse> {
        return this.apiDashboardLocationsLocationIdDeleteWithHttpInfo(locationId, _options).pipe(map((apiResponse: HttpInfo<ModelsSimpleResponse>) => apiResponse.data));
    }

    /**
     * Returns absence stats (total absences, by type) for date range. HR/admin only.
     * Get absence statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAbsencesGetWithHttpInfo(startDate?: string, endDate?: string, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardStatsAbsencesGet(startDate, endDate, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardStatsAbsencesGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns absence stats (total absences, by type) for date range. HR/admin only.
     * Get absence statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAbsencesGet(startDate?: string, endDate?: string, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardStatsAbsencesGetWithHttpInfo(startDate, endDate, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns attendance stats (total check-ins, on-time %, late %) for date range. HR/admin only.
     * Get attendance statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAttendanceGetWithHttpInfo(startDate?: string, endDate?: string, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardStatsAttendanceGet(startDate, endDate, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardStatsAttendanceGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns attendance stats (total check-ins, on-time %, late %) for date range. HR/admin only.
     * Get attendance statistics
     * @param [startDate] Start date (YYYY-MM-DD)
     * @param [endDate] End date (YYYY-MM-DD)
     */
    public apiDashboardStatsAttendanceGet(startDate?: string, endDate?: string, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardStatsAttendanceGetWithHttpInfo(startDate, endDate, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns a list of dates with counts of overtime. HR/admin only.
     * Get overtime stats
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardStatsOvertimeGetWithHttpInfo(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardStatsOvertimeGet(page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardStatsOvertimeGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns a list of dates with counts of overtime. HR/admin only.
     * Get overtime stats
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 30, max 365)
     */
    public apiDashboardStatsOvertimeGet(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardStatsOvertimeGetWithHttpInfo(page, pageSize, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns user stats (total, by role, by team). HR/admin only.
     * Get user statistics
     */
    public apiDashboardStatsUsersGetWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardStatsUsersGet(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardStatsUsersGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns user stats (total, by role, by team). HR/admin only.
     * Get user statistics
     */
    public apiDashboardStatsUsersGet(_options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardStatsUsersGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

    /**
     * Returns users grouped by team. HR/admin only.
     * Get users by team
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiDashboardUsersByTeamGetWithHttpInfo(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiDashboardUsersByTeamGet(page, pageSize, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiDashboardUsersByTeamGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns users grouped by team. HR/admin only.
     * Get users by team
     * @param [page] Page number (default 1)
     * @param [pageSize] Page size (default 20, max 100)
     */
    public apiDashboardUsersByTeamGet(page?: number, pageSize?: number, _options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiDashboardUsersByTeamGetWithHttpInfo(page, pageSize, _options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

}

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     */
    public apiUsersGetWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: any; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersGet(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public apiUsersGet(_options?: ConfigurationOptions): Observable<{ [key: string]: any; }> {
        return this.apiUsersGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<{ [key: string]: any; }>) => apiResponse.data));
    }

}

import { HealthApiRequestFactory, HealthApiResponseProcessor} from "../apis/HealthApi";
export class ObservableHealthApi {
    private requestFactory: HealthApiRequestFactory;
    private responseProcessor: HealthApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: HealthApiRequestFactory,
        responseProcessor?: HealthApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new HealthApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new HealthApiResponseProcessor();
    }

    /**
     * Check if the server is running
     * Health check
     */
    public healthzGetWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: string; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.healthzGet(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.healthzGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Check if the server is running
     * Health check
     */
    public healthzGet(_options?: ConfigurationOptions): Observable<{ [key: string]: string; }> {
        return this.healthzGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<{ [key: string]: string; }>) => apiResponse.data));
    }

}

import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";
export class ObservableUsersApi {
    private requestFactory: UsersApiRequestFactory;
    private responseProcessor: UsersApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: UsersApiRequestFactory,
        responseProcessor?: UsersApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new UsersApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new UsersApiResponseProcessor();
    }

    /**
     * HR/admin can set email_confirmed=true for a user
     * Activate user email
     * @param id User ID
     */
    public apiUsersIdActivateEmailPutWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsSimpleResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersIdActivateEmailPut(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersIdActivateEmailPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can set email_confirmed=true for a user
     * Activate user email
     * @param id User ID
     */
    public apiUsersIdActivateEmailPut(id: number, _options?: ConfigurationOptions): Observable<ModelsSimpleResponse> {
        return this.apiUsersIdActivateEmailPutWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsSimpleResponse>) => apiResponse.data));
    }

    /**
     * HR/admin can approve a user by setting pending_approval=false and deactivated=false.
     * Approve user
     * @param id User ID
     */
    public apiUsersIdApprovePutWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsSimpleResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersIdApprovePut(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersIdApprovePutWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can approve a user by setting pending_approval=false and deactivated=false.
     * Approve user
     * @param id User ID
     */
    public apiUsersIdApprovePut(id: number, _options?: ConfigurationOptions): Observable<ModelsSimpleResponse> {
        return this.apiUsersIdApprovePutWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsSimpleResponse>) => apiResponse.data));
    }

    /**
     * HR/admin can set per-user check-in start time and timezone. JWT with hr/admin required.
     * Update user\'s check-in config
     * @param id User ID
     * @param config Check-in config
     */
    public apiUsersIdCheckinConfigPutWithHttpInfo(id: number, config: ModelsCheckinConfigRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsUser>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersIdCheckinConfigPut(id, config, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersIdCheckinConfigPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can set per-user check-in start time and timezone. JWT with hr/admin required.
     * Update user\'s check-in config
     * @param id User ID
     * @param config Check-in config
     */
    public apiUsersIdCheckinConfigPut(id: number, config: ModelsCheckinConfigRequest, _options?: ConfigurationOptions): Observable<ModelsUser> {
        return this.apiUsersIdCheckinConfigPutWithHttpInfo(id, config, _options).pipe(map((apiResponse: HttpInfo<ModelsUser>) => apiResponse.data));
    }

    /**
     * Admin only. Soft delete user by setting deactivated=true.
     * Deactivate (soft delete) user
     * @param id User ID
     */
    public apiUsersIdDeleteWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsSimpleResponse>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersIdDelete(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Admin only. Soft delete user by setting deactivated=true.
     * Deactivate (soft delete) user
     * @param id User ID
     */
    public apiUsersIdDelete(id: number, _options?: ConfigurationOptions): Observable<ModelsSimpleResponse> {
        return this.apiUsersIdDeleteWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsSimpleResponse>) => apiResponse.data));
    }

    /**
     * Admin only. Get user details by ID.
     * Get user by ID
     * @param id User ID
     */
    public apiUsersIdGetWithHttpInfo(id: number, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsUser>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersIdGet(id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Admin only. Get user details by ID.
     * Get user by ID
     * @param id User ID
     */
    public apiUsersIdGet(id: number, _options?: ConfigurationOptions): Observable<ModelsUser> {
        return this.apiUsersIdGetWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ModelsUser>) => apiResponse.data));
    }

    /**
     * HR/admin can update additional user fields from Excel files (DNI, CUIL, birth date, hire date, location, etc.). JWT with hr/admin required.
     * Update user HR details
     * @param id User ID
     * @param details HR details (set \&#39;approve\&#39;: true to approve and activate user in same call)
     */
    public apiUsersIdHrDetailsPutWithHttpInfo(id: number, details: ModelsUserHRDetailsRequest, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsUser>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersIdHrDetailsPut(id, details, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersIdHrDetailsPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * HR/admin can update additional user fields from Excel files (DNI, CUIL, birth date, hire date, location, etc.). JWT with hr/admin required.
     * Update user HR details
     * @param id User ID
     * @param details HR details (set \&#39;approve\&#39;: true to approve and activate user in same call)
     */
    public apiUsersIdHrDetailsPut(id: number, details: ModelsUserHRDetailsRequest, _options?: ConfigurationOptions): Observable<ModelsUser> {
        return this.apiUsersIdHrDetailsPutWithHttpInfo(id, details, _options).pipe(map((apiResponse: HttpInfo<ModelsUser>) => apiResponse.data));
    }

    /**
     * Admin only. Update user details by ID.
     * Update user
     * @param id User ID
     * @param user User data
     */
    public apiUsersIdPutWithHttpInfo(id: number, user: ModelsUser, _options?: ConfigurationOptions): Observable<HttpInfo<ModelsUser>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersIdPut(id, user, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Admin only. Update user details by ID.
     * Update user
     * @param id User ID
     * @param user User data
     */
    public apiUsersIdPut(id: number, user: ModelsUser, _options?: ConfigurationOptions): Observable<ModelsUser> {
        return this.apiUsersIdPutWithHttpInfo(id, user, _options).pipe(map((apiResponse: HttpInfo<ModelsUser>) => apiResponse.data));
    }

    /**
     * Returns the authenticated user\'s profile info
     * Get current user\'s profile
     */
    public apiUsersMeGetWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<ModelsUser>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.apiUsersMeGet(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.apiUsersMeGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns the authenticated user\'s profile info
     * Get current user\'s profile
     */
    public apiUsersMeGet(_options?: ConfigurationOptions): Observable<ModelsUser> {
        return this.apiUsersMeGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ModelsUser>) => apiResponse.data));
    }

}
