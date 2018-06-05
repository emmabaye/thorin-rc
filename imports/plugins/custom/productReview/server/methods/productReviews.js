import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Reviews } from "../../lib/collections";

Meteor.methods({
  "review/create"(rating, review, userEmail, productName) {
    check(rating, Number);
    check(review, String);
    check(userEmail, String);
    check(productName, String);

    const reviews = Reviews.insert({
      rating,
      review,
      userEmail,
      productName,
      createdAt: new Date()
    });
    return reviews;
  },
  "reviews/average"(productName) {
    check(productName, String);
    const result = Reviews.aggregate([
      {
        $match: {
          productName
        }
      },
      {
        $group: {
          _id: "$productName",
          averageRate: { $avg: "$rating" }
        }
      }
    ]);
    return result[0].averageRate;
  }
});
