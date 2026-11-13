# <<Programme name>> — master technical brief

<!-- Copy to loop/modules/<name>-master.md (beside open/ and done/, not inside them).
     Use a master brief when one requirements document is too large for a single module:
     it holds everything the child modules share, so no child has to repeat it and no child
     can quietly decide it differently. The runner injects this file into every child iteration. -->

Status: **<<draft | approved <date> | implemented through module N>>**
Owner decisions incorporated: **<<date>>**
Execution queue: `loop/modules/progress-modules.md`

This is the mandatory parent specification for the child modules listed in section 9. An agent
must still read the current child file, the repository specs, the current code and the current
migration head before making changes.

## 1. Precedence and change control

Use these sources in this order:

1. owner decisions in this document;
2. this programme's security, isolation and compatibility rules;
3. the selected child module, for its bounded deliverable;
4. current repository specs and code, for facts about the implementation.

The child may add detail but may not weaken this document. If the code makes a child impossible
or contradicts this brief, do not improvise a broader architecture: record the finding and stop
on the one genuine owner decision. Never pull a later child into the current one because the
final state is described here.

## 2. Objective

<<What the whole programme achieves, and what must be preserved while it happens.>>

## 3. Fixed owner decisions

| # | Decision | Date |
| --- | --- | --- |
| 1 | <<...>> | <<...>> |

## 4. Scope and explicit non-goals

<<In. Out. Later.>>

## 5. Shared data model

<<Tables and fields more than one child touches. Each child adds only its own.>>

## 6. Shared rules

<<Security, isolation, naming, error format, compatibility — whatever every child must obey.>>

## 7. Migration and release boundary

<<What can ship independently; what must ship together; what stays switched off until the end.>>

## 8. Programme-wide acceptance

<<What must hold when all children are done.>>

## 9. Ordered child modules

| # | Module file | Repo | Delivers | Depends on |
| --- | --- | --- | --- | --- |
| 1 | `loop/modules/open/<<slug>>.md` | <<repo>> | <<...>> | — |

## 10. Required external inputs before launch

<<Accounts, keys, legal text, DNS — the owner's side.>>
