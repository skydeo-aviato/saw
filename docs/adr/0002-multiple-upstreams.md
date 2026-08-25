# SAW carries skills from more than one upstream

SAW started as a copy of Matt Pocock's skills alone. `unslop` comes from Lauren Tan's `pstack`,
inside `cursor/plugins`, so SAW now draws from two upstreams and the design has to survive a third.

Two rules make that work, and both outlive whatever tooling is in place.

**Pin to a tag where the upstream cuts them, a commit SHA where it does not.** `cursor/plugins`
publishes no tags at all. Tracking a branch instead would make every copy a different tree, so the
pin stops being a pin and "which version do we have" stops having an answer.

**Bare skill names are unique across every upstream.** A skill's directory name is the command
namespace, so two upstreams shipping the same name is a collision with nowhere to go. `pstack` ships
a `tdd` and a `teach` that Matt Pocock already claims. Resolving that would need a rename, which
ADR 0001 rules out, so `unslop` is the only skill we take from `pstack`.

## Consequences

A useful skill can be unreachable purely because of its name, and the answer is to leave it
upstream rather than rename it. That is a real cost and we accept it: a renamed skill silently
stops matching upstream's docs, and nobody remembers why six months later.

Superseded in part by ADR 0004, which replaced the machinery that used to enforce these rules. The
rules still hold. Nothing checks them now.
