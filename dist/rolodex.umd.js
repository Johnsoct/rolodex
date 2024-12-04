(function(s){typeof define=="function"&&define.amd?define(s):s()})(function(){"use strict";var m=Object.defineProperty;var u=(s,l,r)=>l in s?m(s,l,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[l]=r;var c=(s,l,r)=>u(s,typeof l!="symbol"?l+"":l,r);const s="Rolodex",l=document.createElement("template");l.className=s,l.innerHTML=`
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
`;class r extends HTMLElement{constructor(){super();c(this,"classes");c(this,"defaults");c(this,"mandatoryOptions");c(this,"options");const e=this.attachShadow({mode:"open"});this.classes={default:`${s}__item`,exiting:`${s}__item--below`,visible:`${s}__item--visible`},this.defaults={interval:3e3,options:[],"transition-timing-function":"ease-in","transition-duration":1},this.mandatoryOptions=["options"],this.options=this.parseAttributes(this.defaults,this.mandatoryOptions,this.attributes),this.render(l),this.updateRolodexWidth(e.children[1])}animation(){var i,n;const e=(n=(i=this.shadowRoot)==null?void 0:i.querySelector(`.${s}`))==null?void 0:n.children;if(e===void 0||!e.length)return;const t=Array.from(e);setInterval(()=>{const o=t.findIndex(h=>h.classList.contains(this.classes.exiting)),a=t.findIndex(h=>h.classList.contains(this.classes.visible)),d=a===t.length-1?0:a+1;if(o===-1){t[a].classList.remove(this.classes.visible),t[a].classList.add(this.classes.exiting),t[d].classList.add(this.classes.visible);return}t[o].classList.remove(this.classes.exiting),t[a].classList.add(this.classes.exiting),t[a].classList.remove(this.classes.visible),t[d].classList.add(this.classes.visible)},this.options.interval)}buildListItems(e){return e.options.map((i,n)=>{const o=document.createElement("li");return o.classList.add(this.classes.default),n===0&&o.classList.add(this.classes.visible),o.textContent=i,o})}calcMaxWidth(e){let t=e[0].clientWidth;return e.forEach(i=>{i.clientWidth>t&&(t=i.clientWidth)}),t}checkForIncorrectOptions(e,t){Object.hasOwn(e,t)||console.error(`${s}: attribute ${t} does not correlate to an option`)}checkMandatoryOptions(e,t){e.forEach(i=>{t[i].length||console.error(`${s} is missing the mandatory option, ${i}`)})}hydrate(e,t){const i=e,n=i.content.querySelector(`.${s}`);return this.buildListItems(t).forEach(a=>{n.appendChild(a)}),i}parseAttributes(e,t,i){const n=this.updateOptions(e,i);return this.checkMandatoryOptions(t,n),n}render(e){const t=this.hydrate(e,this.options),i=this.updateListStyles(t,this.options);this.shadowRoot?this.shadowRoot.append(i.content.cloneNode(!0)):console.error("shadowRoot is not defined at time of render()")}updateListStyles(e,t){const i=e,n=i.content.querySelector(`.${s}`);return n&&(t["transition-duration"]&&(n.style.transitionDuration=`${t["transition-duration"]}s`),t["transition-timing-function"]&&(n.style.transitionTimingFunction=t["transition-timing-function"])),i}updateOptions(e,t){const i=Object.assign(e);if(!t)return e;for(let n=0;n<t.length;n++){const o=t[n].name,a=t[n].value;this.checkForIncorrectOptions(e,o);try{a.includes("[")||a.includes("{")?i[o]=JSON.parse(a):i[o]=a}catch(d){console.log(`${s}: error parsing ${o} attribute`,d)}}return i}updateRolodexWidth(e){const t=Array.from(e.querySelectorAll(`.${this.classes.default}`));if(t.length){const i=this.calcMaxWidth(t);e.style.width=`${i}px`}}connectedCallback(){this.animation()}disconnectedCallback(){}attributeChangedCallback(){}adoptedCallback(){}}window.customElements.define("rolodex-animation",r)});
