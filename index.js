const block = 'Rolodex'
const template = document.createElement('template')
template.className = block
template.innerHTML = `
<style>
.Rolodex {
        border: 2px dashed red;
        /* border-bottom: 3px solid purple; */
        display: inline-grid;
        margin: 0;
        padding: 2rem;
        position: relative;
        width: max-content;
}

.Rolodex__item {
        border: 1px solid orange;
        height: 0;
        list-style: none;
        /* opacity: 0; */
        transform: translateY(-5em);
        transition: height 1s linear 0s;
        transition-property: transform;
        transition-delay: 0s;
        transition-duration: 1s;
        transition-timing-function: linear;
}

/* Enable to test the default position of one of the defaultly hidden elements */
/* .Rolodex__item:nth-child(1) { */
/*         height: 1; */
/*         opacity: 1; */
/*         transform: translateY(-3.5em); */
/* } */
.Rolodex__item:nth-child(4) {
        height: 1;
        opacity: 1;
        transform: translateY(2.5em);
}

.Rolodex__item--below {
        transform: translateY(2.5em);
}

.Rolodex__item--visible {
        height: inherit;
        opacity: 1;
        transform: translateY(0);
        z-index: 2;
}
</style>

<!-- INSERT HTML HERE -->
<ul class="Rolodex">
        <!-- Example of final result after render() -->
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
        * animate first element in from the top
        * wait n seconds
        * animate first element out to the bottom
        * animate second element in from the top
        * wait n seconds
        * animate second element out to the bottom
        * animate third elemenet in from the top
        * 
        * when at last element:
        * animate last element out to the bottom
        *
        * begin()
*/

class Rolodex extends HTMLElement {
        constructor () {
                super()

                const shadowRoot = this.attachShadow({ mode: 'open' })

                this.render()
        }

        render () {
                const options = this.options
                const rolodex = this.hydrateTemplate(template, options)
                this.calcMaxWidth(options)

                this.shadowRoot.append(rolodex.content.cloneNode(true))
        }

        get options() {
                try {
                        const options = JSON.parse(this.getAttribute('options'))
                        return options
                }
                catch (error) {
                        console.log(`${block}: error parsing options attribute`, error)
                }
        }

        beginAnimation() {
                const exitingClass = `${block}__item--below`
                const nodes = this.shadowRoot.querySelector(`.${block}`).children
                const visibleClass = `${block}__item--visible`
                
                setInterval(() => {
                        const currentVisibleIndex = Array.from(nodes).findIndex((child) => {
                                return child.classList.contains(visibleClass)
                        })
                        const lastExitedIndex = Array.from(nodes).findIndex((child) => {
                                return child.classList.contains(exitingClass)
                        })

                        const nextVisibleIndex = currentVisibleIndex === nodes.length - 1
                                ? 0
                                : currentVisibleIndex + 1
                        const nextExitingIndex = currentVisibleIndex

                        // On the very first iteration; nodes[0] has visible class (buildListItems)
                        // Remove it, begin the existing transition
                        // Start the transition on the next node
                        if (lastExitedIndex === -1) {
                                nodes[currentVisibleIndex].classList.remove(visibleClass)
                                nodes[nextExitingIndex].classList.add(exitingClass)
                                nodes[nextVisibleIndex].classList.add(visibleClass)
                                return
                        }

                        // console.dir({
                        //         currentVisibleIndex,
                        //         nextVisibleIndex,
                        //         lastExitedIndex,
                        //         nextExitingIndex,
                        // })

                        // Remove visible from current visible item
                        nodes[currentVisibleIndex].classList.remove(visibleClass)

                        // Add exiting to next exiting item
                        nodes[nextExitingIndex].classList.add(exitingClass)

                        // Remove exiting from last exiting item
                        nodes[lastExitedIndex].classList.remove(exitingClass)

                        // Add visible to the next visible item
                        nodes[nextVisibleIndex].classList.add(visibleClass)
                }, 3000)
        }

        buildListItems (options) {
                return options.map((option, index) => {
                        const liItem = document.createElement('li')

                        liItem.classList.add(`${block}__item`)

                        // Because of CSS cascading priority, use JS to hide all but the first
                        // list item, which allows the parent container to calculate width and height
                        // if (index === 0) {
                        if (index === 1) {
                                liItem.classList.add(`${block}__item--visible`)
                        }

                        liItem.textContent = option

                        return liItem
                })
        }

        calcMaxWidth (options) {
                // options.forEach((option) => console.log(option))
        }

        hydrateTemplate (template, options) {
                const listItems = this.buildListItems(options)
                this.calcMaxWidth(listItems)
                const hydratedTemplate = template

                listItems.forEach((item) => {
                        hydratedTemplate.content.querySelector(`.${block}`).appendChild(item)
                })

                return hydratedTemplate
        }

        // EVENT CALLBACKS

        // Fires when an instance was inserted into the document
        connectedCallback () {
                // this.beginAnimation()
        }

        // Fires when an instance was removed from the document
        disconnectedCallback () {}

        // Fires when an attribute was added, removed, or updated
        attributeChangedCallback (attrName, oldVal, newVal) {}

        // Fires when an element is moved to a new document
        adoptedCallback () {}
}

window.customElements.define('rolodex-animation', Rolodex)
