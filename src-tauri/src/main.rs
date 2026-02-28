#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{info, error, debug};
use tauri::Manager;

#[tauri::command]
fn get_file_arg() -> Option<String> {
    let args: Vec<String> = std::env::args().collect();
    debug!("get_file_arg called, raw args: {:?}", args);
    // Skip the first arg (exe path), look for a file path
    for arg in args.iter().skip(1) {
        // Skip flags
        if arg.starts_with('-') {
            continue;
        }
        let path = std::path::Path::new(arg);
        if path.exists() {
            info!("Found file arg: {}", arg);
            return Some(arg.clone());
        }
    }
    info!("No file arg found");
    None
}

fn main() {
    // Capture args before anything else
    let raw_args: Vec<String> = std::env::args().collect();

    // Initialize logging — writes to app log directory and stderr
    let log_plugin = tauri_plugin_log::Builder::new()
        .level(log::LevelFilter::Debug)
        .build();

    let result = tauri::Builder::default()
        .plugin(log_plugin)
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_cli::init())
        .invoke_handler(tauri::generate_handler![get_file_arg])
        .setup(move |app| {
            info!("nfo-viewer starting, args: {:?}", raw_args);

            // Open devtools automatically in debug builds
            #[cfg(debug_assertions)]
            {
                if let Some(window) = app.get_webview_window("main") {
                    window.open_devtools();
                }
            }
            info!("Tauri app setup complete");
            Ok(())
        })
        .run(tauri::generate_context!());

    if let Err(e) = result {
        error!("Failed to start: {e}");
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
