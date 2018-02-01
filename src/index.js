import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { ConnectedRouter } from "react-router-redux";
import { Route } from "react-router";

import { store, persistor } from "./redux";
import history from "redux/history";
import Root from "components/root";
import Header from "components/shared/header";
import DownloadForm from "components/download-form";
import DownloadStarted from "components/download-started";
import DownloadComplete from "components/download-complete";
import UploadForm from "components/upload-form";
import UploadStarted from "components/upload-started";
import UploadComplete from "components/upload-complete";
import Playground from "components/playground";
import registerServiceWorker from "./register-service-worker";

const __DEV__ = !process.env || process.env.NODE_ENV === "development";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <div>
          <Header />
          <Route exact path="/" component={Root} />
          <Route path="/download-form" component={DownloadForm} />
          <Route path="/download-started" component={DownloadStarted} />
          <Route path="/download-complete" component={DownloadComplete} />
          <Route path="/upload-form" component={UploadForm} />
          <Route path="/upload-started" component={UploadStarted} />
          {__DEV__ ? <Route path="/playground" component={Playground} /> : null}
          <Route path="/upload-complete" component={UploadComplete} />
        </div>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
