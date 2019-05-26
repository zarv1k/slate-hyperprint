import {Value} from 'slate';
import {HyperscriptOptions} from 'slate-hyperscript';

interface HyperprintPrettier {
  semi?: boolean; // default false
  singleQuote?: boolean; // default true
  tabWidth?: number; // default 4
}
export interface HyperprintOptions {
  preserveKeys?: boolean; // default false
  preserveData?: boolean; // default false
  strict?: boolean; // default false
  prettier?: HyperprintPrettier;
  hyperscript?: HyperscriptOptions;
}
declare function hyperprint(value: Value, options?: HyperprintOptions): string;
interface hyperprint {
  log: (value: Value, options?: HyperprintOptions) => void;
}

export default hyperprint;