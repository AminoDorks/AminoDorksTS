import { Safe } from '../private';

export interface APIManager {
    endpoint: Safe<string>;
};