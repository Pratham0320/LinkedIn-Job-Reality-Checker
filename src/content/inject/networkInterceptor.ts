console.log("[Interceptor] Installed");

(function () {
  // ---- FETCH ----
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    handleResponse(args[0], response.clone());
    return response;
  };

  // ---- XHR ----
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method: string, url: string | URL) {
    (this as any)._li_url = url.toString();
    return originalOpen.apply(this, arguments as any);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("load", function () {
      const url = (this as any)._li_url;
      if (!url) return;

      if (
        url.includes("/voyager/api/jobs/jobPostings") ||
        url.includes("/voyager/api/graphql")
      ) {
        try {
          const text = this.responseText;
          if (!text) return;

          const data = JSON.parse(text);

          window.postMessage(
            {
              source: "LI_JOB_DATA",
              payload: data,
            },
            "*",
          );
        } catch {}
      }
    });

    return originalSend.apply(this, arguments as any);
  };

  function handleResponse(input: any, response: Response) {
    const url =
      typeof input === "string"
        ? input
        : input instanceof Request
          ? input.url
          : "";

    if (url.includes("/voyager/api/jobs/jobPostings")) {
      response
        .json()
        .then((data) => {
          window.postMessage(
            {
              source: "LI_JOB_DATA",
              payload: data,
            },
            "*",
          );
        })
        .catch(() => {});
    }
  }
})();
