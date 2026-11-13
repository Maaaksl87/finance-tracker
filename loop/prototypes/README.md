# loop/prototypes — visual approval before development

**The rule.** Every module that changes something a user can see is first shown as an HTML
prototype. Code for the screen is written only after the prototype is approved — by the agent
itself when every question has a source, by the owner when one does not. A module with nothing
on screen needs no prototype.

## How it works

1. The agent takes a module from `loop/modules/progress-modules.md`.
2. If it changes a screen, the agent writes `<slug>.html` here (`<slug>` = the module's branch
   name without its prefix), adds a `Prototype:` line under the module in the queue, and adds a
   row to `index.html`.
3. The agent answers every question the page raises from the module file, the parent brief, the
   `## Answers` section, the code and the specs, and records each answer in `## Answers`.
4. If nothing is left open, the agent writes `Approved: <date> self-approved — <reason>` on the
   `Prototype:` line and builds in the same iteration.
5. If one question is genuinely the owner's, the agent stops. The owner answers in `## Answers`
   and writes `Approved: <date>` on the `Prototype:` line (or names corrections — they are made
   in the same file and shown again).

## What a prototype contains

A prototype is what a person looks at when deciding yes or no. So it has:

- **Now** — what the user sees today, reproduced honestly with real strings and real numbers.
  If the module is about a defect, this *is* the reproduction.
- **Proposal** — the same place after the change. Beside it, not instead of it.
- **The rule in words** — one or two paragraphs: what changes and why. A prototype that has to
  be decoded approves nothing.
- **Edge cases** — the states that are easy to miss: empty, nothing matches, very long text,
  error, slow, no permission.
- **Questions** — each with its answer and the source that settles it, or marked as open for
  the owner.

What it never contains: invented numbers. If a number was not measured, it says so.

## Technically

One self-contained `.html` file per module: all CSS and JS inline, images as `data:` URIs. No
build, no dependencies — the file opens with a double click.

**A prototype looks like the product, not like a sketch of it.** Colours, type, radii, control
heights and icons come from the application's own tokens: `frontend/src/index.css`. Read the values from the source or from the running app, do not guess them.
Start from `_template.html`.

`index.html` is the contents page: every prototype with its status. It is updated with every
new file.

## Other kinds of page

- **Reviews** — pages that propose nothing and show what already exists, so the owner can decide
  where to go. They have no branch, so the name is descriptive (`checkout-review.html`), and
  `index.html` marks them `review`. Decisions from a review become ordinary modules.
- **Clickable mock-ups** — a whole flow on stubs, no backend, so the owner can click through it
  and feel what is wrong instead of reading about it. Same rules: one self-contained file,
  corrections in the same file.

## After approval

The approved prototype is the spec. If the built screen and the page disagree, the page is
right. If the build forces a departure, the reason is written into the same prototype file and
on the module's `[x]` line.
