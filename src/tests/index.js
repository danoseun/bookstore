import chai from 'chai';
import fs from 'fs';
import chaiHttp from 'chai-http';
import app from '../index';
import { statusCodes } from '../utils/statuscode';
import db from '../database/models';
import { messages } from '../utils/message';
//import { dataOne, dataTwo, dataThree, dataFour } from './mock';

const { expect } = chai;


chai.use(chaiHttp);


let tokenOne;
let tokenTwo;
let tokenThree;

let bookOne;
let bookTwo;
let bookThree;
let bookFour;
let bookFive;

let unknown= 'Levitz Manna'


describe('Test for All routes', () => {

    before(async () => {
        // runs before all tests in this file regardless where this line is defined.
        const { rows } = await db.Book.findAndCountAll({});
        
        bookOne = {
            id: rows[0].id,
            slug: rows[0].slug,
            imgUrl: rows[0].imgUrl,
            quantity_chosen: 1,
            amount: rows[0].amount
        },

        bookTwo = {
            id: rows[1].id,
            slug: rows[1].slug,
            imgUrl: rows[1].imgUrl,
            quantity_chosen: 2,
            amount: rows[1].amount
        },

        bookThree = {
            id: rows[2].id,
            slug: rows[2].slug,
            imgUrl: rows[2].imgUrl,
            quantity_chosen: 1,
            amount: rows[2].amount
        }

        bookFour = rows[7].title;
        bookFive = rows[7].author;
    });

    describe('Test TO Log Users In', () => {
      it('Should return 200 status code and log user in', async () => {
        
        const res = await chai.request(app)
          .post('/api/v1/login')
          .send({
              "username":"usernameone",
              "password":"password"
          });
        expect(res.status).to.equal(statusCodes.success);
        expect(res.body).to.have.property('data');
        expect(res.body.message).to.equal(messages.success);
        tokenOne = res.body.data;
      });

      it('Should return 200 status code and log another user in', async () => {
        const res = await chai.request(app)
          .post('/api/v1/login')
          .send({
              "username":"usernametwo",
              "password":"password"
          });
        expect(res.status).to.equal(statusCodes.success);
        expect(res.body).to.have.property('data');
        expect(res.body.message).to.equal(messages.success);
        tokenTwo = res.body.data;
      });

      it('Should return 200 status code and log another user in', async () => {
        const res = await chai.request(app)
          .post('/api/v1/login')
          .send({
              "username":"usernamethree",
              "password":"password"
          });
        expect(res.status).to.equal(statusCodes.success);
        expect(res.body).to.have.property('data');
        expect(res.body.message).to.equal(messages.success);
        console.log('res', res.body.data);
        tokenThree = res.body.data;
      });

      it('Should return 401 status code and not log user with wrong details in', async () => {
        const res = await chai.request(app)
          .post('/api/v1/login')
          .send({
              "username":"unknown",
              "password":"password"
          });
        expect(res.status).to.equal(statusCodes.unauthorized);
        expect(res.body).to.have.property('error');
      });
    });

    
    describe('Test GET /books', () => {
        it('Should return status code of 200 and all books', async() => {
            const res = await chai.request(app)
          .get('/api/v1/books?page=15')
          expect(res.status).to.equal(statusCodes.success);
          expect(res.body).to.have.property('data');
        })

        it('Should return status code of 200 and return single book', async() => {
            const res = await chai.request(app)
          .get(`/api/v1/books/${bookOne.slug}`)
          expect(res.status).to.equal(statusCodes.success);
          expect(res.body).to.have.property('data');
        })

        it('Should return status code of 200 and return all featured books', async() => {
            const res = await chai.request(app)
          .get('/api/v1/featuredbooks')
          expect(res.status).to.equal(statusCodes.success);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('Array')
        })
    })

    // POST/PUT /carts
    describe('Test /carts', () => {
        it('Should return 201 and add items to cart', async () => {
            const res = await chai.request(app)
            .post('/api/v1/carts')
            .set('Authorization', `${tokenOne}`)
            .send({"cart": [bookOne, bookTwo]});
          expect(res.status).to.equal(statusCodes.success);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.a('Object')
        });

        it('Should return 403 and not add items to cart if no token is supplied', async () => {
            const res = await chai.request(app)
            .post('/api/v1/carts')
            .send({"cart": [bookOne, bookTwo]});
          expect(res.status).to.equal(statusCodes.forbidden);
          expect(res.body.error).to.equal('No token supplied')
        });

        
        it('Should return 200 and update cart', async () => {
            const res = await chai.request(app)
            .post('/api/v1/addtocart')
            .set('Authorization', `${tokenOne}`)
            .send(bookThree);
          expect(res.status).to.equal(statusCodes.success);
        });
    })
    
    // POST /ratings
    describe('Test POST /ratings', () => {
        it('Should return 201 and add items to cart', async () => {
            const res = await chai.request(app)
            .post('/api/v1/ratings')
            .set('Authorization', `${tokenOne}`)
            .send({
                rating: '3',
                slug: bookOne.slug
            });
          expect(res.status).to.equal(statusCodes.created);
          expect(res.body.data).to.be.a('Number');
        });

        it('Should return 400 and not add items to cart if rating is invalid', async () => {
            const res = await chai.request(app)
            .post('/api/v1/ratings')
            .set('Authorization', `${tokenOne}`)
            .send({
                rating: '7',
                slug: bookOne.slug
            });
          expect(res.status).to.equal(statusCodes.badRequest);
          expect(res.body.error).to.equal(messages.ratingMisnomer);
        });

        it('Should return 403 and not rate book if no token is found', async () => {
            const res = await chai.request(app)
            .post('/api/v1/ratings')
            .send({
                rating: '2',
                slug: bookOne.slug
            });
          expect(res.status).to.equal(statusCodes.forbidden);
          expect(res.body.error).to.equal(messages.noToken)
        });
    })
    
    
    // POST /reactions
    describe('Test POST /reactions', () => {
        it('Should return 201 and add reaction for book', async () => {
            const res = await chai.request(app)
            .post('/api/v1/reactions')
            .set('Authorization', `${tokenOne}`)
            .send({
                slug: bookOne.slug
            });
          expect(res.status).to.equal(statusCodes.created);
        });

        it('Should return 201 and add reaction for another book', async () => {
            const res = await chai.request(app)
            .post('/api/v1/reactions')
            .set('Authorization', `${tokenTwo}`)
            .send({
                slug: bookTwo.slug
            });
          expect(res.status).to.equal(statusCodes.created);
        });

        it('Should return 403 and not add reaction to book if no token is supplied', async () => {
            const res = await chai.request(app)
            .post('/api/v1/ratings')
            .send({
                slug: bookOne.slug
            });
          expect(res.status).to.equal(statusCodes.forbidden);
          expect(res.body.error).to.equal(messages.noToken);
        });
    })
    
    describe('Test GET /search', () => {
        it('Should return 200 if item is found', async () => {
            const res = await chai.request(app)
            .get(`/api/v1/search?title=${bookFour}`)
          expect(res.status).to.equal(statusCodes.success);
        });

        it('Should return 200 if item is found', async () => {
            const res = await chai.request(app)
            .get(`/api/v1/search?author=${bookFive}`)
          expect(res.status).to.equal(statusCodes.success);
        });

        it('Should return 404 if item is not found in search', async () => {
            const res = await chai.request(app)
            .get(`/api/v1/search?author=${unknown}`)
          expect(res.status).to.equal(statusCodes.notFound);
          expect(res.body.error).to.equal(messages.notFound);
        });
    }) 

    it('should upload image asset', async() => {
        try {
            const res = await chai.request(app)
            .post('/api/v1/uploads')
            .set('content-type', 'multipart/form-data')
            .attach('image', fs.readdirSync(`${__dirname}/`), 'assets/')
        } catch(error){
            console.log(error);
        }
        
    })
  });