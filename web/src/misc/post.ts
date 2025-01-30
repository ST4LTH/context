type CallbackFunction = (response: any) => void;

export const post = async (event: string, cb?: CallbackFunction, data?: any) => {
  if (event) {
    try {
      const response = await fetch(`https://context/${event}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data || {}),
      });

      if (cb) {
        const result = await response.json();
        cb(result);
      }
    } catch (error) {
      console.error("Error making POST request:", error);
      if (cb) {
        cb({ error: "Failed to fetch" });
      }
    }
  }
};
