"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRequestsCreator;
function createRequestsCreator(creator) {
    return function (_a) {
        var method = _a.method, url = _a.url;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var options = args[0] || {};
            var query = 'query' in options ? options.query : {};
            var params = 'params' in options ? options.params : {};
            var body = 'body' in options ? options.body : {};
            var requestUrl = url[url.length - 1] === '/' ? url : "".concat(url, "/");
            if (typeof params === 'object') {
                for (var key in params) {
                    requestUrl = requestUrl.replace(new RegExp("/:".concat(key, "/"), 'g'), "/".concat(params[key], "/"));
                }
            }
            return creator(__assign(__assign({}, options), { url: requestUrl, method: method, query: query, body: body, params: params }));
        };
    };
}
