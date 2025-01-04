const currentUrl = window.location.href;

// Handling for 'yeumoney.com'
if (currentUrl.includes("yeumoney.com") && currentUrl.split('/').length > 4) {
  console.log("Skipping execution for URL with two slashes after 'yeumoney.com/'");
} else if (currentUrl.includes("yeumoney.com")) {
  const token = currentUrl.split('/').pop();
  const url = "https://yeumoney.com/quangly/check_code.php";

  async function postData() {
    try {
      const response = await fetch(`${url}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
        body: '',
      });

      if (response.ok) {
        const text = await response.text();
        const regex = /\[JSON_URL\] => ({.*?})/;
        const match = text.match(regex);

        if (match) {
          const jsonStr = match[1];
          const jsonData = JSON.parse(jsonStr);
          const urlDich = jsonData.url_dich;
          if (urlDich) {
            console.log(`Extracted URL: ${urlDich}`);
            window.location.href = urlDich;
          } else {
            console.error("URL not found in the JSON data.");
          }
        } else {
          console.error("JSON_URL not found in the response.");
        }
      } else {
        console.error(`POST request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during the POST request:", error);
    }
  }

  postData();
}

// Handling for 'traffic24h.net'
else if (currentUrl.includes("traffic24h.net")) {
  runTraffic24hCode();
}

else if (currentUrl.includes("layma.net")) {
  laymaNet();
}
else if (currentUrl.includes("mneylink.com")) {
  runMneylinkCode();
}
else if (currentUrl.startsWith('https://frslink.com/')) {
  const alias = document.querySelector('[data-alias]').getAttribute('data-alias');
  const userId = document.querySelector('[data-user-id]').getAttribute('data-user-id');
  const shortPageId = document.querySelector('[data-short-page-id]').getAttribute('data-short-page-id');
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  const postData = {
    alias: alias,
    user_id: userId,
    short_page_id: shortPageId
  };

  // Send the POST request using Fetch API
  fetch('https://frslink.com/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify(postData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    if (data && data.data && data.data.url) {
      let url = data.data.url;
      url = url.replace(/\\\//g, '/');
      const urlParams = new URLSearchParams(new URL(url).search);
      const extractedUrl = urlParams.get('url');
      window.location.href = extractedUrl;
    } else {
      console.log('No URL found in the response.');
    }
  })
  .catch(error => {
    console.error('Error occurred:', error); // Handle errors
  });
}
else if (currentUrl.startsWith('https://vuotlink.vip/')) {
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
  });
  window.location.reload();
  const adFormData = document.querySelector('input[name="ad_form_data"]').value;

  // Extract the linkAlias from the current URL
  const linkAlias = currentUrl.split('/').pop(); // Assuming the alias is after the last '/'.

  console.log("Link Alias:", linkAlias); // Log the alias to check

  // Send the POST request using Fetch API
  fetch(`/links/gosl/?alias=${linkAlias}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRF-Token': document.querySelector('[name="_csrfToken"]').value,
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: `ad_form_data=${encodeURIComponent(adFormData)}`
  })
  .then(response => response.json())
  .then(data => {
    if (data && data.url) {
      window.location.href = data.url;
    } else {
      console.log('No URL found in the response.');
    }
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
}
