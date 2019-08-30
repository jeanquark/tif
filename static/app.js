// console.log("Call to app.js");

// function abc() {
//   console.log("abc");
// }

// function urlBase64ToUint8Array(base64String) {
//   var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

//   var rawData = window.atob(base64);
//   var outputArray = new Uint8Array(rawData.length);

//   for (var i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// export { urlBase64ToUint8Array };

// var test = {
//   foo() {
//     console.log("foo");
//   },
//   bar() {
//     console.log("bar");
//   },
//   baz() {
//     console.log("baz");
//   }
// };

// // export default test;
// // module.exports = test;

// export default {};

// export default {
//   abc() {
//     console.log("abc");
//     return "abc";
//   }
// };

export default function square(x) {
  return x * x;
}
