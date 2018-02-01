import IOTA from "iota.lib.js";
import _ from "lodash";
import { IOTA_API } from "config";

const Iota = new IOTA({
  provider: IOTA_API.PROVIDER
});

const toAddress = string => string.substr(0, IOTA_API.ADDRESS_LENGTH);

const parseMessage = message => {
  var splitString = message.split("");
  var reverseArray = splitString.reverse();

  var notNineIndex = reverseArray.findIndex(function(element) {
    return element != 9;
  });

  reverseArray = reverseArray.slice(notNineIndex, reverseArray.length);

  var newArray = reverseArray.reverse();

  var joined = newArray.join("");

  const evenChars = joined.length % 2 === 0 ? joined : joined + "9";

  return Iota.utils.fromTrytes(evenChars);
};

const checkUploadPercentage = addresses =>
  new Promise((resolve, reject) => {
    Iota.api.findTransactionObjects(
      { addresses },
      (error, transactionObjects) => {
        if (error) {
          console.log("IOTA ERROR: ", error);
        }
        const settledTransactions = transactionObjects || [];
        const uniqTransactions = _.uniqBy(settledTransactions, "address");
        const percentage = uniqTransactions.length / addresses.length * 100;
        resolve(percentage);
      }
    );
  });

const findTransactions = addresses =>
  new Promise((resolve, reject) => {
    Iota.api.findTransactionObjects(
      { addresses },
      (error, transactionObjects) => {
        if (error) {
          console.log("IOTA ERROR: ", error);
        }
        const settledTransactions = transactionObjects || [];
        const uniqTransactions = _.uniqBy(settledTransactions, "address");

        console.log("IOTA TRANSACTIONS FOUND: ", uniqTransactions);
        if (uniqTransactions.length === addresses.length) {
          resolve(uniqTransactions);
        } else {
          reject();
        }
      }
    );
  });

export default {
  toAddress,
  parseMessage,
  checkUploadPercentage,
  findTransactions,
  utils: Iota.utils
};
