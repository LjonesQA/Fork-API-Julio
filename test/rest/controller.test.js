const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const app = require('../../rest/app');
const userlogin = require('../../rest/controllers/userController');
const modelsUser = require('../../src/models/user');


describe('Teste de usuário', () => {
    describe('POST /api/users', () => {
       
        it('Deve criar um novo usuário', async () => {
            const newUserMock = sinon.stub(userlogin, 'register')
            newUserMock.returns({
                username: 'lucas',
                password: 'senha123',
                email: 'lucas@mock.com'
            })
           const result = newUserMock()

            expect(result).to.have.property('username', 'lucas')
            expect(result).to.have.property('email', 'lucas@mock.com')


            newUserMock.restore()
        });
     
        
        it('logar um usuário', async () => {
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({ email:modelsUser[0].email, password: modelsUser[0].password });

        
           expect(respostaLogin.status).to.equal(200);
           expect(respostaLogin.body).to.have.property('token');                
        })



    })
})