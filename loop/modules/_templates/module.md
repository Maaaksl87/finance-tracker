# <<Module title — what changes, said as an outcome>>

<!-- Copy to loop/modules/open/<slug>.md, fill it, then add the queue line.
     A small module may drop sections 4, 7–10. Sections 1, 3, 5, 12 and 13 are never dropped. -->

Programme: **<<programme name>>** <!-- delete these three lines for a standalone module -->
Module: **<<N of M>>**
Parent technical brief: `loop/modules/<<name>>-master.md` — mandatory (<<§ that apply>>).

## 1. Task

**<<One paragraph, in bold, that states the whole deliverable in a single breath: what exists
after this module that did not exist before.>>**

Branch: `feature/<<slug>>`
Repository: <<[backend] | [frontend] | [both]>>
Prototype required before code: `loop/prototypes/<<slug>>.html` — <<which screens>>.
<!-- or:  No prototype: <<why nothing is on screen>> -->
Depends on: <<modules that must already be merged>>.

## 2. Where this came from, and what to read first

<<The source: the owner's requirements document, an idea file, a finding from an earlier module.
Quote the sentences that bind. Then the reading list — exact files, and why each one matters.>>

## 3. Goal

<<The result as one person's experience, in plain sentences: who opens what, what they see, what
they can now do, and what stays exactly as it was.>>

## 4. Context — what actually exists today

<<Facts about the current code, verified against named files and lines on the integration
branch, with the date. What is there, what is missing, what looks reusable and is not.
This section is what stops the agent from re-discovering the codebase and from building on an
assumption. Write "verified" only for what was actually opened.>>

## 5. Scope — what this module does not do

- **It does not <<...>>.** <<Which module does, or why nobody does.>>
- <<Every neighbouring thing a reasonable agent might be tempted to pull in.>>

## 6. Decisions (fixed for this implementation)

<<Numbered decisions, each with its reason. A decision written here is not re-opened during the
iteration. Where the owner decided, say so with the date.>>

## 7. Data model

<<Tables, columns, types, constraints, indexes; the migration and its downgrade.>>

## 8. API

<<Each endpoint: method, path, who may call it, request, response, status codes.>>

## 9. Refusals and copy — every sentence

<<Every error and every message the user can see, verbatim, with the condition that produces it.
The agent does not invent wording.>>

## 10. Screens (prototype-gated)

<<Each screen and state. What the prototype must show. Edge cases: empty, too long, error,
slow, no permission.>>

## 11. Security and isolation tests

<<The tests that must exist: who must NOT be able to do what.>>

## 12. Process — branch, prototype, gate

<<Order of work inside the iteration; the gate to run; what must still boot after the merge.>>

## 13. Acceptance criteria

1. <<A statement that is true or false, checkable by a test or a named manual step.>>
2. <<...>>

## 14. Owner actions

<<Things only a person can do, before or after: a key to create, a DNS record, a decision.
"None" is a valid answer.>>

## 15. Findings

<!-- Filled in by the agent when it closes the module: what it learned that the next module
     needs, departures from this file and why. -->
