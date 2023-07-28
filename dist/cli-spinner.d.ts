/// <reference types="node" />
import { Duplex, Writable } from 'node:stream';

interface SpinnerOptions {
    stdout?: Duplex | Writable;
    label?: string;
    spinner?: Array<string>;
    interval?: number;
}
declare class Spinner {
    #private;
    stdout: Duplex | Writable;
    label: string;
    spinner: Array<string>;
    interval: number;
    constructor({ stdout, label, spinner, interval }?: SpinnerOptions);
    show(): Promise<void>;
    hide(): Promise<void>;
}

export { Spinner as default };
