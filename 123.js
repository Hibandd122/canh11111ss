async function runTraffic24hCode() {
  let scripts = document.getElementsByTagName('script');
  let excludeUrls = [
      'https://openfpcdn.io/fingerprintjs/v4',
      'https://traffic24h.net/assets/ajaxs/Authbk.php',
      'https://traffic24h.net/assets/ajaxs/Getcode.php',
      'https://img.youtube.com/vi/',
      'https://www.youtube.com/embed/'
  ];

  // Mảng để lưu các URL hợp lệ
  let validUrls = []; // Chỉ khai báo một lần

  // Duyệt qua từng thẻ script để tìm các URL
  for (let i = 0; i < scripts.length; i++) {
      let scriptContent = scripts[i].innerHTML;

      // Sử dụng regex để tìm tất cả các URL (bao gồm https và http)
      let matches = scriptContent.match(/https?:\/\/[^\s"<>]+/g);

      // Nếu tìm thấy URL
      if (matches) {
          // Duyệt qua các URL tìm được và lưu những URL không nằm trong danh sách loại trừ
          matches.forEach(url => {
              if (!excludeUrls.some(exclude => url.startsWith(exclude))) {
                  // Chuẩn hóa URL (bỏ dấu / nếu có ở cuối hoặc thêm dấu / nếu chưa có)
                  let normalizedUrl = url.endsWith('/') ? url : url + '/';
                  validUrls.push(normalizedUrl);
              }
          });
      }
  }

  // Kiểm tra nếu có URL hợp lệ, nếu không có sẽ thông báo
  if (validUrls.length > 0) {
      // Lấy URL đầu tiên hợp lệ từ danh sách
      let selectedUrl = validUrls[0];

      // URL yêu cầu
      const url = "https://demo24h.wiki/Ping/Get";

      // Dữ liệu POST
      const data = {
          "screen": "1920 x 1080",
          "browser_name": "Chrome",
          "browser_version": "131.0.0.0",
          "browser_major_version": "131",
          "is_mobile": false,
          "os_name": "Windows",
          "os_version": "10",
          "is_cookies": true,
          "href": selectedUrl,
          "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "hostname": selectedUrl.slice(0, -1)
      };

      // Tiêu đề (headers)
      const headers = {
          "Content-Type": "application/json",
          "rid": "6cd02ae6-12f9-4477-ada7-3ca592bae307",
          "Origin": selectedUrl.slice(0, -1),
          "Referer": selectedUrl,
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
      };

      // Gửi yêu cầu POST
      fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(responseData => {
              console.log("Phản hồi JSON:", responseData);
              if (responseData.success) {
                  // Nếu thành công, lấy mã từ phản hồi
                  let fetchedCode = responseData.code;
                  console.log("Mã:", fetchedCode);

                  // Gửi mã tới Authbk.php
                  const authUrl = "https://traffic24h.net/assets/ajaxs/Authbk.php";
                  const authData = {
                      type: "Checkcodez",
                      website: selectedUrl,
                      code: fetchedCode,
                      link: selectedUrl
                  };

                  fetch(authUrl, {
                      method: 'POST',
                      headers: {
                          "Content-Type": "application/x-www-form-urlencoded"
                      },
                      body: new URLSearchParams(authData)
                  })
                      .then(authResponse => {
                          if (!authResponse.ok) {
                              throw new Error("Network response was not ok");
                          }
                          return authResponse.text();
                      })
                      .then(authResponseText => {
                          console.log("Phản hồi từ Authbk.php:", authResponseText);

                          // Tìm URL chuyển hướng trong phản hồi và chuyển hướng
                          let redirectUrl = authResponseText.match(/https?:\/\/[^\s"']+/);
                          if (redirectUrl) {
                              window.location.href = redirectUrl[0];
                          } else {
                              console.error("Không tìm thấy URL chuyển hướng trong phản hồi.");
                          }
                      })
                      .catch(error => {
                          console.error('Error during the POST request:', error);
                      });
              }
          })
          .catch(error => {
              console.error('Error sending data:', error);
          });
  }
}
runTraffic24hCode()
