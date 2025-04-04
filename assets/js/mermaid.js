document.addEventListener('DOMContentLoaded', function() {
    var mmSkin = "contrast";
    var mjsTheme = {
        "air": "default",
        "aqua": "default",
        "contrast": "default",
        "dark": "dark",
        "default": "default",
        "dirt": "default",
        "mint": "mint",
        "neon": "dark",
        "plum": "dark",
        "sunrise": "default"
    }[mmSkin] || "default";
    console.log("mermaid");
    console.log(mermaid);
    mermaid.initialize({
        startOnLoad: true,
        theme: mjsTheme
    });
});