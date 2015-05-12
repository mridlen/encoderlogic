commands.push({
    triggers: [
        {
            trigger: "login",
            help: "logout ................. refreshes the page, effectively logging you out",
            requireLoggedIn: true
        }
    ],
    
    fn: function (term) {
         location.reload(true);
    }
}