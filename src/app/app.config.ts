import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface AppConfig {
    apiBase: string;
}

export const BaseAppConfig:AppConfig = {
    apiBase: "http://35.164.151.13:9082/api"
};