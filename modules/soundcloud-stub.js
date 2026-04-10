// soundcloud-stub.js
// Replacement for the deprecated SoundCloud JavaScript SDK v1 (connect.soundcloud.com/sdk.js)
// Uses the SoundCloud Widget API (still public, no API key required) for actual audio playback.
//
// IMPORTANT: All callbacks are invoked asynchronously via setTimeout, matching the
// behavior of the real SDK (which made HTTP requests). The original codebase uses
// global loop variables (i, j without var) that collide if callbacks fire synchronously.

(function() {
    "use strict";

    var logPrefix = "[SoundCloud Stub]";

    function logCall(method, args) {
        console.warn(logPrefix, method, "called with:", Array.prototype.slice.call(args));
    }

    // Helper: call a callback asynchronously to match real SDK behavior
    function asyncCallback(fn, args) {
        setTimeout(function() {
            fn.apply(null, args);
        }, 0);
    }

    // Helper: refocus the terminal after widget iframe interactions steal focus
    // Retries at multiple delays because the iframe can steal focus asynchronously
    // via postMessage after we initially refocus.
    function refocusTerminal() {
        function doFocus() {
            if (window.jQuery && window.jQuery('#term').length) {
                try {
                    window.jQuery('#term').terminal().focus();
                } catch (e) {
                    // ignore focus errors
                }
            }
        }
        // Retry at multiple intervals to catch async focus-stealing from the iframe
        setTimeout(doFocus, 0);
        setTimeout(doFocus, 50);
        setTimeout(doFocus, 150);
        setTimeout(doFocus, 300);
    }

    // =========================================================================
    // Widget Player - uses hidden SoundCloud iframe for real audio playback
    // =========================================================================
    // Cache for track data fetched from the Widget API
    var trackCache = {};

    var widgetPlayer = {
        iframe: null,
        widget: null,
        ready: false,
        apiLoaded: false,
        onFinishCallback: null,
        // widget accent color - updated by the theme command via setColor()
        // default matches the "default" theme green
        widgetColor: "#006600",

        // Create hidden iframe and load the Widget API script
        init: function() {
            // Create hidden iframe for the SoundCloud player widget
            var iframe = document.createElement('iframe');
            iframe.id = 'sc-widget-player';
            iframe.width = '100%';
            iframe.height = '166';
            iframe.scrolling = 'no';
            iframe.frameBorder = 'no';
            iframe.allow = 'autoplay';
            // tabindex -1 makes the iframe non-focusable via tab order
            iframe.setAttribute('tabindex', '-1');
            iframe.style.position = 'fixed';
            iframe.style.bottom = '0';
            iframe.style.left = '0';
            iframe.style.zIndex = '9999';
            iframe.style.display = 'block';

            // Global focus watcher: whenever the iframe gains focus, steal it back
            // immediately and return it to the terminal. This catches focus theft
            // caused by the widget's internal iframe.focus() calls.
            window.addEventListener('blur', function() {
                // When window blurs because the iframe is now focused, blur the iframe
                // and refocus the terminal.
                setTimeout(function() {
                    if (document.activeElement === iframe) {
                        iframe.blur();
                        refocusTerminal();
                    }
                }, 0);
            });
            // encode # as %23 for the color URL parameter
            var colorParam = '&color=' + encodeURIComponent(widgetPlayer.widgetColor);
            iframe.src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/233067171&auto_play=false&show_artwork=false&visual=false' + colorParam;
            document.body.appendChild(iframe);
            widgetPlayer.iframe = iframe;

            // Load the Widget API script
            // Save our custom SC object before the widget API potentially overwrites it
            var script = document.createElement('script');
            script.src = 'https://w.soundcloud.com/player/api.js';
            script.onload = function() {
                // The Widget API may have added SC.Widget to our object, or replaced SC entirely
                var WidgetConstructor = window.SC && window.SC.Widget;
                if (!WidgetConstructor) {
                    console.error(logPrefix, "Widget API loaded but SC.Widget not found.");
                    return;
                }
                // Save Widget Events reference
                widgetPlayer.Events = WidgetConstructor.Events;
                // Restore our custom SC methods in case the widget API overwrote them
                var savedSC = window.SC;
                window.SC = scObject;
                window.SC.Widget = WidgetConstructor;

                widgetPlayer.apiLoaded = true;
                widgetPlayer.widget = WidgetConstructor(iframe);
                widgetPlayer.widget.bind(widgetPlayer.Events.READY, function() {
                    widgetPlayer.ready = true;
                    console.info(logPrefix, "Widget player ready.");
                    //if a seek was queued (e.g. from a theme color change reloading the iframe),
                    //apply it now that the new iframe content is ready
                    if (widgetPlayer.pendingSeekMs && widgetPlayer.pendingSeekMs > 0) {
                        widgetPlayer.widget.seekTo(widgetPlayer.pendingSeekMs);
                        widgetPlayer.pendingSeekMs = 0;
                    }
                });
                widgetPlayer.widget.bind(widgetPlayer.Events.FINISH, function() {
                    console.info(logPrefix, "Widget: track finished.");
                    if (widgetPlayer.onFinishCallback) {
                        widgetPlayer.onFinishCallback();
                    }
                });
                // Refocus the terminal after PAUSE and PLAY events fire - these
                // confirm the iframe has processed the command and focus may have been stolen
                widgetPlayer.widget.bind(widgetPlayer.Events.PAUSE, refocusTerminal);
                widgetPlayer.widget.bind(widgetPlayer.Events.PLAY, refocusTerminal);
            };
            document.head.appendChild(script);
        },

        // Load and play a track by ID
        loadAndPlay: function(trackId, position, onFinishCb) {
            widgetPlayer.onFinishCallback = onFinishCb || null;
            if (!widgetPlayer.widget) {
                console.warn(logPrefix, "Widget not ready yet, cannot play.");
                return;
            }
            var trackUrl = 'https://api.soundcloud.com/tracks/' + trackId;
            //note: 'color' is NOT a valid load() option - it's only honored as a URL param
            //on the iframe src. See setColor() below for how theme changes update the color.
            widgetPlayer.widget.load(trackUrl, {
                auto_play: true,
                callback: function() {
                    if (position && position > 0) {
                        widgetPlayer.widget.seekTo(position);
                    }
                    console.info(logPrefix, "Widget: playing track " + trackId);
                    refocusTerminal();
                }
            });
        },

        //==========================================================
        //setColor - update the widget accent color
        //----------------------------------------------------------
        //The SoundCloud Widget API only honors the 'color' parameter when set via
        //the iframe src URL query string - it is NOT a valid load() option. To
        //change the color on a live widget, we must rebuild iframe.src. We capture
        //the currently playing track and position first so we can resume after the
        //iframe reloads. The existing READY handler applies pendingSeekMs to seek
        //back to the previous position once the new iframe is ready.
        //called by the theme command (see modules/commands/theme.js)
        //==========================================================
        setColor: function(hexColor) {
            widgetPlayer.widgetColor = hexColor;
            if (!widgetPlayer.iframe) {
                //iframe not created yet - init() will pick up the new color
                return;
            }

            //--- helper: build a widget iframe URL for a given track + color ---
            function buildSrc(trackId, autoPlay) {
                var trackParam = encodeURIComponent('https://api.soundcloud.com/tracks/' + trackId);
                return 'https://w.soundcloud.com/player/?url=' + trackParam +
                       '&auto_play=' + (autoPlay ? 'true' : 'false') +
                       '&show_artwork=false&visual=false' +
                       '&color=' + encodeURIComponent(hexColor);
            }

            //--- if widget isn't ready, just replace the iframe URL with the placeholder track ---
            if (!widgetPlayer.widget || !widgetPlayer.ready) {
                widgetPlayer.iframe.src = buildSrc(233067171, false);
                return;
            }

            //--- capture current state, then reload iframe with new color ---
            widgetPlayer.widget.getCurrentSound(function(sound) {
                var trackId = (sound && sound.id) ? sound.id : 233067171;
                widgetPlayer.widget.getPosition(function(position) {
                    widgetPlayer.widget.isPaused(function(paused) {
                        //stash seek position so the READY handler can restore it
                        //after the new iframe content loads
                        widgetPlayer.pendingSeekMs = position || 0;
                        widgetPlayer.ready = false;
                        widgetPlayer.iframe.src = buildSrc(trackId, !paused);
                    });
                });
            });
        },

        pause: function() {
            if (widgetPlayer.widget) {
                widgetPlayer.widget.pause();
                refocusTerminal();
            }
        },

        stop: function() {
            if (widgetPlayer.widget) {
                widgetPlayer.widget.pause();
                widgetPlayer.widget.seekTo(0);
                refocusTerminal();
            }
            widgetPlayer.onFinishCallback = null;
        },

        // Fetch track listing for a user by loading their URL in a hidden widget
        // and using getSounds() to retrieve the track data
        fetchUserTracks: function(userId, callback) {
            if (!widgetPlayer.apiLoaded) {
                console.warn(logPrefix, "Widget API not loaded yet, cannot fetch tracks.");
                callback([]);
                return;
            }
            var WidgetConstructor = window.SC && window.SC.Widget;
            if (!WidgetConstructor) {
                callback([]);
                return;
            }

            // Create a temporary hidden iframe for fetching the track listing
            var listIframe = document.getElementById('sc-widget-list');
            if (!listIframe) {
                listIframe = document.createElement('iframe');
                listIframe.id = 'sc-widget-list';
                listIframe.width = '0';
                listIframe.height = '0';
                listIframe.style.display = 'none';
                listIframe.scrolling = 'no';
                listIframe.frameBorder = 'no';
                listIframe.src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/' + userId + '&show_artwork=false';
                document.body.appendChild(listIframe);
            }

            var listWidget = WidgetConstructor(listIframe);

            // Load the user URL into the widget, then get the sounds list
            var userUrl = 'https://api.soundcloud.com/users/' + userId;
            listWidget.load(userUrl, {
                auto_play: false,
                callback: function() {
                    listWidget.getSounds(function(sounds) {
                        console.info(logPrefix, "Fetched " + sounds.length + " tracks for user " + userId);
                        // Transform to match the old SDK response format
                        var tracks = [];
                        for (var s = 0; s < sounds.length; s++) {
                            var trackObj = {
                                id: sounds[s].id,
                                title: sounds[s].title,
                                description: sounds[s].description || "",
                                permalink_url: sounds[s].permalink_url || "https://soundcloud.com/",
                                streamable: true,
                                duration: sounds[s].duration || 0,
                                tag_list: sounds[s].tag_list || "",
                                genre: sounds[s].genre || "",
                                user: {
                                    id: sounds[s].user_id || userId,
                                    username: sounds[s].user ? sounds[s].user.username : "Unknown"
                                }
                            };
                            tracks.push(trackObj);
                            // Cache track data for later lookups by SC.get("/tracks/{id}")
                            trackCache[trackObj.id] = trackObj;
                        }
                        callback(tracks);
                    });
                }
            });
        }
    };

    // Initialize widget player when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { widgetPlayer.init(); });
    } else {
        // DOM already loaded, but defer slightly to avoid blocking
        setTimeout(function() { widgetPlayer.init(); }, 100);
    }

    // =========================================================================
    // Known data
    // =========================================================================

    // Known artist data (keyed by SoundCloud user ID)
    // Sourced from SoundCloud oEmbed API: https://soundcloud.com/oembed?url=https://soundcloud.com/encoder-logic&format=json
    var knownUsers = {
        14947567: {
            id: 14947567,
            username: "Encoder Logic",
            full_name: "Encoder Logic",
            city: "",
            track_count: 11,
            followers_count: 0,
            followings_count: 0,
            description: "Soundcloud is my outlet for works in progress. Anything denoted with a V indicates that it is a work in progress. I don't like to offer free downloads until the song is in a fairly stable state. X1stance recently released our first CD, Lev, in stores now.\n\n(I am NOT DJ Mr Rid of DJ Deluxe Productions... that's a different Mark Ridlen.)\n\nCheck out my new website project below. It has links to all my other websites by typing \"about\".",
            avatar_url: "https://i1.sndcdn.com/avatars-000191428839-uryh5u-t500x500.jpg",
            permalink_url: "https://soundcloud.com/encoder-logic"
        }
    };

    // Known track data (keyed by track ID) - Ten Forward album
    // Sourced from SoundCloud oEmbed API: https://soundcloud.com/oembed?url=https://api.soundcloud.com/tracks/{id}&format=json
    var knownTracks = {
        233067171: { title: "01 - Encoder Logic - FTL", description: "An ambient trip though space at extremely high speeds." },
        233067294: { title: "02 - Encoder Logic - We Are Being Scanned", description: "When the enemy ship starts their scans, things get dicey." },
        233067471: { title: "03 - Encoder Logic - Level 3 Diagnostic", description: "Performing root cause analysis on ship systems." },
        233067603: { title: "04 - Encoder Logic - Cloudpusher", description: "Large machines clean the atmosphere and generate new cloud formations as needed." },
        233067706: { title: "05 - Encoder Logic - Engine One", description: "The primary ship's engine requires routine maintenance." },
        233067896: { title: "06 - Encoder Logic - Temporal Mechanics", description: "Memory Alpha describes: Temporal Mechanics as \"the study of the workings of time and its effects on the space-time continuum, and is particularly relevant when dealing with time travel.\"" },
        233068022: { title: "07 - Encoder Logic - Going Down", description: "A large elevator traverses down to the bowels of the ship." },
        233068213: { title: "08 - Encoder Logic - Androcide", description: "Androids, killed in cold blood." },
        233068313: { title: "09 - Encoder Logic - Expanse", description: "Looking across the void of space really puts things in perspective." },
        233068668: { title: "10 - Encoder Logic - Power Coupler", description: "A standard component in starships in the 23rd and 24th centuries." },
        233068879: { title: "11 - Encoder Logic - Things Continue On", description: "A sad song about endings and new beginnings." }
    };

    // =========================================================================
    // Mock data factories
    // =========================================================================

    function mockTrack(id) {
        var known = knownTracks[id];
        return {
            id: id || 0,
            title: known ? known.title : "(unknown track #" + id + ")",
            description: known ? known.description : "(SoundCloud API unavailable - running in stub mode)",
            permalink_url: "https://soundcloud.com/",
            streamable: known ? true : false,
            duration: 0,
            user: knownUsers[14947567] || { id: 0, username: "(unknown artist)" }
        };
    }

    function mockUser(id) {
        if (knownUsers[id]) {
            return knownUsers[id];
        }
        return {
            id: id || 0,
            username: "(unknown user #" + id + ")",
            track_count: 0,
            followers_count: 0,
            followings_count: 0,
            permalink_url: "https://soundcloud.com/"
        };
    }

    function mockCollection() {
        return {
            collection: [],
            next_href: null
        };
    }

    // Parse URL and return appropriate mock data
    function getMockResponse(url) {
        // /tracks/{id}/comments
        if (/^\/tracks\/\d+\/comments/.test(url)) {
            return [];
        }
        // /tracks/{id}
        if (/^\/tracks\/(\d+)$/.test(url)) {
            var trackId = parseInt(url.match(/^\/tracks\/(\d+)$/)[1], 10);
            return mockTrack(trackId);
        }
        // /users/{id}/tracks, /users/{id}/followers, /users/{id}/followings, /users/{id}/favorites
        if (/^\/users\/\d+\/(tracks|followers|followings|favorites)/.test(url)) {
            return mockCollection();
        }
        // /users (search)
        if (/^\/users$/.test(url)) {
            return [];
        }
        // /users/{id}
        if (/^\/users\/(\d+)$/.test(url)) {
            var userId = parseInt(url.match(/^\/users\/(\d+)$/)[1], 10);
            return mockUser(userId);
        }
        // /me
        if (/^\/me/.test(url)) {
            return mockUser(0);
        }
        // Default: return empty object
        return {};
    }

    // =========================================================================
    // soundManager stub (was bundled with the old SoundCloud SDK via SoundManager2)
    // =========================================================================
    window.soundManager = {
        stopAll: function() {
            console.warn(logPrefix, "soundManager.stopAll()");
            widgetPlayer.stop();
        },
        pauseAll: function() {
            console.warn(logPrefix, "soundManager.pauseAll()");
            widgetPlayer.pause();
        },
        resumeAll: function() { console.warn(logPrefix, "soundManager.resumeAll()"); },
        stop: function() {
            console.warn(logPrefix, "soundManager.stop()");
            widgetPlayer.stop();
        }
    };

    // =========================================================================
    // SC global object
    // =========================================================================
    var scObject = {
        initialize: function(options) {
            logCall("SC.initialize", arguments);
            console.info(logPrefix, "Running with Widget API for audio playback.");
        },

        get: function(url, params, callback) {
            logCall("SC.get", arguments);

            // Determine the actual callback (handle both SC.get(url, cb) and SC.get(url, params, cb))
            var cb = (typeof params === 'function') ? params : callback;

            // Dynamic fetch for /users/{id}/tracks - uses Widget API to get real track data
            var userTracksMatch = url.match(/^\/users\/(\d+)\/tracks$/);
            if (userTracksMatch && typeof cb === 'function') {
                var uid = parseInt(userTracksMatch[1], 10);
                widgetPlayer.fetchUserTracks(uid, function(tracks) {
                    // Return in the format the codebase expects: { collection: [...], next_href: ... }
                    cb({ collection: tracks, next_href: null }, null);
                });
                return;
            }

            // For /tracks/{id}, check the cache first (populated by fetchUserTracks)
            var trackMatch = url.match(/^\/tracks\/(\d+)$/);
            if (trackMatch) {
                var tid = parseInt(trackMatch[1], 10);
                if (trackCache[tid]) {
                    if (typeof cb === 'function') {
                        asyncCallback(cb, [trackCache[tid], null]);
                    }
                    return;
                }
            }

            // For everything else, use mock data
            var response = getMockResponse(url);
            if (typeof cb === 'function') {
                asyncCallback(cb, [response, null]);
            }
        },

        post: function(url, params, callback) {
            logCall("SC.post", arguments);
            if (typeof callback === 'function') {
                asyncCallback(callback, [null, { message: "SoundCloud SDK stub - post not available" }]);
            } else if (typeof params === 'function') {
                asyncCallback(params, [null, { message: "SoundCloud SDK stub - post not available" }]);
            }
        },

        put: function(url, callback) {
            logCall("SC.put", arguments);
            if (typeof callback === 'function') {
                asyncCallback(callback, [null]);
            }
        },

        "delete": function(url, callback) {
            logCall("SC.delete", arguments);
            if (typeof callback === 'function') {
                asyncCallback(callback, [null]);
            }
        },

        stream: function(url, callback) {
            logCall("SC.stream", arguments);
            // Extract track ID from url like "/tracks/233067171"
            var match = url.match(/\/tracks\/(\d+)/);
            var trackId = match ? parseInt(match[1], 10) : null;

            if (typeof callback === 'function') {
                asyncCallback(callback, [{
                    play: function(options) {
                        var position = (options && options.position) ? options.position : 0;
                        var onFinish = (options && options.onfinish) ? options.onfinish : null;
                        console.info(logPrefix, "stream.play() - playing track " + trackId + " via Widget API");
                        widgetPlayer.loadAndPlay(trackId, position, onFinish);
                    },
                    pause: function() {
                        console.info(logPrefix, "stream.pause()");
                        widgetPlayer.pause();
                    },
                    stop: function() {
                        console.info(logPrefix, "stream.stop()");
                        widgetPlayer.stop();
                    },
                    destruct: function() {
                        console.info(logPrefix, "stream.destruct()");
                        widgetPlayer.stop();
                    },
                    position: 0,
                    duration: 0,
                    playState: 0
                }]);
            }
        },

        connect: function(callback) {
            logCall("SC.connect", arguments);
            console.warn(logPrefix, "SC.connect() - OAuth login not available in stub mode.");
        },

        connectCallback: function() {
            // No-op for the callback.html popup
        }
    };

    window.SC = scObject;
    //expose widgetPlayer globally so the theme command can update its accent color
    window.widgetPlayer = widgetPlayer;
})();
