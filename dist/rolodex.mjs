var p = Object.defineProperty;
var u = (r, l, e) => l in r ? p(r, l, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[l] = e;
var c = (r, l, e) => u(r, typeof l != "symbol" ? l + "" : l, e);
const a = "Rolodex", m = document.createElement("template");
m.className = a;
m.innerHTML = `
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
`;
class f extends HTMLElement {
  constructor() {
    super();
    c(this, "classes");
    c(this, "defaults");
    c(this, "mandatoryOptions");
    c(this, "options");
    const e = this.attachShadow({ mode: "open" });
    this.classes = {
      default: `${a}__item`,
      exiting: `${a}__item--below`,
      visible: `${a}__item--visible`
    }, this.defaults = {
      interval: 3e3,
      options: [],
      "transition-timing-function": "ease-in",
      "transition-duration": 1
    }, this.mandatoryOptions = [
      "options"
    ], this.options = this.parseAttributes(this.defaults, this.mandatoryOptions, this.attributes), this.render(m), this.updateRolodexWidth(e.children[1]);
  }
  animation() {
    var i, s;
    const e = (s = (i = this.shadowRoot) == null ? void 0 : i.querySelector(`.${a}`)) == null ? void 0 : s.children;
    if (e === void 0 || !e.length)
      return;
    const t = Array.from(e);
    setInterval(() => {
      const o = t.findIndex((h) => h.classList.contains(this.classes.exiting)), n = t.findIndex((h) => h.classList.contains(this.classes.visible)), d = n === t.length - 1 ? 0 : n + 1;
      if (o === -1) {
        t[n].classList.remove(this.classes.visible), t[n].classList.add(this.classes.exiting), t[d].classList.add(this.classes.visible);
        return;
      }
      t[o].classList.remove(this.classes.exiting), t[n].classList.add(this.classes.exiting), t[n].classList.remove(this.classes.visible), t[d].classList.add(this.classes.visible);
    }, this.options.interval);
  }
  buildListItems(e) {
    return e.options.map((i, s) => {
      const o = document.createElement("li");
      return o.classList.add(this.classes.default), s === 0 && o.classList.add(this.classes.visible), o.textContent = i, o;
    });
  }
  calcMaxWidth(e) {
    let t = e[0].clientWidth;
    return e.forEach((i) => {
      i.clientWidth > t && (t = i.clientWidth);
    }), t;
  }
  checkForIncorrectOptions(e, t) {
    Object.hasOwn(e, t) || console.error(`${a}: attribute ${t} does not correlate to an option`);
  }
  checkMandatoryOptions(e, t) {
    e.forEach((i) => {
      t[i].length || console.error(`${a} is missing the mandatory option, ${i}`);
    });
  }
  hydrate(e, t) {
    const i = e, s = i.content.querySelector(`.${a}`);
    return this.buildListItems(t).forEach((n) => {
      s.appendChild(n);
    }), i;
  }
  parseAttributes(e, t, i) {
    const s = this.updateOptions(e, i);
    return this.checkMandatoryOptions(t, s), s;
  }
  render(e) {
    const t = this.hydrate(e, this.options), i = this.updateListStyles(t, this.options);
    this.shadowRoot ? this.shadowRoot.append(i.content.cloneNode(!0)) : console.error("shadowRoot is not defined at time of render()");
  }
  updateListStyles(e, t) {
    const i = e, s = i.content.querySelector(`.${a}`);
    return s && (t["transition-duration"] && (s.style.transitionDuration = `${t["transition-duration"]}s`), t["transition-timing-function"] && (s.style.transitionTimingFunction = t["transition-timing-function"])), i;
  }
  updateOptions(e, t) {
    const i = Object.assign(e);
    if (!t)
      return e;
    for (let s = 0; s < t.length; s++) {
      const o = t[s].name, n = t[s].value;
      this.checkForIncorrectOptions(e, o);
      try {
        n.includes("[") || n.includes("{") ? i[o] = JSON.parse(n.replace(/'/g, '"')) : i[o] = n;
      } catch (d) {
        console.log(`${a}: error parsing ${o} attribute`, d);
      }
    }
    return i;
  }
  updateRolodexWidth(e) {
    const t = Array.from(e.querySelectorAll(`.${this.classes.default}`));
    if (t.length) {
      const i = this.calcMaxWidth(t);
      e.style.width = `${i}px`;
    }
  }
  // EVENT CALLBACKS
  // Fires when an instance was inserted into the document
  connectedCallback() {
    this.animation();
  }
  // Fires when an instance was removed from the document
  disconnectedCallback() {
  }
  // Fires when an attribute was added, removed, or updated
  attributeChangedCallback() {
  }
  // Fires when an element is moved to a new document
  adoptedCallback() {
  }
}
window.customElements.define("rolodex-animation", f);
