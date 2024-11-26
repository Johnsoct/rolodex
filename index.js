const block = 'Rolodex'
const template = document.createElement('template')
template.className = block
template.innerHTML = `
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
`

/*
        * Within a "view" window (div container),
        * hide list elements
        *
        * begin():
        * 
        * First element is statically rendered in place, which gives the parent container height
        * (the width comes from updating the list's width after appending to the shadowRoot in render())
        *
        * wait n seconds
        *
        * Exit first element (visible item)
        * Enter second element (next visible item)
        *
        * wait n seconds
        *
        * Exit second element (visible item)
        * Enter third element (next visible item)
        *
        * wait n seconds
        * 
        * repeat eventually moving back to the front of the list
*/

class Rolodex extends HTMLElement {
        constructor () {
                super()

                const shadowRoot = this.attachShadow({ mode: 'open' })

                this.classes = {
                        default: `${block}__item`,
                        exiting: `${block}__item--below`,
                        visible: `${block}__item--visible`,
                }
                this.defaults = {
                        interval: 3000,
                        options: [],
                        'transition-timing-function': 'ease-in',
                        'transition-duration': 1,
                }
                this.mandatoryOptions = [
                        'options',
                ]
                this.options = this.parseAttributes(this.defaults, this.mandatoryOptions, this.attributes)

                this.render()

                // Must wait until the elements are appended to update the width or
                // the elements won't have values for clientWidth
                this.updateRolodexWidth(this.shadowRoot.children[1])
        }

        animate() {
                const nodes = Array.from(this.shadowRoot.querySelector(`.${block}`).children)
                
                setInterval(() => {
                        const exitedItemIndex = nodes.findIndex((child) => {
                                return child.classList.contains(this.classes.exiting)
                        })
                        const visibleIndex = nodes.findIndex((child) => {
                                return child.classList.contains(this.classes.visible)
                        })
                        const nextVisibleIndex = visibleIndex === nodes.length - 1
                                ? 0
                                : visibleIndex + 1

                        // On the very first iteration; nodes[nextVisibleIndex] has visible class (buildListItems)
                        // Remove it since the setInterval has already waited 3s and begin the exiting transition
                        // Start the transition on the next node
                        if (exitedItemIndex === -1) {
                                nodes[visibleIndex].classList.remove(this.classes.visible)
                                nodes[visibleIndex].classList.add(this.classes.exiting)

                                nodes[nextVisibleIndex].classList.add(this.classes.visible)
                                return
                        }

                        // Remove exit class from last exited item
                        nodes[exitedItemIndex].classList.remove(this.classes.exiting)

                        // Add exit class to current active item and remove visible class
                        nodes[visibleIndex].classList.add(this.classes.exiting)
                        nodes[visibleIndex].classList.remove(this.classes.visible)

                        // Add visible class to next item
                        nodes[nextVisibleIndex].classList.add(this.classes.visible)
                }, this.options.interval)
        }

        buildListItems (options) {
                const listItems = options.options

                return listItems.map((option, index) => {
                        const item = document.createElement('li')

                        item.classList.add(this.classes.default)

                        // Because of CSS cascading priority, use CSS to hide all but JS to show the first
                        // list item, which allows the parent container to calculate width
                        if (index === 0) {
                                item.classList.add(this.classes.visible)
                        }

                        item.textContent = option

                        return item
                })
        }

        calcMaxWidth (options) {
                let longestOptionWidth = options[0].clientWidth

                options.forEach((option) => {
                        if (option.clientWidth > longestOptionWidth) {
                                longestOptionWidth = option.clientWidth
                        }
                })

                return longestOptionWidth
        }

        checkForIncorrectOptions (defaults, key) {
                if (!Object.hasOwn(defaults, key)) {
                        console.error(`${block}: attribute ${key} does not correlate to an option`)
                }
        }

        checkMandatoryOptions (mandatoryOptions, options) {
                mandatoryOptions.forEach((option) => {
                        if (!options[option]) {
                                console.error(`${block} is missing the mandatory option, ${option}`)
                        }
                })
        }

        hydrate (template, options) {
                const hydratedTemplate = template
                const list = hydratedTemplate.content.querySelector(`.${block}`)
                const listItems = this.buildListItems(options)

                listItems.forEach((item) => {
                        list.appendChild(item)
                })

                return hydratedTemplate
        }

        parseAttributes (defaults, mandatoryOptions, attributes) {
                const options = this.updateOptions(defaults, attributes)

                this.checkMandatoryOptions(mandatoryOptions, options)

                return options
        }

        render () {
                const hydratedTemplate = this.hydrate(template, this.options)
                const rolodex = this.updateListStyles(hydratedTemplate, this.options)

                this.shadowRoot.append(rolodex.content.cloneNode(true))
        }

        updateListStyles (template, options) {
                const temp = template
                const list = temp.content.querySelector(`.${block}`)

                list.style.transitionDuration = `${options['transition-duration']}s`
                list.style.transitionTimingFunction = options['transition-timing-function']

                return temp
        }

        updateOptions (options, attributes) {
                const temp = Object.assign(options)

                for (let i = 0; i < attributes.length; i++) {
                        const key = attributes.item(i).name
                        const value = attributes.item(i).value

                        this.checkForIncorrectOptions(options, key)

                        try {
                                // Parse objects into JSON
                                if (value.includes('[') || value.includes('{')) {
                                        temp[key] = JSON.parse(value)
                                }
                                // Let strings be strings...
                                else {
                                        temp[key] = value
                                }
                        }
                        catch (error) {
                                console.log(`${block}: error parsing ${key} attribute`, error)
                        }
                }

                return temp
        }

        updateRolodexWidth (list) {
                const listItems = list.querySelectorAll(`.${this.classes.default}`)
                const listWidth = this.calcMaxWidth(listItems)

                list.style.width = `${listWidth}px`
        }

        // EVENT CALLBACKS

        // Fires when an instance was inserted into the document
        connectedCallback () {
                this.animate()
        }

        // Fires when an instance was removed from the document
        disconnectedCallback () {}

        // Fires when an attribute was added, removed, or updated
        attributeChangedCallback (attrName, oldVal, newVal) {}

        // Fires when an element is moved to a new document
        adoptedCallback () {}
}

window.customElements.define('rolodex-header', Rolodex)
