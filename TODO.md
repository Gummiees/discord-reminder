# TODO
1. Set to send messages on `#bot-spam` channel if exists. If not, use default channel.
2. Create command where you can set the desired channel to use.
3. Create message to remind at the desired moment.
4. Read message reactions. (`Message.awaitReactions`)
   1. Force users to only be able to react with two emojis (`Message.react`).
   2. Make sure that the reaction that matters is the one from the original message.
5.  Read reminders from saved json.
6.  `.help` command.
7.  [Use Browserify](https://www.typescriptlang.org/docs/handbook/gulp.html#browserify)
8.  Create branch `dev` to test code on it.
9.  Upload to Heroku and sync with branch `main`.
10. CACHE
    1.  Every new day, the bot must caché the reminders from the JSON that it has to remind for the current day. The ones for other days, are omited.
    2.  Read the cache when checking if there is any reminder for this minute.