
# Markdown To Jira

This was created to deal with the fact that I cannot paste my mardown content as a comment in JIRA.
If I copy my markdown into this converter and then paste the comment I can.

[website](https://jadujoel.github.io/markdown-to-jira/)

## Build

This fork builds a single standalone HTML file with all CSS and JavaScript inlined:

```bash
bun run build.ts
```

The output is `dist/index.html` - a single file containing the entire application that can be opened directly in any browser without a server.

## Development

Install dependencies:
`bun install`

Start local webpage:
`bun serve.ts
