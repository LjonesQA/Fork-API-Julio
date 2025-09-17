const request = require('supertest');
const { expect } = require('chai');
const modelsUser = require('../../src/models/user');
const { faker } = require('@faker-js/faker');

const nome = faker.person.firstName();
const email = faker.internet.email();
const senha = faker.internet.password();

async function getAuthToken(page, email, password ) {
    const response = await request(page)
        .post('/api/users/login')
        .send({ email, password });
    return response.body.token;
}


describe('Teste de usuário', () => {
    describe('POST /api/users', () => {
       
        it('Deve criar um novo usuário', async () => {
            const newUser = await request('localhost:3000')
                .post('/api/users/register')
                .send({ username: nome, email: email, password: senha });
            
            expect(newUser.status).to.equal(201);            
        });
     
        
        it('logar um usuário', async () => {
            const respostaLogin = await request('localhost:3000')
                .post('/api/users/login')
                .send({ email:modelsUser[0].email, password: modelsUser[0].password });

           expect(respostaLogin.status).to.equal(200);
           expect(respostaLogin.body).to.have.property('token');                
        })

    })    

    describe('POST /api/checkout', () => {
        it('Deve fazer um checkout', async () => {
            const token = await getAuthToken('localhost:3000', modelsUser[0].email, modelsUser[0].password);
            const respostaCheckout = await request('localhost:3000')
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({ items: [{ productId: 1, quantity: 2 }]})
            ;
            
 
            expect(respostaCheckout.status).to.equal(200);
            
        })
    })
})