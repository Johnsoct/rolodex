const block = 'Rolodex'
const template = document.createElement('template')
template.className = block
template.innerHTML = `
<style>
.Rolodex {
        border: 2px solid red;
        display: inline-block;
        margin: 0;
        position: relative;
}

.Rolodex__item {
        left: 0;
        list-style: none;
        opacity: 0;
        padding: 2rem;
        position: absolute;
        bottom: 0;
}

.Rolodex__item--active {
        opacity: 1;
}
</style>

<!-- INSERT HTML HERE -->
<ul class="Rolodex">
        <!-- Example of final result after render() -->
        <!-- <li class="Rolodex__item">impact</li> -->
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
                const animationClass = `${block}__item--active`
                const rolodex = this.shadowRoot.querySelector(`.${block}`)
                let activeIndex = 0
                let maxIndex = this.options.length - 1

                setInterval(() => {
                        rolodex.querySelectorAll(`.${block}__item`).forEach((item, index) => {
                                if (activeIndex === index) {
                                        item.classList.add(animationClass)
                                        return
                                }
                                item.classList.remove(animationClass)
                        })

                        if (activeIndex === maxIndex) {
                                activeIndex = 0
                        }
                        else {
                                activeIndex++
                        }
                }, 1000)
        }

        buildListItems (options) {
                return options.map((option, index) => {
                        const liItem = document.createElement('li')

                        liItem.classList.add(`${block}__item`)
                        liItem.textContent = option

                        return liItem
                })
        }

        hydrateTemplate (template, options) {
                const listItems = this.buildListItems(options)
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

window.customElements.define('rolodex-header', Rolodex)
