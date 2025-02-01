// test/test.js

const request = require('supertest');

// שימוש ב‑Chai – מכיוון שגרסת Chai שברשותך היא ESM, ננסה להשתמש במאפיין default אם קיים
const chaiImported = require('chai');
const expect = (chaiImported && chaiImported.default && chaiImported.default.expect) ? chaiImported.default.expect : chaiImported.expect;

const mongoose = require('mongoose');
const app = require('../app'); // ודאי ש‑app.js נמצא במבנה CommonJS (עם require ו‑module.exports)

// ייבוא המודלים לצורך ניקוי והכנסת נתונים
const User = require('../models/User');
const Cost = require('../models/Cost');

describe('Cost Manager API Unit Tests', function () {

  // התחברות למסד הנתונים לפני כל הבדיקות
  before(function (done) {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  // ניקוי בסיס הנתונים והכנסת המשתמש המדומה לפני כל בדיקה
  beforeEach(async function () {
    await User.deleteMany({});
    await Cost.deleteMany({});

    // הכנסת המשתמש המדומה לפי הדרישה
    const testUser = new User({
      id: "123123",
      first_name: "mosh",
      last_name: "israeli",
      birthday: new Date("1990-01-01"),
      marital_status: "single"
    });
    await testUser.save();
  });

  // סגירת החיבור למסד הנתונים לאחר כל הבדיקות
  after(function (done) {
    mongoose.connection.close()
      .then(() => done())
      .catch((err) => done(err));
  });

  // בדיקה של נתיב /api/about
  describe('GET /api/about', function () {
    it('should return the team members with first_name and last_name only', function (done) {
      request(app)
        .get('/api/about')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an('array').that.is.not.empty;
          res.body.forEach(member => {
            expect(member).to.have.property('first_name');
            expect(member).to.have.property('last_name');
          });
          done();
        });
    });
  });

  // בדיקה של נתיב /api/users/:id
  describe('GET /api/users/:id', function () {
    it('should return the details of the specified user including total cost', function (done) {
      request(app)
        .get('/api/users/123123')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('id', '123123');
          expect(res.body).to.have.property('first_name', 'mosh');
          expect(res.body).to.have.property('last_name', 'israeli');
          expect(res.body).to.have.property('total');
          done();
        });
    });
  });

  // בדיקה של נתיב /api/add
  describe('POST /api/add', function () {
    it('should add a new cost item and return the created cost item', function (done) {
      const costData = {
        userid: "123123",
        description: "test cost item",
        category: "food",
        sum: 15
      };
      request(app)
        .post('/api/add')
        .send(costData)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('description', costData.description);
          expect(res.body).to.have.property('category', costData.category);
          expect(res.body).to.have.property('userid', costData.userid);
          expect(res.body).to.have.property('sum', costData.sum);
          expect(res.body).to.have.property('date');
          done();
        });
    });
  });

  // בדיקה של נתיב /api/report
  describe('GET /api/report', function () {
    it('should return a monthly report with cost items grouped by category', async function () {
      // הוספת שני פריטי עלות לדוגמא
      const cost1 = { userid: "123123", description: "cost one", category: "food", sum: 10 };
      const cost2 = { userid: "123123", description: "cost two", category: "food", sum: 20 };

      await request(app).post('/api/add').send(cost1).expect(201);
      await request(app).post('/api/add').send(cost2).expect(201);

      // בקשת דוח עבור המשתמש 123123, שנה 2025 וחודש 2
      const res = await request(app)
        .get('/api/report')
        .query({ id: "123123", year: "2025", month: "2" })
        .expect(200);

      const report = res.body;
      expect(report).to.have.property('userid', '123123');
      expect(report).to.have.property('year', 2025);
      expect(report).to.have.property('month', 2);
      expect(report).to.have.property('costs').that.is.an('array');

      // בדיקה שבקטגוריית "food" יש את שני הפריטים שהוספנו
      const foodCategory = report.costs.find(item => item.food);
      expect(foodCategory).to.exist;
      expect(foodCategory.food).to.be.an('array').with.lengthOf(2);
      // בדיקת הסכום הכולל בקטגוריית "food"
      const totalFoodCost = foodCategory.food.reduce((sum, item) => sum + item.sum, 0);
      expect(totalFoodCost).to.equal(30);
    });
  });

});

