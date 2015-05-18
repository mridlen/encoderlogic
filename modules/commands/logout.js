commands.push({
    triggers: [
        {
            trigger: "logout",
            alias: ["logo", "logou"],
            help: "logout ................. refreshes the page, effectively logging you out",
            requireLoggedIn: true
        }
    ],
    
    fn: function (trigger, term, cmd) {
         location.reload(true);
    }
});