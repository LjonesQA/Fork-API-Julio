const request = require('supertest');
const { expect } = require('chai');
const external = 'http://localhost:4000';
const modelsUser = require('../../src/models/user');
const { faker } = require('@faker-js/faker');
const nometest = faker.person.firstName();
const emailtest = faker.internet.email();
const senhatest = faker.internet.password();



async function getAuthToken(email = modelsUser[0].email, password = modelsUser[0].password) {
  const query = {
    query: `mutation Login($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n  }\n}`,
    variables: { email, password }
  };
  const res = await request(external) 
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

    const newUser = await request(external) 
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
      
      const failUser = await request(external) 
        .post('/graphql')
        .send(mutation);   
      expect(failUser.body).to.have.property('errors');
      expect(failUser.body.errors[0].message).to.equal('Email já cadastrado');
    })  
    
    it('finalizar um checkout-boleto ', async () => {
      const token = await getAuthToken();
      const mutation = {
      query: `
        mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!) {
          checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod) {
            paymentMethod
          }
        }
      `,
      variables: {
        items: [{ productId: 2, quantity: 1 }],
        freight: 15,
        paymentMethod: "boleto"
      }
    };

      const respostaCheckout = await request(external) 
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send(mutation);

      expect(respostaCheckout.body.data.checkout).to.include({ paymentMethod: 'boleto' });
      
    })

    
    
  })
})