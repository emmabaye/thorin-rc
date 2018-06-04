import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import shopTour from "./shoptour";


const autoTour = () => {
  const user = Collections.Accounts.find({ userId: Meteor.userId() }).fetch();
  if (user[0].firstTourOnRegistration === false) {
    shopTour();
    Collections.Accounts.update(user[0]._id,
      { $set: { firstTourOnRegistration: true } }
    );
  }
};

export default autoTour;
