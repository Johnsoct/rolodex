var m=Object.defineProperty;var p=(l,r,i)=>r in l?m(l,r,{enumerable:!0,configurable:!0,writable:!0,value:i}):l[r]=i;var c=(l,r,i)=>p(l,typeof r!="symbol"?r+"":r,i);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function i(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(t){if(t.ep)return;t.ep=!0;const s=i(t);fetch(t.href,s)}})();const a="Rolodex",u=document.createElement("template");u.className=a;u.innerHTML=`
<!-- INSERT CSS HERE -->
<style>
.Rolodex {
        --vertical-offset: 3em;

        /* For debugging: */
        /* border: 2px dashed red; */

        border-bottom: 3px solid red;
        box-sizing: border-box;
        display: inline-grid;
        margin: 0;
        padding: 0;
        position: relative;
}

.Rolodex__item {
        box-sizing: border-box;
        list-style: none;
        margin: 0;
        opacity: 0;
        padding: 1rem;
        position: absolute;
        text-align: center;
        top: calc(-1 * var(--vertical-offset));
        transition-property: opacity, position, top;
        transition-delay: 0s;
        transition-duration: 0.5s;
        transition-timing-function: ease;
        width: inherit;
}

.Rolodex__item--below {
        top: var(--vertical-offset);
}

.Rolodex__item--visible {
        opacity: 1;
        position: relative;
        top: 0;
}
</style>

<!-- INSERT HTML HERE -->
<ul class="Rolodex">
        <!-- Example of inital hydration result after render() -->
        <!-- <li class="Rolodex__item Rolodex__item--visible">impact</li> -->
        <!-- <li class="Rolodex__item">damage</li> -->
        <!-- <li class="Rolodex__item">surprise</li> -->
</ul>
`;class f extends HTMLElement{constructor(){super();c(this,"classes");c(this,"defaults");c(this,"mandatoryOptions");c(this,"options");const i=this.attachShadow({mode:"open"});this.classes={default:`${a}__item`,exiting:`${a}__item--below`,visible:`${a}__item--visible`},this.defaults={interval:3e3,options:[],"transition-timing-function":"ease-in","transition-duration":1},this.mandatoryOptions=["options"],this.options=this.parseAttributes(this.defaults,this.mandatoryOptions,this.attributes),this.render(u),this.updateRolodexWidth(i.children[1])}animation(){var t,s;const i=(s=(t=this.shadowRoot)==null?void 0:t.querySelector(`.${a}`))==null?void 0:s.children;if(i===void 0||!i.length)return;const e=Array.from(i);setInterval(()=>{const o=e.findIndex(h=>h.classList.contains(this.classes.exiting)),n=e.findIndex(h=>h.classList.contains(this.classes.visible)),d=n===e.length-1?0:n+1;if(o===-1){e[n].classList.remove(this.classes.visible),e[n].classList.add(this.classes.exiting),e[d].classList.add(this.classes.visible);return}e[o].classList.remove(this.classes.exiting),e[n].classList.add(this.classes.exiting),e[n].classList.remove(this.classes.visible),e[d].classList.add(this.classes.visible)},this.options.interval)}buildListItems(i){return i.options.map((t,s)=>{const o=document.createElement("li");return o.classList.add(this.classes.default),s===0&&o.classList.add(this.classes.visible),o.textContent=t,o})}calcMaxWidth(i){let e=i[0].clientWidth;return i.forEach(t=>{t.clientWidth>e&&(e=t.clientWidth)}),e}checkForIncorrectOptions(i,e){Object.hasOwn(i,e)||console.error(`${a}: attribute ${e} does not correlate to an option`)}checkMandatoryOptions(i,e){i.forEach(t=>{e[t].length||console.error(`${a} is missing the mandatory option, ${t}`)})}hydrate(i,e){const t=i,s=t.content.querySelector(`.${a}`);return this.buildListItems(e).forEach(n=>{s.appendChild(n)}),t}parseAttributes(i,e,t){const s=this.updateOptions(i,t);return this.checkMandatoryOptions(e,s),s}render(i){const e=this.hydrate(i,this.options),t=this.updateListStyles(e,this.options);this.shadowRoot?this.shadowRoot.append(t.content.cloneNode(!0)):console.error("shadowRoot is not defined at time of render()")}updateListStyles(i,e){const t=i,s=t.content.querySelector(`.${a}`);return s&&(e["transition-duration"]&&(s.style.transitionDuration=`${e["transition-duration"]}s`),e["transition-timing-function"]&&(s.style.transitionTimingFunction=e["transition-timing-function"])),t}updateOptions(i,e){const t=Object.assign(i);if(!e)return i;for(let s=0;s<e.length;s++){const o=e[s].name,n=e[s].value;this.checkForIncorrectOptions(i,o);try{n.includes("[")||n.includes("{")?t[o]=JSON.parse(n.replace(/'/g,'"')):t[o]=n}catch(d){console.log(`${a}: error parsing ${o} attribute`,d)}}return t}updateRolodexWidth(i){const e=Array.from(i.querySelectorAll(`.${this.classes.default}`));if(e.length){const t=this.calcMaxWidth(e);i.style.width=`${t}px`}}connectedCallback(){this.animation()}disconnectedCallback(){}attributeChangedCallback(){}adoptedCallback(){}}window.customElements.define("rolodex-animation",f);
