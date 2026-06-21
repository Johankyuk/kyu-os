**Setup Master — CachyOS → Kyu OS (Niri + Noctalia)**  
Script de restauración automática del sistema. Convierte una instalación base de  
   
 CachyOS en un entorno Kyu OS completo: instala las apps, despliega tus dotfiles  
   
 de Niri/Noctalia, aplica el tema morado, el cursor, el login y el branding de  
   
 arranque, y deja la batería con límite de carga.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNBCkLfFR7wwIgHRiywEZJWQZeZ2ao9AAD+4lyruzq+ngAA8Nr1AOIEBeX8aGZPAAAAAElFTkSuQmCC)  
**Instalación rápida**  
Sobre una **CachyOS** recién instalada, un solo comando deja Kyu OS completo:  
bash <(curl -fsSL https://raw.githubusercontent.com/Johankyuk/kyu-os/main/bootstrap.sh)  
   
El bootstrap instala git, clona este repo en ~/kyu-os y lanza el setup. Acepta  
   
 los mismos flags que el setup (ej. --dry-run). Para clonar en otra ruta, exporta  
   
 KYU_OS_DIR=~/otra/ruta antes. Si ya tienes el repo clonado, salta el bootstrap y  
   
 corre kyu-setup directo.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OYQ1AABSAwY8JoIGqr4Z6Eoiggn9mu0twy8wc1RkAAH9xbdVa7V9PAAB47X4A9C4EIsmYmgsAAAAASUVORK5CYII=)  
**Requisitos previos**  
Antes de correr el script:  
- **CachyOS** instalado (base funcional, con systemd-boot como bootloader).  
- **AUR helper**: paru o yay. Necesario para instalar; los modos  
 --capturar, --check y --dry-run no lo requieren.  
- **Conexión a internet** estable; se descargan bastantes paquetes.  
- Usuario con permisos **sudo**. El script pide la contraseña al inicio y la  
   
 mantiene viva mientras corre (no la vuelve a pedir a mitad).  
- **No** se corre como root: el script aborta si detecta sudo bash ....  
**Estructura de archivos**  
El repo vive en ~/kyu-os/ (donde lo clona el bootstrap). El script busca sus  
   
 recursos (configs, tema de SDDM, imágenes) **en su misma carpeta**, así que  
   
 funciona sin importar desde dónde se ejecute, mientras todo el contenido esté  
   
 junto:  
~/kyu-os/  
 ├── setup_master.sh  
 ├── README.md  
 ├── config/                 <- dotfiles que se despliegan en ~/.config  
 │   ├── niri/                  (config.kdl + cfg/*.kdl: focus ring, keybinds…)  
 │   ├── noctalia/              (settings.json)  
 │   └── foot/                  (foot.ini)  
 ├── local-bin/              <- scripts personales → ~/.local/bin (puede ir vacío)  
 ├── sugar-dark-kyu/         <- tema SDDM pre-customizado  [LO APORTAS TÚ]  
 │   ├── theme.conf             (colores morados, reloj 12h, traducciones)  
 │   ├── Main.qml  
 │   ├── KyuHE.jpeg             <- fondo de SDDM (systemd-boot no usa fondo de imagen)  
 │   └── ...  
 ├── PFP/                    <- foto(s) de perfil; Noctalia las lee de aquí   [LO APORTAS TÚ]  
 └── Wallpapers/             <- wallpapers; Noctalia los lee de aquí          [LO APORTAS TÚ]  
   
config/ es la **fuente de verdad** de los dotfiles: se despliega sobre  
   
 ~/.config en cada corrida. Edita las configs aquí (en el repo), no en ~/.config  
   
 directo, o el siguiente deploy las pisa.  
Las carpetas marcadas no vienen en el paquete:  
Si sugar-dark-kyu/ falta, SDDM queda con su tema por defecto; el  
   
 branding del menú de arranque (título "Kyu OS") no depende de ese tema y se aplica  
   
 igual. El resto del setup funciona igual.  
**Uso**  
Si usaste el bootstrap, el setup ya corrió. Para re-ejecutarlo luego, usa el atajo  
   
 kyu-setup desde cualquier carpeta (la primera vez, sin atajos aún:  
   
 bash ~/kyu-os/setup_master.sh):  
kyu-setup              # muestra el plan, pide confirmación y procede  
 kyu-dry                # opcional: solo el plan, sin tocar nada ni preguntar  
   
La corrida normal **muestra primero el plan** (qué instalaría y qué configs  
   
 desplegaría) y **pide confirmación** (¿Proceder? [s/N]) antes de tocar nada. Solo  
   
 continúa si respondes s; cualquier otra cosa cancela sin modificar el sistema. Ya  
   
 no hace falta correr --dry-run y luego de nuevo: es un solo paso. El --dry-run  
   
 queda como atajo para solo inspeccionar el plan y salir.  
**Flags:**  
| | |  
|-|-|  
| **Flag** | **Efecto** |   
| --skip-update | No corre pacman -Syu (iteraciones rápidas) |   
| --dry-run | Solo reporta qué instalaría/desplegaría; no toca nada |   
| --check | Healthcheck post-setup: valida el estado y sale |   
| --capturar | Vuelca tu config activa (~/.config) de vuelta al repo y sale. No instala nada ni pide sudo |   
| --bateria=N | Límite de carga de batería en N% (default 80; 0 = off) |   
| --no-bateria | No configura el límite de carga |   
| --limpiar | Borra restos de versiones viejas del setup (~/Imágenes/PFP y Wallpapers, log viejo en el repo) y sale. Pide confirmación; no toca el sistema |   
   
**Reinicio:** la  **primera corrida completa reinicia el equipo solo** (cuenta de  
   
 10 s con Ctrl+C para cancelar), para aplicar todo de una. A partir de la segunda  
   
 corrida ya no reinicia: solo avisa con sudo reboot si algún cambio lo amerita.  
   
 Con --solo=… nunca reinicia (es parcial).  
**Atajos (quedan en PATH tras la primera corrida)**  
| | |  
|-|-|  
| **Comando** | **Qué hace** |   
| kyu-setup | Corre el setup desde cualquier carpeta (acepta los mismos flags) |   
| kyu-update | Actualiza todo: mirrors + repos/AUR (paru -Syu) y Flatpaks |   
| kyu-check | Healthcheck: valida que todo quedó bien (atajo de --check) |   
| kyu-sync | Vuelca tu ~/.config actual de vuelta al repo, listo para commitear (atajo de --capturar) |   
| kyu-dry | Simula la corrida completa sin tocar nada (atajo de --dry-run) |   
| kyu-verifica | Compara los dotfiles del repo vs tu ~/.config activa, sin tocar nada |   
| apps | Lista o lanza cualquier app, **incluidas las ocultas** del launcher: apps lista (id → nombre), apps <id> lanza |   
| proyectar | Gestión de monitores; proyectar toggle (Mod+P) alterna duplicar ↔ extendido |   
   
El launcher de Noctalia queda **minimalista**: solo se muestran las apps de uso  
   
 diario (navegador, ofimática, multimedia, etc.); el resto sigue instalado pero  
   
 oculto. Para correr algo oculto usa apps o la terminal (Mod+Return).  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/jVEMYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4rLBc059ysnAAAAAElFTkSuQmCC)  
**Migrar a otra máquina**  
Con el repo en git, migrar es trivial. El despliegue es **unidireccional** (el repo  
   
 pisa ~/.config), así que lo que ajustes por GUI vive solo en el activo hasta que  
   
 lo vuelques al repo. Antes de migrar hay que capturar ese estado, o el setup  
   
 desplegará una versión vieja en la máquina nueva.  
**En la máquina vieja (origen)** — captura y sube tus cambios:  
kyu-sync                       # vuelca ~/.config -> repo (niri, foot, noctalia)  
 cd ~/kyu-os  
 git add -A && git commit -m "sync configs" && git push  
   
kyu-sync deja un respaldo del repo previo en .repo-backup-<fecha>/ por si algo  
   
 se volcó mal, y es idempotente: si el repo ya refleja tu activo, no toca nada.  
**En la máquina nueva (destino)** — un solo comando:  
bash <(curl -fsSL https://raw.githubusercontent.com/Johankyuk/kyu-os/main/bootstrap.sh)  
   
Eso clona el repo e instala apps, despliega dotfiles, aplica tema/cursor/login/  
   
 branding y deja la batería con límite. Cierra sesión y entra de nuevo, y listo.  
**Regla de oro:** tocas algo por GUI → kyu-sync + commit antes de cerrar. Así el  
   
 repo siempre está al día y la máquina nueva es un solo comando.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhQAQ60PcrIhnxgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseS14EKxPCORkAAAAASUVORK5CYII=)  
**Qué hace**  
El setup corre en 13 secciones. Un fallo en una no detiene las demás; al final se  
   
 listan los fallos reales (no pinta ✔ en todo a ciegas).  
1. **Snapshot pre-setup** — crea un snapshot con snapper antes de tocar nada  
   
 (red de seguridad; solo si snapper está configurado para root).  
2. **Actualizar sistema** — pacman -Syu (omitible con --skip-update).  
3. **Paquetes de repos** — Niri, Zen, Discord, Code-OSS, Steam, LibreOffice,  
   
 OBS, Audacity, VLC, mpv, imv, Foot, Thunar + plugins, fuentes Nerd, etc., **en una sola**  
 **  
 transacción**.  
4. **Paquetes AUR** — Noctalia, YouTube Music, juguetes de terminal, Catppuccin,  
   
 Bibata, rar, **en una sola invocación** del helper. El batch es no-interactivo:  
   
 salta la revisión de PKGBUILD (--skipreview) y resuelve solo el conflicto de  
 rar con unrar (ver Advertencias).  
5. **Sober (Roblox)** — vía Flatpak, con su config.json y fflags.  
6. **Configs + scripts** — despliega config/ en ~/.config (Niri, Noctalia,  
   
 Foot) con backup de lo previo, copia local-bin/ y elimina apps conflictivas.  
   
 El foot.ini se despliega con la **sintaxis moderna** ya normalizada  
   
 ([colors-dark] e initial-color-theme=dark; mata los warnings de foot ≥1.23).  
7. **Generables** — color scheme "Kyu OS" para Noctalia,  **reloj en 12h (AM/PM)**  
   
 en la barra/lockscreen, fix de ventana negra de Steam en Wayland, fastfetch con  
   
 logo ASCII propio y nombre "Kyu OS".  
8. **GTK / iconos / Thunar** — Catppuccin Mocha Mauve, Papirus violet, Thunar como  
   
 gestor por defecto, portal del selector de archivos en tono morado.  
9. **Cursor morado Bibata** — genera y aplica Bibata-Modern-Purple en todos los  
   
 entornos (XWayland, Qt, Flatpak). Es lo lento; se omite si ya está generado.  
10. **SDDM Sugar-Dark** — pantalla de login morada en español, con el  **reloj en**  
 **  
 12h (AM/PM)**.  
11. **Branding Kyu OS (systemd-boot)** — el menú de arranque muestra "Kyu OS" /  
   
 "Kyu OS (LTS)"; el arranque queda en negro (sin splash). El apagado sigue  
   
 mostrando unas líneas finales de systemd-shutdown (ver nota de branding).  
12. **Recursos y energía** — verifica que PFP/ y Wallpapers/ estén presentes en  
   
 el repo (Noctalia los lee de ahí; ya **no** se copian a ~/Imágenes) y configura  
   
 el límite de carga de batería.  
13. **Utilidad de proyección** — instala ~/.local/bin/proyectar para manejar el  
   
 monitor externo en caliente vía IPC de Niri (extender / solo-externo / solo-laptop  
   
 / espejo). Niri no clona salidas de forma nativa; el modo extender es el robusto  
   
 para presentar.  
**Advertencias**  
El script **elimina** software que considera redundante:  
- Navegadores: Firefox, Chromium, Chrome, Brave — deja solo Zen.  
- Terminales: Alacritty, Kitty, WezTerm — deja solo Foot.  
- Gestores de archivos: Nautilus, Dolphin, Nemo, Caja, PCManFM — deja solo Thunar.  
El despliegue de configs **respalda** lo previo en ~/.config-backup-<fecha>/  
   
 antes de sobrescribir, así que no pierdes lo que ya tenías.  
El branding "Kyu OS" es **puramente visual**: el sistema sigue siendo CachyOS por  
   
 debajo. No se modifica ningún paquete ni /etc/os-release.  
El paquete rar es software **propietario** (freeware de RARLab). Como rar  
   
 entra en conflicto con unrar (de los repos) y trae su propio unrar, el script  
   
 **quita ** **unrar** ** automáticamente** antes de instalar rar. Esto es necesario: sin  
   
 ese paso, el conflicto detiene la transacción de pacman al final del batch AUR (con  
   
 --noconfirm responde "No" al reemplazo) y arrastra a todos los demás paquetes del  
   
 batch con él. Si la build de rar falla, los .rar solo se podrán extraer, no crear;  
   
 el resto continúa.  
**Después de instalar**  
- **Teclado latam**: tu layout vive a nivel sistema, no en la config de Niri; en  
   
 una máquina limpia configúralo con localectl si hace falta.  
   
   
- Verifícalo con cat /sys/class/power_supply/BAT0/charge_control_end_threshold;  
   
 si pasa, hace falta un hook de systemd-sleep.  
- Cierra sesión y vuelve a entrar (cursor y SDDM); luego sudo reboot.  
- Corre kyu-check para validar que todo quedó.  
**Notas técnicas**  
**Configs por carpeta.** El despliegue de config/ reemplaza los antiguos parches  
   
 sed/heredoc de focus ring, keybinds, cursor y gestures: ahora vienen ya correctos  
   
 en los .kdl. Editas el archivo, no el script.  
**Instalación agrupada.** Repos en una transacción de pacman y AUR en una del  
   
 helper, en vez de una llamada por paquete. En máquina ya configurada, la parte de  
   
 paquetes pasa de minutos a segundos (cada paquete presente se omite con --needed).  
**Branding de systemd-boot.** El título del menú no es configurable de forma fiable  
   
 en esta versión de sdboot-manage: su autogen lo deriva del nombre del kernel  
   
 (linux-cachyos → "Linux Cachyos"), ignorando ENTRY_TITLE. Por eso el branding va  
   
 en dos frentes: el arranque silencioso (negro) vive en LINUX_OPTIONS de  
   
 /etc/sdboot-manage.conf (lo respeta cada autogen), con DEFAULT_ENTRY="manual"  
   
 para no pisar default @saved; y el título lo fija /usr/local/bin/kyu-os-title  
   
 (idempotente), que un hook de pacman zzz-kyu-branding.hook reaplica tras cada  
   
 autogen (corre después de sdboot-kernel-update.hook). El splash de CachyOS se  
   
 apaga por completo: Plymouth fuera del initramfs (HOOKS de /etc/mkinitcpio.conf +  
   
 mkinitcpio -P) Y plymouth-start.service enmascarado (CachyOS también lo arranca  
   
 por systemd). Para revertir: borra el script y el hook, quita los tokens extra de  
   
 LINUX_OPTIONS, y systemctl unmask plymouth-start.service.  
**Apagado: limitación conocida.** Por defecto systemd-shutdown sube el nivel del  
   
 kernel (bump_sysctl_printk_log_level) en su fase final, antes de matar los procesos  
   
 restantes, así que el "killing processes" aparece aunque el cmdline lleve  
   
 quiet/loglevel=3. Se intentó systemd.log_target=journal para evitar ese *bump*,  
   
 pero NO funciona: en la fase final systemd-shutdown vuelve a kmsg igual, y encima  
   
 ese ajuste hace que el initramfs imprima en pantalla (rompe el arranque negro). La  
   
 única vía limpia es Plymouth (servicio plymouth-poweroff), descartado aquí por la  
   
 GPU Intel i915. Por ahora el apagado muestra ~3-4 líneas que parpadean <1 s; el  
   
 arranque sí queda negro.  
**Límite de batería.** Servicio systemd battery-charge-limit.service que escribe  
   
 el umbral en charge_control_end_threshold en cada arranque. Independiente del  
   
 gestor de energía (no usa TLP, que chocaría con power-profiles-daemon).  
**Robustez.** set -uo pipefail sin set -e: un fallo aislado no aborta el setup.  
   
 Guard de no-root, check de red, keep-alive de sudo, snapshot previo y resumen de  
   
 fallos al final. Cada corrida queda registrada en ~/.local/state/kyu-os/logs/  
   
 (un archivo por corrida; se conservan los 10 más recientes; setup-latest.log  
   
 apunta al último).  
**Idempotencia.** Seguro de correr varias veces: detecta lo ya instalado y lo omite,  
   
 y reescribe configs/branding sin duplicar.  
**Scripts auxiliares (ya integrados).** Lo que antes eran scripts sueltos vive ahora  
   
 dentro del setup, así que puedes borrarlos:  
- fix_foot.sh → la normalización de sintaxis de foot.ini ([6], copia temporal  
   
 antes de desplegar; no toca el repo).  
- reloj_12h.sh → el reloj 12h de Noctalia ([7], parche del settings.json) y de SDDM  
   
 ([10], HourFormat en el theme.conf del tema).  
- limpiar_huerfanos.sh → el flag --limpiar.  
- proyectar → se genera en ~/.local/bin/proyectar ([13]).  
