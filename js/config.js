const FCP = {
  version: "1.0.4",
  currentYear: new Date().getFullYear(),
  githubUrl: "https://github.com/Hyacinthe-primus/File_Converter_Pro",
  githubReadmeUrl: "https://github.com/Hyacinthe-primus/File_Converter_Pro/blob/main/README.md",
  releaseUrl: "https://github.com/Hyacinthe-primus/File_Converter_Pro/releases/latest",
  installerUrl: "https://github.com/Hyacinthe-primus/File_Converter_Pro/releases/latest/download/FileConverterPro_Setup_v1.0.4.exe",
  portableUrl: "https://github.com/Hyacinthe-primus/File_Converter_Pro/releases/latest/download/File_Converter_Pro_v1.0.4.zip",
  kofiUrl: "https://ko-fi.com/hyacinthe_primus/goal?g=0",
  itchioUrl: "https://hyacinthe-primus.itch.io/file-converter-pro",
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-fcp]").forEach((el) => {
    const key = el.dataset.fcp;
    if (FCP[key] !== undefined) el.textContent = FCP[key];
  });

  document.querySelectorAll("[data-fcp-href]").forEach((el) => {
    const key = el.dataset.fcpHref;
    if (FCP[key] !== undefined) el.href = FCP[key];
  });

  document.querySelectorAll("[data-fcp-installer-cmd]").forEach((el) => {
    el.textContent = `$f="$env:TEMP\\fcp.exe"; Invoke-WebRequest "${FCP.installerUrl}" -OutFile $f; Start-Process $f "/SILENT" -Wait; Remove-Item $f`;
  });
  document.querySelectorAll("[data-fcp-portable-cmd]").forEach((el) => {
    el.textContent = `$z="$env:TEMP\\fcp.zip"; $d="$env:USERPROFILE\\Downloads\\FileConverterPro"; Invoke-WebRequest "${FCP.portableUrl}" -OutFile $z; Expand-Archive $z -DestinationPath $d -Force; Remove-Item $z; Start-Process explorer.exe $d`;
  });

  document.querySelectorAll("[data-fcp-year]").forEach((el) => {
    el.textContent = FCP.currentYear;
  });

  document.querySelectorAll(".download-trigger[data-fcp-dl]").forEach((el) => {
    const key = el.dataset.fcpDl;
    if (FCP[key]) el.dataset.href = FCP[key];
  });

  document.querySelectorAll("[data-fcp-issue]").forEach((el) => {
    el.href = FCP.githubUrl + "/issues/new?template=feature_request.md";
  });

  const dlCountEls = document.querySelectorAll("#dl-count");
  if (dlCountEls.length) {
    fetch("https://api.github.com/repos/Hyacinthe-primus/File_Converter_Pro/releases", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => r.json())
      .then((releases) => {
        if (!Array.isArray(releases)) return;
        const total = releases.reduce(
          (sum, release) =>
            sum + (release.assets || []).reduce((s, a) => s + (a.download_count || 0), 0),
          0
        );
        if (total > 0) dlCountEls.forEach((el) => (el.textContent = total.toLocaleString("en-US")));
      })
      .catch(() => {});
  }
});
