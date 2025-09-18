const request = require('supertest');
const { expect } = require('chai');
const external = 'http://localhost:4000';
const modelsUser = require('../../src/models/user');
const { faker } = require('@faker-js/faker');
const nometest = faker.person.firstName();
const emailtest = faker.internet.email();
const senhatest = faker.internet.password();



async function getAuthToken(username = modelsUser[0].name, password = modelsUser[0].password) {
  const query = {
    query: `mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    token\n  }\n}`,
    variables: { username, password }
  };
  const res = await request(external) // Aqui colocamos a url da aplicação que está rodando externamente
    .post('/graphql')
    .send(query);
  return res.body.data.login.token;
}

describe('Teste de usuário', () => {
  describe('Mutation', () => {
    it('Deve criar um novo usuário', async () => {
    const mutation = {
      query: `
        mutation Register {
          register(name: "${nometest}", email: "${emailtest}", password: "${senhatest}") {
            email
            name
          }
        }`
    };

    const newUser = await request(external) // external = URL da sua API
      .post('/graphql')
      .send(mutation);
   
    expect(newUser.body.data.register).to.include({
      email: emailtest,
      name: nometest
    });
  });

    it('Criar um usuario com email que ja existe', async () => {
     const mutation = {
      query: `
        mutation Register {
          register(name: "${nometest}", email: "${modelsUser[1].email}", password: "${senhatest}") {
            email
            name
          }
        }`
      
      };
      
      const failUser = await request(external) // external = URL da sua API
        .post('/graphql')
        .send(mutation);   
      expect(failUser.body).to.have.property('errors');
      expect(failUser.body.errors[0].message).to.equal('Email já cadastrado');
    })  
    
    
  })
})