# TODO
1. Set to send messages on #spam channel if exists. If not, use default channel.
2. Create command where you can set the desired channel to use.
3. Set bot presence.
4. .remind command.
   1. One of the args must be a name (like an id).
   2. It will have to write on a json, so if the discord is suddenly stopped or put to sleep, it can read it when turned back on.
5. .remove command.
7. Read message reactions. (Message.awaitReactions)
   1. Force users to only be able to react with two emojis (Message.react).
   2. Make sure that the reaction that matters is the one from the original message.
8. Respond to original message when reminding (MessageMentions / Message.reply).
9.  Read reminders from saved json.
10. List command.
11. Help command.
12. [Use Browserify](https://www.typescriptlang.org/docs/handbook/gulp.html#browserify)
13. Create branch `dev` to test code on it.
14. Upload to Heroku and sync with branch `main`.
