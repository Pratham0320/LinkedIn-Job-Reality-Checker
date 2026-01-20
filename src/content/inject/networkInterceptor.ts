(function () {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    try {
      const input = args[0];
      const url =
        typeof input === "string"
          ? input
          : input instanceof Request
          ? input.url
          : "";

      if (url.includes("/voyager/api/jobs/jobPostings")) {
        const cloned = response.clone();
        const data = await cloned.json();

        window.postMessage(
          {
            source: "LI_JOB_DATA",
            payload: data,
          },
          "*"
        );
      }
    } catch {
      // fail silently
    }

    return response;
  };
})();
