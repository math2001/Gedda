# Gedda

> A simple markdown viewer (*not* editor)

## Why?

Because I use vim in a terminal. And when I'm in a file explorer, I don't want
to have to switch to a terminal and `vim` the markdown file just to read it.

## Screenshot

So, here it is, a simple markdown viewer.

*Screenshot here*

## Customization

Gedda is powered by [electron][], and uses the [`showdown`][showdown] library to
convert the markdown to html.

The default style is the GitHub-like CSS for markdown stolen from
[`github-markdown-css`][github-markdown-css] and tweaked a bit.

And all of those things, you can customize them from your configuration file.
Geeda uses the XDG convention, so your configuration file is located at
`~/.config/Gedda/conf.json`.

Note: if you don't specify an option, the default value will automatically be
used, but the configuration file must exists and be a valid JSON object.
Otherwise it'll show an error above the markdown file every time.

#### `stylesheet <String>`

A path/URL to a style sheet. It replaces the default one.

#### `showdownOptions <Object>`

An object that is passed straight away to the showdown converter. The list of
options is available on the [showdown's wiki][]

## Recommended configuration

```json
{
    "shodownOptions": {
        "omitExtraWLInCodeBlocks": true,
        "ghCompatibleHeaderId": true,
        "simplifiedAutoLink": true,
        "excludeTrailingPunctuationFromURLs": true,
        "literalMidWordUnderscores": true,
        "strikethrough": true,
        "tables": true,
        "tasklists": true
    }
}
```

[electron]: https://electron.atom.io/
[github-markdown-css]: https://github.com/sindresorhus/github-markdown-css
[showdown]: https://github.com/showdownjs/showdown
[showdown's wiki]: https://github.com/showdownjs/showdown/wiki/Showdown-options
