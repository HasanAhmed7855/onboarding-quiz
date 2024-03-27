describe('The Home Page', () => {
    it('successfully loads with the correct contents', () => {
      cy.visit('http://localhost:3000')

      cy.contains("Login using GitHub").click()
      cy.get('.button').click()
      cy.get('.button').click()

      cy.get('input#login_field').type(Cypress.env("GH_USER"));
      cy.get('input#password').type(Cypress.env("GH_PASSWORD"));
      cy.get('input[type="submit"]').click();

    
    })

  })
  