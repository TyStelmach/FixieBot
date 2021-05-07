# FixieBot

FixieBot is a reddit auto-reply bot based off of Node that searches for comments that summon it on [/r/FixedGearBicycle](https://www.reddit.com/r/FixedGearBicycle/). FixieBot will accept commands in the form of gear sizes and return a ratio, as well as tire skidpatch information.

## Commands

FixieBot will respond to the following command:
- `Ratio(#, #)`

Ratio accpets to numbers as paramaters, this is your bike's chainring and cog sizes -- `Ratio(49, 17)` then FixieBot will return calculations to give you a gear ratio and information on your tire skidpatches.

FixieBot can accept many ratios at once and will seperate out the response to accomodate them. For every `Ratio(#, #)` that is passed, it will calculate it. (See future improvments).

* Note: To cut down on spam, and avoid the bot from being blocked, you must summon the bot using reddit's built in summoning syntax: `/u/FixieBot`. Any comment that does not include this will be ignored. (This will log as an error, but will not stop the script.)

## Improvements
- Build out better logging methods
- Create tests
- Ratio Command
  - Always arrange numbers largest to smallest
  - Remove duplicates if in comment
- Additional Commands