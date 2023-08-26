import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { Box, Button, Card, CardActions, CardContent, CardMedia, Link, Paper, Popover, Stack, Typography, type PopoverProps } from "@mui/material"
import type { PlasmoCSConfig, PlasmoGetOverlayAnchor, PlasmoWatchOverlayAnchor } from "plasmo"
import { useEffect, useMemo, useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  // matches: ["https://en.wikipedia.org/*"]
}

// ====
const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

document.querySelector("#plasmo-shadow-container")

const PlasmoPricingExtra = () => {
  const [content, setContent] = useState({ selectText: "", position: null, translations: [] })

  const myRef = useRef(null)

  const handleMouseUp = async (event) => {
    const content = window.getSelection()
    const selectText = content?.toString().trim()
    if (!selectText) {
      content.removeAllRanges()
      setContent({ selectText: "", position: null, translations: [] })
      return
    }

    const left = event.clientX - 10 + window.scrollX
    const top = event.clientY + 10 + window.scrollY

    // const resp = await sendToBackground({
    //   name: "lookup-word",
    //   body: { selectText }
    // })

    const translations = await chrome.runtime.sendMessage({
      name: "lookup-word",
      body: { selectText }
    })

    setContent({ selectText, position: { top, left }, translations })
  }

  const handleMouseOver = async (event) => {
    // only for youtube
    const hoveredEl = document.elementFromPoint(event.clientX, event.clientY)
    if (!hoveredEl.className.includes("ytp-caption-segment")) return

    // Split the text content into words
    const words = [...hoveredEl.childNodes].map((tnode) => tnode.nodeValue)
    if (!words.length) return

    const x = event.clientX - hoveredEl.getBoundingClientRect().left
    const lenOfChar = hoveredEl.clientWidth / words.join("").length
    let curWidth = 0
    for (let selectText of words) {
      curWidth += selectText.length * lenOfChar
      if (curWidth >= x) {
        selectText = selectText.trim()
        const translations = await chrome.runtime.sendMessage({
          name: "lookup-word",
          body: { selectText }
        })

        setContent({ selectText, position: { top: event.clientY, left: event.clientX }, translations })
        console.log("found word: ", selectText, { translations })
        break
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleMouseOver, { passive: true })
    return () => {
      document.removeEventListener("mouseup", () => {})
      document.removeEventListener("mouseover", () => {})
    }
  }, [])

  return (
    Boolean(content.selectText && content.position) && (
      <CacheProvider value={styleCache}>
        <Box
          sx={{
            ...content.position,
            position: "relative"
          }}
          ref={myRef}
          id="pop-root">
          <Card sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                word selected
              </Typography>
              <Typography variant="h5" component="div">
                {content.selectText}
              </Typography>
              {content.translations.map((translation, index) => (
                <Typography key={index} sx={{ mb: 1.5 }} color="text.secondary">
                  {translation}
                </Typography>
              ))}
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Box>
      </CacheProvider>
    )
  )
}

export default PlasmoPricingExtra
