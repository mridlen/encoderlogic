# encoderlogic
A Soundcloud API interface built using JQuery Terminal.
http://beta.encoderlogic.com

(Originally modified from the Commodore 64 demo https://github.com/jcubic/commodore64 although I have changed almost everything)

Disclaimer: I do not provide any level of support, nor will I claim any responsibility if
the script breaks something and causes catastrophic damage to your system or to your Soundcloud account.

This is primarily created to promote my soundcloud website, but it may be useful for others as well.

All of the interface content is stored in the modules/terminal.js and modules/globals.js, but the framework is under the terminal directory (JQuery Terminal).

I have made only one update to the terminal/jquery.terminal.css file, and that was to add the CSS slow blinking cursor (http://terminal.jcubic.pl/examples.php#css-cursor)

## Installation

If you just want to use this, go to: http://beta.encoderlogic.com

If you are using this on your own website, you will need to supply your own Soundcloud API client key and website url or this will not work.

You need to first set up your app at: http://soundcloud.com/you/apps

You will need to update the Client ID and Redirect URI, soundcloudUserID and soundcloudUserName in modules/globals.js

### Finding your soundcloudUserID

Use this command on your server, replacing "encoder-logic" with the URL of your artist name and the client_id with your client_id from the soundcloud apps page:

(look for: https://api.soundcloud.com/users/##########, THIS IS YOUR USER ID!)

```
$ curl -v 'http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/encoder-logic&client_id=8c3cf644ea6051b32f5e612143e203e9'
* About to connect() to api.soundcloud.com port 80 (#0)
*   Trying 72.21.91.127... connected
* Connected to api.soundcloud.com (72.21.91.127) port 80 (#0)
> GET /resolve.json?url=http://soundcloud.com/encoder-logic&client_id=8c3cf644ea6051b32f5e612143e203e9 HTTP/1.1
> User-Agent: curl/7.19.7 (x86_64-redhat-linux-gnu) libcurl/7.19.7 NSS/3.16.2.3 Basic ECC zlib/1.2.3 libidn/1.18 libssh2/1.4.2
> Host: api.soundcloud.com
> Accept: */*
>
< HTTP/1.1 302 Found
< Access-Control-Allow-Headers: Accept, Authorization, Content-Type, Origin
< Access-Control-Allow-Methods: GET, PUT, POST, DELETE
< Access-Control-Allow-Origin: *
< Access-Control-Expose-Headers: Date
< Cache-Control: no-cache
< Content-Type: application/json; charset=utf-8
< Date: Fri, 24 Apr 2015 19:51:34 GMT
< Location: https://api.soundcloud.com/users/14947567.json?client_id=8c3cf644ea6051b32f5e612143e203e9
< Server: am/2
< Content-Length: 127
<
* Connection #0 to host api.soundcloud.com left intact
* Closing connection #0
{"status":"302 - Found","location":"https://api.soundcloud.com/users/14947567.json?client_id=8c3cf644ea6051b32f5e612143e203e9"}
```

There are also a number of things you will need to modify in the modules to personalize it (e.g. create your own links section, soundcloud and facebook urls, etc), but it should be fairly obvious what you need to change.

## Creating your own custom Modules

I have made it intentionally easy to expand or reduce the command functionality. The goal being user created custom plugins.

You will need to create a single .js file in the modules/commands directory that looks like this:

```javascript
commands.push({
    triggers: [
        {
            trigger: "yourcommand", //the command typed here
            alias: { "yc", "yourc", "y" }, //this will be implemented soon (command aliases that will also run your command)
            help: "yourcommand ............ this is the description of your command.",
            requireLoggedIn: false //make this true if it requires them to be logged in
        }
    ],

    fn: function(trigger, term, cmd) { //pass it (trigger, term, cmd) always!
        //your code here
        term.echo("Hello World!");
    }
});
```