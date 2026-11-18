/**
 * Runs before the first paint (inline, first thing in <body>) and decides
 * whether this is the first visit of the browser session:
 *   html[data-loader="show"]  → play the intro
 *   html[data-loader="skip"]  → no intro
 * It also records the visit, so the intro never depends on later scripts.
 * With prefers-reduced-motion the intro is never shown. Storage errors
 * (private modes, blocked storage) simply mean no intro.
 */
export const LOADER_SESSION_KEY = 'washeej-loader';

export const LOADER_SCRIPT = `(function(){try{var d=document.documentElement,k='${LOADER_SESSION_KEY}';if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.loader='skip';return}if(sessionStorage.getItem(k)){d.dataset.loader='skip'}else{d.dataset.loader='show';sessionStorage.setItem(k,'1')}}catch(e){document.documentElement.dataset.loader='skip'}})();`;

/**
 * The script as an HTML string. It is injected with dangerouslySetInnerHTML on
 * a wrapper, so the browser runs it while parsing the server HTML, and React
 * never has to create a <script> element on the client (which it warns about).
 */
export const LOADER_SCRIPT_HTML = `<script>${LOADER_SCRIPT}</script>`;
