export function accessWithoutToken() {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      localStorage.clear();
      window.location.href = "/";
      return;
    }
  }