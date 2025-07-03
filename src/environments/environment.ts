// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiPath: window.location.origin,
  apiPath : "http://localhost:5253/api/",//set the path 
  commonAPI: "http://111.93.61.251:8086/",
  umsURL: "http://111.93.61.253:3252",
  mfgURL: "http://111.93.61.253:9090",
  svcURL: "http://111.93.61.253:9091",
  gtmURL: "http://111.93.61.253:9092",
};


// mfgAPIURL : 'http://http://192.168.29.100:84/api/',
// mfgAPIURL : 'http://localhost:84/api/',
// mfgAPIURL : 'http://localhost:5253/api/',

// export const environment = {
//   production: false,
//   // apiPath: window.location.origin,
//   apiPath : 'http://10.101.0.225/api/',
//   commonAPI: "http://10.101.0.225:8083/",
//   umsURL: "http://10.101.0.225:3251",
//   mfgURL: "http://10.101.0.225:9090",
//   svcURL: "http://10.101.0.225:9091",
//   gtmURL: "http://10.101.0.225:9092",
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
