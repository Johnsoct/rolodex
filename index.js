const block = 'Rolodex'
const template = document.createElement('template')
template.className = block
template.innerHTML = `
<style>
.Rolodex {
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
        top: -3em;
        transition-property: opacity, position, top;
        transition-delay: 0s;
        transition-duration: 1s;
        /* transition-timing-function: ease; */
        width: inherit;
}

.Rolodex__item--below {
        top: 3em;
}

.Rolodex__item--visible {
        opacity: 1;
        position: relative;
        top: 0;
}
</style>

<!-- INSERT HTML HERE -->
<ul class="Rolodex">
        <!-- Example of inital hydration result after appendToShadowRoot() -->
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
        * (the width comes from updating the list's width after appending to the shadowRoot in appendToShadowRoot())
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

                this.exitingClass = `${block}__item--below`
                this.itemClass = `${block}__item`
                this.visibleClass = `${block}__item--visible`
                this.options = this.parseAttributes()


                this.appendToShadowRoot()

                // Must wait until the elements are appended to update the width or
                // the elements won't have values for clientWidth
                this.updateListWidth(this.shadowRoot.children[1])
        }

        appendToShadowRoot () {
                const hydratedTemplate = this.hydrate(template, this.options)
                const rolodex = this.applyOptions(hydratedTemplate, this.options)

                this.shadowRoot.append(rolodex.content.cloneNode(true))
        }

        applyOptions (template, options) {
                const list = template.content.querySelector(`.${block}`)
                const listItems = template.content.querySelectorAll(`.${this.itemClass}`)

                listItems.forEach((item) => {
                        item.style.transitionTimingFunction = options['timing-function']
                })

                return template
        }

        beginAnimation() {
                const nodes = Array.from(this.shadowRoot.querySelector(`.${block}`).children)
                
                setInterval(() => {
                        const exitedItemIndex = nodes.findIndex((child) => {
                                return child.classList.contains(this.exitingClass)
                        })
                        const visibleIndex = nodes.findIndex((child) => {
                                return child.classList.contains(this.visibleClass)
                        })
                        const nextVisibleIndex = visibleIndex === nodes.length - 1
                                ? 0
                                : visibleIndex + 1

                        // On the very first iteration; nodes[nextVisibleIndex] has visible class (buildListItems)
                        // Remove it since the setInterval has already waited 3s and begin the exiting transition
                        // Start the transition on the next node
                        if (exitedItemIndex === -1) {
                                nodes[visibleIndex].classList.remove(this.visibleClass)
                                nodes[visibleIndex].classList.add(this.exitingClass)

                                nodes[nextVisibleIndex].classList.add(this.visibleClass)
                                return
                        }

                        // Remove exit class from last exited item
                        nodes[exitedItemIndex].classList.remove(this.exitingClass)

                        // Add exit class to current active item and remove visible class
                        nodes[visibleIndex].classList.add(this.exitingClass)
                        nodes[visibleIndex].classList.remove(this.visibleClass)

                        // Add visible class to next item
                        nodes[nextVisibleIndex].classList.add(this.visibleClass)
                }, 3000)
        }

        buildListItems (options) {
                const listItems = options.options
                return listItems.map((option, index) => {
                        const liItem = document.createElement('li')

                        liItem.classList.add(`${block}__item`)

                        // Because of CSS cascading priority, use JS to hide all but the first
                        // list item, which allows the parent container to calculate width and height
                        if (index === 0) {
                                liItem.classList.add(this.visibleClass)
                        }

                        liItem.textContent = option

                        return liItem
                })
        }

        calcMaxWidth (options) {
                if (!options) {
                        console.log('Rolodex:calcMaxWidth - options is empty')
                        return
                }

                let longestOptionWidth = options[0].clientWidth

                options.forEach((option) => {
                        if (option.clientWidth > longestOptionWidth) {
                                longestOptionWidth = option.clientWidth
                        }
                })

                return longestOptionWidth
        }

        hydrate (template, options) {
                const hydratedTemplate = template
                const listItems = this.buildListItems(options)

                listItems.forEach((item) => {
                        hydratedTemplate.content.querySelector(`.${block}`).appendChild(item)
                })

                return hydratedTemplate
        }

        parseAttributes () {
                const attributes = this.attributes
                const options = this.setOptionsDefaults()

                for (let i = 0; i < attributes.length; i++) {
                        const attrName = attributes.item(i).name
                        const attrValue = attributes.item(i).value

                        try {
                                options[attrName] = JSON.parse(attrValue)
                        }
                        catch (error) {
                                console.log(`${block}: error parsing ${attrName} attribute`, error)
                        }
                }

                if (!options.options) {
                        console.error('Rolodex was not given any options to render')
                }

                return options
        }

        setOptionsDefaults () {
                return {
                        'timing-function': 'ease-in',
                }
        }

        updateListWidth (list) {
                const listItems = list.querySelectorAll(`.${this.itemClass}`)
                const listWidth = this.calcMaxWidth(listItems)

                list.style.width = `${listWidth}px`
        }

        // EVENT CALLBACKS

        // Fires when an instance was inserted into the document
        connectedCallback () {
                this.beginAnimation()
        }

        // Fires when an instance was removed from the document
        disconnectedCallback () {}

        // Fires when an attribute was added, removed, or updated
        attributeChangedCallback (attrName, oldVal, newVal) {}

        // Fires when an element is moved to a new document
        adoptedCallback () {}
}

window.customElements.define('rolodex-header', Rolodex)
