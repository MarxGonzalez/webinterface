import Raven from "raven-js";

Raven.config(
  "https://8fdbdab452f04a43b5c3f2e00ec126f7@sentry.io/295597"
).install();

export default Raven;
