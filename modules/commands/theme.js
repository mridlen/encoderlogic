commands.push({
    triggers: [
        {
            trigger: "theme",
            alias: ["th", "the", "them"],
            help: "theme [name] ........... change color theme. 'theme list' to see options",
            requireLoggedIn: false
        }
    ],

    fn: function (trigger, term, cmd) {
        //==========================================================
        //themes dictionary
        //----------------------------------------------------------
        //each theme defines:
        //  CSS colors: bgColor, textColor, cursorColor, link/visited/hover
        //  jquery.terminal format colors used in [[;color;]text] strings:
        //    quickIdColor, trackIdColor, artistIdColor,
        //    streamableColor, streamableTrue, streamableFalse
        //see modules/globals.js for the global 'theme' object this updates
        //==========================================================
        var themes = {
            "default": {
                description: "original Encoder Logic green-on-black",
                bgColor: "#000000",
                textColor: "#006600",
                cursorColor: "#006600",
                glowColor: "rgba(0, 170, 0, 0.9)",
                widgetColor: "#006600",
                linkColor: "#00AA00",
                visitedColor: "#22AA22",
                hoverColor: "#22BB22",
                quickIdColor: "cyan",
                trackIdColor: "red",
                artistIdColor: "yellow",
                streamableColor: "grey",
                streamableTrue: "green",
                streamableFalse: "red"
            },
            "matrix": {
                description: "bright green on black, wake up neo",
                bgColor: "#000000",
                textColor: "#00FF41",
                cursorColor: "#00FF41",
                glowColor: "rgba(0, 255, 65, 0.9)",
                widgetColor: "#00FF41",
                linkColor: "#88FF88",
                visitedColor: "#44CC44",
                hoverColor: "#CCFFCC",
                quickIdColor: "#00FFAA",
                trackIdColor: "#66FF66",
                artistIdColor: "#AAFFAA",
                streamableColor: "#008822",
                streamableTrue: "#00FF41",
                streamableFalse: "#AA4400"
            },
            "amber": {
                description: "amber CRT monitor, 1980s vibes",
                bgColor: "#100800",
                textColor: "#FFB000",
                cursorColor: "#FFB000",
                glowColor: "rgba(255, 176, 0, 0.9)",
                widgetColor: "#FFB000",
                linkColor: "#FFCC33",
                visitedColor: "#CC8800",
                hoverColor: "#FFDD66",
                quickIdColor: "#FFDD66",
                trackIdColor: "#FF8800",
                artistIdColor: "#FFCC33",
                streamableColor: "#885500",
                streamableTrue: "#FFB000",
                streamableFalse: "#884400"
            },
            "c64": {
                description: "Commodore 64 light blue on dark blue",
                bgColor: "#4040E0",
                textColor: "#A0A0FF",
                cursorColor: "#A0A0FF",
                glowColor: "rgba(200, 200, 255, 0.8)",
                widgetColor: "#A0A0FF",
                linkColor: "#FFFFFF",
                visitedColor: "#CCCCFF",
                hoverColor: "#FFFF88",
                quickIdColor: "#FFFFFF",
                trackIdColor: "#FFFF88",
                artistIdColor: "#88FFFF",
                streamableColor: "#8080CC",
                streamableTrue: "#FFFFFF",
                streamableFalse: "#FF8888"
            },
            "ice": {
                description: "cold cyan on black",
                bgColor: "#000811",
                textColor: "#00CCFF",
                cursorColor: "#00CCFF",
                glowColor: "rgba(0, 204, 255, 0.9)",
                widgetColor: "#00CCFF",
                linkColor: "#66DDFF",
                visitedColor: "#4499CC",
                hoverColor: "#AAEEFF",
                quickIdColor: "#AAEEFF",
                trackIdColor: "#FFFFFF",
                artistIdColor: "#66DDFF",
                streamableColor: "#336688",
                streamableTrue: "#00CCFF",
                streamableFalse: "#FF6666"
            },
            "dos": {
                description: "classic DOS grey-on-black",
                bgColor: "#000000",
                textColor: "#CCCCCC",
                cursorColor: "#CCCCCC",
                glowColor: "rgba(204, 204, 204, 0.6)",
                widgetColor: "#CCCCCC",
                linkColor: "#FFFFFF",
                visitedColor: "#AAAAAA",
                hoverColor: "#FFFFFF",
                quickIdColor: "cyan",
                trackIdColor: "yellow",
                artistIdColor: "white",
                streamableColor: "grey",
                streamableTrue: "#00FF00",
                streamableFalse: "#FF5555"
            },
            "paper": {
                description: "black on white, the bland one",
                bgColor: "#FFFFFF",
                textColor: "#000000",
                cursorColor: "#330000",
                glowColor: "none",
                widgetColor: "#000000",
                linkColor: "#000000",
                visitedColor: "#000000",
                hoverColor: "#444444",
                quickIdColor: "black",
                trackIdColor: "black",
                artistIdColor: "black",
                streamableColor: "black",
                streamableTrue: "black",
                streamableFalse: "black"
            },
            "hotdog": {
                description: "Windows 3.1 hotdog stand - you have been warned",
                bgColor: "#FFFF00",
                textColor: "#000000",
                cursorColor: "#FF0000",
                glowColor: "rgba(255, 0, 0, 0.9)",
                widgetColor: "#FF0000",
                linkColor: "#AA0000",
                visitedColor: "#660000",
                hoverColor: "#FF0000",
                quickIdColor: "#AA0000",
                trackIdColor: "black",
                artistIdColor: "#660066",
                streamableColor: "#440000",
                streamableTrue: "#008800",
                streamableFalse: "#AA0000"
            }
        };

        //==========================================================
        //applyTheme - apply the given theme name to CSS + global theme
        //==========================================================
        function applyTheme(name) {
            var t = themes[name];
            if (!t) {
                term.echo("Unknown theme: " + name);
                term.echo("Type 'theme list' to see available themes.");
                return;
            }

            //--- apply CSS colors ---
            $('.terminal').css({"background-color": t.bgColor, "color": t.textColor});
            $('.cmd').css({"background-color": t.bgColor, "color": t.textColor});
            $('body').css({"background-color": t.bgColor});
            $('.wrapper').css({"background-color": t.bgColor});
            //cursor glow — overrides hardcoded green box-shadow in jquery.terminal.css
            //"none" disables the glow entirely (used by paper theme)
            var shadow = (t.glowColor === "none") ? "none" : "0 0 5px " + t.glowColor;
            $('.cursor').css({
                "background-color": t.cursorColor,
                "background": t.cursorColor,
                "color": t.bgColor,
                "box-shadow": shadow,
                "-webkit-box-shadow": shadow,
                "-moz-box-shadow": shadow
            });
            $('a').css({"color": t.linkColor});
            $('a:link').css({"color": t.linkColor});
            $('a:visited').css({"color": t.visitedColor});

            //--- update global theme object ---
            //used by jquery.terminal format strings [[;color;]text]
            //see globals.js for the original definition
            theme.quickIdColor = t.quickIdColor;
            theme.trackIdColor = t.trackIdColor;
            theme.artistIdColor = t.artistIdColor;
            theme.streamableColor = t.streamableColor;
            theme.streamableTrue = t.streamableTrue;
            theme.streamableFalse = t.streamableFalse;
            theme.name = name;

            //--- update SoundCloud widget accent color ---
            //widgetPlayer lives in modules/soundcloud-stub.js and is exposed globally
            if (window.widgetPlayer && typeof window.widgetPlayer.setColor === 'function') {
                window.widgetPlayer.setColor(t.widgetColor);
            }

            term.echo("Theme set to: " + name + " (" + t.description + ")");
        }

        //==========================================================
        //listThemes - print all available themes
        //==========================================================
        function listThemes() {
            term.echo("Available themes:");
            var current = theme.name || "default";
            for (var name in themes) {
                var marker = (name === current) ? " * " : "   ";
                term.echo(marker + name + " - " + themes[name].description);
            }
            term.echo("");
            term.echo("Usage: theme <name>");
        }

        //==========================================================
        //parse sub-command and dispatch
        //==========================================================
        var arg = cmd.split(" ")[1];

        if (!arg || arg === "list" || arg === "help") {
            listThemes();
        } else {
            applyTheme(arg);
        }
    }
});
