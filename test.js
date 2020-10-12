function require(e, t, r) {
  var n = require.resolve(e);
  if (null == n) {
    (r = r || e), (t = t || "root");
    var i = new Error('Failed to require "' + r + '" from "' + t + '"');
    throw ((i.path = r), (i.parent = t), (i.require = !0), i);
  }
  var s = require.modules[n];
  if (!s._resolving && !s.exports) {
    var o = {};
    (o.exports = {}),
      (o.client = o.component = !0),
      (s._resolving = !0),
      s.call(this, o.exports, require.relative(n), o),
      delete s._resolving,
      (s.exports = o.exports);
  }
  return s.exports;
}
(require.modules = {}),
  (require.aliases = {}),
  (require.resolve = function (e) {
    "/" === e.charAt(0) && (e = e.slice(1));
    for (
      var t = [e, e + ".js", e + ".json", e + "/index.js", e + "/index.json"],
        r = 0;
      r < t.length;
      r++
    ) {
      var e = t[r];
      if (require.modules.hasOwnProperty(e)) return e;
      if (require.aliases.hasOwnProperty(e)) return require.aliases[e];
    }
  }),
  (require.normalize = function (e, t) {
    var r = [];
    if ("." != t.charAt(0)) return t;
    (e = e.split("/")), (t = t.split("/"));
    for (var n = 0; n < t.length; ++n)
      ".." == t[n] ? e.pop() : "." != t[n] && "" != t[n] && r.push(t[n]);
    return e.concat(r).join("/");
  }),
  (require.register = function (e, t) {
    require.modules[e] = t;
  }),
  (require.alias = function (e, t) {
    if (!require.modules.hasOwnProperty(e))
      throw new Error('Failed to alias "' + e + '", it does not exist');
    require.aliases[t] = e;
  }),
  (require.relative = function (e) {
    function t(e, t) {
      for (var r = e.length; r--; ) if (e[r] === t) return r;
      return -1;
    }
    function r(t) {
      var n = r.resolve(t);
      return require(n, e, t);
    }
    var n = require.normalize(e, "..");
    return (
      (r.resolve = function (r) {
        var i = r.charAt(0);
        if ("/" == i) return r.slice(1);
        if ("." == i) return require.normalize(n, r);
        var s = e.split("/"),
          o = t(s, "deps") + 1;
        return o || (o = 0), (r = s.slice(0, o + 1).join("/") + "/deps/" + r);
      }),
      (r.exists = function (e) {
        return require.modules.hasOwnProperty(r.resolve(e));
      }),
      r
    );
  }),
  require.register("component-trim/index.js", function (e, t, r) {
    function n(e) {
      return e.trim ? e.trim() : e.replace(/^\s*|\s*$/g, "");
    }
    (e = r.exports = n),
      (e.left = function (e) {
        return e.trimLeft ? e.trimLeft() : e.replace(/^\s*/, "");
      }),
      (e.right = function (e) {
        return e.trimRight ? e.trimRight() : e.replace(/\s*$/, "");
      });
  }),
  require.register("component-type/index.js", function (e, t, r) {
    var n = Object.prototype.toString;
    r.exports = function (e) {
      switch (n.call(e)) {
        case "[object Date]":
          return "date";
        case "[object RegExp]":
          return "regexp";
        case "[object Arguments]":
          return "arguments";
        case "[object Array]":
          return "array";
        case "[object Error]":
          return "error";
      }
      return null === e
        ? "null"
        : void 0 === e
        ? "undefined"
        : e !== e
        ? "nan"
        : e && 1 === e.nodeType
        ? "element"
        : ((e = e.valueOf ? e.valueOf() : Object.prototype.valueOf.apply(e)),
          typeof e);
    };
  }),
  require.register("component-querystring/index.js", function (e, t, r) {
    var n = encodeURIComponent,
      i = decodeURIComponent,
      s = t("trim"),
      o = t("type");
    (e.parse = function (e) {
      if ("string" != typeof e) return {};
      if (((e = s(e)), "" == e)) return {};
      "?" == e.charAt(0) && (e = e.slice(1));
      for (var t = {}, r = e.split("&"), n = 0; n < r.length; n++) {
        var o,
          a = r[n].split("="),
          u = i(a[0]);
        (o = /(\w+)\[(\d+)\]/.exec(u))
          ? ((t[o[1]] = t[o[1]] || []), (t[o[1]][o[2]] = i(a[1])))
          : (t[a[0]] = null == a[1] ? "" : i(a[1]));
      }
      return t;
    }),
      (e.stringify = function (e) {
        if (!e) return "";
        var t = [];
        for (var r in e) {
          var i = e[r];
          if ("array" != o(i)) t.push(n(r) + "=" + n(e[r]));
          else
            for (var s = 0; s < i.length; ++s)
              t.push(n(r + "[" + s + "]") + "=" + n(i[s]));
        }
        return t.join("&");
      });
  }),
  require.register("ddict-translate-google/index.js", function (
    exports,
    require,
    module
  ) {
    function translate(e, t, r, n) {
      (e = e || "auto"), (t = t || "en"), debug("#translate");
      var i = {
        client: "gtx",
        sl: e,
        tl: t,
        hl: t,
        dj: 1,
        ie: "UTF-8",
        oe: "UTF-8",
      };
      r.length <= 200 && (i.q = r),
        (i = qs.stringify(i)),
        (i = "?" + i + "&dt=bd&dt=ld&dt=qc&dt=rm&dt=t"),
        (i += complete(r));
      var s = {
        url: "https://translate.googleapis.com/translate_a/single" + i,
        json: !0,
      };
      r.length > 200 && ((s.method = "POST"), (s.form = { q: r })),
        debug("#translate request data", s),
        request(s, function (i, s, o) {
          if (403 == s.statusCode || null == TKK)
            return void getTKK(function (s) {
              return s ? translate(e, t, r, n) : ((TKK = null), n(i));
            });
          if (i) return debug("#translate error", i), n(i);
          if (200 != s.statusCode)
            return debug("#translate status code != 200", s), n(s);
          debug("#translate success");
          var a = _handleData(o);
          return (
            (a.audio = getAudioUrl(r, o.src)),
            (a.to = t),
            (a.src = "google"),
            (a.from_word = r),
            r !== r.toLowerCase() && a.sentence && a.sentence[0] === r
              ? translate(e, t, r.toLowerCase(), n)
              : n(null, a)
          );
        });
    }
    function _handleData(e) {
      var t = {};
      return (
        (t.from = e.src),
        (t.translit = e.sentences[1] && e.sentences[1].src_translit),
        (t.spell = e.spell && e.spell.spell_res),
        e.dict &&
          (t.dict = e.dict.map(function (e) {
            return (e.terms = e.terms.join(", ")), e;
          })),
        e.sentences &&
          (t.sentence = e.sentences
            .map(function (e) {
              return e.trans;
            })
            .join("")
            .split("\n")),
        t
      );
    }
    function getAudioUrl(e, t) {
      if ((debug("#getAudioUrl"), e.length > 100))
        return debug("#getAudioUrl false", e.length), !1;
      var r = { ie: "UTF-8", client: "gtx", q: e, tl: t };
      return (
        debug("#getAudioUrl success"),
        "https://translate.google.com/translate_tts?" +
          qs.stringify(r) +
          complete(e)
      );
    }
    function getTKK(callback) {
      request({ url: "https://translate.google.com/m/translate" }, function (
        err,
        res,
        body
      ) {
        if (err) return debug("#getTKK error", err), callback(!1);
        if (200 != res.statusCode)
          return debug("#getTKK status code != 200", res), callback(!1);
        var tkkFuncStr = between(body, "tkk:'", "',")
          .replace("\\x3d", "=")
          .replace("\\x3d", "=")
          .replace("\\x27", "'")
          .replace("\\x27", "'");
        return (TKK = eval(tkkFuncStr)), callback(!0);
      });
    }
    function complete(e) {
      var t,
        r = function (e) {
          return function () {
            return e;
          };
        },
        n = function (e, t) {
          for (var r = 0; r < t.length - 2; r += 3) {
            var n = t.charAt(r + 2),
              n = n >= "a" ? n.charCodeAt(0) - 87 : Number(n),
              n = "+" == t.charAt(r + 1) ? e >>> n : e << n;
            e = "+" == t.charAt(r) ? (e + n) & 4294967295 : e ^ n;
          }
          return e;
        },
        i = TKK;
      if (null !== i) t = i;
      else {
        t = r(String.fromCharCode(84));
        var s = r(String.fromCharCode(75));
        (t = [t(), t()]),
          (t[1] = s()),
          (t = (i = window[t.join(s())] || "") || "");
      }
      var o = r(String.fromCharCode(116)),
        s = r(String.fromCharCode(107)),
        o = [o(), o()];
      (o[1] = s()),
        (s = "&" + o.join("") + "="),
        (t = t ? t.toString() : ""),
        (o = t.split(".")),
        (t = Number(o[0]) || 0);
      for (var a = [], u = 0, c = 0; c < e.length; c++) {
        var l = e.charCodeAt(c);
        128 > l
          ? (a[u++] = l)
          : (2048 > l
              ? (a[u++] = (l >> 6) | 192)
              : (55296 == (64512 & l) &&
                c + 1 < e.length &&
                56320 == (64512 & e.charCodeAt(c + 1))
                  ? ((l =
                      65536 + ((1023 & l) << 10) + (1023 & e.charCodeAt(++c))),
                    (a[u++] = (l >> 18) | 240),
                    (a[u++] = ((l >> 12) & 63) | 128))
                  : (a[u++] = (l >> 12) | 224),
                (a[u++] = ((l >> 6) & 63) | 128)),
            (a[u++] = (63 & l) | 128));
      }
      for (e = t, u = 0; u < a.length; u++) (e += a[u]), (e = n(e, "+-a^+6"));
      return (
        (e = n(e, "+-3^+b+-f")),
        (e ^= Number(o[1]) || 0),
        0 > e && (e = (2147483647 & e) + 2147483648),
        (e %= 1e6),
        s + (e.toString() + "." + (e ^ t))
      );
    }
    function between(e, t, r) {
      var n = e.indexOf(t);
      if (-1 === n) return !1;
      n += t.length;
      var i = e.slice(n).indexOf(r);
      return -1 === i ? !1 : e.slice(n, n + i);
    }
    var qs = require("querystring"),
      request = require("request"),
      debug = require("debug")("google-translate");
    exports.translate = translate;
  }),
  require.register("ddo-browser-request/index.js", function (e, t, r) {
    function n(e, t) {
      if ("function" != typeof t) throw new Error("Bad callback given: " + t);
      if (!e) throw new Error("No options given");
      var r = e.onResponse;
      if (
        ((e =
          "string" == typeof e ? { uri: e } : JSON.parse(JSON.stringify(e))),
        (e.onResponse = r),
        e.verbose && (n.log = o()),
        e.url && ((e.uri = e.url), delete e.url),
        !e.uri && "" !== e.uri)
      )
        throw new Error("options.uri is a required argument");
      if ("string" != typeof e.uri)
        throw new Error("options.uri must be a string");
      for (
        var a = [
            "proxy",
            "_redirectsFollowed",
            "maxRedirects",
            "followRedirect",
          ],
          u = 0;
        u < a.length;
        u++
      )
        if (e[a[u]]) throw new Error("options." + a[u] + " is not supported");
      if (
        ((e.callback = t),
        (e.method = e.method || "GET"),
        (e.headers = e.headers || {}),
        (e.body = e.body || null),
        (e.timeout = e.timeout || n.DEFAULT_TIMEOUT),
        e.headers.host)
      )
        throw new Error("Options.headers.host is not supported");
      e.json &&
        ((e.headers.accept = e.headers.accept || "application/json"),
        "GET" !== e.method && (e.headers["content-type"] = "application/json"),
        "boolean" != typeof e.json
          ? (e.body = JSON.stringify(e.json))
          : "string" != typeof e.body && (e.body = JSON.stringify(e.body)));
      var l = function (e) {
        var t = [];
        for (var r in e)
          e.hasOwnProperty(r) &&
            t.push(encodeURIComponent(r) + "=" + encodeURIComponent(e[r]));
        return t.join("&");
      };
      if (e.qs) {
        var d = "string" == typeof e.qs ? e.qs : l(e.qs);
        -1 !== e.uri.indexOf("?")
          ? (e.uri = e.uri + "&" + d)
          : (e.uri = e.uri + "?" + d);
      }
      var p = function (e) {
        var t = {};
        t.boundry =
          "-------------------------------" + Math.floor(1e9 * Math.random());
        var r = [];
        for (var n in e)
          e.hasOwnProperty(n) &&
            r.push(
              "--" +
                t.boundry +
                '\nContent-Disposition: form-data; name="' +
                n +
                '"\n\n' +
                e[n] +
                "\n"
            );
        return (
          r.push("--" + t.boundry + "--"),
          (t.body = r.join("")),
          (t.length = t.body.length),
          (t.type = "multipart/form-data; boundary=" + t.boundry),
          t
        );
      };
      if (e.form) {
        if ("string" == typeof e.form) throw "form name unsupported";
        if ("POST" === e.method) {
          var f = (
            e.encoding || "application/x-www-form-urlencoded"
          ).toLowerCase();
          switch (((e.headers["content-type"] = f), f)) {
            case "application/x-www-form-urlencoded":
              e.body = l(e.form).replace(/%20/g, "+");
              break;
            case "multipart/form-data":
              var h = p(e.form);
              (e.body = h.body), (e.headers["content-type"] = h.type);
              break;
            default:
              throw new Error("unsupported encoding:" + f);
          }
        }
      }
      return (
        (e.onResponse = e.onResponse || s),
        e.onResponse === !0 && ((e.onResponse = t), (e.callback = s)),
        !e.headers.authorization &&
          e.auth &&
          (e.headers.authorization =
            "Basic " + c(e.auth.username + ":" + e.auth.password)),
        i(e)
      );
    }
    function i(e) {
      function t() {
        c = !0;
        var t = new Error("ETIMEDOUT");
        return (
          (t.code = "ETIMEDOUT"),
          (t.duration = e.timeout),
          n.log.error("Timeout", { id: a._id, milliseconds: e.timeout }),
          e.callback(t, a)
        );
      }
      function r(t) {
        if (c)
          return n.log.debug("Ignoring timed out state change", {
            state: a.readyState,
            id: a.id,
          });
        if (
          (n.log.debug("State change", {
            state: a.readyState,
            id: a.id,
            timed_out: c,
          }),
          a.readyState === l.OPENED)
        ) {
          n.log.debug("Request started", { id: a.id });
          for (var r in e.headers) a.setRequestHeader(r, e.headers[r]);
        } else a.readyState === l.HEADERS_RECEIVED ? i() : a.readyState === l.LOADING ? (i(), s()) : a.readyState === l.DONE && (i(), s(), o());
      }
      function i() {
        if (!g.response) {
          if (
            ((g.response = !0),
            n.log.debug("Got response", { id: a.id, status: a.status }),
            clearTimeout(a.timeoutTimer),
            (a.statusCode = a.status),
            d && 0 == a.statusCode)
          ) {
            var t = new Error("CORS request rejected: " + e.uri);
            return (
              (t.cors = "rejected"),
              (g.loading = !0),
              (g.end = !0),
              e.callback(t, a)
            );
          }
          e.onResponse(null, a);
        }
      }
      function s() {
        g.loading ||
          ((g.loading = !0),
          n.log.debug("Response body loading", { id: a.id }));
      }
      function o() {
        if (!g.end) {
          if (
            ((g.end = !0),
            n.log.debug("Request done", { id: a.id }),
            (a.body = a.responseText),
            e.json)
          )
            try {
              a.body = JSON.parse(a.responseText);
            } catch (t) {
              return e.callback(t, a);
            }
          e.callback(null, a, a.body);
        }
      }
      var a = new l(),
        c = !1,
        d = u(e.uri),
        f = "withCredentials" in a;
      if (
        ((p += 1),
        (a.seq_id = p),
        (a.id = p + ": " + e.method + " " + e.uri),
        (a._id = a.id),
        d && !f)
      ) {
        var h = new Error(
          "Browser does not support cross-origin request: " + e.uri
        );
        return (h.cors = "unsupported"), e.callback(h, a);
      }
      a.timeoutTimer = setTimeout(t, e.timeout);
      var g = { response: !1, loading: !1, end: !1 };
      return (
        (a.onreadystatechange = r),
        a.open(e.method, e.uri, !0),
        d && (a.withCredentials = !!e.withCredentials),
        a.send(e.body),
        a
      );
    }
    function s() {}
    function o() {
      var e,
        t,
        r = {},
        n = ["trace", "debug", "info", "warn", "error"];
      for (t = 0; t < n.length; t++)
        (e = n[t]),
          (r[e] = s),
          "undefined" != typeof console &&
            console &&
            console[e] &&
            (r[e] = a(console, e));
      return r;
    }
    function a(e, t) {
      function r(r, n) {
        return (
          "object" == typeof n && (r += " " + JSON.stringify(n)),
          e[t].call(e, r)
        );
      }
      return r;
    }
    function u(e) {
      var t,
        r = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/;
      try {
        t = location.href;
      } catch (n) {
        (t = document.createElement("a")), (t.href = ""), (t = t.href);
      }
      var i = r.exec(t.toLowerCase()) || [],
        s = r.exec(e.toLowerCase()),
        o = !(
          !s ||
          (s[1] == i[1] &&
            s[2] == i[2] &&
            (s[3] || ("http:" === s[1] ? 80 : 443)) ==
              (i[3] || ("http:" === i[1] ? 80 : 443)))
        );
      return o;
    }
    function c(e) {
      var t,
        r,
        n,
        i,
        s,
        o,
        a,
        u,
        c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        l = 0,
        d = 0,
        p = "",
        f = [];
      if (!e) return e;
      do
        (t = e.charCodeAt(l++)),
          (r = e.charCodeAt(l++)),
          (n = e.charCodeAt(l++)),
          (u = (t << 16) | (r << 8) | n),
          (i = (u >> 18) & 63),
          (s = (u >> 12) & 63),
          (o = (u >> 6) & 63),
          (a = 63 & u),
          (f[d++] = c.charAt(i) + c.charAt(s) + c.charAt(o) + c.charAt(a));
      while (l < e.length);
      switch (((p = f.join("")), e.length % 3)) {
        case 1:
          p = p.slice(0, -2) + "==";
          break;
        case 2:
          p = p.slice(0, -1) + "=";
      }
      return p;
    }
    var l = XMLHttpRequest;
    if (!l) throw new Error("missing XMLHttpRequest");
    n.log = { trace: s, debug: s, info: s, warn: s, error: s };
    var d = 18e4,
      p = 0;
    (n.withCredentials = !1),
      (n.DEFAULT_TIMEOUT = d),
      (n.defaults = function (e, t) {
        var r = function (t) {
            var r = function (r, n) {
              r =
                "string" == typeof r
                  ? { uri: r }
                  : JSON.parse(JSON.stringify(r));
              for (var i in e) void 0 === r[i] && (r[i] = e[i]);
              return t(r, n);
            };
            return r;
          },
          i = r(n);
        return (
          (i.get = r(n.get)),
          (i.post = r(n.post)),
          (i.put = r(n.put)),
          (i.head = r(n.head)),
          i
        );
      });
    var f = ["get", "put", "post", "head"];
    f.forEach(function (e) {
      var t = e.toUpperCase(),
        r = e.toLowerCase();
      n[r] = function (e) {
        "string" == typeof e
          ? (e = { method: t, uri: e })
          : ((e = JSON.parse(JSON.stringify(e))), (e.method = t));
        var r = [e].concat(Array.prototype.slice.apply(arguments, [1]));
        return n.apply(this, r);
      };
    }),
      (n.couch = function (e, t) {
        function r(e, r, n) {
          if (e) return t(e, r, n);
          if ((r.statusCode < 200 || r.statusCode > 299) && n.error) {
            e = new Error(
              "CouchDB error: " + (n.error.reason || n.error.error)
            );
            for (var i in n) e[i] = n[i];
            return t(e, r, n);
          }
          return t(e, r, n);
        }
        "string" == typeof e && (e = { uri: e }),
          (e.json = !0),
          e.body && (e.json = e.body),
          delete e.body,
          (t = t || s);
        var i = n(e, r);
        return i;
      }),
      (r.exports = n);
  }),
  require.register("guille-ms.js/index.js", function (e, t, r) {
    function n(e) {
      var t = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(
        e
      );
      if (t) {
        var r = parseFloat(t[1]),
          n = (t[2] || "ms").toLowerCase();
        switch (n) {
          case "years":
          case "year":
          case "y":
            return r * d;
          case "days":
          case "day":
          case "d":
            return r * l;
          case "hours":
          case "hour":
          case "h":
            return r * c;
          case "minutes":
          case "minute":
          case "m":
            return r * u;
          case "seconds":
          case "second":
          case "s":
            return r * a;
          case "ms":
            return r;
        }
      }
    }
    function i(e) {
      return e >= l
        ? Math.round(e / l) + "d"
        : e >= c
        ? Math.round(e / c) + "h"
        : e >= u
        ? Math.round(e / u) + "m"
        : e >= a
        ? Math.round(e / a) + "s"
        : e + "ms";
    }
    function s(e) {
      return (
        o(e, l, "day") ||
        o(e, c, "hour") ||
        o(e, u, "minute") ||
        o(e, a, "second") ||
        e + " ms"
      );
    }
    function o(e, t, r) {
      return t > e
        ? void 0
        : 1.5 * t > e
        ? Math.floor(e / t) + " " + r
        : Math.ceil(e / t) + " " + r + "s";
    }
    var a = 1e3,
      u = 60 * a,
      c = 60 * u,
      l = 24 * c,
      d = 365.25 * l;
    r.exports = function (e, t) {
      return (
        (t = t || {}), "string" == typeof e ? n(e) : t["long"] ? s(e) : i(e)
      );
    };
  }),
  require.register("visionmedia-debug/browser.js", function (e, t, r) {
    function n() {
      return (
        "WebkitAppearance" in document.documentElement.style ||
        (window.console &&
          (console.firebug || (console.exception && console.table))) ||
        (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
          parseInt(RegExp.$1, 10) >= 31)
      );
    }
    function i() {
      var t = arguments,
        r = this.useColors;
      if (
        ((t[0] =
          (r ? "%c" : "") +
          this.namespace +
          (r ? " %c" : " ") +
          t[0] +
          (r ? "%c " : " ") +
          "+" +
          e.humanize(this.diff)),
        !r)
      )
        return t;
      var n = "color: " + this.color;
      t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
      var i = 0,
        s = 0;
      return (
        t[0].replace(/%[a-z%]/g, function (e) {
          "%%" !== e && (i++, "%c" === e && (s = i));
        }),
        t.splice(s, 0, n),
        t
      );
    }
    function s() {
      return (
        "object" == typeof console &&
        "function" == typeof console.log &&
        Function.prototype.apply.call(console.log, console, arguments)
      );
    }
    function o(e) {
      try {
        null == e ? localStorage.removeItem("debug") : (localStorage.debug = e);
      } catch (t) {}
    }
    function a() {
      var e;
      try {
        e = localStorage.debug;
      } catch (t) {}
      return e;
    }
    (e = r.exports = t("./debug")),
      (e.log = s),
      (e.formatArgs = i),
      (e.save = o),
      (e.load = a),
      (e.useColors = n),
      (e.colors = [
        "lightseagreen",
        "forestgreen",
        "goldenrod",
        "dodgerblue",
        "darkorchid",
        "crimson",
      ]),
      (e.formatters.j = function (e) {
        return JSON.stringify(e);
      }),
      e.enable(a());
  }),
  require.register("visionmedia-debug/debug.js", function (e, t, r) {
    function n() {
      return e.colors[l++ % e.colors.length];
    }
    function i(t) {
      function r() {}
      function i() {
        var t = i,
          r = +new Date(),
          s = r - (c || r);
        (t.diff = s),
          (t.prev = c),
          (t.curr = r),
          (c = r),
          null == t.useColors && (t.useColors = e.useColors()),
          null == t.color && t.useColors && (t.color = n());
        var o = Array.prototype.slice.call(arguments);
        (o[0] = e.coerce(o[0])),
          "string" != typeof o[0] && (o = ["%o"].concat(o));
        var a = 0;
        (o[0] = o[0].replace(/%([a-z%])/g, function (r, n) {
          if ("%%" === r) return r;
          a++;
          var i = e.formatters[n];
          if ("function" == typeof i) {
            var s = o[a];
            (r = i.call(t, s)), o.splice(a, 1), a--;
          }
          return r;
        })),
          "function" == typeof e.formatArgs && (o = e.formatArgs.apply(t, o));
        var u = i.log || e.log || console.log.bind(console);
        u.apply(t, o);
      }
      (r.enabled = !1), (i.enabled = !0);
      var s = e.enabled(t) ? i : r;
      return (s.namespace = t), s;
    }
    function s(t) {
      e.save(t);
      for (var r = (t || "").split(/[\s,]+/), n = r.length, i = 0; n > i; i++)
        r[i] &&
          ((t = r[i].replace(/\*/g, ".*?")),
          "-" === t[0]
            ? e.skips.push(new RegExp("^" + t.substr(1) + "$"))
            : e.names.push(new RegExp("^" + t + "$")));
    }
    function o() {
      e.enable("");
    }
    function a(t) {
      var r, n;
      for (r = 0, n = e.skips.length; n > r; r++)
        if (e.skips[r].test(t)) return !1;
      for (r = 0, n = e.names.length; n > r; r++)
        if (e.names[r].test(t)) return !0;
      return !1;
    }
    function u(e) {
      return e instanceof Error ? e.stack || e.message : e;
    }
    (e = r.exports = i),
      (e.coerce = u),
      (e.disable = o),
      (e.enable = s),
      (e.enabled = a),
      (e.humanize = t("ms")),
      (e.names = []),
      (e.skips = []),
      (e.formatters = {});
    var c,
      l = 0;
  }),
  require.register("twitter-hogan.js/lib/compiler.js", function (e, t, r) {
    !(function (e) {
      function t(e) {
        "}" === e.n.substr(e.n.length - 1) &&
          (e.n = e.n.substring(0, e.n.length - 1));
      }
      function r(e) {
        return e.trim ? e.trim() : e.replace(/^\s*|\s*$/g, "");
      }
      function n(e, t, r) {
        if (t.charAt(r) != e.charAt(0)) return !1;
        for (var n = 1, i = e.length; i > n; n++)
          if (t.charAt(r + n) != e.charAt(n)) return !1;
        return !0;
      }
      function i(t, r, n, a) {
        var u = [],
          c = null,
          l = null,
          d = null;
        for (l = n[n.length - 1]; t.length > 0; ) {
          if (((d = t.shift()), l && "<" == l.tag && !(d.tag in j)))
            throw new Error("Illegal content in < super tag.");
          if (e.tags[d.tag] <= e.tags.$ || s(d, a))
            n.push(d), (d.nodes = i(t, d.tag, n, a));
          else {
            if ("/" == d.tag) {
              if (0 === n.length)
                throw new Error("Closing tag without opener: /" + d.n);
              if (((c = n.pop()), d.n != c.n && !o(d.n, c.n, a)))
                throw new Error("Nesting error: " + c.n + " vs. " + d.n);
              return (c.end = d.i), u;
            }
            "\n" == d.tag && (d.last = 0 == t.length || "\n" == t[0].tag);
          }
          u.push(d);
        }
        if (n.length > 0) throw new Error("missing closing tag: " + n.pop().n);
        return u;
      }
      function s(e, t) {
        for (var r = 0, n = t.length; n > r; r++)
          if (t[r].o == e.n) return (e.tag = "#"), !0;
      }
      function o(e, t, r) {
        for (var n = 0, i = r.length; i > n; n++)
          if (r[n].c == e && r[n].o == t) return !0;
      }
      function a(e) {
        var t = [];
        for (var r in e)
          t.push('"' + c(r) + '": function(c,p,t,i) {' + e[r] + "}");
        return "{ " + t.join(",") + " }";
      }
      function u(e) {
        var t = [];
        for (var r in e.partials)
          t.push(
            '"' +
              c(r) +
              '":{name:"' +
              c(e.partials[r].name) +
              '", ' +
              u(e.partials[r]) +
              "}"
          );
        return "partials: {" + t.join(",") + "}, subs: " + a(e.subs);
      }
      function c(e) {
        return e
          .replace(v, "\\\\")
          .replace(g, '\\"')
          .replace(m, "\\n")
          .replace(b, "\\r")
          .replace(y, "\\u2028")
          .replace(x, "\\u2029");
      }
      function l(e) {
        return ~e.indexOf(".") ? "d" : "f";
      }
      function d(e, t) {
        var r = "<" + (t.prefix || ""),
          n = r + e.n + w++;
        return (
          (t.partials[n] = { name: e.n, partials: {} }),
          (t.code +=
            't.b(t.rp("' + c(n) + '",c,p,"' + (e.indent || "") + '"));'),
          n
        );
      }
      function p(e, t) {
        t.code += "t.b(t.t(t." + l(e.n) + '("' + c(e.n) + '",c,p,0)));';
      }
      function f(e) {
        return "t.b(" + e + ");";
      }
      var h = /\S/,
        g = /\"/g,
        m = /\n/g,
        b = /\r/g,
        v = /\\/g,
        y = /\u2028/,
        x = /\u2029/;
      (e.tags = {
        "#": 1,
        "^": 2,
        "<": 3,
        $: 4,
        "/": 5,
        "!": 6,
        ">": 7,
        "=": 8,
        _v: 9,
        "{": 10,
        "&": 11,
        _t: 12,
      }),
        (e.scan = function (i, s) {
          function o() {
            v.length > 0 &&
              (y.push({ tag: "_t", text: new String(v) }), (v = ""));
          }
          function a() {
            for (var t = !0, r = w; r < y.length; r++)
              if (
                ((t =
                  e.tags[y[r].tag] < e.tags._v ||
                  ("_t" == y[r].tag && null === y[r].text.match(h))),
                !t)
              )
                return !1;
            return t;
          }
          function u(e, t) {
            if ((o(), e && a()))
              for (var r, n = w; n < y.length; n++)
                y[n].text &&
                  ((r = y[n + 1]) &&
                    ">" == r.tag &&
                    (r.indent = y[n].text.toString()),
                  y.splice(n, 1));
            else t || y.push({ tag: "\n" });
            (x = !1), (w = y.length);
          }
          function c(e, t) {
            var n = "=" + k,
              i = e.indexOf(n, t),
              s = r(e.substring(e.indexOf("=", t) + 1, i)).split(" ");
            return (q = s[0]), (k = s[s.length - 1]), i + n.length - 1;
          }
          var l = i.length,
            d = 0,
            p = 1,
            f = 2,
            g = d,
            m = null,
            b = null,
            v = "",
            y = [],
            x = !1,
            j = 0,
            w = 0,
            q = "{{",
            k = "}}";
          for (
            s && ((s = s.split(" ")), (q = s[0]), (k = s[1])), j = 0;
            l > j;
            j++
          )
            g == d
              ? n(q, i, j)
                ? (--j, o(), (g = p))
                : "\n" == i.charAt(j)
                ? u(x)
                : (v += i.charAt(j))
              : g == p
              ? ((j += q.length - 1),
                (b = e.tags[i.charAt(j + 1)]),
                (m = b ? i.charAt(j + 1) : "_v"),
                "=" == m ? ((j = c(i, j)), (g = d)) : (b && j++, (g = f)),
                (x = j))
              : n(k, i, j)
              ? (y.push({
                  tag: m,
                  n: r(v),
                  otag: q,
                  ctag: k,
                  i: "/" == m ? x - q.length : j + k.length,
                }),
                (v = ""),
                (j += k.length - 1),
                (g = d),
                "{" == m && ("}}" == k ? j++ : t(y[y.length - 1])))
              : (v += i.charAt(j));
          return u(x, !0), y;
        });
      var j = { _t: !0, "\n": !0, $: !0, "/": !0 };
      e.stringify = function (t, r, n) {
        return (
          "{code: function (c,p,i) { " + e.wrapMain(t.code) + " }," + u(t) + "}"
        );
      };
      var w = 0;
      (e.generate = function (t, r, n) {
        w = 0;
        var i = { code: "", subs: {}, partials: {} };
        return (
          e.walk(t, i),
          n.asString ? this.stringify(i, r, n) : this.makeTemplate(i, r, n)
        );
      }),
        (e.wrapMain = function (e) {
          return 'var t=this;t.b(i=i||"");' + e + "return t.fl();";
        }),
        (e.template = e.Template),
        (e.makeTemplate = function (e, t, r) {
          var n = this.makePartials(e);
          return (
            (n.code = new Function("c", "p", "i", this.wrapMain(e.code))),
            new this.template(n, t, this, r)
          );
        }),
        (e.makePartials = function (e) {
          var t,
            r = { subs: {}, partials: e.partials, name: e.name };
          for (t in r.partials)
            r.partials[t] = this.makePartials(r.partials[t]);
          for (t in e.subs)
            r.subs[t] = new Function("c", "p", "t", "i", e.subs[t]);
          return r;
        }),
        (e.codegen = {
          "#": function (t, r) {
            (r.code +=
              "if(t.s(t." +
              l(t.n) +
              '("' +
              c(t.n) +
              '",c,p,1),c,p,0,' +
              t.i +
              "," +
              t.end +
              ',"' +
              t.otag +
              " " +
              t.ctag +
              '")){t.rs(c,p,function(c,p,t){'),
              e.walk(t.nodes, r),
              (r.code += "});c.pop();}");
          },
          "^": function (t, r) {
            (r.code +=
              "if(!t.s(t." +
              l(t.n) +
              '("' +
              c(t.n) +
              '",c,p,1),c,p,1,0,0,"")){'),
              e.walk(t.nodes, r),
              (r.code += "};");
          },
          ">": d,
          "<": function (t, r) {
            var n = { partials: {}, code: "", subs: {}, inPartial: !0 };
            e.walk(t.nodes, n);
            var i = r.partials[d(t, r)];
            (i.subs = n.subs), (i.partials = n.partials);
          },
          $: function (t, r) {
            var n = { subs: {}, code: "", partials: r.partials, prefix: t.n };
            e.walk(t.nodes, n),
              (r.subs[t.n] = n.code),
              r.inPartial || (r.code += 't.sub("' + c(t.n) + '",c,p,i);');
          },
          "\n": function (e, t) {
            t.code += f('"\\n"' + (e.last ? "" : " + i"));
          },
          _v: function (e, t) {
            t.code += "t.b(t.v(t." + l(e.n) + '("' + c(e.n) + '",c,p,0)));';
          },
          _t: function (e, t) {
            t.code += f('"' + c(e.text) + '"');
          },
          "{": p,
          "&": p,
        }),
        (e.walk = function (t, r) {
          for (var n, i = 0, s = t.length; s > i; i++)
            (n = e.codegen[t[i].tag]), n && n(t[i], r);
          return r;
        }),
        (e.parse = function (e, t, r) {
          return (r = r || {}), i(e, "", [], r.sectionTags || []);
        }),
        (e.cache = {}),
        (e.cacheKey = function (e, t) {
          return [
            e,
            !!t.asString,
            !!t.disableLambda,
            t.delimiters,
            !!t.modelGet,
          ].join("||");
        }),
        (e.compile = function (t, r) {
          r = r || {};
          var n = e.cacheKey(t, r),
            i = this.cache[n];
          if (i) {
            var s = i.partials;
            for (var o in s) delete s[o].instance;
            return i;
          }
          return (
            (i = this.generate(
              this.parse(this.scan(t, r.delimiters), t, r),
              t,
              r
            )),
            (this.cache[n] = i)
          );
        });
    })("undefined" != typeof e ? e : Hogan);
  }),
  require.register("twitter-hogan.js/lib/hogan.js", function (e, t, r) {
    var n = t("./compiler");
    (n.Template = t("./template").Template),
      (n.template = n.Template),
      (r.exports = n);
  }),
  require.register("twitter-hogan.js/lib/template.js", function (e, t, r) {
    var n = {};
    !(function (e) {
      function t(e, t, r) {
        var n;
        return (
          t &&
            "object" == typeof t &&
            (void 0 !== t[e]
              ? (n = t[e])
              : r && t.get && "function" == typeof t.get && (n = t.get(e))),
          n
        );
      }
      function r(e, t, r, n, i, s) {
        function o() {}
        function a() {}
        (o.prototype = e), (a.prototype = e.subs);
        var u,
          c = new o();
        (c.subs = new a()),
          (c.subsText = {}),
          (c.buf = ""),
          (n = n || {}),
          (c.stackSubs = n),
          (c.subsText = s);
        for (u in t) n[u] || (n[u] = t[u]);
        for (u in n) c.subs[u] = n[u];
        (i = i || {}), (c.stackPartials = i);
        for (u in r) i[u] || (i[u] = r[u]);
        for (u in i) c.partials[u] = i[u];
        return c;
      }
      function n(e) {
        return String(null === e || void 0 === e ? "" : e);
      }
      function i(e) {
        return (
          (e = n(e)),
          l.test(e)
            ? e
                .replace(s, "&amp;")
                .replace(o, "&lt;")
                .replace(a, "&gt;")
                .replace(u, "&#39;")
                .replace(c, "&quot;")
            : e
        );
      }
      (e.Template = function (e, t, r, n) {
        (e = e || {}),
          (this.r = e.code || this.r),
          (this.c = r),
          (this.options = n || {}),
          (this.text = t || ""),
          (this.partials = e.partials || {}),
          (this.subs = e.subs || {}),
          (this.buf = "");
      }),
        (e.Template.prototype = {
          r: function (e, t, r) {
            return "";
          },
          v: i,
          t: n,
          render: function (e, t, r) {
            return this.ri([e], t || {}, r);
          },
          ri: function (e, t, r) {
            return this.r(e, t, r);
          },
          ep: function (e, t) {
            var n = this.partials[e],
              i = t[n.name];
            if (n.instance && n.base == i) return n.instance;
            if ("string" == typeof i) {
              if (!this.c) throw new Error("No compiler available.");
              i = this.c.compile(i, this.options);
            }
            if (!i) return null;
            if (((this.partials[e].base = i), n.subs)) {
              t.stackText || (t.stackText = {});
              for (key in n.subs)
                t.stackText[key] ||
                  (t.stackText[key] =
                    void 0 !== this.activeSub && t.stackText[this.activeSub]
                      ? t.stackText[this.activeSub]
                      : this.text);
              i = r(
                i,
                n.subs,
                n.partials,
                this.stackSubs,
                this.stackPartials,
                t.stackText
              );
            }
            return (this.partials[e].instance = i), i;
          },
          rp: function (e, t, r, n) {
            var i = this.ep(e, r);
            return i ? i.ri(t, r, n) : "";
          },
          rs: function (e, t, r) {
            var n = e[e.length - 1];
            if (!d(n)) return void r(e, t, this);
            for (var i = 0; i < n.length; i++)
              e.push(n[i]), r(e, t, this), e.pop();
          },
          s: function (e, t, r, n, i, s, o) {
            var a;
            return d(e) && 0 === e.length
              ? !1
              : ("function" == typeof e && (e = this.ms(e, t, r, n, i, s, o)),
                (a = !!e),
                !n &&
                  a &&
                  t &&
                  t.push("object" == typeof e ? e : t[t.length - 1]),
                a);
          },
          d: function (e, r, n, i) {
            var s,
              o = e.split("."),
              a = this.f(o[0], r, n, i),
              u = this.options.modelGet,
              c = null;
            if ("." === e && d(r[r.length - 2])) a = r[r.length - 1];
            else
              for (var l = 1; l < o.length; l++)
                (s = t(o[l], a, u)),
                  void 0 !== s ? ((c = a), (a = s)) : (a = "");
            return i && !a
              ? !1
              : (i ||
                  "function" != typeof a ||
                  (r.push(c), (a = this.mv(a, r, n)), r.pop()),
                a);
          },
          f: function (e, r, n, i) {
            for (
              var s = !1,
                o = null,
                a = !1,
                u = this.options.modelGet,
                c = r.length - 1;
              c >= 0;
              c--
            )
              if (((o = r[c]), (s = t(e, o, u)), void 0 !== s)) {
                a = !0;
                break;
              }
            return a
              ? (i || "function" != typeof s || (s = this.mv(s, r, n)), s)
              : i
              ? !1
              : "";
          },
          ls: function (e, t, r, i, s, o) {
            var a = this.options.delimiters;
            return (
              (this.options.delimiters = o),
              this.b(this.ct(n(e.call(t, s, r)), t, i)),
              (this.options.delimiters = a),
              !1
            );
          },
          ct: function (e, t, r) {
            if (this.options.disableLambda)
              throw new Error("Lambda features disabled.");
            return this.c.compile(e, this.options).render(t, r);
          },
          b: function (e) {
            this.buf += e;
          },
          fl: function () {
            var e = this.buf;
            return (this.buf = ""), e;
          },
          ms: function (e, t, r, n, i, s, o) {
            var a,
              u = t[t.length - 1],
              c = e.call(u);
            return "function" == typeof c
              ? n
                ? !0
                : ((a =
                    this.activeSub &&
                    this.subsText &&
                    this.subsText[this.activeSub]
                      ? this.subsText[this.activeSub]
                      : this.text),
                  this.ls(c, u, t, r, a.substring(i, s), o))
              : c;
          },
          mv: function (e, t, r) {
            var i = t[t.length - 1],
              s = e.call(i);
            return "function" == typeof s ? this.ct(n(s.call(i)), i, r) : s;
          },
          sub: function (e, t, r, n) {
            var i = this.subs[e];
            i &&
              ((this.activeSub = e), i(t, r, this, n), (this.activeSub = !1));
          },
        });
      var s = /&/g,
        o = /</g,
        a = />/g,
        u = /\'/g,
        c = /\"/g,
        l = /[&<>\"\']/,
        d =
          Array.isArray ||
          function (e) {
            return "[object Array]" === Object.prototype.toString.call(e);
          };
    })("undefined" != typeof e ? e : n);
  }),
  require.register("ddict-ddict/index.js", function (e, t, r) {
    function n(e) {
      return this instanceof n
        ? ((e = e || {}),
          (this.from = e.from || "auto"),
          (this.to = e.to || i()),
          (this.url = "http://dashboard.ddict.me/"),
          (this.loggedin = !1),
          (this.notify = e.notify),
          (this.asked = !1),
          u(this),
          (this.templateContent = s.compile(
            '{{#error}}<p><i>{{error}}</i></p>{{/error}}{{#audio}}<img class="ddict_audio" data-url="{{audio}}" src="{{img}}">{{/audio}}{{#translit}}<p><span class="ddict_translit">/{{translit}}/</span></p>{{/translit}}{{#sentence}}<p class="ddict_sentence">{{.}}</p>{{/sentence}}{{#dict}}<hr><p class="ddict_pos">{{pos}}</p><p>{{terms}}</p>{{/dict}}{{#spell}}<hr><p class="ddict_didumean">Did you mean <span class="ddict_spell">{{spell}}</span></p>{{/spell}}'
          )),
          (this.templatePopup = s.compile(
            '{{#error}}<p><i>{{error}}</i></p>{{/error}}<p>{{#translit}}<span id="translit" class="label label-default">/{{translit}}/</span> {{/translit}}{{#audio}}<button value="{{audio}}" id="audio" class="btn btn-xs"><span class="glyphicon glyphicon-volume-up"></span></button>{{/audio}}</p>{{#sentence}}<p class="sentence">{{.}}</p>{{/sentence}}<div id="dict">{{#dict}}<hr><p class="text-capitalize"><i>{{pos}}</i></p><blockquote><small>{{terms}}</small></blockquote>{{/dict}}</div>{{#spell}}<div id="spell"><p><label class="label label-danger">Did you mean</label> <u id="spelling">{{spell}}</u></p></div>{{/spell}}'
          )),
          this)
        : new n(e);
    }
    function i() {
      if ("undefined" == typeof navigator || !navigator.language) return "vi";
      var e = navigator.language;
      return e.indexOf("ceb") > -1
        ? "ceb"
        : e.indexOf("zh") > -1
        ? "zh-CN"
        : ((e = e.substr(0, 2)),
          -1 ===
          [
            "af",
            "sq",
            "ar",
            "hy",
            "az",
            "eu",
            "be",
            "bn",
            "bs",
            "bg",
            "ca",
            "ceb",
            "zh-CN",
            "hr",
            "cs",
            "da",
            "nl",
            "en",
            "eo",
            "et",
            "tl",
            "fi",
            "fr",
            "gl",
            "ka",
            "de",
            "el",
            "gu",
            "ht",
            "ha",
            "iw",
            "hi",
            "hmn",
            "hu",
            "is",
            "ig",
            "id",
            "ga",
            "it",
            "ja",
            "jw",
            "kn",
            "km",
            "ko",
            "lo",
            "la",
            "lv",
            "lt",
            "mk",
            "ms",
            "mt",
            "mi",
            "mr",
            "mn",
            "ne",
            "no",
            "fa",
            "pl",
            "pt",
            "pa",
            "ro",
            "ru",
            "sr",
            "sk",
            "sl",
            "so",
            "es",
            "sw",
            "sv",
            "ta",
            "te",
            "th",
            "tr",
            "uk",
            "ur",
            "vi",
            "cy",
            "yi",
            "yo",
            "zu",
          ].indexOf(e)
            ? "vi"
            : e);
    }
    var s;
    try {
      s = t("hogan.js");
    } catch (o) {
      s = t("hogan");
    }
    var a = t("request"),
      u = t("debug")("ddict"),
      c = t("translate-google");
    (r.exports = n),
      (n.prototype.translate = function (e, t) {
        var r = this;
        u("#translate"),
          c.translate(r.from, r.to, e, function (e, r) {
            return e
              ? (u("#translate err", e), t(!1))
              : (u("#translate success"), t(r));
          });
      }),
      (n.prototype.renderContent = function (e) {
        return u("#renderContent"), this.templateContent.render(e);
      }),
      (n.prototype.renderPopup = function (e) {
        return u("#renderPopup"), this.templatePopup.render(e);
      }),
      (n.prototype.checkLogin = function (e) {
        var t = this;
        a(t.url + "check", function (r, n, i) {
          return r
            ? e(r)
            : (200 === n.statusCode ? (t.loggedin = !0) : (t.loggedin = !1),
              e(null, t.loggedin));
        });
      }),
      (n.prototype.saveWord = function (e) {
        var t = this;
        if (e.from.toLowerCase() !== e.to.toLowerCase()) {
          var r = e.sentence.join("\n");
          e.from_word.toLowerCase() !== r.toLowerCase() &&
            a(
              {
                url: t.url + "word",
                method: "POST",
                form: {
                  from: e.from,
                  to: e.to,
                  src: e.src,
                  from_word: e.from_word,
                  to_word: r,
                },
              },
              function (e, r, n) {
                if (e) return callback(e);
                if (!e)
                  switch (r.statusCode) {
                    case 201:
                    case 204:
                      t.asked = !1;
                      break;
                    case 401:
                      t.notify(
                        "You are not logged in to Ddict yet. Click here to login again."
                      );
                      break;
                    case 403:
                      t.asked ||
                        ((t.asked = !0),
                        t.notify(
                          "Oops! Your Phrasebook is full, please remove the old words to save more."
                        ));
                  }
              }
            );
        }
      });
  }),
  require.register("component-emitter/index.js", function (e, t, r) {
    function n(e) {
      return e ? i(e) : void 0;
    }
    function i(e) {
      for (var t in n.prototype) e[t] = n.prototype[t];
      return e;
    }
    (r.exports = n),
      (n.prototype.on = n.prototype.addEventListener = function (e, t) {
        return (
          (this._callbacks = this._callbacks || {}),
          (this._callbacks[e] = this._callbacks[e] || []).push(t),
          this
        );
      }),
      (n.prototype.once = function (e, t) {
        function r() {
          n.off(e, r), t.apply(this, arguments);
        }
        var n = this;
        return (
          (this._callbacks = this._callbacks || {}),
          (r.fn = t),
          this.on(e, r),
          this
        );
      }),
      (n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function (
        e,
        t
      ) {
        if (((this._callbacks = this._callbacks || {}), 0 == arguments.length))
          return (this._callbacks = {}), this;
        var r = this._callbacks[e];
        if (!r) return this;
        if (1 == arguments.length) return delete this._callbacks[e], this;
        for (var n, i = 0; i < r.length; i++)
          if (((n = r[i]), n === t || n.fn === t)) {
            r.splice(i, 1);
            break;
          }
        return this;
      }),
      (n.prototype.emit = function (e) {
        this._callbacks = this._callbacks || {};
        var t = [].slice.call(arguments, 1),
          r = this._callbacks[e];
        if (r) {
          r = r.slice(0);
          for (var n = 0, i = r.length; i > n; ++n) r[n].apply(this, t);
        }
        return this;
      }),
      (n.prototype.listeners = function (e) {
        return (
          (this._callbacks = this._callbacks || {}), this._callbacks[e] || []
        );
      }),
      (n.prototype.hasListeners = function (e) {
        return !!this.listeners(e).length;
      });
  }),
  require.register("ddict-extension/index.js", function (e, t, r) {
    r.exports = t("./lib/");
  }),
  require.register("ddict-extension/lib/index.js", function (e, t, r) {
    function n() {
      var e,
        t = navigator.userAgent,
        r =
          t.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
          ) || [];
      return /trident/i.test(r[1])
        ? ((e = /\brv[ :]+(\d+)/g.exec(t) || []), "ie")
        : "Chrome" === r[1] && ((e = t.match(/\bOPR\/(\d+)/)), null !== e)
        ? "opera"
        : ((r = r[2]
            ? [r[1], r[2]]
            : [navigator.appName, navigator.appVersion, "-?"]),
          null !== (e = t.match(/version\/(\d+)/i)) && r.splice(1, 1, e[1]),
          r[0].toLowerCase());
    }
    r.exports = t("./" + n());
  }),
  require.register("ddict-extension/lib/chrome/index.js", function (e, t, r) {
    var n = t("./event"),
      i = t("./context_menu"),
      s = t("./tab"),
      o = chrome;
    (r.exports = o),
      n(o),
      (o.context_menu = i),
      (o.tab = s),
      (o.send = chrome.tabs.sendMessage),
      (o.notify = function (e, t) {
        return (
          (e = {
            type: "basic",
            title: e.title || "Extension",
            message: e.data,
            iconUrl: e.icon,
          }),
          t
            ? chrome.notifications.create("", e, t)
            : void chrome.notifications.create("", e, function () {})
        );
      }),
      (o.playAudio = function (e) {
        var t = document.createElement("audio");
        (t.src = e), t.play();
      }),
      (o.set = function (e, t) {
        var r = localStorage.data;
        if (e) {
          r || (r = {});
          try {
            r = JSON.parse(r);
          } catch (n) {
            delete localStorage.data, (r = {});
          }
          if (t) r[e] = t;
          else
            for (var i = e, s = Object.keys(i), o = 0; o < s.length; o++)
              r[s[o]] = i[s[o]];
          localStorage.data = JSON.stringify(r);
        }
      }),
      (o.get = function (e) {
        var t = localStorage.data;
        t || (t = {});
        try {
          t = JSON.parse(t);
        } catch (r) {
          delete localStorage.data, (t = {});
        }
        return e ? t[e] : t;
      });
  }),
  require.register("ddict-extension/lib/chrome/event.js", function (e, t, r) {
    function n(e) {
      i(e),
        e.runtime.onStartup.addListener(function () {
          var t = Array.prototype.slice.call(arguments);
          t.unshift("startup"), e.emit.apply(e, t);
        }),
        e.runtime.onInstalled.addListener(function (t) {
          if (t && t.reason) {
            var r = Array.prototype.slice.call(arguments);
            r.unshift(t.reason), e.emit.apply(e, r);
          }
        }),
        e.runtime.onUpdateAvailable.addListener(function () {
          var t = Array.prototype.slice.call(arguments);
          t.unshift("update_available"), e.emit.apply(e, t);
        }),
        e.runtime.onMessage.addListener(function () {
          var t = Array.prototype.slice.call(arguments);
          return t.unshift("message"), e.emit.apply(e, t), !0;
        }),
        e.contextMenus.onClicked.addListener(function () {
          var t = Array.prototype.slice.call(arguments);
          t.unshift("context_menu"), e.emit.apply(e, t);
        }),
        e.notifications.onClicked.addListener(function () {
          var t = Array.prototype.slice.call(arguments);
          t.unshift("notification"), e.emit.apply(e, t);
        });
    }
    var i = t("emitter");
    r.exports = n;
  }),
  require.register("ddict-extension/lib/chrome/context_menu.js", function (
    e,
    t,
    r
  ) {
    var n = { next_id: 0, callbacks: [] };
    (r.exports = n),
      chrome.contextMenus.onClicked.addListener(function (e, t) {
        var r = e.menuItemId;
        n.callbacks[r] && n.callbacks[r](e, t);
      }),
      (n.create = function (e) {
        (e.contexts = e.contexts || ["all"]),
          e.id ||
            ((e.id = this.next_id + ""),
            this.next_id++,
            e.onClick
              ? (this.callbacks.push(e.onClick), delete e.onClick)
              : this.callbacks.push(function () {})),
          chrome.contextMenus.create(e, function () {
            arguments.length && console.warn(arguments);
          });
      });
  }),
  require.register("ddict-extension/lib/chrome/tab.js", function (e, t, r) {
    var n = {};
    (r.exports = n),
      (n.create = function (e, t) {
        chrome.tabs.create({ url: e }, function () {
          t && t.apply(chrome, arguments);
        });
      }),
      (n.send = chrome.tabs.sendMessage);
  }),
  require.register("ddict-extension/lib/opera.js", function (e, t, r) {
    var n = t("./chrome"),
      i = n;
    (r.exports = i),
      (i.notify = function (e, t) {
        alert(e.data);
      }),
      (i.playAudio = function (e) {
        var t = document.createElement("embed");
        (t.src = e), document.body.appendChild(t);
        var r = document.createElement("embed");
        (r.src = ""), document.body.appendChild(r);
      });
  }),
  require.register("build/index.js", function (e, t, r) {
    r.exports = { ddict: t("ddict"), extension: t("extension") };
  }),
  require.alias("ddict-ddict/index.js", "build/deps/ddict/index.js"),
  require.alias("ddict-ddict/index.js", "build/deps/ddict/index.js"),
  require.alias("ddict-ddict/index.js", "ddict/index.js"),
  require.alias(
    "ddict-translate-google/index.js",
    "ddict-ddict/deps/translate-google/index.js"
  ),
  require.alias(
    "ddict-translate-google/index.js",
    "ddict-ddict/deps/translate-google/index.js"
  ),
  require.alias(
    "visionmedia-debug/browser.js",
    "ddict-translate-google/deps/debug/browser.js"
  ),
  require.alias(
    "visionmedia-debug/debug.js",
    "ddict-translate-google/deps/debug/debug.js"
  ),
  require.alias(
    "visionmedia-debug/browser.js",
    "ddict-translate-google/deps/debug/index.js"
  ),
  require.alias("guille-ms.js/index.js", "visionmedia-debug/deps/ms/index.js"),
  require.alias("visionmedia-debug/browser.js", "visionmedia-debug/index.js"),
  require.alias(
    "ddo-browser-request/index.js",
    "ddict-translate-google/deps/request/index.js"
  ),
  require.alias(
    "ddo-browser-request/index.js",
    "ddict-translate-google/deps/request/index.js"
  ),
  require.alias("ddo-browser-request/index.js", "ddo-browser-request/index.js"),
  require.alias(
    "component-querystring/index.js",
    "ddict-translate-google/deps/querystring/index.js"
  ),
  require.alias(
    "component-trim/index.js",
    "component-querystring/deps/trim/index.js"
  ),
  require.alias(
    "component-type/index.js",
    "component-querystring/deps/type/index.js"
  ),
  require.alias(
    "ddict-translate-google/index.js",
    "ddict-translate-google/index.js"
  ),
  require.alias(
    "ddo-browser-request/index.js",
    "ddict-ddict/deps/request/index.js"
  ),
  require.alias(
    "ddo-browser-request/index.js",
    "ddict-ddict/deps/request/index.js"
  ),
  require.alias("ddo-browser-request/index.js", "ddo-browser-request/index.js"),
  require.alias(
    "visionmedia-debug/browser.js",
    "ddict-ddict/deps/debug/browser.js"
  ),
  require.alias(
    "visionmedia-debug/debug.js",
    "ddict-ddict/deps/debug/debug.js"
  ),
  require.alias(
    "visionmedia-debug/browser.js",
    "ddict-ddict/deps/debug/index.js"
  ),
  require.alias("guille-ms.js/index.js", "visionmedia-debug/deps/ms/index.js"),
  require.alias("visionmedia-debug/browser.js", "visionmedia-debug/index.js"),
  require.alias(
    "twitter-hogan.js/lib/compiler.js",
    "ddict-ddict/deps/hogan.js/lib/compiler.js"
  ),
  require.alias(
    "twitter-hogan.js/lib/hogan.js",
    "ddict-ddict/deps/hogan.js/lib/hogan.js"
  ),
  require.alias(
    "twitter-hogan.js/lib/template.js",
    "ddict-ddict/deps/hogan.js/lib/template.js"
  ),
  require.alias(
    "twitter-hogan.js/lib/hogan.js",
    "ddict-ddict/deps/hogan.js/index.js"
  ),
  require.alias("twitter-hogan.js/lib/hogan.js", "twitter-hogan.js/index.js"),
  require.alias("ddict-ddict/index.js", "ddict-ddict/index.js"),
  require.alias("ddict-extension/index.js", "build/deps/extension/index.js"),
  require.alias(
    "ddict-extension/lib/index.js",
    "build/deps/extension/lib/index.js"
  ),
  require.alias(
    "ddict-extension/lib/chrome/index.js",
    "build/deps/extension/lib/chrome/index.js"
  ),
  require.alias(
    "ddict-extension/lib/chrome/event.js",
    "build/deps/extension/lib/chrome/event.js"
  ),
  require.alias(
    "ddict-extension/lib/chrome/context_menu.js",
    "build/deps/extension/lib/chrome/context_menu.js"
  ),
  require.alias(
    "ddict-extension/lib/chrome/tab.js",
    "build/deps/extension/lib/chrome/tab.js"
  ),
  require.alias(
    "ddict-extension/lib/opera.js",
    "build/deps/extension/lib/opera.js"
  ),
  require.alias("ddict-extension/index.js", "build/deps/extension/index.js"),
  require.alias("ddict-extension/index.js", "extension/index.js"),
  require.alias(
    "component-emitter/index.js",
    "ddict-extension/deps/emitter/index.js"
  ),
  require.alias("ddict-extension/index.js", "ddict-extension/index.js"),
  require.alias("build/index.js", "build/index.js");
