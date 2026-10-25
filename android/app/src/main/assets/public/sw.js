/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "c7cda24c2f024d35063c52af7d756530"
  }, {
    "url": "pwa-512x512.png",
    "revision": "c7cda24c2f024d35063c52af7d756530"
  }, {
    "url": "pwa-192x192.png",
    "revision": "bf5910a48530535a0128ef76a4d6d619"
  }, {
    "url": "index.html",
    "revision": "fb1c90019eb42ecaa7d6c4fbb7f45109"
  }, {
    "url": "icon.svg",
    "revision": "053fcf5c05fdd379da9966ad4858f8a1"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "bf5910a48530535a0128ef76a4d6d619"
  }, {
    "url": "fonts/NotoSansArabic-Regular.ttf",
    "revision": "922866973771a260b7bef7f5d4cd10e4"
  }, {
    "url": "fonts/NotoSansArabic-Bold.ttf",
    "revision": "3d510cf00851ee385745c631aa3aa89b"
  }, {
    "url": "assets/index-KvEo3M7H.css",
    "revision": null
  }, {
    "url": "assets/index-Bnefx2Yb.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "bf5910a48530535a0128ef76a4d6d619"
  }, {
    "url": "icon.svg",
    "revision": "053fcf5c05fdd379da9966ad4858f8a1"
  }, {
    "url": "pwa-192x192.png",
    "revision": "bf5910a48530535a0128ef76a4d6d619"
  }, {
    "url": "pwa-512x512.png",
    "revision": "c7cda24c2f024d35063c52af7d756530"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "c7cda24c2f024d35063c52af7d756530"
  }, {
    "url": "fonts/NotoSansArabic-Bold.ttf",
    "revision": "3d510cf00851ee385745c631aa3aa89b"
  }, {
    "url": "fonts/NotoSansArabic-Regular.ttf",
    "revision": "922866973771a260b7bef7f5d4cd10e4"
  }, {
    "url": "manifest.webmanifest",
    "revision": "1d789c17103b422303d2712b60e47562"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
