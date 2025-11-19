export const storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value ? { key, value } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
  async list(prefix) {
    const keys = Object.keys(localStorage).filter(
      (k) => !prefix || k.startsWith(prefix)
    );
    return { keys };
  },
};

if (typeof window !== "undefined") {
  window.storage = storage;
}
