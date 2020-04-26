import { func } from "prop-types";

describe('Note ', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const root = {
      name: 'Root User',
      username: 'root',
      password: 'slkfgjalkjqweroiu'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', root) 

    cy.visit('http://localhost:3000')
  })
  
  it('login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
  })

  describe('login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('slkfgjalkjqweroiu')
      cy.get('#login-button').click()
  
      cy.contains('logged in as Root User')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('aaa')
      cy.get('#login-button').click()
  
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'root',
        password: 'slkfgjalkjqweroiu'
      })
    })

    it('a new blog can be added', function() {
      cy.contains('add blog').click()
      cy.get('#title').type('Test Blog')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('google.com')
      cy.get('#submitBlogForm').click()

      cy.get('.error').contains('added')
      cy.contains('Test Blog')
    })

    describe('and one blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Test Blog',
          author: 'Test Author',
          url: 'google.com'
        })
      })

      it('it can be liked', function() {
        cy.contains('Test Blog')
          .contains('view')
          .click()
        
        cy.contains('Test Blog')
          .contains('like')
          .click()

        cy.contains('Test Blog')
          .contains('1 like')

        cy.should('not.contain', 'failed')
      })

      it('it can be removed by the creator', function() {
        cy.contains('Test Blog')
          .contains('view')
          .click()
        
        cy.contains('Test Blog')
          .contains('remove')
          .click()
        
        cy.should('not.contain', 'Test Blog')
      })

      it('it can not be removed by other people', function() {
        const nonroot = {
          name: 'Other People',
          username: 'nonroot',
          password: 'askdjaksjfhakjfh'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', nonroot) 

        cy.login({
          username: "nonroot",
          password: "askdjaksjfhakjfh"
        })

        cy.contains('Test Blog')
          .contains('view')
          .click()
        
        cy.contains('Test Blog')
          .contains('remove')
          .should('not.be.visible')
      })

    })

    describe('and multiple blogs exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Test Blog',
          author: 'Test Author',
          url: 'google.com',
          likes: 54
        })
        cy.createBlog({
          title: 'Another Blog',
          author: 'Another Author',
          url: 'google.com',
          likes: 21
        })
        cy.createBlog({
          title: 'Third Blog',
          author: 'Third Author',
          url: 'google.com',
          likes: 64
        })
      })

      it.only('blogs are sorted by likes', function() {
        cy.contains('Test Blog')
          .contains('view')
          .click()

        cy.contains('Another Blog')
          .contains('view')
          .click()

        cy.contains('Third Blog')
          .contains('view')
          .click()
        
        // cy.get('.blog')
        //   .then(blogs => {
        //     cy.wrap(blogs)
        //       .find('#likes')
        //       .then(likes => {
        //         cy.wrap(likes)
        //           .child()
        //         console.log(likes);
        //       })
        //   })

        let likes = []

        cy.get('.blog')
          .find('#likes')
          .each(span => likes.push(Number(span.text())))
        
        cy.wrap(likes)
          .should('equal', likes.sort((a, b) => b - a))
      })

      
    })
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password,
  }).then(response => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
    cy.visit('http://localhost:3000')
  })
})