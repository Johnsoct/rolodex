import { html } from 'lit'

const options = {
        one: "['one']",
        two: "['one', 'two']",
        three: "['one', 'two', 'three']",
}

const rolodexHTML = (parameters) => {
        return html`<h1>Test<rolodex-animation options=${parameters.options}></rolodex-animation></h1>`
}

describe('Rolodex', () => {
        context('Render', () => {
                it('Render with one option', () => {
                        cy.mount(rolodexHTML({ options: options.one }))
                        cy
                                .get('rolodex-animation')
                                .should('exist')
                })

                it('Render with two options', () => {
                        cy.mount(rolodexHTML({ options: options.two }))
                        cy
                                .get('rolodex-animation')
                                .should('exist')
                })

                it('Render with three options', () => {
                        cy.mount(rolodexHTML({ options: options.three }))
                        cy.wait(3000)
                        cy
                                .get('rolodex-animation')
                                .should('exist')
                })
        })
})
