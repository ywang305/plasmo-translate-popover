chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log({ message, sender })
  if (message.name === "lookup-word") {
    const qword = message.body.selectText
    fetch("https://dict.iciba.com/dictionary/word/suggestion?word=" + qword + "&nums=1&is_need_mean=1")
      .then((resp) => resp.json())
      .then(({ message: respData }) => {
        console.log({ respData })
        sendResponse(respData.map((item) => item.paraphrase))
      })
    return true
  }
})

export {}
