import { Observable } from "rxjs";
import { combineEpics } from "redux-observable";
import _ from "lodash";
import FileSaver from "file-saver";

import downloadActions from "redux/actions/download-actions";
import Iota from "services/iota";
import Datamap from "utils/datamap";
import Encryption from "utils/encryption";
import FileProcessor from "utils/file-processor";

const initializeDownload = (action$, store) => {
  return action$
    .ofType(downloadActions.INITIALIZE_DOWNLOAD)
    .mergeMap(action => {
      const handle = action.payload;
      const genesisHash = Encryption.sha256(handle);
      const genesisHashInTrytes = Iota.utils.toTrytes(genesisHash);
      const iotaAddress = Iota.toAddress(genesisHashInTrytes);
      return Observable.fromPromise(Iota.findTransactions([iotaAddress]))
        .map(transactions => {
          if (!transactions.length) {
            throw Error("NO TRANSACTION FOUND");
          }

          const t = transactions[0];
          const {
            numberOfChunks,
            fileName
          } = FileProcessor.metaDataFromIotaFormat(
            t.signatureMessageFragment,
            handle
          );

          return downloadActions.beginDownloadAction({
            handle,
            numberOfChunks,
            fileName
          });
        })
        .catch(error => {
          console.log("DOWNLOAD ERROR: ", error);
          return Observable.empty();
        });
    });
};

const beginDownload = (action$, store) => {
  return action$.ofType(downloadActions.BEGIN_DOWNLOAD).mergeMap(action => {
    const { handle, fileName, numberOfChunks } = action.payload;
    const datamap = Datamap.generate(handle, numberOfChunks);
    const addresses = _.values(datamap).map(Iota.toAddress);
    return Observable.fromPromise(Iota.findTransactions(addresses))
      .map(transactions => {
        const contentChunks = transactions.slice(1, transactions.length);
        const chunksArrayBuffers = contentChunks.map(t => {
          return FileProcessor.chunkFromIotaFormat(
            t.signatureMessageFragment,
            handle
          );
        });

        const completeFileArrayBuffer = FileProcessor.mergeArrayBuffers(
          chunksArrayBuffers
        );
        const blob = new Blob(completeFileArrayBuffer);
        FileSaver.saveAs(blob, fileName);

        return downloadActions.downloadSuccessAction();
      })
      .catch(error => {
        console.log("DOWNLOAD ERROR: ", error);
        return Observable.empty();
      });
  });
};

export default combineEpics(initializeDownload, beginDownload);
