import request from 'supertest'
import { Server } from '../../app'

it('admin login with correct creds', async () => {
  const res = await request(Server).post('/auth/admin/login').send({
    "email": "rajbeer@gmail.com",
    "password":"1234"
  }).expect(200)
})

it('admin login with invalid email', async () => {
  const res = await request(Server)
    .post('/auth/admin/login')
    .send({
      email: 'sd@gmail.com',
      password: '1234',
    })
    .expect(400);
});
it('admin login with invalid password', async () => {
  const res = await request(Server)
    .post('/auth/admin/login')
    .send({
      email: 'rajbeer@gmail.com',
      password: '123',
    })
    .expect(400);
});