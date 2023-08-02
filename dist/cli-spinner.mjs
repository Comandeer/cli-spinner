/*! @comandeer/cli-spinner v1.0.2 | (c) 2023 Comandeer | MIT license (see LICENSE) */
import{stderr as t}from"node:process";import{Writable as e,Duplex as r}from"node:stream";import s from"ansi-escapes";import i from"is-interactive";var n=["/","-","\\","|"];const o=s.cursorLeft+s.eraseLine;class a{stdout;label;spinner;interval;#t;#e;#r;#s;constructor({stdout:s=t,label:o="",spinner:a=n,interval:u=80}={}){if(!((h=s)instanceof e||h instanceof r))throw new TypeError("Custom stdout must be a valid writable/duplex stream");var h;if("number"!=typeof u)throw new TypeError("Custom interval must be a valid number");if("string"!=typeof o)throw new TypeError("Custom label must be a valid string");if(!function(t){return Array.isArray(t)&&t.every((t=>"string"==typeof t))}(a))throw new TypeError("Custom spinner must be a valid array of strings");this.stdout=s,this.label=o,this.spinner=a,this.interval=u,this.#t=null,this.#e=0,this.#r=!1,this.#s=i({stream:this.stdout})}async show(){if(!this.#s||this.#r)return;const t=async()=>{const e=this.#i();await this.#n(e),this.#t=setTimeout(t,this.interval)};return this.#r=!0,await this.#n(s.cursorHide),t()}async hide(){this.#r&&(this.#t&&clearTimeout(this.#t),await this.#n(o+s.cursorShow),this.#e=0,this.#r=!1)}#i(){const t=this.spinner[this.#e++%this.spinner.length];return`${o+t} ${this.label}`}#n(t){return new Promise((e=>{this.stdout.write(t,"utf8")?e():this.stdout.once("drain",e)}))}}export{a as default};
//# sourceMappingURL=cli-spinner.mjs.map
