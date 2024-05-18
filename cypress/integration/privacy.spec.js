it('Testando a página de política de privacidade de forma independente(NOME DA ABA)', () => {
    cy.visit('./src/privacy.html')
    cy.contains('Talking About Testing').should('be.visible')
});

//it.only( 'Acessar o google e realizar pesquisa', () => {
    //cy.visit('https://google.com/')
//});