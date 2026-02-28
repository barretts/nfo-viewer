#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    let result = tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_cli::init())
        .run(tauri::generate_context!());

    if let Err(e) = result {
        #[cfg(target_os = "windows")]
        {
            use std::os::windows::ffi::OsStrExt;
            let msg: Vec<u16> = std::ffi::OsStr::new(&format!("nfo-viewer failed to start:\n{e}"))
                .encode_wide()
                .chain(std::iter::once(0))
                .collect();
            let title: Vec<u16> = std::ffi::OsStr::new("nfo-viewer Error")
                .encode_wide()
                .chain(std::iter::once(0))
                .collect();
            unsafe {
                windows_sys::Win32::UI::WindowsAndMessaging::MessageBoxW(
                    std::ptr::null_mut(),
                    msg.as_ptr(),
                    title.as_ptr(),
                    0x10, // MB_ICONERROR
                );
            }
        }
        #[cfg(not(target_os = "windows"))]
        {
            eprintln!("nfo-viewer failed to start: {e}");
        }
        std::process::exit(1);
    }
}
