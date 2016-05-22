/*! *****************************************************************************
Copyright (c) 2016 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */
import * as common from "./client-common";
import * as application from "application";
import * as utils from "../utils";
import * as definition from "nativescript-azure-mobile-apps/client";
import { MobileServiceTable } from "nativescript-azure-mobile-apps/table";
import { MobileServiceUser } from "nativescript-azure-mobile-apps/user";

global.moduleMerge(common, exports);

let nativeAuthenticationProviders = [];
nativeAuthenticationProviders[definition.AuthenticationProvider.AzureActiveDirectory] = com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory;
nativeAuthenticationProviders[definition.AuthenticationProvider.Google] = com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider.Google;
nativeAuthenticationProviders[definition.AuthenticationProvider.Facebook] = com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider.Facebook;
nativeAuthenticationProviders[definition.AuthenticationProvider.Twitter] = com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider.Twitter;
nativeAuthenticationProviders[definition.AuthenticationProvider.Microsoft] = com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider.MicrosoftAccount;

export class MobileServiceClient extends common.MobileServiceClient {
    constructor(url: string) {
        super(url);
        this._msClient = new com.microsoft.windowsazure.mobileservices.MobileServiceClient(url, application.android.currentContext);
        this._msClient.setAndroidHttpClientFactory(new com.microsoft.windowsazure.mobileservices.http.OkHttpClientFactory({
            createOkHttpClient: () => {
                let client = new com.squareup.okhttp.OkHttpClient();
                client.setReadTimeout(20, java.util.concurrent.TimeUnit.SECONDS);
                client.setWriteTimeout(20, java.util.concurrent.TimeUnit.SECONDS);
                return client;
            }
        }));
    }
    
    public getTable(tableName: string): MobileServiceTable {
        return new MobileServiceTable(this._msClient.getTable(tableName));
    }
    
    public login(provider: definition.AuthenticationProvider): Promise<MobileServiceUser> {
        return new Promise((resolve, reject) => {
            try {
                let futureResult = this._msClient.login(nativeAuthenticationProviders[provider]);
                utils.futureToPromise(futureResult).then((result) => {
                    this.user = new MobileServiceUser(result, this._url);
                    resolve(this.user); 
                }, reject);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    
    public loginFromCache(): boolean {
        let user = MobileServiceUser.getFromCache();
        
        if (!user) {
            return false;
        }
        
        this.user = user;
        this._msClient.setCurrentUser(this.user.nativeValue);
        
        return true;
    }
}