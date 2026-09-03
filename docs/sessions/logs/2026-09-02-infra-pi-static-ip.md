# 2026-09-02 — Infra: the Pi's LAN address, pinned

Ad-hoc. Reported as "prod is down, spin it back up." Prod was never down.

## What actually happened

The Pi rebooted at 14:20 (cable management) and came back on `192.168.0.43`
instead of `192.168.0.42`. Public DNS and the Tailscale subnet route both still
pointed at `.42`, so every LAN request to `vireohome.app` timed out while the app
itself answered 200 the whole time on its tailnet address.

There was no DHCP reservation in effect for this host. The Pi 5 took `.42` from
the pool on the 2026-08-16 migration — the 3B had just vacated it — and held it
across two weeks of ~24h renewals. The first reboot since was enough to lose it.

## What was done

`eth0` pinned in NetworkManager: `ipv4.method manual`, `192.168.0.42/24`, gw
`192.168.0.1`. Applied through a detached `systemd-run` unit with a 300s
auto-rollback armed, verified, rollback cancelled. Survives reboots.

The Tailscale route needed no change — it was advertising `192.168.0.42/32`
throughout, so off-LAN access restored itself when the address did.

## Still owed

**A DHCP reservation for `88:a2:9e:d4:e7:33` at the router.** The static and the
reservation are not redundant: if `.42` falls inside the DHCP pool the router
doesn't know it's taken and can lease it to a new device. The reservation is what
prevents that conflict; the static is what survives a reboot.

## The wrong turn, recorded

Two hours of this session chased a Pi-side ssh lockout that did not exist.
`ssh vireo-pi` was prompting for a passphrase because the Mac rebooted 2026-08-29
and `~/.ssh/config` scopes `AddKeysToAgent`/`UseKeychain` to `Host github.com`
only, so the agent came back empty. Every diagnostic ran with `BatchMode=yes`,
which forbids the prompt and reports `Permission denied (publickey,password)` —
identical to a rejected key. That produced a false StrictModes theory and a false
reimage scare, both disproved later by an unchanged host key and a Tailscale node
`Created` of 2026-08-16.

`ssh-add -l` distinguishes the two in one command. Check it before concluding
anything about the remote host. Memory: `project-pi-ssh-passphrase-agent`.

## Facts the repo had never recorded

- eth0 MAC `88:a2:9e:d4:e7:33` (wlan0 `…:34`, down, never addressed)
- OS is Debian 13 trixie
- `journald` is not persistent — the reboot cause was unrecoverable from the Pi
