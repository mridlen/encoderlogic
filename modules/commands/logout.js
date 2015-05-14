commands.push({
    triggers: [
        {
            trigger: "logout",
            help: "logout ................. refreshes the page, effectively logging you out",
            requireLoggedIn: true
        }
    ],
    
    fn: function (trigger, term, cmd) {
         location.reload(true);
    }
});