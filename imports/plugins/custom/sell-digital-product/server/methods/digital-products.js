import { Meteor } from "meteor/meteor";
import { DigitalProducts } from "../../lib/collections";
import { check } from "meteor/check";
import { Products } from "/lib/collections";

Meteor.methods({
  "upsertDigitalProduct"(modifier) {
    check(modifier, Object);

    console.log("GOT TO");

    if (!modifier.uploadSuccess) {
      return DigitalProducts.upsert({
        productId: modifier.productId
      }, {
        $set: {
          productId: modifier.productId,
          isDigital: modifier.isDigital
        }
      });
    } else if (modifier.uploadSuccess) {
      return DigitalProducts.upsert({
        productId: modifier.productId
      }, {
        $set: {
          productId: modifier.productId,
          productTitle: modifier.productTitle,
          isDigital: modifier.isDigital,
          fileUrl: modifier.fileUrl,
          bytes: modifier.bytes
        }
      });
    } 
  },
  "removeFromDigitalProducts"(productId) {
    check(productId, String);

    console.log("GOT TO REMOVE PRODUCT");

    return DigitalProducts.remove({
      productId: productId
    });
  }
});
