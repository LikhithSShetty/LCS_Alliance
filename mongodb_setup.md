\
# MongoDB Manual Start/Stop (Windows)

If you prefer to start MongoDB manually each time on Windows, just follow these steps:

---

### 🛠️ One-Time Setup (if not already done)

1.  **Re-enable the service with manual start**:
    Open Command Prompt as Administrator and run:
    ```cmd
    sc config MongoDB start= demand
    ```

    This ensures the service won’t start automatically, but you’ll be allowed to start it manually when needed.

---

### ▶️ To start MongoDB manually (anytime):

Open Command Prompt as Administrator and run:
```cmd
net start MongoDB
```

### ⏹️ To stop it when done:

Open Command Prompt as Administrator and run:
```cmd
net stop MongoDB
```

---

You can even create a `.bat` file with the start command if you want a one-click launcher.
