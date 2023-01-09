import { CancelablePromise } from 'cancelable-promise';

export const delay = <T>(v: T, ms = 1000) => {
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    console.log(`delay v=${v} ms=${ms} started...`);
    onCancel(() => {
      console.log(`delay v=${v} ms=${ms} Canceled`);
    });
    setTimeout(() => {
      resolve(v);
    }, ms);
  });
};

// export const delay = <T>(v: T, ms = 1000) => {
//   return new Promise<T>((resolve, reject) => {
//     console.log(`delay v=${v} ms=${ms} started...`);
//
//     setTimeout(() => {
//       resolve(v);
//     }, ms);
//   });
// };
