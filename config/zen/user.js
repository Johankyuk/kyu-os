// Autor: Kyu
// Kyu OS — perfil Zen, prefs base del tema Horus.

// --- userChrome.css / userContent.css habilitados ---
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// --- Acento nativo de Zen a la paleta Horus ---
// Si tu version de Zen no respeta esta clave, ajustalo en Ajustes > Apariencia.
user_pref("zen.theme.accent-color", "#8b45f7");

// --- Sin telemetria / sin reportes ---
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("toolkit.telemetry.archive.enabled", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("app.shield.optoutstudies.enabled", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.ping-centre.telemetry", false);
