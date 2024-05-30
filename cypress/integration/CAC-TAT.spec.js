/// <reference types="Cypress" />

    beforeEach(() => {
        cy.visit('./src/index.html')
    });

describe('Central de Atendimento ao cliente TAT', function () {
    it('Verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })
    
    it('Preenchimento dos campos obrigatórios e envio do formulário', () => {
        const longText = 'Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando,Internet não está conectando'

        cy.get('#firstName').type('Claudenor')
        cy.get('[name=lastName]').type('Dantas')
        cy.get('.field [name=email]').type('cd@outlook.com')
        cy.get('#phone').type('1198761234')
        cy.get('.field #open-text-area') .type(longText, {delay: 0}) // seta o delay igual a 0, para melhorar a performance do teste, nn perde tempo digitando
        cy.get('button').contains('Enviar').click() // 'button[type-submit]'

        cy.get('.success').should('be.visible')
    });
    
    it('Validar mensagem de erro com email preenchido de forma inválida', () => {
        cy.get('#firstName').type('Claudenor')
        cy.get('[name=lastName]').type('Dantas')
        cy.get('.field [name=email]').type('cdoutlook.com')
        cy.get('#phone').type('1198761234')
        cy.get('.field #open-text-area') .type('Teste')
        cy.get('button').contains('Enviar').click() 
        cy.get('.error').should('be.visible')
    });
    it('Validar que campo telefone aceita apenas conteúdo numérico', () => {
        cy.get('#phone')
            .type('abcdef')
            .should('have.value', '')
    });
    it('Mensagem de erro quando telefone for obrigatório e não for preenchido', () => {
        cy.get('#firstName').type('Claudenor')
        cy.get('[name=lastName]').type('Dantas')
        cy.get('.field [name=email]').type('cd@outlook.com')
        cy.get('#phone-checkbox').check()
        cy.get('.field #open-text-area') .type('Teste')
        cy.get('button').contains('Enviar').click() 

        cy.get('.error').should('be.visible')
    });
    it('Preenche e limpa os campos', () => {
        cy.get('#firstName')
            .type('Claudenor')
            .should('have.value','Claudenor')
            .clear()
            .should('have.value','')

        cy.get('[name=lastName]')
            .type('Dantas')
            .should('have.value','Dantas')
            .clear()
            .should('have.value','')
        cy.get('.field [name=email]')
            .type('cd@outlook,com')
            .should('have.value','cd@outlook,com')
            .clear()
            .should('have.value','')

        cy.get('#phone')
            .type('1198761234')
            .should('have.value','1198761234')
            .clear()
            .should('have.value','')
    });

    it('Validar mensagem de erro ao enviar o formulário sem preenchimento dos campos obrigatórios', () => {
        cy.contains('button', 'Enviar').click() 
        cy.get('.error').should('be.visible')
    });

    it('Envia o formulário com sucesso usando comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit() // Comando customizado, configurado no arquivo commands, e importado no arquivo index.js
        cy.get('.success').should('be.visible')
    });
    it('Selecionar o produto(youtube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube') // validando o valor , por isso em letra minúscula
    });
    it('Selecionar o produto(Mentoria) por seu valor', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria') // validando o valor , por isso em letra minúscula
    });
    it('Selecionar o produto(blog) por seu índice', () => {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    });
    it('Marcar o tipo de atendimento feedback (input radio button)', () => {
        cy.get('input[type=radio][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    });
    it('Marcar e validar cada tipo de atendimento', () => {
        cy.get('input[type=radio]')
            .should('have.length', 3)
            .each(function($radio){
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    });
    it('Marcar os checkboxes, e desmarcar o último', () => {
        cy.get('input[type=checkbox]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    });
    it('Selecionar um arquivo da pasta fixtures e validar o nome do arquivo carregado', () => {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });
    it('Selecionar um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    });
    it('Seleciona um arquivo utilizando uma fixtue para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    });

    //cypress não trabalha com multi abas
    it('Verificar que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    });
    it('Acessar a página de política de privacidade removendo o target e clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    });
})