describe('The Home Page', () => {
    it('successfully loads with the correct contents', () => {
      cy.visit('/')

      cy.contains('h1', 'Onboarding Quiz Manager')
      cy.contains('a', 'Register')
      cy.contains('a', 'Login')
    })
  })
  
  