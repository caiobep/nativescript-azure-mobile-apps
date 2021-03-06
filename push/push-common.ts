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
import * as definition from "nativescript-azure-mobile-apps/push";

export abstract class MobileServicePush implements definition.MobileServicePush {
    protected _msPush;
    
    abstract get installationId(): string;

    constructor(nativeValue: any) {
        this._msPush = nativeValue;
    }     
    
    abstract register(registrationId: string): Promise<any>;
    abstract registerWithTemplate(registrationId: string, templateName: string, templateBody: string): Promise<any>;
    abstract registerWithTags(registrationId: string, tags: string[]): Promise<any>;
    abstract registerWithTagsAndTemplate(registrationId: string, tags: string[], templateName: string, templateBody: string): Promise<any>;
    abstract unregister(): Promise<any>;
    
}