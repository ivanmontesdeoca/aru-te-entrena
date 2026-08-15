import os from "node:os";

try {
  os.userInfo();
} catch {
  const username = process.env.USERNAME || "local-test-user";
  os.userInfo = () => ({ uid: -1, gid: -1, username, homedir: os.homedir(), shell: null });
}
