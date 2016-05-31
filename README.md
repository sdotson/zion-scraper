# zion-scraper
A Node and CasperJS program that checks for backcountry and campsite cancellations

This program manually checked for permit cancellations for Zion National Park's Narrows overnight permit, Buckskin Gulch overnight permit, and a Watchman campsites at Zion every 15 minutes. If a cancellation is detected, it sends me an email via SparkPost.

I wrote this after finding out that looking 2 months in advance for permits isn't early enough for many national parks. \

Before you ask, this program did successfully detect cancellations at Watchman which I subsequently reserved in May 2016. Believe it or not, I never saw cancellations for the other two permits. 

If I were to write this program again, I would use a headless browser that works more seamlessly with Node, like Horseman or Zombie.
