# Kyu OS — Setup Master (CachyOS → Niri + Noctalia)

Script de restauración automática del sistema. Convierte una instalación base de **CachyOS** en un entorno **Kyu OS** completo: instala las apps, despliega tus dotfiles de Niri/Noctalia, aplica el tema morado **Horus**, el cursor, el login, el branding de arranque, configura Zen y deja la batería con límite de carga.

**Idioma / Language:** [Español](#español) · [English](#english)

---

## Español

### Instalación rápida

Sobre una **CachyOS** recién instalada, un solo comando deja Kyu OS completo:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Johankyuk/kyu-os/main/bootstrap.sh)
```

El bootstrap instala git, clona este repo en `~/kyu-os` y lanza el setup. Para clonar en otra ruta, exporta `KYU_OS_DIR=~/otra/ruta` antes. Si ya tienes el repo clonado, salta el bootstrap y corre `kyu-setup` directo.

### Requisitos previos

- **CachyOS** instalado (base funcional, con systemd-boot como bootloader).
- **AUR helper**: `paru` o `yay`. Necesario para instalar; los modos `kyu-sync`, `kyu-check` y `kyu-dry` no lo requieren.
- **Conexión a internet** estable; se descargan bastantes paquetes.
- Usuario con permisos **sudo**. El script pide la contraseña al inicio y la mantiene viva mientras corre.
- **No** se corre como root: el script aborta si detecta `sudo bash …`.

### Estructura de archivos

El repo vive en `~/kyu-os/`. El script busca sus recursos en su misma carpeta, así que funciona sin importar desde dónde se ejecute mientras todo esté junto:

```
~/kyu-os/
├── setup_master.sh
├── README.md
├── bootstrap.sh
├── config/                  <- dotfiles que se despliegan en ~/.config
│   ├── niri/                   (config.kdl + cfg/*.kdl: focus ring, keybinds…)
│   ├── noctalia/               (settings.json)
│   ├── foot/                   (foot.ini)
│   └── zen/                    (tema Horus para Zen)
│       ├── policies.json         (políticas de privacidad)
│       ├── user.js               (prefs: userChrome, acento, telemetría off)
│       ├── userChrome.css        (chrome Horus)
│       ├── userContent.css       (acentos por sitio: YouTube, Claude)
│       └── darkreader-horus.json (config de Dark Reader, import manual)
├── local-bin/               <- scripts personales → ~/.local/bin
├── sugar-dark-kyu/          <- tema SDDM pre-customizado  [LO APORTAS TÚ]
├── PFP/                     <- foto(s) de perfil; Noctalia las lee de aquí  [LO APORTAS TÚ]
└── Wallpapers/              <- wallpapers; Noctalia los lee de aquí          [LO APORTAS TÚ]
```

`config/` es la **fuente de verdad** de los dotfiles: se despliega sobre `~/.config` en cada corrida. Edita las configs aquí (en el repo), no en `~/.config` directo, o el siguiente deploy las pisa.

### Uso

```bash
kyu-setup     # muestra el plan, pide confirmación y procede
kyu-dry       # opcional: solo el plan, sin tocar nada ni preguntar
```

La corrida normal **muestra primero el plan** y **pide confirmación** (`¿Proceder? [s/N]`) antes de tocar nada. Solo continúa si respondes `s`.

**Reinicio:** la **primera corrida completa reinicia el equipo solo** (cuenta de 10 s, `Ctrl+C` para cancelar). A partir de la segunda ya no reinicia. Con `kyu-solo` nunca reinicia (es parcial).

### Atajos (quedan en PATH tras la primera corrida)

| Comando | Qué hace |
|---|---|
| `kyu-setup` | Corre el setup desde cualquier carpeta (plan + confirmación) |
| `kyu-update` | Actualiza todo: mirrors + repos/AUR (`paru -Syu`) y Flatpaks |
| `kyu-check` | Healthcheck: valida que todo quedó bien |
| `kyu-sync` | Vuelca tu `~/.config` actual de vuelta al repo, listo para commitear |
| `kyu-dry` | Simula la corrida completa sin tocar nada |
| `kyu-solo` | Corre solo la(s) sección(es) indicada(s): `kyu-solo lista`, `kyu-solo cursor`, `kyu-solo 7,9`. No reinicia |
| `kyu-limpia` | Borra restos de versiones viejas del setup. Pide confirmación; no toca el sistema |
| `kyu-verifica` | Compara los dotfiles del repo vs tu `~/.config` activa, sin tocar nada |
| `apps` | Lista o lanza cualquier app, **incluidas las ocultas**: `apps` lista, `apps <id>` lanza |
| `proyectar` | Gestión de monitores; `proyectar toggle` (Mod+P) alterna duplicar ↔ extendido |

El launcher de Noctalia queda **minimalista**: solo apps de uso diario; el resto sigue instalado pero oculto. Para correr algo oculto usa `apps` o la terminal (Mod+Return).

### Qué hace

El setup corre en secciones modulares. Un fallo en una no detiene las demás; al final se listan los fallos reales.

1. **Snapshot pre-setup** — snapshot con snapper antes de tocar nada (si está configurado para root).
2. **Actualizar sistema** — `pacman -Syu`.
3. **Paquetes de repos** — Niri, Zen, Code-OSS, Steam, LibreOffice, OBS, Audacity, VLC, mpv, imv, Foot, Thunar + plugins, fuentes Nerd, etc., en una sola transacción.
4. **Paquetes AUR** — Noctalia, juguetes de terminal, Catppuccin, Bibata, rar, en una sola invocación del helper.
5. **Flatpak** — instala la CLI de Flatpak y habilita el remoto **Flathub** (instalas apps desde flathub.org vía internet, sin tienda local).
6. **Sober (Roblox)** — vía Flatpak, con su `config.json` y fflags.
7. **Configs + scripts** — despliega `config/` en `~/.config` (Niri, Noctalia, Foot) con backup de lo previo, copia `local-bin/`. El `foot.ini` va con sintaxis moderna normalizada.
8. **Generables** — color scheme "Kyu OS", reloj 12h (AM/PM), fix de ventana negra de Steam, fastfetch con logo ASCII en morado Horus (`c8a6f9`).
9. **Limpieza del lanzador** — oculta del launcher las apps que no son de uso directo.
10. **GTK / iconos / Thunar** — Papirus violet, Thunar por defecto, portal del selector en morado.
11. **Cursor morado Bibata** — genera y aplica Bibata-Modern-Purple en todos los entornos. Es lo lento; se omite si ya está.
12. **SDDM Sugar-Dark** — login morado en español con reloj 12h.
13. **Branding Kyu OS (systemd-boot)** — menú de arranque "Kyu OS" / "Kyu OS (LTS)", arranque en negro.
14. **Steam** — wrapper en `/usr/local/bin/steam` que antepone `-cef-disable-gpu` (fix de la pantalla negra del cliente CEF en la iGPU Intel).
15. **Recursos y energía** — verifica PFP/ y Wallpapers/ en el repo y configura el límite de carga de batería.
16. **Utilidad de proyección** — instala `proyectar` para manejar el monitor externo vía IPC de Niri.
17. **Zen** — tema Horus para Zen nativo: `policies.json` a `/opt/zen-browser-bin/distribution/`, y `userChrome.css` + `userContent.css` + `user.js` a todos los perfiles de `~/.zen`. Las extensiones llegan por la **sincronización de tu cuenta Mozilla** al iniciar sesión; la paleta de **Dark Reader** se importa a mano (`darkreader-horus.json`).

### Tema Horus

Paleta morada derivada del ojo de Horus, aplicada en todo el stack (Noctalia, Niri, foot, fastfetch, SDDM, cursor, Zen):

| Rol | Hex |
|---|---|
| Primary | `#8b45f7` |
| Secondary | `#c44fe6` |
| Tertiary | `#e85fb0` |
| Error | `#fb5c7e` |
| Base | `#18092b` |
| Terminal | `#1c0e33` |

### Advertencias

El script **elimina** software redundante: navegadores (Firefox, Chromium, Chrome, Brave → deja Zen), terminales (Alacritty, Kitty, WezTerm → deja Foot), gestores de archivos (Nautilus, Dolphin, Nemo, Caja, PCManFM → deja Thunar).

El despliegue de configs **respalda** lo previo en `~/.config-backup-<fecha>/` antes de sobrescribir.

El branding "Kyu OS" es **puramente visual**: el sistema sigue siendo CachyOS por debajo; no se toca `/etc/os-release`.

El paquete `rar` es propietario y entra en conflicto con `unrar`; el script quita `unrar` automáticamente antes de instalar `rar`.

### Migrar a otra máquina

El despliegue es **unidireccional** (el repo pisa `~/.config`), así que lo que ajustes por GUI vive solo en el activo hasta que lo vuelques al repo.

**En la máquina vieja** — captura y sube:
```bash
kyu-sync
cd ~/kyu-os && git add -A && git commit -m "sync configs" && git push
```

**En la máquina nueva** — un solo comando + los pasos manuales de Zen:
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Johankyuk/kyu-os/main/bootstrap.sh)
```
Luego: instala `zen-browser-bin`, abre Zen una vez, `kyu-solo zen`, inicia sesión en tu cuenta Mozilla (trae las extensiones) e importa `config/zen/darkreader-horus.json` en Dark Reader.

**Regla de oro:** tocas algo por GUI → `kyu-sync` + commit antes de cerrar.

### Notas técnicas

- **Configs por carpeta:** el despliegue de `config/` reemplaza los antiguos parches sed/heredoc. Editas el archivo, no el script.
- **Instalación agrupada:** repos en una transacción de pacman, AUR en una del helper. En máquina ya configurada pasa de minutos a segundos (`--needed` omite lo presente).
- **Branding systemd-boot:** el título lo fija `/usr/local/bin/kyu-os-title`, reaplicado por el hook `zzz-kyu-branding.hook` tras cada autogen. El splash de CachyOS se apaga (Plymouth fuera del initramfs + `plymouth-start.service` enmascarado).
- **Apagado (limitación conocida):** `systemd-shutdown` sube el log level en su fase final, así que quedan ~3-4 líneas <1 s pese a `quiet`. El *broadcast* "going down" sí se eliminó con `--no-wall` en las acciones de Noctalia.
- **Límite de batería:** servicio `battery-charge-limit.service` que escribe el umbral en cada arranque (no usa TLP).
- **Robustez:** `set -uo pipefail` sin `set -e` (un fallo aislado no aborta). Guard de no-root, check de red, keep-alive de sudo, snapshot previo y resumen de fallos. Logs en `~/.local/state/kyu-os/logs/`.
- **Idempotencia:** seguro de correr varias veces; detecta lo instalado y reescribe sin duplicar.

---

## English

### Quick install

On a freshly installed **CachyOS**, a single command sets up the full Kyu OS:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Johankyuk/kyu-os/main/bootstrap.sh)
```

The bootstrap installs git, clones this repo into `~/kyu-os`, and launches the setup. To clone elsewhere, export `KYU_OS_DIR=~/other/path` first. If the repo is already cloned, skip the bootstrap and run `kyu-setup` directly.

### Requirements

- **CachyOS** installed (working base, systemd-boot as bootloader).
- **AUR helper**: `paru` or `yay`. Needed to install; the `kyu-sync`, `kyu-check`, and `kyu-dry` modes don't require it.
- Stable **internet** connection; a fair number of packages are downloaded.
- A user with **sudo**. The script asks once at the start and keeps it alive while running.
- It does **not** run as root: the script aborts if it detects `sudo bash …`.

### File layout

The repo lives in `~/kyu-os/`. The script locates its resources within its own folder, so it works regardless of where it's run from as long as everything stays together:

```
~/kyu-os/
├── setup_master.sh
├── README.md
├── bootstrap.sh
├── config/                  <- dotfiles deployed into ~/.config
│   ├── niri/                   (config.kdl + cfg/*.kdl: focus ring, keybinds…)
│   ├── noctalia/               (settings.json)
│   ├── foot/                   (foot.ini)
│   └── zen/                    (Horus theme for Zen)
│       ├── policies.json         (privacy policies)
│       ├── user.js               (prefs: userChrome, accent, telemetry off)
│       ├── userChrome.css        (Horus chrome)
│       ├── userContent.css       (per-site accents: YouTube, Claude)
│       └── darkreader-horus.json (Dark Reader config, manual import)
├── local-bin/               <- personal scripts → ~/.local/bin
├── sugar-dark-kyu/          <- pre-customized SDDM theme  [YOU PROVIDE]
├── PFP/                     <- profile picture(s); read by Noctalia  [YOU PROVIDE]
└── Wallpapers/              <- wallpapers; read by Noctalia          [YOU PROVIDE]
```

`config/` is the **source of truth** for dotfiles: it's deployed over `~/.config` on every run. Edit configs here (in the repo), not in `~/.config` directly, or the next deploy overwrites them.

### Usage

```bash
kyu-setup     # shows the plan, asks for confirmation, then proceeds
kyu-dry       # optional: plan only, touches nothing
```

A normal run **shows the plan first** and **asks for confirmation** (`Proceed? [y/N]`) before touching anything. It only continues on `s` (yes).

**Reboot:** the **first full run reboots automatically** (10 s countdown, `Ctrl+C` to cancel). From the second run on it no longer reboots. `kyu-solo` never reboots (partial run).

### Shortcuts (land in PATH after the first run)

| Command | What it does |
|---|---|
| `kyu-setup` | Runs the setup from any folder (plan + confirmation) |
| `kyu-update` | Updates everything: mirrors + repos/AUR (`paru -Syu`) and Flatpaks |
| `kyu-check` | Healthcheck: validates the result |
| `kyu-sync` | Dumps your current `~/.config` back into the repo, ready to commit |
| `kyu-dry` | Simulates the full run without touching anything |
| `kyu-solo` | Runs only the given section(s): `kyu-solo lista`, `kyu-solo cursor`, `kyu-solo 7,9`. No reboot |
| `kyu-limpia` | Removes leftovers from old setup versions. Asks for confirmation; doesn't touch the system |
| `kyu-verifica` | Compares repo dotfiles vs your active `~/.config`, without touching anything |
| `apps` | Lists or launches any app, **including hidden ones**: `apps` lists, `apps <id>` launches |
| `proyectar` | Monitor management; `proyectar toggle` (Mod+P) switches mirror ↔ extended |

The Noctalia launcher stays **minimal**: only daily-use apps show; the rest stay installed but hidden. To run a hidden one use `apps` or the terminal (Mod+Return).

### What it does

The setup runs in modular sections. A failure in one doesn't stop the others; real failures are listed at the end.

1. **Pre-setup snapshot** — snapper snapshot before touching anything (if configured for root).
2. **System update** — `pacman -Syu`.
3. **Repo packages** — Niri, Zen, Code-OSS, Steam, LibreOffice, OBS, Audacity, VLC, mpv, imv, Foot, Thunar + plugins, Nerd fonts, etc., in a single transaction.
4. **AUR packages** — Noctalia, terminal toys, Catppuccin, Bibata, rar, in a single helper invocation.
5. **Flatpak** — installs the Flatpak CLI and enables the **Flathub** remote (install apps from flathub.org over the internet, no local store).
6. **Sober (Roblox)** — via Flatpak, with its `config.json` and fflags.
7. **Configs + scripts** — deploys `config/` into `~/.config` (Niri, Noctalia, Foot) with a backup of the previous state, copies `local-bin/`.
8. **Generables** — "Kyu OS" color scheme, 12h clock (AM/PM), Steam black-window fix, fastfetch with its ASCII logo in Horus purple (`c8a6f9`).
9. **Launcher cleanup** — hides non-daily apps from the launcher.
10. **GTK / icons / Thunar** — Papirus violet, Thunar as default, purple file-picker portal.
11. **Bibata purple cursor** — generates and applies Bibata-Modern-Purple everywhere. The slow part; skipped if already present.
12. **SDDM Sugar-Dark** — purple Spanish login with a 12h clock.
13. **Kyu OS branding (systemd-boot)** — boot menu shows "Kyu OS" / "Kyu OS (LTS)", black boot.
14. **Steam** — a wrapper at `/usr/local/bin/steam` prepending `-cef-disable-gpu` (fixes the CEF client black screen on Intel iGPU).
15. **Resources & power** — checks PFP/ and Wallpapers/ in the repo and sets the battery charge limit.
16. **Projection utility** — installs `proyectar` to drive the external monitor via Niri IPC.
17. **Zen** — Horus theme for native Zen: `policies.json` into `/opt/zen-browser-bin/distribution/`, and `userChrome.css` + `userContent.css` + `user.js` into every `~/.zen` profile. Extensions arrive through **Mozilla account sync** on sign-in; the **Dark Reader** palette is imported manually (`darkreader-horus.json`).

### Horus theme

Purple palette derived from the Eye of Horus, applied across the whole stack (Noctalia, Niri, foot, fastfetch, SDDM, cursor, Zen):

| Role | Hex |
|---|---|
| Primary | `#8b45f7` |
| Secondary | `#c44fe6` |
| Tertiary | `#e85fb0` |
| Error | `#fb5c7e` |
| Base | `#18092b` |
| Terminal | `#1c0e33` |

### Caveats

The script **removes** redundant software: browsers (Firefox, Chromium, Chrome, Brave → keeps Zen), terminals (Alacritty, Kitty, WezTerm → keeps Foot), file managers (Nautilus, Dolphin, Nemo, Caja, PCManFM → keeps Thunar).

Config deployment **backs up** the previous state into `~/.config-backup-<date>/` before overwriting.

The "Kyu OS" branding is **purely cosmetic**: the system is still CachyOS underneath; `/etc/os-release` is untouched.

The `rar` package is proprietary and conflicts with `unrar`; the script removes `unrar` automatically before installing `rar`.

### Migrating to another machine

Deployment is **one-directional** (the repo overwrites `~/.config`), so anything you tweak via GUI lives only in the active config until you dump it back to the repo.

**On the old machine** — capture and push:
```bash
kyu-sync
cd ~/kyu-os && git add -A && git commit -m "sync configs" && git push
```

**On the new machine** — one command + Zen's manual steps:
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Johankyuk/kyu-os/main/bootstrap.sh)
```
Then: install `zen-browser-bin`, open Zen once, run `kyu-solo zen`, sign in to your Mozilla account (brings the extensions), and import `config/zen/darkreader-horus.json` in Dark Reader.

**Golden rule:** touch something via GUI → `kyu-sync` + commit before closing.

### Technical notes

- **Per-folder configs:** the `config/` deploy replaced the old sed/heredoc patches. You edit the file, not the script.
- **Batched installs:** repos in one pacman transaction, AUR in one helper run. On an already-configured machine this drops from minutes to seconds (`--needed` skips what's present).
- **systemd-boot branding:** the title is set by `/usr/local/bin/kyu-os-title`, reapplied by the `zzz-kyu-branding.hook` after each autogen. The CachyOS splash is disabled (Plymouth out of the initramfs + `plymouth-start.service` masked).
- **Shutdown (known limitation):** `systemd-shutdown` raises the log level in its final phase, so ~3-4 lines flash for <1 s despite `quiet`. The "going down" broadcast *is* gone, via `--no-wall` in Noctalia's actions.
- **Battery limit:** a `battery-charge-limit.service` writes the threshold on every boot (no TLP).
- **Robustness:** `set -uo pipefail` without `set -e` (an isolated failure doesn't abort). No-root guard, network check, sudo keep-alive, prior snapshot, and a failure summary. Logs in `~/.local/state/kyu-os/logs/`.
- **Idempotency:** safe to run multiple times; detects what's installed and rewrites without duplicating.
