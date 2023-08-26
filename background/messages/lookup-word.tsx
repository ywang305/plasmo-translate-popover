import type { PlasmoMessaging } from "@plasmohq/messaging"

const getUrl = (qword) =>
  "https://dict.iciba.com/dictionary/word/suggestion?word=" +
  qword +
  "&nums=1&is_need_mean=1"
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("background req : ", req)
  const url = getUrl(req.body.selectText)

  const resp = await fetch(url)
  const data = await resp.json()
  const message = data.message[0]

  console.log("data: ", data)

  res.send({
    message
  })
}

export default handler
