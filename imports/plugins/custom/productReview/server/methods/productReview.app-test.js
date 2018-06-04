import { Meteor } from "meteor/meteor";
import { expect } from "meteor/practicalmeteor:chai";

const productName = "and-shoe";
const userEmail = "toy";
const review = "i love the shoe";
const rating = 5;

describe("productReview", () => {
  it("save ratings and reviews for a product", () => {
    Meteor.call("review/create", rating, review, userEmail, productName,
      (err, payload) => {
        expect(payload).to.equal(typeof "string");
      });
  });

  it("should get ratings and review for product", () => {
    Meteor.call("review/create", productName,
      (error, payload) => {
        expect(payload[0].productName).to.equal(productName);
        expect(payload[0].userEmail).to.equal(userEmail);
        expect(payload[0].review).to.equal(review);
        expect(payload[0].rating).to.equal(rating);
      }
    );
  });

  it("should get average rating for product", () => {
    Meteor.call("reviews/average", productName,
      (error, payload) => {
        expect(payload).to.equal(5);
      }
    );
  });

  it("should get ratings and review for product", () => {
    Meteor.call("reviews/average", productName,
      (error, payload) => {
        expect(payload).to.equal(5);
      }
    );
  });
});


