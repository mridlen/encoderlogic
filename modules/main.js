//This file loads all the modules for the terminal commands

requirejs.config({
    paths: {
        jquery: '../terminal/js/jquery-1.7.1.min',
        jqueryterminal: '../terminal/js/jquery.terminal-src',
        soundcloud: 'http://connect.soundcloud.com/sdk',
        globals: 'globals',
        terminal: 'terminal'
    }
});

//the dependency tree
//first jquery must be loaded
require(['jquery'], function(jquery) {
    //then jquery terminal and soundcloud can be loaded
    require(['jqueryterminal', 'soundcloud'], function (jqueryterminal, soundcloud) {
        //then globals, slowTyping, and terminal can be loaded
        require(['globals', 'slowTyping', 'terminal']);
    }); 
});


