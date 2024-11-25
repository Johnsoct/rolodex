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
        top: -4em;
        transition-property: opacity, position, top;
        transition-delay: 0s;
        transition-duration: 1s;
        transition-timing-function: linear;
        width: inherit;
}

.Rolodex__item--below {
        top: 4em;
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

                this.render()
        }

        render () {
                const rolodex = this.hydrateTemplate(template, this.options)

                this.shadowRoot.append(rolodex.content.cloneNode(true))

                // Must wait until the elements are appended to update the width or
                // the elements won't have values for clientWidth
                this.updateListWidth(this.shadowRoot.children[1])
        }

        get options() {
                try {
                        return JSON.parse(this.getAttribute('options'))
                }
                catch (error) {
                        console.log(`${block}: error parsing options attribute`, error)
                }
        }

        beginAnimation() {
                const nodes = Array.from(this.shadowRoot.querySelector(`.${block}`).children)
                const exitingClass = `${block}__item--below`
                const visibleClass = `${block}__item--visible`
                
                setInterval(() => {
                        const exitedItemIndex = nodes.findIndex((child) => {
                                return child.classList.contains(exitingClass)
                        })
                        const visibleIndex = nodes.findIndex((child) => {
                                return child.classList.contains(visibleClass)
                        })
                        const nextVisibleIndex = visibleIndex === nodes.length - 1
                                ? 0
                                : visibleIndex + 1

                        // On the very first iteration; nodes[nextVisibleIndex] has visible class (buildListItems)
                        // Remove it since the setInterval has already waited 3s and begin the exiting transition
                        // Start the transition on the next node
                        if (exitedItemIndex === -1) {
                                nodes[visibleIndex].classList.remove(visibleClass)
                                nodes[visibleIndex].classList.add(exitingClass)

                                nodes[nextVisibleIndex].classList.add(visibleClass)
                                return
                        }

                        // Remove exit class from last exited item
                        nodes[exitedItemIndex].classList.remove(exitingClass)

                        // Add exit class to current active item and remove visible class
                        nodes[visibleIndex].classList.add(exitingClass)
                        nodes[visibleIndex].classList.remove(visibleClass)

                        // Add visible class to next item
                        nodes[nextVisibleIndex].classList.add(visibleClass)
                }, 3000)
        }

        buildListItems (options) {
                return options.map((option, index) => {
                        const liItem = document.createElement('li')

                        liItem.classList.add(`${block}__item`)

                        // Because of CSS cascading priority, use JS to hide all but the first
                        // list item, which allows the parent container to calculate width and height
                        if (index === 0) {
                                liItem.classList.add(`${block}__item--visible`)
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

        hydrateTemplate (template, options) {
                const hydratedTemplate = template
                const listItems = this.buildListItems(options)

                listItems.forEach((item) => {
                        hydratedTemplate.content.querySelector(`.${block}`).appendChild(item)
                })

                return hydratedTemplate
        }

        updateListWidth (list) {
                const listItems = list.querySelectorAll(`.${block}__item`)
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
