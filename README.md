# The Dust Off

The new static home for what was formerly [thedustoff.com](http://thedustoff.com). This site makes the XML feed available as well as a basic stylized version of the feed on the homepage.

## Getting started

To run the site locally, use:

```bash
npm install && npm start
```

From there, you can open the site in your browser at [localhost:3000](http://localhost:3000/).

## What's up with the shortened MP3 links?

This is nothing to do with tracking or analytics! The share links from DropBox have ampersands and other special characters that aren't parseable by XML. And encoding them to be XML-friendly was no longer recognized by DropBox. So, we're using shortened URLs without the special characters.

Our links come from two services, because Bitly's free plan only allows 12 links per month:

- [Bitly](https://app.bitly.com/Bncg2eEidLO/links)
- [TinyUrl](https://tinyurl.com/app/my-urls)

## What's up next?

This is still an early version, built in one evening care of [Storyteller Lager](https://www.storytellerbeverages.com/) and too much [Creed](https://www.youtube.com/watch?v=J16lInLZRms) - so you can thank them both for this mess.

Stuff that still needs to be done:

- Migrate MP3s from WordPress and DigitalOcean (In progress)
- ~~Repair audio player elements for each post~~ (Done!)
- ~~Migrate episode images over from WordPress~~ (Done!)
- Find and upload missing episode MP3 files
- Render full episode details when selected
- Add the show logo and additional details
